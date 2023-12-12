import React, { useCallback, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  Grid,
  useTheme,
  Card
} from '@chakra-ui/react';
import { useSelectFile } from '@/web/common/file/hooks/useSelectFile';
import { useForm } from 'react-hook-form';
import { compressImgFileAndUpload } from '@/web/common/file/controller';
import { getErrText } from '@fastgpt/global/common/error/utils';
import { useToast } from '@/web/common/hooks/useToast';
import { postCreateApp } from '@/web/core/app/api';
import { useRouter } from 'next/router';
import { appTemplates } from '@/web/core/app/templates';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { useRequest } from '@/web/common/hooks/useRequest';
import { feConfigs } from '@/web/common/system/staticData';
import Avatar from '@/components/Avatar';
import MyTooltip from '@/components/MyTooltip';
import Image from 'next/image';
import MyModal from '@/components/MyModal';
import { useTranslation } from 'next-i18next';

type FormType = {
  avatar: string;
  name: string;
  templateId: string;
};

const CreateModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [refresh, setRefresh] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const theme = useTheme();
  const { isPc } = useSystemStore();
  const { register, setValue, getValues, handleSubmit } = useForm<FormType>({
    defaultValues: {
      avatar: '/icon/logo.svg',
      name: '',
      templateId: appTemplates[0].id
    }
  });

  const { File, onOpen: onOpenSelectFile } = useSelectFile({
    fileType: '.jpg,.png',
    multiple: false
  });

  const onSelectFile = useCallback(
    async (e: File[]) => {
      const file = e[0];
      if (!file) return;
      try {
        const src = await compressImgFileAndUpload({
          file,
          maxW: 300,
          maxH: 300
        });
        setValue('avatar', src);
        setRefresh((state) => !state);
      } catch (err: any) {
        toast({
          title: getErrText(err, 'Avatar selection is abnormal'),
          status: 'warning'
        });
      }
    },
    [setValue, toast]
  );

  const { mutate: onclickCreate, isLoading: creating } = useRequest({
    mutationFn: async (data: FormType) => {
      const template = appTemplates.find((item) => item.id === data.templateId);
      if (!template) {
        return Promise.reject('The template does not exist');
      }

      if (data.templateId == 'simpleChat') {
        data.avatar = '/imgs/module/AI.png';
      }

      if (data.templateId == 'simpleDatasetChat') {
        data.avatar = '/imgs/module/db.png';
      }

      if (data.templateId == 'chatGuide') {
        data.avatar = '/imgs/module/userGuide.png';
      }

      if (data.templateId == 'CQ') {
        data.avatar = '/imgs/module/cq.png';
      }

      return postCreateApp({
        avatar: data.avatar,
        name: data.name,
        type: template.type,
        modules: template.modules || []
      });
    },
    onSuccess(id: string) {
      router.push(`/app/detail?appId=${id}`);
      onSuccess();
      onClose();
    },
    successToast: 'Successful creation',
    errorToast: 'Create an abnormal application'
  });

  return (
    <MyModal
      iconSrc="/imgs/module/ai.svg"
      title={t('core.app.create app')}
      isOpen
      onClose={onClose}
      isCentered={!isPc}
    >
      <ModalBody>
        <Box color={'myGray.800'} fontWeight={'bold'}>
          Choose a resounding name
        </Box>
        <Flex mt={3} alignItems={'center'}>
          <MyTooltip label={'Click to set avatar'}>
            <Image src={'/favicon.png'} alt={''} width={32} height={32} />
          </MyTooltip>
          <Input
            flex={1}
            ml={4}
            autoFocus
            bg={'myWhite.600'}
            {...register('name', {
              required: 'The application name cannot be empty'
            })}
          />
        </Flex>
        {!feConfigs?.hide_app_flow && (
          <>
            <Box mt={[4, 7]} mb={[0, 3]} color={'myGray.800'} fontWeight={'bold'}>
              Choose from templates
            </Box>
            <Grid
              userSelect={'none'}
              gridTemplateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
              gridGap={[2, 4]}
            >
              {appTemplates.map((item) => (
                <Card
                  key={item.id}
                  border={theme.borders.base}
                  p={3}
                  borderRadius={'md'}
                  cursor={'pointer'}
                  boxShadow={'sm'}
                  {...(getValues('templateId') === item.id
                    ? {
                        bg: 'myWhite.600'
                      }
                    : {
                        _hover: {
                          boxShadow: 'md'
                        }
                      })}
                  onClick={() => {
                    setValue('templateId', item.id);
                    setRefresh((state) => !state);
                  }}
                >
                  <Flex alignItems={'center'}>
                    <Avatar src={item.avatar} borderRadius={'md'} w={'20px'} />
                    <Box ml={3} fontWeight={'bold'}>
                      {item.name}
                    </Box>
                  </Flex>
                  <Box fontSize={'sm'} mt={4}>
                    {item.intro}
                  </Box>
                </Card>
              ))}
            </Grid>
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant={'base'} mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={creating} onClick={handleSubmit((data) => onclickCreate(data))}>
          Confirm creation
        </Button>
      </ModalFooter>

      <File onSelect={onSelectFile} />
    </MyModal>
  );
};

export default CreateModal;
