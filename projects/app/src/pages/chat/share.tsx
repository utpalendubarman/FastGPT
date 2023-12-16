import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { initShareChatInfo } from '@/web/support/outLink/api';
import { Box, Flex, useDisclosure, Drawer, DrawerOverlay, DrawerContent } from '@chakra-ui/react';
import { useToast } from '@/web/common/hooks/useToast';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { useQuery } from '@tanstack/react-query';
import { streamFetch } from '@/web/common/api/fetch';
import { useShareChatStore, defaultHistory } from '@/web/core/chat/storeShareChat';
import SideBar from '@/components/SideBar';
import { gptMessage2ChatType } from '@/utils/adapt';
import { getErrText } from '@fastgpt/global/common/error/utils';
import type { ChatSiteItemType } from '@fastgpt/global/core/chat/type.d';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 12);

import ChatBox, { type ComponentRef, type StartChatFnProps } from '@/components/ChatBox';
import PageContainer from '@/components/PageContainer';
import ChatHeader from './components/ChatHeader';
import ChatHistorySlider from './components/ChatHistorySlider';
import { serviceSideProps } from '@/web/common/utils/i18n';
import { checkChatSupportSelectFileByChatModels } from '@/web/core/chat/utils';

const OutLink = ({
  shareId,
  chatId,
  showHistory,
  authToken
}: {
  shareId: string;
  chatId: string;
  showHistory: '0' | '1';
  authToken?: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen: isOpenSlider, onClose: onCloseSlider, onOpen: onOpenSlider } = useDisclosure();
  const { isPc } = useSystemStore();
  const forbidRefresh = useRef(false);
  const [isEmbed, setIdEmbed] = useState(true);
  const isIframe = window.location !== window.parent.location;

  const ChatBoxRef = useRef<ComponentRef>(null);

  const {
    shareChatData,
    setShareChatData,
    shareChatHistory,
    saveChatResponse,
    delShareChatHistoryItemById,
    delOneShareHistoryByChatId,
    delManyShareChatHistoryByShareId
  } = useShareChatStore();
  const history = useMemo(
    () => shareChatHistory.filter((item) => item.shareId === shareId),
    [shareChatHistory, shareId]
  );

  const startChat = useCallback(
    async ({ messages, controller, generatingMessage, variables }: StartChatFnProps) => {
      const prompts = messages.slice(-2);
      const completionChatId = chatId ? chatId : nanoid();

      const { responseText, responseData } = await streamFetch({
        data: {
          messages: prompts,
          variables,
          shareId,
          chatId: completionChatId,
          authToken
        },
        onMessage: generatingMessage,
        abortSignal: controller
      });

      const result: ChatSiteItemType[] = gptMessage2ChatType(prompts).map((item) => ({
        ...item,
        status: 'finish'
      }));
      result[1].value = responseText;
      result[1].responseData = responseData;

      /* save chat */
      saveChatResponse({
        chatId: completionChatId,
        prompts: result,
        variables,
        shareId
      });

      if (completionChatId !== chatId && controller.signal.reason !== 'leave') {
        forbidRefresh.current = true;
        router.replace({
          query: {
            ...router.query,
            chatId: completionChatId
          }
        });
      }

      window.top?.postMessage(
        {
          type: 'shareChatFinish',
          data: {
            question: result[0]?.value,
            answer: result[1]?.value
          }
        },
        '*'
      );

      return { responseText, responseData, isNewChat: forbidRefresh.current };
    },
    [authToken, chatId, router, saveChatResponse, shareId]
  );

  const loadAppInfo = useCallback(
    async (shareId: string, chatId: string, authToken?: string) => {
      if (!shareId) return null;
      const history = shareChatHistory.find((item) => item.chatId === chatId) || defaultHistory;

      ChatBoxRef.current?.resetHistory(history.chats);
      ChatBoxRef.current?.resetVariables(history.variables);

      try {
        const chatData = await (async () => {
          if (shareChatData.app.name === '') {
            return initShareChatInfo({
              shareId,
              authToken
            });
          }
          return shareChatData;
        })();

        setShareChatData({
          ...chatData,
          history
        });
      } catch (e: any) {
        toast({
          status: 'error',
          title: getErrText(e, '获取应用失败')
        });
        if (e?.code === 501) {
          delManyShareChatHistoryByShareId(shareId);
        }
      }

      if (history.chats.length > 0) {
        setTimeout(() => {
          ChatBoxRef.current?.scrollToBottom('auto');
        }, 500);
      }

      return history;
    },
    [delManyShareChatHistoryByShareId, setShareChatData, shareChatData, shareChatHistory, toast]
  );

  useQuery(['init', shareId, chatId, authToken], () => {
    if (forbidRefresh.current) {
      forbidRefresh.current = false;
      return null;
    }
    return loadAppInfo(shareId, chatId, authToken);
  });

  useEffect(() => {
    if (window !== top) {
      window.top?.postMessage({ type: 'shareChatReady' }, '*');
    }
    setIdEmbed(window !== top);
  }, []);
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
        htmlnew += `<a target="_blank" href="${itm[5]}"><div style="${
          shareChatData.app?.style?.font !== undefined && shareChatData.app.style.font !== ''
            ? 'font-family:' + shareChatData.app.style.font + '; '
            : ''
        } border: 1px solid var(--chakra-colors-gray-300); background: white; border-radius: ${
          shareChatData.app?.style?.border_radius !== undefined &&
          shareChatData.app.style.border_radius !== ''
            ? shareChatData.app.style.border_radius
            : '3'
        }px; text-decoration: none; color: black;">
        <div>
        <div style="display:flex; justify-content: center;"><img src="${
          itm[4]
        }" alt="${name}" style="border-top-right-radius: 7px; border-top-left-radius: 7px; padding: 10px; height: 200px" onerror="this.src='/imgs/errImg.png'"></div>
        </div><div style="padding: 10px;">
        <h3 style="font-weight: bold;">${name}</h3>
        <p>Price: ${itm[8] !== '' ? itm[8] : 'May Vary'}</p>
        </div>
        </div></a>`;
      }
    });
    historyDom.innerHTML = htmlnew;
  };

  const containerStyle = {
    display: 'flex',
    height: '100%'
  };

  const sideBySideStyle = {
    flex: 1,
    height: '100%'
  };
  showHistory = '0';

  return (
    <PageContainer {...(isEmbed ? { p: '0 !important', borderRadius: '0' } : {})}>
      <Head>
        <title>{shareChatData.app.name}</title>
      </Head>
      <Flex h={'100%'} flexDirection={['column', 'row']}>
        {showHistory === '1'
          ? ((children: React.ReactNode) => {
              return isPc ? (
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
                  <DrawerContent maxWidth={'250px'} boxShadow={'2px 0 10px rgba(0,0,0,0.15)'}>
                    {children}
                  </DrawerContent>
                </Drawer>
              );
            })(
              <ChatHistorySlider
                appName={shareChatData.app.name}
                appAvatar={shareChatData.app.avatar}
                activeChatId={chatId}
                history={history.map((item) => ({
                  id: item.chatId,
                  title: 'item.title'
                }))}
                onClose={onCloseSlider}
                onChangeChat={(chatId) => {
                  router.replace({
                    query: {
                      ...router.query,
                      chatId: chatId || ''
                    }
                  });
                  if (!isPc) {
                    onCloseSlider();
                  }
                }}
                onDelHistory={delOneShareHistoryByChatId}
                onClearHistory={() => {
                  delManyShareChatHistoryByShareId(shareId);
                  router.replace({
                    query: {
                      ...router.query,
                      chatId: ''
                    }
                  });
                }}
              />
            )
          : null}

        {/* chat container */}
        <Flex
          position={'relative'}
          h={[0, '100%']}
          w={['100%', 0]}
          flex={'1 0 0'}
          flexDirection={'column'}
        >
          {/* header */}
          {shareChatData.app?.style?.show_header !== undefined &&
            shareChatData.app.style.show_header === true && (
              <ChatHeader
                appAvatar={shareChatData.app.avatar}
                appName={shareChatData.app.name}
                history={[]}
                onOpenSlider={onOpenSlider}
                mymode="share"
              />
            )}

          {/* chat box */}
          {shareChatData.app?.mid !== undefined && shareChatData.app?.mid === 'askforProduct' ? (
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
                    active={!!shareChatData.app.name}
                    ref={ChatBoxRef}
                    appDetails={shareChatData.app}
                    appAvatar={shareChatData.app.avatar}
                    userAvatar={shareChatData.userAvatar}
                    userGuideModule={shareChatData.app?.userGuideModule}
                    showFileSelector={checkChatSupportSelectFileByChatModels(
                      shareChatData.app.chatModels
                    )}
                    onProducts={(e) => updateProducts(e)}
                    feedbackType={'user'}
                    onUpdateVariable={(e) => {
                      setShareChatData((state) => ({
                        ...state,
                        history: {
                          ...state.history,
                          variables: e
                        }
                      }));
                    }}
                    onStartChat={startChat}
                    onDelMessage={({ contentId, index }) =>
                      delShareChatHistoryItemById({ chatId, contentId, index })
                    }
                    mystyle={{
                      chatColor:
                        shareChatData.app?.style?.accent !== undefined &&
                        shareChatData.app.style.accent !== ''
                          ? shareChatData.app.style.accent
                          : 'myBlue.300'
                    }}
                  />
                </div>
              </div>
            </Box>
          ) : (
            <Box flex={1}>
              <ChatBox
                active={!!shareChatData.app.name}
                ref={ChatBoxRef}
                appDetails={shareChatData.app}
                appAvatar={shareChatData.app.avatar}
                userAvatar={shareChatData.userAvatar}
                userGuideModule={shareChatData.app?.userGuideModule}
                showFileSelector={checkChatSupportSelectFileByChatModels(
                  shareChatData.app.chatModels
                )}
                onProducts={(e) => {}}
                feedbackType={'user'}
                onUpdateVariable={(e) => {
                  setShareChatData((state) => ({
                    ...state,
                    history: {
                      ...state.history,
                      variables: e
                    }
                  }));
                }}
                onStartChat={startChat}
                onDelMessage={({ contentId, index }) =>
                  delShareChatHistoryItemById({ chatId, contentId, index })
                }
              />
            </Box>
          )}
        </Flex>
      </Flex>
    </PageContainer>
  );
};

export async function getServerSideProps(context: any) {
  const shareId = context?.query?.shareId || '';
  const chatId = context?.query?.chatId || '';
  const showHistory = context?.query?.showHistory || '1';
  const authToken = context?.query?.authToken || '';

  return {
    props: {
      shareId,
      chatId,
      showHistory,
      authToken,
      ...(await serviceSideProps(context))
    }
  };
}

export default OutLink;
