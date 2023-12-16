import type { NextApiRequest, NextApiResponse } from 'next';
import { authApp } from '@fastgpt/service/support/permission/auth/app';
import { authCert } from '@fastgpt/service/support/permission/auth/common';
import { sseErrRes, jsonRes } from '@fastgpt/service/common/response';
import { addLog } from '@fastgpt/service/common/mongo/controller';
import { withNextCors } from '@fastgpt/service/common/middle/cors';
import { ChatRoleEnum, ChatSourceEnum } from '@fastgpt/global/core/chat/constants';
import { sseResponseEventEnum } from '@fastgpt/service/common/response/constant';
import { dispatchModules } from '@/service/moduleDispatch';
import type { ChatCompletionCreateParams } from '@fastgpt/global/core/ai/type.d';
import type { ChatMessageItemType } from '@fastgpt/global/core/ai/type.d';
import { gptMessage2ChatType, textAdaptGptResponse } from '@/utils/adapt';
import { getChatHistory } from './getHistory';
import { saveChat } from '@/service/utils/chat/saveChat';
import { responseWrite } from '@fastgpt/service/common/response';
import { pushChatBill } from '@/service/support/wallet/bill/push';
import { authOutLinkChat } from '@/service/support/permission/auth/outLink';
import { pushResult2Remote, updateOutLinkUsage } from '@fastgpt/service/support/outLink/tools';
import requestIp from 'request-ip';
import { getBillSourceByAuthType } from '@fastgpt/global/support/wallet/bill/tools';

import { MongoUser } from '@fastgpt/service/support/user/schema';
import { selectShareResponse } from '@/utils/service/core/chat';
import { updateApiKeyUsage } from '@fastgpt/service/support/openapi/tools';
import { connectToDatabase } from '@/service/mongo';
import { getUserAndAuthBalance } from '@/service/support/permission/auth/user';
import { AuthUserTypeEnum } from '@fastgpt/global/support/permission/constant';
import { MongoApp } from '@fastgpt/service/core/app/schema';
import { authUserNotVisitor } from '@fastgpt/service/support/permission/auth/user';
import { use } from 'react';

type FastGptWebChatProps = {
  chatId?: string; // undefined: nonuse history, '': new chat, 'xxxxx': use history
  appId?: string;
};
type FastGptShareChatProps = {
  shareId?: string;
  authToken?: string;
};
export type Props = ChatCompletionCreateParams &
  FastGptWebChatProps &
  FastGptShareChatProps & {
    messages: ChatMessageItemType[];
    stream?: boolean;
    detail?: boolean;
    variables: Record<string, any>;
  };
export type ChatResponseType = {
  newChatId: string;
  quoteLen?: number;
};

