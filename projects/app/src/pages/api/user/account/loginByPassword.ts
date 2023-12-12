import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { MongoUser } from '@fastgpt/service/support/user/schema';
import { createJWT, setCookie } from '@fastgpt/service/support/permission/controller';
import { connectToDatabase } from '@/service/mongo';
import { getUserDetail } from '@/service/support/user/controller';
import type { PostLoginProps } from '@fastgpt/global/support/user/api.d';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const { username, password, tmbId = '' } = req.body as PostLoginProps;

    if (!username || !password) throw new Error('Missing parameters');

    const authCert = await MongoUser.findOne({
      $or: [{ email: username }, { username: username }]
    });

    if (!authCert) throw new Error('User is not registered');

    /* login using email / phone / username */
    if (authCert.email !== undefined)
      var user = await MongoUser.findOne({ email: username, password });
    else if (authCert.phone !== undefined)
      var user = await MongoUser.findOne({ phone: username, password });
    else var user = await MongoUser.findOne({ username: username, password });

    if (!user) throw new Error('Wrong Password');

    const userDetail = await getUserDetail({ tmbId, userId: user._id });

    const token = createJWT(userDetail);
    setCookie(res, token);

    jsonRes(res, {
      data: {
        user: userDetail,
        token
      }
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
