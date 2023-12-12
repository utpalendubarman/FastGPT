import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '../../node/constant';
import { FlowModuleTemplateType } from '../../type.d';
import { ModuleDataTypeEnum, ModuleInputKeyEnum, ModuleTemplateTypeEnum } from '../../constants';

export const HistoryModule: FlowModuleTemplateType = {
  id: FlowNodeTypeEnum.historyNode,
  templateType: ModuleTemplateTypeEnum.systemInput,
  flowType: FlowNodeTypeEnum.historyNode,
  avatar: '/imgs/module/history.png',
  name: '聊天记录',
  intro: '用户输入的内容。该模块通常作为应用的入口，用户在发送消息后会首先执行该模块。',
  inputs: [
    {
      key: ModuleInputKeyEnum.historyMaxAmount,
      type: FlowNodeInputTypeEnum.numberInput,
      label: '最长记录数',
      description:
        '该记录数不代表模型可接收这么多的历史记录，具体可接收多少历史记录，取决于模型的能力，通常建议不要超过20条。',
      value: 6,
      valueType: ModuleDataTypeEnum.number,
      min: 0,
      max: 100,
      showTargetInApp: false,
      showTargetInPlugin: false
    },
    {
      key: ModuleInputKeyEnum.history,
      type: FlowNodeInputTypeEnum.hidden,
      valueType: ModuleDataTypeEnum.chatHistory,
      label: '聊天记录',
      showTargetInApp: false,
      showTargetInPlugin: false
    }
  ],
  outputs: [
    {
      key: ModuleInputKeyEnum.history,
      label: '聊天记录',
      valueType: ModuleDataTypeEnum.chatHistory,
      type: FlowNodeOutputTypeEnum.source,
      targets: []
    }
  ]
};
