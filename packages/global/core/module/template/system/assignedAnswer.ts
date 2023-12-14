import { FlowNodeInputTypeEnum, FlowNodeTypeEnum } from '../../node/constant';
import { FlowModuleTemplateType } from '../../type.d';
import { ModuleDataTypeEnum, ModuleInputKeyEnum, ModuleTemplateTypeEnum } from '../../constants';
import { Input_Template_TFSwitch } from '../input';
import { Output_Template_Finish } from '../output';

export const AssignedAnswerModule: FlowModuleTemplateType = {
  id: FlowNodeTypeEnum.answerNode,
  templateType: ModuleTemplateTypeEnum.textAnswer,
  flowType: FlowNodeTypeEnum.answerNode,
  avatar: '/imgs/module/reply.png',
  name: 'Specify reply',
  intro:
    'This module can directly reply to a specified piece of content. Commonly used for guidance and prompts',
  inputs: [
    Input_Template_TFSwitch,
    {
      key: ModuleInputKeyEnum.answerText,
      type: FlowNodeInputTypeEnum.textarea,
      valueType: ModuleDataTypeEnum.any,
      value: '',
      label: 'Reply content',
      description:
        'You can use \\n to achieve continuous line breaks. \n\nReply can be achieved through external module input. When external module input, the currently filled content will be overwritten. \n\nIf non-string type data is passed in, it will be automatically converted into a string.',
      showTargetInApp: true,
      showTargetInPlugin: true
    }
  ],
  outputs: [Output_Template_Finish]
};
