import React, { useCallback, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getInitChatSiteInfo, delChatRecordById, putChatHistory } from '@/web/core/chat/api';
import {
  Box,
  Flex,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  Text,
  DrawerContent,
  useTheme,
  background
} from '@chakra-ui/react';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { useQuery } from '@tanstack/react-query';
import { streamFetch } from '@/web/common/api/fetch';
import { useChatStore } from '@/web/core/chat/storeChat';
import { useLoading } from '@/web/common/hooks/useLoading';
import { useToast } from '@/web/common/hooks/useToast';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 12);
import type { ChatHistoryItemType } from '@fastgpt/global/core/chat/type.d';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import ChatBox, { type ComponentRef, type StartChatFnProps } from '@/components/ChatBox';
import PageContainer from '@/components/PageContainer';
import SideBar from '@/components/SideBar';
import ChatHistorySlider from './components/ChatHistorySlider';
import SliderApps from './components/SliderApps';
import ChatHeader from './components/ChatHeader';
import { getErrText } from '@fastgpt/global/common/error/utils';
import { useUserStore } from '@/web/support/user/useUserStore';
import { serviceSideProps } from '@/web/common/utils/i18n';
import { useAppStore } from '@/web/core/app/store/useAppStore';
import { checkChatSupportSelectFileByChatModels } from '@/web/core/chat/utils';
import { chatContentReplaceBlock } from '@fastgpt/global/core/chat/utils';

