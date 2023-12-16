import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoOutLink } from '@fastgpt/service/support/outLink/schema';
import { authApp } from '@fastgpt/service/support/permission/auth/app';
import { authUserNotVisitor } from '@fastgpt/service/support/permission/auth/user';

/* get shareChat list by appId */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    const { appId } = req.query as {
      appId: string;
    };

    const { userId } = await authUserNotVisitor({ req, authToken: true });

    const data = await MongoOutLink.find({
      appId,
      userId
    }).sort({
      _id: -1
    });

    jsonRes(res, { data });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
