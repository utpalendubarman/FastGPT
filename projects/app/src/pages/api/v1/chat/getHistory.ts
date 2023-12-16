import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { authCert } from '@fastgpt/service/support/permission/auth/common';
import { connectToDatabase } from '@/service/mongo';
import { MongoChatItem } from '@fastgpt/service/core/chat/chatItemSchema';
import { Types } from '@fastgpt/service/common/mongo';
import type { ChatItemType } from '@fastgpt/global/core/chat/type.d';
import { authUserNotVisitor } from '@fastgpt/service/support/permission/auth/user';

export type Props = {
  appId?: string;
  chatId?: string;
  limit?: number;
};
export type Response = { history: ChatItemType[] };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const { userId } = await authUserNotVisitor({ req, authToken: true });
    const { chatId, limit } = req.body as Props;

    jsonRes<Response>(res, {
      data: await getChatHistory({
        chatId,
        userId,
        limit
      })
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}

export async function getChatHistory({
  chatId,
  userId,
  limit = 30
}: Props & { userId: string }): Promise<Response> {
  if (!chatId) {
    return { history: [] };
  }

  const history = await MongoChatItem.aggregate([
    {
      $match: {
        chatId,
        userId: new Types.ObjectId(userId)
      }
    },
    {
      $sort: {
        _id: -1
      }
    },
    {
      $limit: limit
    },
    {
      $project: {
        dataId: 1,
        obj: 1,
        value: 1
      }
    }
  ]);

  history.reverse();

  return { history };
}
