import React, { useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Button,
  FormControl,
  Input,
  Textarea,
  ModalFooter,
  ModalBody,
  Image
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { AppSchema } from '@fastgpt/global/core/app/type.d';
import { useToast } from '@/web/common/hooks/useToast';
import { useSelectFile } from '@/web/common/file/hooks/useSelectFile';
import { compressImgFileAndUpload } from '@/web/common/file/controller';
import { getErrText } from '@fastgpt/global/common/error/utils';
import { useRequest } from '@/web/common/hooks/useRequest';
import Avatar from '@/components/Avatar';
import MyModal from '@/components/MyModal';
import { useAppStore } from '@/web/core/app/store/useAppStore';
import PermissionRadio from '@/components/support/permission/Radio';
import { useTranslation } from 'next-i18next';

const InfoModal = ({
  defaultApp,
  onClose,
  onSuccess
}: {
  defaultApp: AppSchema;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { updateAppDetail } = useAppStore();

  const { File, onOpen: onOpenSelectFile } = useSelectFile({
    fileType: '.jpg,.png',
    multiple: false
  });
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    reset,
    handleSubmit
  } = useForm({
    defaultValues: defaultApp
  });
  const [refresh, setRefresh] = useState(false);

  // 提交保存模型修改
  const { mutate: saveSubmitSuccess, isLoading: btnLoading } = useRequest({
    mutationFn: async (data: AppSchema) => {
      await updateAppDetail(data._id, {
        name: data.name,
        avatar: data.avatar,
        intro: data.intro,
        permission: data.permission
      });
    },
    onSuccess() {
      onSuccess && onSuccess();
      onClose();
      toast({
        title: 'update completed',
        status: 'success'
      });
    },
    errorToast: 'Update failure'
  });

  // 提交保存表单失败
  const saveSubmitError = useCallback(() => {
    // deep search message
    const deepSearch = (obj: any): string => {
      if (!obj) return 'Submit the form error';
      if (!!obj.message) {
        return obj.message;
      }
      return deepSearch(Object.values(obj)[0]);
    };
    toast({
      title: deepSearch(errors),
      status: 'error',
      duration: 4000,
      isClosable: true
    });
  }, [errors, toast]);

  const saveUpdateModel = useCallback(
    () => handleSubmit((data) => saveSubmitSuccess(data), saveSubmitError)(),
    [handleSubmit, saveSubmitError, saveSubmitSuccess]
  );

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

  return (
    <MyModal
      isOpen={true}
      onClose={onClose}
      iconSrc="/imgs/module/ai.svg"
      title={t('core.app.setting')}
    >
      <ModalBody>
        <Box>Avatar & Name</Box>
        <Flex mt={2} alignItems={'center'}>
          <Avatar
            src={getValues('avatar')}
            w={['26px', '34px']}
            h={['26px', '34px']}
            cursor={'pointer'}
            borderRadius={'lg'}
            mr={4}
            title={'Click to switch avatar'}
            onClick={() => onOpenSelectFile()}
          />
          <FormControl>
            <Input
              bg={'myWhite.600'}
              placeholder={'给应用设置一个名称'}
              {...register('name', {
                required: 'The display name cannot be empty'
              })}
            ></Input>
          </FormControl>
        </Flex>
        <Box mt={4} mb={1}>
          应用介绍
        </Box>
        {/* <Box color={'myGray.500'} mb={2} fontSize={'sm'}>
            该介绍主要用于记忆和在应用市场展示
          </Box> */}
        <Textarea
          rows={4}
          maxLength={500}
          placeholder={'Introduction to your AI application'}
          bg={'myWhite.600'}
          {...register('intro')}
        />
        <Box mt={4}>
          <Box mb={1}>{t('user.Permission')}</Box>
          <PermissionRadio
            value={getValues('permission')}
            onChange={(e) => {
              setValue('permission', e);
              setRefresh(!refresh);
            }}
          />
        </Box>
      </ModalBody>

      <ModalFooter>
        <Button variant={'base'} mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={btnLoading} onClick={saveUpdateModel}>
          keep
        </Button>
      </ModalFooter>

      <File onSelect={onSelectFile} />
    </MyModal>
  );
};

export default InfoModal;
