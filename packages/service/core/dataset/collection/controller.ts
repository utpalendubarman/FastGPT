import {
  DatasetCollectionTrainingModeEnum,
  DatasetCollectionTypeEnum
} from '@fastgpt/global/core/dataset/constant';
import type { CreateDatasetCollectionParams } from '@fastgpt/global/core/dataset/api.d';
import { MongoDatasetCollection } from './schema';

export async function createOneCollection({
  name,
  parentId,
  datasetId,
  type,
  trainingType = DatasetCollectionTrainingModeEnum.manual,
  chunkSize = 0,
  fileId,
  rawLink,
  userId,
  metadata = {}
}: CreateDatasetCollectionParams & { teamId: string; tmbId: string }) {
  const { _id } = await MongoDatasetCollection.create({
    name,
    userId,
    datasetId,
    parentId: parentId || null,
    type,
    trainingType,
    chunkSize,
    fileId,
    rawLink,
    metadata
  });

  // create default collection
  // if (type === DatasetCollectionTypeEnum.folder) {
  //   await createDefaultCollection({
  //     datasetId,
  //     parentId: _id,
  //     teamId,
  //     tmbId
  //   });
  // }

  return _id;
}

// create default collection
export function createDefaultCollection({
  name = '手动录入',
  datasetId,
  parentId,
  userId
}: {
  name?: '手动录入' | '手动标注';
  datasetId: string;
  parentId?: string;
  userId: string;
}) {
  return MongoDatasetCollection.create({
    name,
    userId,
    datasetId,
    parentId,
    type: DatasetCollectionTypeEnum.virtual,
    trainingType: DatasetCollectionTrainingModeEnum.manual,
    chunkSize: 0,
    updateTime: new Date('2099')
  });
}
