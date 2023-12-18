/* 
    universal mode.
    @author: FastGpt Team
*/
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import type { AppSimpleEditFormType } from '@fastgpt/global/core/app/type.d';
import type { ModuleItemType } from '@fastgpt/global/core/module/type';
import { FlowNodeInputTypeEnum, FlowNodeTypeEnum } from '@fastgpt/global/core/module/node/constant';
import { ModuleDataTypeEnum } from '@fastgpt/global/core/module/constants';
import { ModuleInputKeyEnum } from '@fastgpt/global/core/module/constants';
import type { FlowNodeInputItemType } from '@fastgpt/global/core/module/node/type.d';
import { FormatForm2ModulesProps } from '@fastgpt/global/core/app/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { formData, chatModelList } = req.body as FormatForm2ModulesProps;

    const modules =
      formData.dataset.datasets.length > 0
        ? datasetTemplate(formData)
        : simpleChatTemplate(formData);

    jsonRes<ModuleItemType[]>(res, {
      data: modules
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}

function chatModelInput(formData: AppSimpleEditFormType): FlowNodeInputItemType[] {
  return [
    {
      key: 'model',
      value: formData.aiSettings.model,
      type: 'custom',
      label: '对话模型',
      connected: true
    },
    {
      key: 'temperature',
      value: formData.aiSettings.temperature,
      type: 'slider',
      label: '温度',
      connected: true
    },
    {
      key: 'maxToken',
      value: formData.aiSettings.maxToken,
      type: 'custom',
      label: '回复上限',
      connected: true
    },
    {
      key: 'systemPrompt',
      value: formData.aiSettings.systemPrompt || '',
      type: 'textarea',
      label: '系统提示词',
      connected: true
    },
    {
      key: ModuleInputKeyEnum.aiChatIsResponseText,
      value: true,
      type: 'hidden',
      label: '返回AI内容',
      connected: true
    },
    {
      key: 'quoteTemplate',
      value: formData.aiSettings.quoteTemplate || '',
      type: 'hidden',
      label: '引用内容模板',
      connected: true
    },
    {
      key: 'quotePrompt',
      value: formData.aiSettings.quotePrompt || '',
      type: 'hidden',
      label: '引用内容提示词',
      connected: true
    },
    {
      key: 'switch',
      type: 'target',
      label: '触发器',
      connected: formData.dataset.datasets.length > 0 && !!formData.dataset.searchEmptyText
    },
    {
      key: 'quoteQA',
      type: 'target',
      label: '引用内容',
      connected: formData.dataset.datasets.length > 0
    },
    {
      key: 'history',
      type: 'target',
      label: '聊天记录',
      connected: true
    },
    {
      key: 'userChatInput',
      type: 'target',
      label: '用户问题',
      connected: true
    }
  ];
}

function datasetTemplate(formData: AppSimpleEditFormType): ModuleItemType[] {
  return [
    {
      moduleId: 'userChatInput',
      name: '用户问题(对话入口)',
      avatar: '/imgs/module/userChatInput.png',
      flowType: 'questionInput',
      position: {
        x: -795.2276475287244,
        y: 1018.719926297249
      },
      inputs: [
        {
          key: 'userChatInput',
          type: 'systemInput',
          valueType: 'string',
          label: '用户问题',
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: true
        }
      ],
      outputs: [
        {
          key: 'userChatInput',
          label: '用户问题',
          type: 'source',
          valueType: 'string',
          targets: [
            {
              moduleId: 'ti6yf5',
              key: 'userChatInput'
            }
          ]
        }
      ]
    },
    {
      moduleId: 'history',
      name: '聊天记录',
      avatar: '/imgs/module/history.png',
      flowType: 'historyNode',
      position: {
        x: -753.7310546494796,
        y: 175.8762430452661
      },
      inputs: [
        {
          key: 'maxContext',
          type: 'numberInput',
          label: '最长记录数',
          description:
            '该记录数不代表模型可接收这么多的历史记录，具体可接收多少历史记录，取决于模型的能力，通常建议不要超过20条。',
          value: 6,
          valueType: 'number',
          min: 0,
          max: 100,
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: true
        },
        {
          key: 'history',
          type: 'hidden',
          valueType: 'chatHistory',
          label: '聊天记录',
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: true
        }
      ],
      outputs: [
        {
          key: 'history',
          label: '聊天记录',
          valueType: 'chatHistory',
          type: 'source',
          targets: [
            {
              moduleId: 'ti6yf5',
              key: 'history'
            }
          ]
        }
      ]
    },
    {
      moduleId: 'datasetSearch',
      name: '知识库搜索',
      avatar: '/imgs/module/db.png',
      flowType: 'datasetSearchNode',
      showStatus: true,
      position: {
        x: 648.5490023673332,
        y: -338.2132944090431
      },
      inputs: [
        {
          key: 'switch',
          type: 'target',
          label: 'core.module.input.label.switch',
          valueType: 'any',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: true
        },
        {
          key: 'datasets',
          type: 'selectDataset',
          label: '关联的知识库',
          value: formData.dataset.datasets,
          valueType: 'selectDataset',
          list: [],
          required: true,
          showTargetInApp: false,
          showTargetInPlugin: true,
          connected: true
        },
        {
          key: 'similarity',
          type: 'hidden',
          label: '最低相关性',
          value: 0.76,
          valueType: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          markList: [
            {
              label: '0',
              value: 0
            },
            {
              label: '1',
              value: 1
            }
          ],
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: true
        },
        {
          key: 'limit',
          type: 'hidden',
          label: '单次搜索上限',
          description: '最多取 n 条记录作为本次问题引用',
          value: 5,
          valueType: 'number',
          min: 1,
          max: 20,
          step: 1,
          markList: [
            {
              label: '1',
              value: 1
            },
            {
              label: '20',
              value: 20
            }
          ],
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: true
        },
        {
          key: 'searchMode',
          type: 'hidden',
          label: 'core.dataset.search.Mode',
          valueType: 'string',
          showTargetInApp: false,
          showTargetInPlugin: false,
          value: 'embedding',
          connected: true
        },
        {
          key: 'datasetParamsModal',
          type: 'selectDatasetParamsModal',
          label: '',
          connected: false,
          valueType: 'any',
          showTargetInApp: false,
          showTargetInPlugin: false
        },
        {
          key: 'userChatInput',
          type: 'target',
          label: 'core.module.input.label.user question',
          required: true,
          valueType: 'string',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: true
        }
      ],
      outputs: [
        {
          key: 'isEmpty',
          label: '搜索结果为空',
          type: 'source',
          valueType: 'boolean',
          targets: []
        },
        {
          key: 'unEmpty',
          label: '搜索结果不为空',
          type: 'source',
          valueType: 'boolean',
          targets: [
            {
              moduleId: 'chatModule',
              key: 'switch'
            }
          ]
        },
        {
          key: 'quoteQA',
          label: '引用内容',
          description:
            '始终返回数组，如果希望搜索结果为空时执行额外操作，需要用到上面的两个输入以及目标模块的触发器',
          type: 'source',
          valueType: 'datasetQuote',
          targets: [
            {
              moduleId: 'chatModule',
              key: 'quoteQA'
            }
          ]
        },
        {
          key: 'finish',
          label: 'core.module.output.label.running done',
          description: 'core.module.output.description.running done',
          valueType: 'boolean',
          type: 'source',
          targets: []
        }
      ]
    },
    {
      moduleId: 'emptyText',
      name: '指定回复',
      avatar: '/imgs/module/reply.png',
      flowType: 'answerNode',
      position: {
        x: 1644.2958989662895,
        y: 172.54452064355087
      },
      inputs: [
        {
          key: 'switch',
          type: 'target',
          label: 'core.module.input.label.switch',
          valueType: 'any',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: false
        },
        {
          key: 'text',
          type: 'textarea',
          valueType: 'any',
          value: "didn't an",
          label: 'Reply content',
          description:
            'You can use \\n to achieve continuous line breaks. \n\nReply can be achieved through external module input. When external module input, the currently filled content will be overwritten. \n\nIf non-string type data is passed in, it will be automatically converted into a string.',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: true
        }
      ],
      outputs: [
        {
          key: 'finish',
          label: 'core.module.output.label.running done',
          description: 'core.module.output.description.running done',
          valueType: 'boolean',
          type: 'source',
          targets: []
        }
      ]
    },
    {
      moduleId: 'chatModule',
      name: 'AI 对话',
      avatar: '/imgs/module/AI.png',
      flowType: 'chatNode',
      showStatus: true,
      position: {
        x: 1266.913394072471,
        y: 500.4863718728624
      },
      inputs: [
        {
          key: 'switch',
          type: 'target',
          label: 'core.module.input.label.switch',
          valueType: 'any',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: true
        },
        {
          key: 'model',
          type: 'selectChatModel',
          label: 'dialogue model',
          required: true,
          valueType: 'string',
          showTargetInApp: false,
          showTargetInPlugin: false,
          value: 'gpt-3.5-turbo-16k',
          connected: true
        },
        {
          key: 'temperature',
          type: 'hidden',
          label: 'temperature',
          value: 0,
          valueType: 'number',
          min: 0,
          max: 10,
          step: 1,
          markList: [
            {
              label: 'rigorous',
              value: 0
            },
            {
              label: 'diverge',
              value: 10
            }
          ],
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: false
        },
        {
          key: 'maxToken',
          type: 'hidden',
          label: 'Reply limit',
          value: 8000,
          valueType: 'number',
          min: 100,
          max: 4000,
          step: 50,
          markList: [
            {
              label: '100',
              value: 100
            },
            {
              label: '4000',
              value: 4000
            }
          ],
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: true
        },
        {
          key: 'isResponseAnswerText',
          type: 'hidden',
          label: 'Return to AI content',
          value: true,
          valueType: 'boolean',
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: true
        },
        {
          key: 'quoteTemplate',
          type: 'hidden',
          label: 'Quote content template',
          valueType: 'string',
          value: '',
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: false
        },
        {
          key: 'quotePrompt',
          type: 'hidden',
          label: 'Quotation content prompt words',
          valueType: 'string',
          value: '',
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: false
        },
        {
          key: 'aiSettings',
          type: 'aiSettings',
          label: '',
          connected: false,
          valueType: 'any',
          showTargetInApp: false,
          showTargetInPlugin: false
        },
        {
          key: 'systemPrompt',
          type: 'textarea',
          label: 'System prompt word',
          max: 300,
          valueType: 'string',
          description:
            'The model has a fixed guide word. By adjusting this content, you can guide the model in the chat direction. The content will be anchored at the beginning of the context. Variables can be used, such as {{language}}',
          placeholder:
            'The model has a fixed guide word. By adjusting this content, you can guide the model in the chat direction. The content will be anchored at the beginning of the context. Variables can be used, such as {{language}}',
          value:
            'if there are products found just provide product ids separated by comma also, stictly respond in this format, do not add any other text other than the array of ids',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: true
        },
        {
          key: 'quoteQA',
          type: 'target',
          label: 'Quotation content',
          description: "对象数组格式，结构：\n [{q:'问题',a:'回答'}]",
          valueType: 'datasetQuote',
          connected: true,
          showTargetInApp: true,
          showTargetInPlugin: true
        },
        {
          key: 'history',
          type: 'target',
          label: 'core.module.input.label.chat history',
          valueType: 'chatHistory',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: true
        },
        {
          key: 'userChatInput',
          type: 'target',
          label: 'core.module.input.label.user question',
          required: true,
          valueType: 'string',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: true
        }
      ],
      outputs: [
        {
          key: 'answerText',
          label: 'AI回复',
          description: '将在 stream 回复完毕后触发',
          valueType: 'string',
          type: 'source',
          targets: []
        },
        {
          key: 'finish',
          label: 'core.module.output.label.running done',
          description: 'core.module.output.description.running done',
          valueType: 'boolean',
          type: 'source',
          targets: []
        },
        {
          key: 'history',
          label: '新的上下文',
          description: '将本次回复内容拼接上历史记录，作为新的上下文返回',
          valueType: 'chatHistory',
          type: 'source',
          targets: []
        }
      ]
    },
    {
      moduleId: 'ti6yf5',
      name: 'AI dialogue',
      avatar: '/imgs/module/AI.png',
      flowType: 'chatNode',
      showStatus: true,
      position: {
        x: -80.47119560888746,
        y: -153.85124975800977
      },
      inputs: [
        {
          key: 'switch',
          type: 'target',
          label: 'core.module.input.label.switch',
          valueType: 'any',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: false
        },
        {
          key: 'model',
          type: 'selectChatModel',
          label: 'dialogue model',
          required: true,
          valueType: 'string',
          showTargetInApp: false,
          showTargetInPlugin: false,
          value: 'gpt-3.5-turbo-1106',
          connected: true
        },
        {
          key: 'temperature',
          type: 'hidden',
          label: 'temperature',
          value: 0,
          valueType: 'number',
          min: 0,
          max: 10,
          step: 1,
          markList: [
            {
              label: 'rigorous',
              value: 0
            },
            {
              label: 'diverge',
              value: 10
            }
          ],
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: false
        },
        {
          key: 'maxToken',
          type: 'hidden',
          label: 'Reply limit',
          value: 2000,
          valueType: 'number',
          min: 100,
          max: 4000,
          step: 50,
          markList: [
            {
              label: '100',
              value: 100
            },
            {
              label: '4000',
              value: 4000
            }
          ],
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: true
        },
        {
          key: 'isResponseAnswerText',
          type: 'hidden',
          label: 'Return to AI content',
          value: true,
          valueType: 'boolean',
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: true
        },
        {
          key: 'quoteTemplate',
          type: 'hidden',
          label: 'Quote content template',
          valueType: 'string',
          value: '',
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: false
        },
        {
          key: 'quotePrompt',
          type: 'hidden',
          label: 'Quotation content prompt words',
          valueType: 'string',
          value: '',
          showTargetInApp: false,
          showTargetInPlugin: false,
          connected: false
        },
        {
          key: 'aiSettings',
          type: 'aiSettings',
          label: '',
          connected: false,
          valueType: 'any',
          showTargetInApp: false,
          showTargetInPlugin: false
        },
        {
          key: 'systemPrompt',
          type: 'textarea',
          label: 'System prompt word',
          max: 300,
          valueType: 'string',
          description:
            'The model has a fixed guide word. By adjusting this content, you can guide the model in the chat direction. The content will be anchored at the beginning of the context. Variables can be used, such as {{language}}',
          placeholder:
            'The model has a fixed guide word. By adjusting this content, you can guide the model in the chat direction. The content will be anchored at the beginning of the context. Variables can be used, such as {{language}}',
          value:
            'if the user input is a human interaction reply to it else he is asking for some product list product categories related to user input not the user input it self, products related to user input stickly respond as catergoties sepreated by comma',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: true
        },
        {
          key: 'quoteQA',
          type: 'target',
          label: 'Quotation content',
          description: "对象数组格式，结构：\n [{q:'问题',a:'回答'}]",
          valueType: 'datasetQuote',
          connected: false,
          showTargetInApp: true,
          showTargetInPlugin: true
        },
        {
          key: 'history',
          type: 'target',
          label: 'core.module.input.label.chat history',
          valueType: 'chatHistory',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: true
        },
        {
          key: 'userChatInput',
          type: 'target',
          label: 'core.module.input.label.user question',
          required: true,
          valueType: 'string',
          showTargetInApp: true,
          showTargetInPlugin: true,
          connected: true
        }
      ],
      outputs: [
        {
          key: 'history',
          label: '新的上下文',
          description: '将本次回复内容拼接上历史记录，作为新的上下文返回',
          valueType: 'chatHistory',
          type: 'source',
          targets: [
            {
              moduleId: 'chatModule',
              key: 'history'
            }
          ]
        },
        {
          key: 'answerText',
          label: 'AI回复',
          description: '将在 stream 回复完毕后触发',
          valueType: 'string',
          type: 'source',
          targets: [
            {
              moduleId: 'chatModule',
              key: 'userChatInput'
            },
            {
              moduleId: 'datasetSearch',
              key: 'userChatInput'
            }
          ]
        },
        {
          key: 'finish',
          label: 'core.module.output.label.running done',
          description: 'core.module.output.description.running done',
          valueType: 'boolean',
          type: 'source',
          targets: [
            {
              moduleId: 'datasetSearch',
              key: 'switch'
            }
          ]
        }
      ]
    }
  ];
}
function simpleChatTemplate(formData: AppSimpleEditFormType): ModuleItemType[] {
  return [
    {
      name: '用户问题(对话入口)',
      flowType: FlowNodeTypeEnum.questionInput,
      inputs: [
        {
          key: 'userChatInput',
          connected: true,
          label: '用户问题',
          type: 'target'
        }
      ],
      outputs: [
        {
          key: 'userChatInput',
          targets: [
            {
              moduleId: 'chatModule',
              key: 'userChatInput'
            }
          ]
        }
      ],
      position: {
        x: 464.32198615344566,
        y: 1602.2698463081606
      },
      moduleId: 'userChatInput'
    },
    {
      name: '聊天记录',
      flowType: FlowNodeTypeEnum.historyNode,
      inputs: [
        {
          key: 'maxContext',
          value: 6,
          connected: true,
          type: 'numberInput',
          label: '最长记录数'
        },
        {
          key: 'history',
          type: 'hidden',
          label: '聊天记录',
          connected: true
        }
      ],
      outputs: [
        {
          key: 'history',
          targets: [
            {
              moduleId: 'chatModule',
              key: 'history'
            }
          ]
        }
      ],
      position: {
        x: 452.5466249541586,
        y: 1276.3930310334215
      },
      moduleId: 'history'
    },
    {
      name: 'AI 对话',
      flowType: FlowNodeTypeEnum.chatNode,
      inputs: chatModelInput(formData),
      showStatus: true,
      outputs: [
        {
          key: 'answerText',
          label: 'AI回复',
          description: '直接响应，无需配置',
          type: 'hidden',
          targets: []
        },
        {
          key: 'finish',
          label: '回复结束',
          description: 'AI 回复完成后触发',
          valueType: 'boolean',
          type: 'source',
          targets: []
        }
      ],
      position: {
        x: 981.9682828103937,
        y: 890.014595014464
      },
      moduleId: 'chatModule'
    }
  ];
}
function datasetTemplate2(formData: AppSimpleEditFormType): ModuleItemType[] {
  return [
    {
      name: '用户问题(对话入口)',
      flowType: FlowNodeTypeEnum.questionInput,
      inputs: [
        {
          key: 'userChatInput',
          label: '用户问题',
          type: 'target',
          connected: true
        }
      ],
      outputs: [
        {
          key: 'userChatInput',
          targets: [
            {
              moduleId: 'chatModule',
              key: 'userChatInput'
            },
            {
              moduleId: 'datasetSearch',
              key: 'userChatInput'
            }
          ]
        }
      ],
      position: {
        x: 464.32198615344566,
        y: 1602.2698463081606
      },
      moduleId: 'userChatInput'
    },
    {
      name: '聊天记录',
      flowType: FlowNodeTypeEnum.historyNode,
      inputs: [
        {
          key: 'maxContext',
          value: 6,
          connected: true,
          type: 'numberInput',
          label: '最长记录数'
        },
        {
          key: 'history',
          type: 'hidden',
          label: '聊天记录',
          connected: true
        }
      ],
      outputs: [
        {
          key: 'history',
          targets: [
            {
              moduleId: 'chatModule',
              key: 'history'
            }
          ]
        }
      ],
      position: {
        x: 452.5466249541586,
        y: 1276.3930310334215
      },
      moduleId: 'history'
    },
    {
      name: '知识库搜索',
      flowType: FlowNodeTypeEnum.datasetSearchNode,
      showStatus: true,
      inputs: [
        {
          key: 'datasets',
          value: formData.dataset.datasets,
          type: FlowNodeInputTypeEnum.custom,
          label: '关联的知识库',
          connected: false
        },
        {
          key: 'similarity',
          value: formData.dataset.similarity,
          type: FlowNodeInputTypeEnum.slider,
          label: '相似度',
          connected: false
        },
        {
          key: 'limit',
          value: formData.dataset.limit,
          type: FlowNodeInputTypeEnum.slider,
          label: '单次搜索上限',
          connected: false
        },
        {
          key: 'switch',
          type: FlowNodeInputTypeEnum.target,
          label: '触发器',
          connected: false
        },
        {
          key: 'userChatInput',
          type: FlowNodeInputTypeEnum.target,
          label: '用户问题',
          connected: true
        },
        {
          key: 'searchMode',
          type: 'hidden',
          label: 'core.dataset.search.Mode',
          valueType: 'string',
          showTargetInApp: false,
          showTargetInPlugin: false,
          value: formData.dataset.searchMode,
          connected: false
        },
        {
          key: 'datasetParamsModal',
          type: 'selectDatasetParamsModal',
          label: '',
          connected: false,
          valueType: 'any',
          showTargetInApp: false,
          showTargetInPlugin: false
        }
      ],
      outputs: [
        {
          key: 'isEmpty',
          targets: formData.dataset.searchEmptyText
            ? [
                {
                  moduleId: 'emptyText',
                  key: 'switch'
                }
              ]
            : []
        },
        {
          key: 'unEmpty',
          targets: formData.dataset.searchEmptyText
            ? [
                {
                  moduleId: 'chatModule',
                  key: 'switch'
                }
              ]
            : []
        },
        {
          key: 'quoteQA',
          targets: [
            {
              moduleId: 'chatModule',
              key: 'quoteQA'
            }
          ]
        }
      ],
      position: {
        x: 956.0838440206068,
        y: 887.462827870246
      },
      moduleId: 'datasetSearch'
    },
    ...(formData.dataset.searchEmptyText
      ? [
          {
            name: '指定回复',
            flowType: FlowNodeTypeEnum.answerNode,
            inputs: [
              {
                key: ModuleInputKeyEnum.switch,
                type: FlowNodeInputTypeEnum.target,
                label: '触发器',
                connected: true
              },
              {
                key: ModuleInputKeyEnum.answerText,
                value: formData.dataset.searchEmptyText,
                type: FlowNodeInputTypeEnum.textarea,
                valueType: ModuleDataTypeEnum.string,
                label: '回复的内容',
                connected: true
              }
            ],
            outputs: [],
            position: {
              x: 1553.5815811529146,
              y: 637.8753731306779
            },
            moduleId: 'emptyText'
          }
        ]
      : []),
    {
      name: 'AI 对话',
      flowType: FlowNodeTypeEnum.chatNode,
      inputs: chatModelInput(formData),
      showStatus: true,
      outputs: [
        {
          key: 'answerText',
          label: 'AI回复',
          description: '直接响应，无需配置',
          type: 'hidden',
          targets: []
        },
        {
          key: 'finish',
          label: '回复结束',
          description: 'AI 回复完成后触发',
          valueType: 'boolean',
          type: 'source',
          targets: []
        }
      ],
      position: {
        x: 1551.71405495818,
        y: 977.4911578918461
      },
      moduleId: 'chatModule'
    }
  ];
}
