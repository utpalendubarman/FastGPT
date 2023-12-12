import { GET, POST, PUT } from '@/web/common/api/request';
import type { PayModelSchema } from '@fastgpt/global/support/wallet/pay/type';

export const listTransactions = async () => {
  return GET<PayModelSchema[]>('/pay/list', {});
};
