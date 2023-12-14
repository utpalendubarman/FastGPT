import { BillSourceEnum } from '@fastgpt/global/support/wallet/bill/constants';
import { MongoBill } from './schema';

export const createTrainingBill = async ({
  userId,
  appName,
  billSource,
  vectorModel,
  agentModel
}: {
  userId: string;
  appName: string;
  billSource: `${BillSourceEnum}`;
  vectorModel: string;
  agentModel: string;
}) => {
  const { _id } = await MongoBill.create({
    userId,
    appName,
    source: billSource,
    list: [
      {
        moduleName: 'wallet.moduleName.index',
        model: vectorModel,
        amount: 0,
        tokenLen: 0
      },
      {
        moduleName: 'wallet.moduleName.qa',
        model: agentModel,
        amount: 0,
        tokenLen: 0
      }
    ],
    total: 0
  });

  return { billId: String(_id) };
};
