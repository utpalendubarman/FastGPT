import React, { useMemo } from 'react';
import { Flex, useTheme, Box } from '@chakra-ui/react';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import MyIcon from '@/components/Icon';
import Tag from '@/components/Tag';
import Avatar from '@/components/Avatar';
import ToolMenu from './ToolMenu';
import type { ChatItemType } from '@fastgpt/global/core/chat/type';
import { useRouter } from 'next/router';
import { chatContentReplaceBlock } from '@fastgpt/global/core/chat/utils';

const ChatHeader = ({
  history,
  appName,
  appAvatar,
  chatModels,
  appId,
  onOpenSlider,
  mymode = 'self'
}: {
  history: ChatItemType[];
  appName: string;
  appAvatar: string;
  chatModels?: string[];
  appId?: string;
  onOpenSlider: () => void;
  mymode: string;
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { isPc } = useSystemStore();
  const title = useMemo(
    () =>
      chatContentReplaceBlock(history[history.length - 2]?.value)?.slice(0, 8) ||
      appName ||
      'New conversation',
    [appName, history]
  );

  return (
    <Flex
      alignItems={'center'}
      px={[3, 5]}
      h={['46px', '60px']}
      borderBottom={theme.borders.base}
      borderBottomColor={'gray.200'}
      color={'myGray.900'}
    >
      {isPc ? (
        <>
          {mymode == 'share' && <Avatar src={appAvatar} w={'50px'} mr={4} />}
          <Box mr={3} color={'myGray.1000'}>
            {title}
          </Box>

          {mymode != 'share' && (
            <Tag>
              <MyIcon name={'history'} w={'14px'} />
              <Box ml={1}>{history.length === 0 ? 'New dialogue' : `${history.length}Records`}</Box>
            </Tag>
          )}
          {mymode != 'share' && !!chatModels && chatModels.length > 0 && (
            <Tag ml={2} colorSchema={'green'}>
              <MyIcon name={'core/chat/chatModelTag'} w={'14px'} />
              <Box ml={1}>{chatModels.join(',')}</Box>
            </Tag>
          )}
          <Box flex={1} />
        </>
      ) : (
        <>
          <MyIcon name={'menu'} w={'20px'} h={'20px'} color={'myGray.900'} onClick={onOpenSlider} />
          <Flex px={3} alignItems={'center'} flex={'1 0 0'} w={0} justifyContent={'center'}>
            <Avatar src={appAvatar} w={'16px'} />
            <Box
              ml={1}
              className="textEllipsis"
              onClick={() => {
                appId && router.push(`/app/detail?appId=${appId}`);
              }}
            >
              {appName}
            </Box>
          </Flex>
        </>
      )}
      {/* control */}
      <ToolMenu history={history} />
    </Flex>
  );
};

export default ChatHeader;