export default withNextCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.on('close', () => {
    res.end();
  });
  res.on('error', () => {
    console.log('error: ', 'request error');
    res.end();
  });

  let {
    chatId,
    appId,
    shareId,
    authToken,
    stream = false,
    detail = false,
    messages = [],
    variables = {}
  } = req.body as Props;

  try {
    await connectToDatabase();
    // body data check
    if (!messages) {
      throw new Error('Prams Error');
    }
    if (!Array.isArray(messages)) {
      throw new Error('messages is not array');
    }
    if (messages.length === 0) {
      throw new Error('messages is empty');
    }

    let startTime = Date.now();

    const chatMessages = gptMessage2ChatType(messages);
    if (chatMessages[chatMessages.length - 1].obj !== ChatRoleEnum.Human) {
      chatMessages.pop();
    }

    // user question
    const question = chatMessages.pop();
    if (!question) {
      throw new Error('Question is empty');
    }

    /*  auth app permission */
    const { user, app, responseDetail, authType, apikey, canWrite } = await (async () => {
      if (shareId) {
        const { user, app, authType, responseDetail } = await authOutLinkChat({
          shareId,
          ip: requestIp.getClientIp(req),
          authToken,
          question: question.value
        });
        return {
          user,
          app,
          responseDetail,
          apikey: '',
          authType,
          canWrite: false
        };
      }

      const {
        appId: apiKeyAppId,
        tmbId,
        authType,
        apikey
      } = await authCert({
        req,
        authToken: true,
        authApiKey: true
      });
      const { userId } = await authUserNotVisitor({ req, authToken: true });
      const user = await getUserAndAuthBalance({
        tmbId,
        minBalance: 0,
        userId
      });

      // openapi key
      if (authType === AuthUserTypeEnum.apikey) {
        const app = await MongoApp.findById(apiKeyAppId);

        if (!app) {
          return Promise.reject('app is empty');
        }

        return {
          user,
          app,
          responseDetail: detail,
          apikey,
          authType,
          canWrite: true
        };
      }

      if (!appId) {
        return Promise.reject('appId is empty');
      }

      // token
      const { app, canWrite } = await authApp({
        req,
        authToken: true,
        appId,
        per: 'r'
      });

      return {
        user,
        app,
        responseDetail: detail,
        apikey,
        authType,
        canWrite: canWrite || false
      };
    })();
    const { userId } = await authUserNotVisitor({ req, authToken: true });

    // auth app, get history
    const { history } = await getChatHistory({ chatId, userId });

    const isAppOwner = !shareId;
    /* format prompts */
    const concatHistory = history.concat(chatMessages);
    const dostream = app?.mid !== undefined && app?.mid != 'askforProduct';

    /* start flow controller */
    var { responseData, answerText } = await dispatchModules({
      res,
      appId: String(app._id),
      chatId,
      modules: app.modules,
      user,
      userId,
      variables,
      params: {
        history: concatHistory,
        userChatInput: question.value
      },
      stream,
      detail
    });
    function extractNumbersAtEnd(inputString) {
      if (typeof inputString !== 'string') {
        return [];
      }

      const lines = inputString.split(/\r?\n/);
      const numbersArray = [];

      lines.forEach((line) => {
        const match = line.match(/(\s*\d+\s*,\s*)+\s*\d+\s*$/);
        if (match) {
          const numbers = match[0].split(',').map((number) => Number(number.trim()));
          numbersArray.push(...numbers);
        }
      });

      return numbersArray;
    }

    const prodIds = extractNumbersAtEnd(answerText);

    // if (prodIds.length > 0) {
    //   answerText = JSON.stringify({ type: "render", elems: prodIds, "message": "Sure" });
    // }
    // console.log(answerText);

    // responseData[responseData.length - 1].query = answerText;

    // save chat
    if (chatId) {
      await saveChat({
        chatId,
        appId: app._id,
        userId: user._id,
        variables,
        updateUseTime: isAppOwner, // owner update use time
        shareId,
        source: (() => {
          if (shareId) {
            return ChatSourceEnum.share;
          }
          if (authType === 'apikey') {
            return ChatSourceEnum.api;
          }
          return ChatSourceEnum.online;
        })(),
        content: [
          question,
          {
            dataId: messages[messages.length - 1].dataId,
            obj: ChatRoleEnum.AI,
            value: answerText,
            responseData
          }
        ]
      });
    }

    addLog.info(`completions running time: ${(Date.now() - startTime) / 1000}s`);

    /* select fe response field */
    const feResponseData = canWrite ? responseData : selectShareResponse({ responseData });

    if (stream) {
      responseWrite({
        res,
        event: detail ? sseResponseEventEnum.answer : undefined,
        data: textAdaptGptResponse({
          text: null,
          finish_reason: 'stop'
        })
      });
      responseWrite({
        res,
        event: detail ? sseResponseEventEnum.answer : undefined,
        data: '[DONE]'
      });

      if (responseDetail && detail) {
        responseWrite({
          res,
          event: sseResponseEventEnum.appStreamResponse,
          data: JSON.stringify(feResponseData)
        });
      }

      res.end();
    } else {
      res.json({
        ...(detail ? { responseData: feResponseData } : {}),
        id: chatId || '',
        model: '',
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 1 },
        choices: [
          {
            message: { role: 'assistant', content: answerText },
            finish_reason: 'stop',
            index: 0
          }
        ]
      });
    }

    // add record
    // const { total } = pushChatBill({
    //   appName: app.name,
    //   appId: app._id,
    //   userId,
    //   source: getBillSourceByAuthType({ shareId, authType }),
    //   response: responseData
    // });
    const total = responseData.reduce((sum, item) => sum + item.price, 0);

    const DeductToken = async (userId: string, total: any) => {
      try {
        await connectToDatabase();

        const user = await MongoUser.findOne({
          _id: userId
        });

        await MongoUser.findByIdAndUpdate(userId, {
          token: user.token - total
        });
      } catch (x) {}
    };

    // deduct from user
    DeductToken(userId, total);

    if (shareId) {
      // pushResult2Remote({ authToken, shareId, responseData });
      updateOutLinkUsage({
        shareId,
        total
      });
    }
    // if (apikey) {
    //   updateApiKeyUsage({
    //     apikey,
    //     usage: total
    //   });
    // }
  } catch (err: any) {
    if (stream) {
      sseErrRes(res, err);
      res.end();
    } else {
      jsonRes(res, {
        code: 500,
        error: err
      });
    }
  }
});

export const config = {
  api: {
    responseLimit: '20mb'
  }
};
