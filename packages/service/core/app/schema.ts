import { AppTypeMap } from '@fastgpt/global/core/app/constants';
import { connectionMongo, type Model } from '../../common/mongo';
const { Schema, model, models } = connectionMongo;
import type { AppSchema as AppType } from '@fastgpt/global/core/app/type.d';
import { PermissionTypeEnum, PermissionTypeMap } from '@fastgpt/global/support/permission/constant';
import {
  TeamCollectionName,
  TeamMemberCollectionName
} from '@fastgpt/global/support/user/team/constant';

export const appCollectionName = 'apps';

const AppSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mid: {
    type: String
  },
  type: {
    type: String,
    default: 'advanced',
    enum: Object.keys(AppTypeMap)
  },
  simpleTemplateId: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/icon/logo.svg'
  },
  intro: {
    type: String,
    default: ''
  },
  updateTime: {
    type: Date,
    default: () => new Date()
  },
  modules: {
    type: Array,
    default: []
  },
  inited: {
    type: Boolean
  },
  permission: {
    type: String,
    enum: Object.keys(PermissionTypeMap),
    default: PermissionTypeEnum.private
  }
});

try {
  AppSchema.index({ updateTime: -1 });
  AppSchema.index({ teamId: 1 });
} catch (error) {
  console.log(error);
}

export const MongoApp: Model<AppType> =
  models[appCollectionName] || model(appCollectionName, AppSchema);

MongoApp.syncIndexes();
