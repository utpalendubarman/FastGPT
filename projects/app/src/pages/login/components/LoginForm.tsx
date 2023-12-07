import React, { useState, Dispatch, useCallback, useRef } from 'react';
import { FormControl, Flex, Input, Button, FormErrorMessage, Box, Link } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { PageTypeEnum } from '@/constants/user';
import { OAuthEnum } from '@fastgpt/global/support/user/constant';
import { postLogin } from '@/web/support/user/api';
import type { ResLogin } from '@/global/support/api/userRes';
import { useToast } from '@/web/common/hooks/useToast';
import { feConfigs } from '@/web/common/system/staticData';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import MyIcon from '@/components/Icon';
import { customAlphabet } from 'nanoid';
import { getDocPath } from '@/web/common/system/doc';
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 8);

interface Props {
  setPageType: Dispatch<`${PageTypeEnum}`>;
  loginSuccess: (e: ResLogin) => void;
}

interface LoginFormType {
  username: string;
  password: string;
}

const LoginForm = ({ setPageType, loginSuccess }: Props) => {
  const router = useRouter();
  const { lastRoute = '/app/list' } = router.query as { lastRoute: string };
  const { toast } = useToast();
  const { setLoginStore } = useSystemStore();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormType>();

  const [requesting, setRequesting] = useState(false);

  const onclickLogin = useCallback(
    async ({ username, password }: LoginFormType) => {
      setRequesting(true);
      try {
        loginSuccess(
          await postLogin({
            username,
            password
          })
        );
        toast({
          title: 'login successful',
          status: 'success'
        });
      } catch (error: any) {
        toast({
          title: error.message || 'Login exception',
          status: 'error'
        });
      }
      setRequesting(false);
    },
    [loginSuccess, toast]
  );

  const redirectUri = `${location.origin}/login/provider`;
  const state = useRef(nanoid());

  const oAuthList = [
    ...(feConfigs?.oauth?.github
      ? [
          {
            provider: OAuthEnum.github,
            icon: 'gitFill',
            redirectUrl: `https://github.com/login/oauth/authorize?client_id=${feConfigs?.oauth?.github}&redirect_uri=${redirectUri}&state=${state.current}&scope=user:email%20read:user`
          }
        ]
      : []),
    ...(feConfigs?.oauth?.google
      ? [
          {
            provider: OAuthEnum.google,
            icon: 'googleFill',
            redirectUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${feConfigs?.oauth?.google}&redirect_uri=${redirectUri}&state=${state.current}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20openid&include_granted_scopes=true`
          }
        ]
      : [])
  ];

  const isCommunityVersion = feConfigs?.show_register === false && feConfigs?.show_git;

  return (
    <>
      <Box fontWeight={'bold'} fontSize={'2xl'} textAlign={'center'}>
        Login {feConfigs?.systemTitle}
      </Box>
      <form onSubmit={handleSubmit(onclickLogin)}>
        <FormControl mt={8} isInvalid={!!errors.username}>
          <Input
            placeholder={
              isCommunityVersion ? 'Log in as root user' : 'Email/Mobile phone number/Username'
            }
            size={['md', 'lg']}
            {...register('username', {
              required: 'Email/mobile phone number/username cannot be empty'
            })}
          ></Input>
          <FormErrorMessage position={'absolute'} fontSize="xs">
            {!!errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl mt={8} isInvalid={!!errors.password}>
          <Input
            type={'password'}
            size={['md', 'lg']}
            placeholder={
              isCommunityVersion
                ? 'The root password is the environment variable set for you.'
                : 'password'
            }
            {...register('password', {
              required: 'password can not be blank',
              maxLength: {
                value: 20,
                message: 'Password maximum 20 characters'
              }
            })}
          ></Input>
          <FormErrorMessage position={'absolute'} fontSize="xs">
            {!!errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        {feConfigs?.show_register && (
          <>
            <Flex align={'center'} justifyContent={'space-between'} mt={3} color={'myBlue.600'}>
              <Box
                cursor={'pointer'}
                _hover={{ textDecoration: 'underline' }}
                onClick={() => setPageType('forgetPassword')}
                fontSize="sm"
              >
                forget the password?
              </Box>
              <Box
                cursor={'pointer'}
                _hover={{ textDecoration: 'underline' }}
                onClick={() => setPageType('register')}
                fontSize="sm"
              >
                Registration account number
              </Box>
            </Flex>
            {feConfigs?.docUrl && (
              <Box textAlign={'center'} mt={2} fontSize={'sm'}>
                By using it, you agree to our{' '}
                <Link
                  href={getDocPath('/docs/agreement/disclaimer/')}
                  target={'_blank'}
                  color={'myBlue.600'}
                >
                  Disclaimer
                </Link>
              </Box>
            )}
          </>
        )}

        <Button
          type="submit"
          mt={5}
          w={'100%'}
          size={['md', 'lg']}
          colorScheme="blue"
          isLoading={requesting}
        >
          Login
        </Button>
        {feConfigs?.show_register && (
          <>
            <Flex mt={10} justifyContent={'space-around'} alignItems={'center'}>
              {oAuthList.map((item) => (
                <MyIcon
                  key={item.provider}
                  name={item.icon as any}
                  w={'34px'}
                  cursor={'pointer'}
                  color={'myGray.800'}
                  onClick={() => {
                    setLoginStore({
                      provider: item.provider,
                      lastRoute,
                      state: state.current
                    });
                    router.replace(item.redirectUrl, '_self');
                  }}
                />
              ))}
            </Flex>
          </>
        )}
      </form>
    </>
  );
};

export default LoginForm;
