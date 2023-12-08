import { AppSimpleEditConfigTemplateType } from '@fastgpt/global/core/app/type.d';
import { DatasetSearchModeEnum } from '@fastgpt/global/core/dataset/constant';

export const SimpleModeTemplate_FastGPT_Universal: AppSimpleEditConfigTemplateType = {
  id: 'fastgpt-universal',
  name: 'Universal template',
  desc: 'Universal template  n can completely configure AI attributes and knowledge bases',
  systemForm: {
    aiSettings: {
      model: true,
      systemPrompt: true,
      temperature: true,
      maxToken: true,
      quoteTemplate: true,
      quotePrompt: true
    },
    dataset: {
      datasets: true,
      similarity: true,
      limit: true,
      searchMode: DatasetSearchModeEnum.embedding,
      searchEmptyText: true
    },
    userGuide: {
      welcomeText: true,
      variables: true,
      questionGuide: true,
      tts: true
    }
  }
};
