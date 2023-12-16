import React, { useMemo, useState } from 'react';
import {
  Flex,
  Box,
  Button,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  ModalFooter,
  ModalBody,
  Input,
  Switch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  background
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import MyIcon from '@/components/Icon';
import { useLoading } from '@/web/common/hooks/useLoading';
import { useQuery } from '@tanstack/react-query';
import {
  getShareChatList,
  delShareChatById,
  createShareChat,
  putShareChat
} from '@/web/support/outLink/api';
import { formatTimeToChatTime } from '@/utils/tools';
import { useCopyData } from '@/web/common/hooks/useCopyData';
import { useForm } from 'react-hook-form';
import { defaultOutLinkForm } from '@/constants/app';
import type { OutLinkEditType } from '@fastgpt/global/support/outLink/type.d';
import { useRequest } from '@/web/common/hooks/useRequest';
import { formatPrice } from '@fastgpt/global/support/wallet/bill/tools';
import { OutLinkTypeEnum } from '@fastgpt/global/support/outLink/constant';
import { useTranslation } from 'next-i18next';
import { useToast } from '@/web/common/hooks/useToast';
import { feConfigs } from '@/web/common/system/staticData';
import MyTooltip from '@/components/MyTooltip';
import MyModal from '@/components/MyModal';
import dayjs from 'dayjs';
import { getDocPath } from '@/web/common/system/doc';

const Share = ({ appId }: { appId: string }) => {
  const { t } = useTranslation();
  const { Loading, setIsLoading } = useLoading();
  const { copyData } = useCopyData();
  const [editLinkData, setEditLinkData] = useState<OutLinkEditType>();
  const { toast } = useToast();

  const {
    isFetching,
    data: shareChatList = [],
    refetch: refetchShareChatList
  } = useQuery(['initShareChatList', appId], () => getShareChatList(appId));

  return (
    <Box position={'relative'} pt={3} px={5} minH={'50vh'}>
      <Flex justifyContent={'space-between'}>
        <Box fontWeight={'bold'} fontSize={['md', 'xl']}>
          Share
          <MyTooltip
            forceShow
            label="The model can be directly shared with other users for dialogue, and the other party can directly engage in dialogue without logging in. Note that this function will consume the balance of your account, please keep the link!"
          ></MyTooltip>
        </Box>
        <Button
          variant={'base'}
          colorScheme={'myBlue'}
          size={['sm', 'md']}
          {...(shareChatList.length >= 10
            ? {
                isDisabled: true,
                title: '最多创建10组'
              }
            : {})}
          onClick={() => setEditLinkData(defaultOutLinkForm)}
        >
          Create new link
        </Button>
      </Flex>
      <TableContainer mt={3}>
        <Table variant={'simple'} w={'100%'} overflowX={'auto'} fontSize={'sm'}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Tokens Consumed</Th>
              {feConfigs?.isPlus && (
                <>
                  <Th>Amount limit(￥)</Th>
                  <Th>IP current limit (per person)</Th>
                  <Th>Expiration</Th>
                  <Th>Identity verification</Th>
                </>
              )}
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {shareChatList.map((item) => (
              <Tr key={item._id}>
                <Td>{item.name}</Td>
                <Td>{item.total}</Td>
                {feConfigs?.isPlus && (
                  <>
                    <Td>
                      {item.limit && item.limit.credit > -1 ? `${item.limit.credit}元` : '无限制'}
                    </Td>
                    <Td>{item?.limit?.QPM || '-'}</Td>

                    <Td>
                      {item?.limit?.expiredTime
                        ? dayjs(item.limit?.expiredTime).format('YYYY/MM/DD\nHH:mm')
                        : '-'}
                    </Td>
                    <Th>{item?.limit?.hookUrl ? '✔' : '✖'}</Th>
                  </>
                )}
                <Td display={'flex'} style={{ justifyContent: 'right' }}>
                  <Menu autoSelect={false} isLazy>
                    <MenuButton
                      _hover={{ bg: 'myWhite.600  ' }}
                      cursor={'pointer'}
                      borderRadius={'md'}
                    >
                      <MyIcon name={'more'} w={'14px'} p={2} />
                    </MenuButton>
                    <MenuList color={'myGray.700'} minW={`120px !important`} zIndex={10}>
                      <MenuItem
                        onClick={() =>
                          setEditLinkData({
                            _id: item._id,
                            name: item.name,
                            responseDetail: item.responseDetail,
                            limit: item.limit,
                            style: item.style
                          })
                        }
                        py={[2, 3]}
                      >
                        <MyIcon name={'edit'} w={['14px', '16px']} />
                        <Box ml={[1, 2]}>{t('common.Edit')}</Box>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          const url = `${location.origin}/chat/share?shareId=${item.shareId}`;
                          copyData(url, 'Copied to Clipboard');
                        }}
                        py={[2, 3]}
                      >
                        <MyIcon name={'copy'} w={['14px', '16px']} />
                        <Box ml={[1, 2]}>{'Copy Link'}</Box>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          const url = `${location.origin}/chat/share?shareId=${item.shareId}`;
                          const src = `${location.origin}/js/iframe.js`;
                          const script = `<iframe src="${url}" data-src="${url}" data-color="#4e83fd" width="100%" height="100%" frameborder="0"></iframe>`;
                          copyData(script, 'Copied to Clipboard', 3000);
                        }}
                        py={[2, 3]}
                      >
                        <MyIcon name={'apiLight'} w={['14px', '16px']} />
                        <Box ml={[1, 2]}>{t('outlink.Copy IFrame')}</Box>
                      </MenuItem>
                      <MenuItem
                        onClick={async () => {
                          setIsLoading(true);
                          try {
                            await delShareChatById(item._id);
                            refetchShareChatList();
                          } catch (error) {
                            console.log(error);
                          }
                          setIsLoading(false);
                        }}
                        py={[2, 3]}
                      >
                        <MyIcon name={'delete'} w={['14px', '16px']} />
                        <Box ml={[1, 2]}>{t('common.Delete')}</Box>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {shareChatList.length === 0 && !isFetching && (
        <Flex h={'100%'} flexDirection={'column'} alignItems={'center'} pt={'10vh'}>
          <MyIcon name="empty" w={'48px'} h={'48px'} color={'transparent'} />
          <Box mt={2} color={'myGray.500'}>
            No Links yet
          </Box>
        </Flex>
      )}
      {!!editLinkData && (
        <EditLinkModal
          appId={appId}
          type={'share'}
          defaultData={editLinkData}
          onCreate={(id) => {
            const url = `${location.origin}/chat/share?shareId=${id}`;
            copyData(url, 'Link created Successully');
            refetchShareChatList();
            setEditLinkData(undefined);
          }}
          onEdit={() => {
            toast({
              status: 'success',
              title: t('common.Update Successful')
            });
            refetchShareChatList();
            setEditLinkData(undefined);
          }}
          onClose={() => setEditLinkData(undefined)}
        />
      )}
      <Loading loading={isFetching} fixed={false} />
    </Box>
  );
};

