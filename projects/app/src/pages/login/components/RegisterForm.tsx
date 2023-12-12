import React, { useState, Dispatch, useCallback } from 'react';
import { FormControl, Box, Input, Button, FormErrorMessage, Flex } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { PageTypeEnum } from '@/constants/user';
import { postRegister } from '@/web/support/user/api';
import { useSendCode } from '@/web/support/user/hooks/useSendCode';
import type { ResLogin } from '@/global/support/api/userRes';
import { useToast } from '@/web/common/hooks/useToast';
import { postCreateApp } from '@/web/core/app/api';
import { appTemplates } from '@/web/core/app/templates';
import { feConfigs } from '@/web/common/system/staticData';

interface Props {
  loginSuccess: (e: ResLogin) => void;
  setPageType: Dispatch<`${PageTypeEnum}`>;
}

interface RegisterType {
  username: string;
  password: string;
  password2: string;
  name: string;
}

const RegisterForm = ({ setPageType, loginSuccess }: Props) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors }
  } = useForm<RegisterType>({
    mode: 'onBlur'
  });

  const { codeSending, sendCodeText, sendCode, codeCountDown } = useSendCode();

  const onclickSendCode = useCallback(async () => {
    const check = await trigger('username');
    if (!check) return;
    sendCode({
      username: getValues('username'),
      type: 'register'
    });
  }, [getValues, sendCode, trigger]);

  const [requesting, setRequesting] = useState(false);

  const onclickRegister = useCallback(
    async ({ username, password, name }: RegisterType) => {
      setRequesting(true);
      try {
        loginSuccess(
          await postRegister({
            username,
            password,
            name
          })
        );
        toast({
          title: `Welcome`,
          status: 'success'
        });
        // auto register template app
        // setTimeout(() => {
        //   appTemplates.forEach((template) => {
        //     postCreateApp({
        //       avatar: template.avatar,
        //       name: template.name,
        //       modules: template.modules,
        //       type: template.type
        //     });
        //   });
        // }, 100);
      } catch (error: any) {
        toast({
          title: error.message || 'Registration exception',
          status: 'error'
        });
      }
      setRequesting(false);
    },
    [loginSuccess, toast]
  );

  return (
    <>
      <Box fontWeight={'bold'} fontSize={'2xl'} textAlign={'center'}>
        Signup
      </Box>
      <form onSubmit={handleSubmit(onclickRegister)}>
        <FormControl mt={5} isInvalid={!!errors.name}>
          <Input
            placeholder="Full Name"
            size={['md', 'lg']}
            {...register('name', {
              required: 'Name cannot be empty',
              pattern: {
                value: /(^[A-Za-z]+(?: [A-Za-z]+)?$)/,
                message: 'Invalid Name'
              }
            })}
          ></Input>
          <FormErrorMessage position={'absolute'} fontSize="xs">
            {!!errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl mt={6} isInvalid={!!errors.username}>
          <Input
            placeholder="Email"
            size={['md', 'lg']}
            {...register('username', {
              required: 'Email number cannot be empty',
              pattern: {
                value:
                  /(^1[3456789]\d{9}$)|(^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$)/,
                message: 'Invalid Email'
              }
            })}
          ></Input>
          <FormErrorMessage position={'absolute'} fontSize="xs">
            {!!errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>
        {/* <FormControl mt={8} isInvalid={!!errors.username}>
          <Flex>
            <Input
              flex={1}
              size={['md', 'lg']}
              placeholder="Verification code"
              {...register('code', {
                required: 'Verification code must be filled'
              })}
            ></Input>
            <Button
              ml={5}
              w={'145px'}
              maxW={'50%'}
              size={['md', 'lg']}
              onClick={onclickSendCode}
              isDisabled={codeCountDown > 0}
              isLoading={codeSending}
            >
              Send Code
            </Button>
          </Flex>
          <FormErrorMessage position={'absolute'} fontSize="xs">
            {!!errors.code && errors.code.message}
          </FormErrorMessage>
        </FormControl> */}
        <FormControl mt={8} isInvalid={!!errors.password}>
          <Input
            type={'password'}
            placeholder="Password"
            size={['md', 'lg']}
            {...register('password', {
              required: 'Password can not be blank',
              minLength: {
                value: 4,
                message: 'Password must be at least 4 characters and at most 20 characters'
              },
              maxLength: {
                value: 20,
                message: 'Password must be at least 4 characters and at most 20 characters'
              }
            })}
          ></Input>
          <FormErrorMessage position={'absolute'} fontSize="xs">
            {!!errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl mt={8} isInvalid={!!errors.password2}>
          <Input
            type={'password'}
            placeholder="Confirm Password"
            size={['md', 'lg']}
            {...register('password2', {
              validate: (val) =>
                getValues('password') === val ? true : 'Two passwords are not same'
            })}
          ></Input>
          <FormErrorMessage position={'absolute'} fontSize="xs">
            {!!errors.password2 && errors.password2.message}
          </FormErrorMessage>
        </FormControl>
        <Box
          float={'right'}
          fontSize="sm"
          mt={2}
          color={'myBlue.600'}
          cursor={'pointer'}
          _hover={{ textDecoration: 'underline' }}
          onClick={() => setPageType('login')}
        >
          Already have an account? Log in
        </Box>
        <Button
          type="submit"
          mt={5}
          w={'100%'}
          size={['md', 'lg']}
          colorScheme="blue"
          isLoading={requesting}
        >
          Register
        </Button>
      </form>
    </>
  );
};

export default RegisterForm;
