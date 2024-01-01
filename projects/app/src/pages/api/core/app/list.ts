import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoApp } from '@fastgpt/service/core/app/schema';
import { mongoRPermission } from '@fastgpt/global/support/permission/utils';
import { AppListItemType } from '@fastgpt/global/core/app/type';
import { authUserNotVisitor } from '@fastgpt/service/support/permission/auth/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    // 凭证校验
    // const { teamId, tmbId, teamOwner, role } = await authUserRole({ req, authToken: true });
    const { userId } = await authUserNotVisitor({ req, authToken: true });
    // 根据 userId 获取模型信息
    const myApps = await MongoApp.find({ userId }, '_id avatar name intro permission').sort({
      updateTime: -1
    });
    jsonRes<AppListItemType[]>(res, {
      data: myApps.map((app) => ({
        _id: app._id,
        avatar: app.avatar,
        name: app.name,
        intro: app.intro,
        isOwner: true,
        permission: app.permission
      }))
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
