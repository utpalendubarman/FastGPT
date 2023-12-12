import { useState, useMemo, useCallback } from 'react';
import { sendAuthCode } from '@/web/support/user/api';
import { UserAuthTypeEnum } from '@/constants/common';
import { useToast } from '@/web/common/hooks/useToast';
import { feConfigs } from '@/web/common/system/staticData';
import { getErrText } from '@fastgpt/global/common/error/utils';

let timer: any;

export const useSendCode = () => {
  const { toast } = useToast();
  const [codeSending, setCodeSending] = useState(false);
  const [codeCountDown, setCodeCountDown] = useState(0);
  const sendCodeText = useMemo(() => {
    if (codeCountDown >= 10) {
      return `${codeCountDown}s Resend`;
    }
    if (codeCountDown > 0) {
      return `0${codeCountDown}s Resend`;
    }
    return 'get verification code';
  }, [codeCountDown]);

  const sendCode = useCallback(
    async ({ username, type }: { username: string; type: `${UserAuthTypeEnum}` }) => {
      setCodeSending(true);
      try {
        await sendAuthCode({
          username,
          type,
          googleToken: await getClientToken(feConfigs.googleClientVerKey)
        });
        setCodeCountDown(60);
        timer = setInterval(() => {
          setCodeCountDown((val) => {
            if (val <= 0) {
              clearInterval(timer);
            }
            return val - 1;
          });
        }, 1000);
        toast({
          title: 'The verification code has been sent',
          status: 'success',
          position: 'top'
        });
      } catch (error: any) {
        toast({
          title: getErrText(error, 'Verification code sending abnormalities'),
          status: 'error'
        });
      }
      setCodeSending(false);
    },
    [toast]
  );

  return {
    codeSending,
    sendCode,
    sendCodeText,
    codeCountDown
  };
};

export function getClientToken(googleClientVerKey?: string) {
  if (!googleClientVerKey || typeof window.grecaptcha === 'undefined' || !window.grecaptcha?.ready)
    return '';
  return new Promise<string>((resolve, reject) => {
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(googleClientVerKey, {
          action: 'submit'
        });
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  });
}
