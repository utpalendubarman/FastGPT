import { AuthResponseType } from '@fastgpt/global/support/permission/type';
import { parseHeaderCert } from '@fastgpt/service/support/permission/controller';
import { AuthModeType } from '@fastgpt/service/support/permission/type';
import { UserErrEnum } from '@fastgpt/global/common/error/code/user';
import { UserType } from '@fastgpt/global/support/user/type';
import { getUserDetail } from '@/service/support/user/controller';
import { authUserNotVisitor } from '@fastgpt/service/support/permission/auth/user';

export async function getUserAndAuthBalance({
  tmbId,
  minBalance,
  userId
}: {
  tmbId: string;
  minBalance?: number;
  userId: string;
}) {
  const user = await getUserDetail({ userId });

  if (!user) {
    return Promise.reject(UserErrEnum.unAuthUser);
  }
  if (minBalance !== undefined && global.feConfigs.isPlus && user.team.balance < minBalance) {
    return Promise.reject(UserErrEnum.balanceNotEnough);
  }

  return user;
}

/* get user */
export async function authUser({
  minBalance,
  ...props
}: AuthModeType & {
  minBalance?: number;
  authToken?: boolean;
}): Promise<
  AuthResponseType & {
    user: UserType;
  }
> {
  const result = await parseHeaderCert(props);
  return {
    ...result,
    user: await getUserAndAuthBalance({ tmbId: result.tmbId, minBalance, userId }),
    isOwner: true,
    canWrite: true
  };
}