// edit link modal
function EditLinkModal({
  appId,
  type,
  defaultData,
  onClose,
  onCreate,
  onEdit
}: {
  appId: string;
  type: `${OutLinkTypeEnum}`;
  defaultData: OutLinkEditType;
  onClose: () => void;
  onCreate: (id: string) => void;
  onEdit: () => void;
}) {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    watch,
    handleSubmit: submitShareChat
  } = useForm({
    defaultValues: defaultData
  });

  const isEdit = useMemo(() => !!defaultData._id, [defaultData]);
  const accent_color = watch('style.accent');
  const font_color = watch('style.font_color');

  const { mutate: onclickCreate, isLoading: creating } = useRequest({
    mutationFn: async (e: OutLinkEditType) =>
      createShareChat({
        ...e,
        appId,
        type
      }),
    errorToast: '创建链接异常',
    onSuccess: onCreate
  });
  const { mutate: onclickUpdate, isLoading: updating } = useRequest({
    mutationFn: (e: OutLinkEditType) => {
      return putShareChat(e);
    },
    errorToast: '更新链接异常',
    onSuccess: onEdit
  });

  return (
    <MyModal
      isOpen={true}
      iconSrc="/imgs/modal/shareLight.svg"
      title={isEdit ? t('outlink.Edit Link') : t('outlink.Create Link')}
    >
      <ModalBody>
        <Flex alignItems={'center'}>
          <Box flex={'0 0 90px'}>{t('Name')}:</Box>
          <Input
            placeholder={t('outlink.Link Name') || 'Link Name'}
            maxLength={20}
            {...register('name', {
              required: t('common.Name is empty') || 'Name is empty'
            })}
          />
        </Flex>
        <Flex alignItems={'center'} mt={4}>
          <Box flex={'0 0 90px'}>{'Font'}:</Box>
          <Input placeholder={'Font'} maxLength={20} {...register('style.font')} />
        </Flex>
        <Flex alignItems={'center'} mt={4}>
          <Box flex={'0 0 90px'}>{'Font Color'}:</Box>
          <Input placeholder={'Font Color'} maxLength={20} {...register('style.font_color')} />
          <Box
            ml={5}
            width={20}
            height={10}
            style={{ background: font_color, borderRadius: 5, border: '1px solid lightgrey' }}
          ></Box>
        </Flex>
        <Flex alignItems={'center'} mt={4}>
          <Box flex={'0 0 90px'}>{'Accent Color'}:</Box>
          <Input placeholder={'Accent Color'} maxLength={20} {...register('style.accent')} />
          <Box
            ml={5}
            width={20}
            height={10}
            style={{ background: accent_color, borderRadius: 5, border: '1px solid lightgrey' }}
          ></Box>
        </Flex>
        <Flex alignItems={'center'} mt={4}>
          <Box flex={'0 0 90px'}>{'Border Radius'}:</Box>
          <Input
            placeholder={'Border Radius'}
            maxLength={20}
            {...register('style.border_radius')}
          />
        </Flex>
        <Flex alignItems={'center'} mt={4}>
          <Box flex={'0 0 90px'}>{'Show Header'}:</Box>
          <Switch {...register('style.show_header')} size={'lg'} ml={3} />
        </Flex>
        {feConfigs?.isPlus && (
          <>
            <Flex alignItems={'center'} mt={4}>
              <Flex flex={'0 0 90px'} alignItems={'center'}>
                QPM:
                <MyTooltip label={t('outlink.QPM Tips' || '')}>
                  <QuestionOutlineIcon ml={1} />
                </MyTooltip>
              </Flex>
              <Input
                max={1000}
                {...register('limit.QPM', {
                  min: 0,
                  max: 1000,
                  valueAsNumber: true,
                  required: t('outlink.QPM is empty') || ''
                })}
              />
            </Flex>
            <Flex alignItems={'center'} mt={4}>
              <Flex flex={'0 0 90px'} alignItems={'center'}>
                {t('common.Max credit')}:
                <MyTooltip label={t('common.Max credit tips' || '')}>
                  <QuestionOutlineIcon ml={1} />
                </MyTooltip>
              </Flex>
              <Input
                {...register('limit.credit', {
                  min: -1,
                  max: 1000,
                  valueAsNumber: true,
                  required: true
                })}
              />
            </Flex>
            <Flex alignItems={'center'} mt={4}>
              <Flex flex={'0 0 90px'} alignItems={'center'}>
                {t('common.Expired Time')}:
              </Flex>
              <Input
                type="datetime-local"
                defaultValue={
                  defaultData.limit?.expiredTime
                    ? dayjs(defaultData.limit?.expiredTime).format('YYYY-MM-DDTHH:mm')
                    : ''
                }
                onChange={(e) => {
                  setValue('limit.expiredTime', new Date(e.target.value));
                }}
              />
            </Flex>
            <Flex alignItems={'center'} mt={4}>
              <Flex flex={'0 0 90px'}>
                {t('outlink.token auth')}
                <MyTooltip label={t('outlink.token auth Tips') || ''}>
                  <QuestionOutlineIcon ml={1} />
                </MyTooltip>
              </Flex>
              <Input
                placeholder={t('outlink.token auth Tips') || ''}
                {...register('limit.hookUrl')}
              />
            </Flex>
            <Link
              href={getDocPath('/docs/development/openapi/share')}
              target={'_blank'}
              fontSize={'sm'}
              color={'myGray.500'}
            >
              {t('outlink.token auth use cases')}
            </Link>
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant={'base'} mr={3} onClick={onClose}>
          Cancel
        </Button>

        <Button
          isLoading={creating || updating}
          onClick={submitShareChat((data) => (isEdit ? onclickUpdate(data) : onclickCreate(data)))}
        >
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </ModalFooter>
    </MyModal>
  );
}

export default React.memo(Share);
