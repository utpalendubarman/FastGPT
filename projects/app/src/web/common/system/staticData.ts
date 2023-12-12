import type { InitDateResponse } from '@/global/common/api/systemRes';
import { getSystemInitData } from '@/web/common/system/api';
import { delay } from '@fastgpt/global/common/system/utils';
import type { FeConfigsType } from '@fastgpt/global/common/system/types/index.d';
import {
  defaultChatModels,
  defaultQAModels,
  defaultCQModels,
  defaultExtractModels,
  defaultQGModels,
  defaultVectorModels,
  defaultAudioSpeechModels,
  defaultReRankModels
} from '@fastgpt/global/core/ai/model';
import { AppSimpleEditConfigTemplateType } from '@fastgpt/global/core/app/type';

export let feConfigs: FeConfigsType = {};
export let priceMd = '';
export let systemVersion = '0.0.0';

export let vectorModelList = defaultVectorModels;
export let chatModelList = defaultChatModels;
export let qaModelList = defaultQAModels;
export let cqModelList = defaultCQModels;
export let extractModelList = defaultExtractModels;
export let qgModelList = defaultQGModels;
export let audioSpeechModels = defaultAudioSpeechModels;
export let simpleModeTemplates: AppSimpleEditConfigTemplateType[] = [];
export let reRankModelList = defaultReRankModels;

let retryTimes = 3;

export const clientInitData = async (): Promise<InitDateResponse> => {
  try {
    const res = await getSystemInitData();

    chatModelList = res.chatModels ?? chatModelList;
    qaModelList = res.qaModels ?? qaModelList;
    cqModelList = res.cqModels ?? cqModelList;
    extractModelList = res.extractModels ?? extractModelList;

    vectorModelList = res.vectorModels ?? vectorModelList;

    reRankModelList = res.reRankModels ?? reRankModelList;

    audioSpeechModels = res.audioSpeechModels ?? audioSpeechModels;

    feConfigs = res.feConfigs;
    priceMd = res.priceMd;
    systemVersion = res.systemVersion;

    simpleModeTemplates = res.simpleModeTemplates;

    return res;
  } catch (error) {
    retryTimes--;
    await delay(500);
    return clientInitData();
  }
};