const Share = ({ appId, chatId }: { appId: string; chatId: string }) => {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { toast } = useToast();

  const ChatBoxRef = useRef<ComponentRef>(null);
  const forbidRefresh = useRef(false);

  const {
    lastChatAppId,
    setLastChatAppId,
    lastChatId,
    setLastChatId,
    history,
    loadHistory,
    updateHistory,
    delHistory,
    clearHistory,
    chatData,
    setChatData
  } = useChatStore();
  const { myApps, loadMyApps } = useAppStore();
  const { userInfo } = useUserStore();

  const { isPc } = useSystemStore();
  const { Loading, setIsLoading } = useLoading();
  const { isOpen: isOpenSlider, onClose: onCloseSlider, onOpen: onOpenSlider } = useDisclosure();

  const startChat = useCallback(
    async ({ messages, controller, generatingMessage, variables }: StartChatFnProps) => {
      const prompts = messages.slice(-2);
      const completionChatId = chatId ? chatId : nanoid();

      const { responseText, responseData } = await streamFetch({
        data: {
          messages: prompts,
          variables,
          appId,
          chatId: completionChatId
        },
        onMessage: generatingMessage,
        abortSignal: controller
      });

      const newTitle =
        chatContentReplaceBlock(prompts[0].content).slice(0, 20) ||
        prompts[1]?.value?.slice(0, 20) ||
        'New conversation';

      // update history
      if (completionChatId !== chatId) {
        const newHistory: ChatHistoryItemType = {
          chatId: completionChatId,
          updateTime: new Date(),
          title: newTitle,
          appId,
          top: false
        };
        updateHistory(newHistory);
        if (controller.signal.reason !== 'leave') {
          forbidRefresh.current = true;
          router.replace({
            query: {
              chatId: completionChatId,
              appId
            }
          });
        }
      } else {
        const currentChat = history.find((item) => item.chatId === chatId);
        currentChat &&
          updateHistory({
            ...currentChat,
            updateTime: new Date(),
            title: newTitle
          });
      }
      // update chat window
      setChatData((state) => ({
        ...state,
        title: newTitle,
        history: ChatBoxRef.current?.getChatHistory() || state.history
      }));

      return { responseText, responseData, isNewChat: forbidRefresh.current };
    },
    [appId, chatId, history, router, setChatData, updateHistory]
  );

  // del one chat content
  const delOneHistoryItem = useCallback(
    async ({ contentId, index }: { contentId?: string; index: number }) => {
      if (!chatId || !contentId) return;

      try {
        setChatData((state) => ({
          ...state,
          history: state.history.filter((_, i) => i !== index)
        }));
        await delChatRecordById({ chatId, contentId });
      } catch (err) {
        console.log(err);
      }
    },
    [chatId, setChatData]
  );

  // get chat app info
  const loadChatInfo = useCallback(
    async ({
      appId,
      chatId,
      loading = false
    }: {
      appId: string;
      chatId: string;
      loading?: boolean;
    }) => {
      try {
        loading && setIsLoading(true);
        const res = await getInitChatSiteInfo({ appId, chatId });
        const history = res.history.map((item) => ({
          ...item,
          status: 'finish' as any
        }));

        setChatData({
          ...res,
          history
        });

        // have records.
        ChatBoxRef.current?.resetHistory(history);
        ChatBoxRef.current?.resetVariables(res.variables);
        if (res.history.length > 0) {
          setTimeout(() => {
            ChatBoxRef.current?.scrollToBottom('auto');
          }, 500);
        }
      } catch (e: any) {
        // reset all chat tore
        setLastChatAppId('');
        setLastChatId('');
        toast({
          title: getErrText(e, 'Initialized chat failed'),
          status: 'error'
        });
        if (e?.code === 501) {
          router.replace('/app/list');
        } else {
          router.replace('/chat');
        }
      }
      setIsLoading(false);
      return null;
    },
    [setIsLoading, setChatData, router, setLastChatAppId, setLastChatId, toast]
  );
  // Initialization chat box
  useQuery(['init', { appId, chatId }], () => {
    // pc: redirect to latest model chat
    if (!appId && lastChatAppId) {
      return router.replace({
        query: {
          appId: lastChatAppId,
          chatId: lastChatId
        }
      });
    }
    if (!appId && myApps[0]) {
      return router.replace({
        query: {
          appId: myApps[0]._id,
          chatId: lastChatId
        }
      });
    }
    if (!appId) {
      (async () => {
        const apps = await loadMyApps();
        if (apps.length === 0) {
          toast({
            status: 'error',
            title: t('chat.You need to a chat app')
          });
          router.replace('/app/list');
        } else {
          router.replace({
            query: {
              appId: apps[0]._id,
              chatId: lastChatId
            }
          });
        }
      })();
      return;
    }

    // store id
    appId && setLastChatAppId(appId);
    setLastChatId(chatId);

    if (forbidRefresh.current) {
      forbidRefresh.current = false;
      return null;
    }

    return loadChatInfo({
      appId,
      chatId,
      loading: appId !== chatData.appId
    });
  });

  useQuery(['loadHistory', appId], () => (appId ? loadHistory({ appId }) : null));
  const containerStyle = {
    display: 'flex',
    height: '100%'
  };

  const sideBySideStyle = {
    flex: 1,
    height: '100%'
  };

  const productStyle = {};

  const Product = ({ name, price, color, image }) => {
    return (
      <div
        style={{
          border: '1px solid var(--chakra-colors-gray-300)',
          background: 'white',
          borderRadius: 7,
          margin: '5px',
          width: '150px'
        }}
      >
        <div>
          <img
            src={image}
            alt={name}
            style={{ width: '100%', borderTopRightRadius: 7, borderTopLeftRadius: 7 }}
          />
        </div>
        <div style={{ padding: 10 }}>
          <h3 style={{ fontWeight: 'bold' }}>{name}</h3>
          <p>Price: ${price}</p>
          <p>Color: {color}</p>
        </div>
      </div>
    );
  };

  const ProductGrid = () => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }} id="products">
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    );
  };
  function CSVtoArray(text) {
    let ret = [''],
      i = 0,
      p = '',
      s = true;
    for (let l in text) {
      l = text[l];
      if ('"' === l) {
        s = !s;
        if ('"' === p) {
          ret[i] += '"';
          l = '-';
        } else if ('' === p) l = '-';
      } else if (s && ',' === l) l = ret[++i] = '';
      else ret[i] += l;
      p = l;
    }
    return ret;
  }
  const updateProducts = (e) => {
    var historyDom = document.getElementById('products');
    var htmlnew = '';

    e.all.map((item) => {
      const itm = CSVtoArray(item.q);
      if (e.found.includes(Number(itm[0]))) {
        const name = itm[1].length < 36 ? itm[1] : itm[1].substring(0, 33) + '...';
        htmlnew += `<a target="_blank" href="${
          itm[5]
        }"><div style="border: 1px solid var(--chakra-colors-gray-300); background: white; border-radius: 7px; text-decoration: none; color: black;">
        <div>
        <div style="display:flex; justify-content: center;"><img src="${
          itm[4]
        }" alt="Product 2" style="border-top-right-radius: 7px; border-top-left-radius: 7px; padding: 10px; width: 200px; height: 200px" onerror="this.src='/imgs/errImg.png'"></div>
        </div><div style="padding: 10px;">
        <h3 style="font-weight: bold;">${name}</h3>
        <p>Price: ${itm[8] !== '' ? itm[8] : 'May Vary'}</p>
        </div>
        </div></a>`;
      }
    });
    historyDom.innerHTML = htmlnew;
  };

  return (
    <Flex h={'100%'}>
      <Head>
        <title>{chatData.app.name}</title>
      </Head>
      {/* pc show myself apps */}
      {isPc && (
        <Box borderRight={theme.borders.base} w={'220px'} flexShrink={0}>
          <SliderApps appId={appId} />
        </Box>
      )}

      <PageContainer flex={'1 0 0'} w={0} bg={'myWhite.600'} position={'relative'}>
        <Flex h={'100%'} flexDirection={['column', 'row']}>
          {/* pc always show history. */}
          {((children: React.ReactNode) => {
            return isPc || !appId ? (
              <SideBar>{children}</SideBar>
            ) : (
              <Drawer
                isOpen={isOpenSlider}
                placement="left"
                autoFocus={false}
                size={'xs'}
                onClose={onCloseSlider}
              >
                <DrawerOverlay backgroundColor={'rgba(255,255,255,0.5)'} />
                <DrawerContent maxWidth={'250px'}>{children}</DrawerContent>
              </Drawer>
            );
          })(
            <ChatHistorySlider
              appId={appId}
              appName={chatData.app.name}
              appAvatar={chatData.app.avatar}
              activeChatId={chatId}
              onClose={onCloseSlider}
              history={history.map((item, i) => ({
                id: item.chatId,
                title: item.title,
                customTitle: item.customTitle,
                top: item.top
              }))}
              onChangeChat={(chatId) => {
                router.replace({
                  query: {
                    chatId: chatId || '',
                    appId
                  }
                });
                if (!isPc) {
                  onCloseSlider();
                }
              }}
              onDelHistory={delHistory}
              onClearHistory={() => {
                clearHistory(appId);
                router.replace({
                  query: {
                    appId
                  }
                });
              }}
              onSetHistoryTop={async (e) => {
                try {
                  await putChatHistory(e);
                  const historyItem = history.find((item) => item.chatId === e.chatId);
                  if (!historyItem) return;
                  updateHistory({
                    ...historyItem,
                    top: e.top
                  });
                } catch (error) {}
              }}
              onSetCustomTitle={async (e) => {
                try {
                  putChatHistory({
                    chatId: e.chatId,
                    customTitle: e.title
                  });
                  const historyItem = history.find((item) => item.chatId === e.chatId);
                  if (!historyItem) return;
                  updateHistory({
                    ...historyItem,
                    customTitle: e.title
                  });
                } catch (error) {}
              }}
            />
          )}
          {/* chat container */}
          <Flex
            position={'relative'}
            h={[0, '100%']}
            w={['100%', 0]}
            flex={'1 0 0'}
            flexDirection={'column'}
          >
            {/* header */}
            <ChatHeader
              appAvatar={chatData.app.avatar}
              appName={chatData.app.name}
              appId={appId}
              history={chatData.history}
              chatModels={chatData.app.chatModels}
              onOpenSlider={onOpenSlider}
            />

            {/* chat box */}
            {chatData.app?.mid == 'askforProduct' ? (
              <Box flex={1}>
                <div style={containerStyle}>
                  <div
                    style={{
                      ...sideBySideStyle,
                      ...{
                        flex: '3',
                        borderRight: '1px solid var(--chakra-colors-myGray-200)',
                        background: 'var(--chakra-colors-myGray-100',
                        overflow: 'scroll'
                      }
                    }}
                  >
                    <div style={{ padding: 10 }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '10px'
                        }}
                        id="products"
                      ></div>
                    </div>
                  </div>
                  <div style={{ ...sideBySideStyle, ...{ flex: '2' } }}>
                    <ChatBox
                      ref={ChatBoxRef}
                      showEmptyIntro
                      appDetails={chatData.app}
                      appAvatar={chatData.app.avatar}
                      userAvatar={userInfo?.avatar}
                      userGuideModule={chatData.app?.userGuideModule}
                      showFileSelector={checkChatSupportSelectFileByChatModels(
                        chatData.app.chatModels
                      )}
                      feedbackType={'user'}
                      onUpdateVariable={(e) => {}}
                      onStartChat={startChat}
                      onProducts={(e) => updateProducts(e)}
                      onDelMessage={delOneHistoryItem}
                    />
                  </div>
                </div>
              </Box>
            ) : (
              <Box flex={1}>
                <ChatBox
                  ref={ChatBoxRef}
                  showEmptyIntro
                  appDetails={chatData.app}
                  appAvatar={chatData.app.avatar}
                  userAvatar={userInfo?.avatar}
                  userGuideModule={chatData.app?.userGuideModule}
                  showFileSelector={checkChatSupportSelectFileByChatModels(chatData.app.chatModels)}
                  feedbackType={'user'}
                  onUpdateVariable={(e) => {}}
                  onStartChat={startChat}
                  onDelMessage={delOneHistoryItem}
                />
              </Box>
            )}
          </Flex>
        </Flex>
        <Loading fixed={false} />
      </PageContainer>
    </Flex>
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: {
      appId: context?.query?.appId || '',
      chatId: context?.query?.chatId || '',
      ...(await serviceSideProps(context))
    }
  };
}

export default Share;
