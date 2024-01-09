import { AppItemType } from '@/types/app';
import { AppTypeEnum } from '@fastgpt/global/core/app/constants';

// template
export const appTemplates: (AppItemType & {
  avatar: string;
  intro: string;
  type: `${AppTypeEnum}`;
})[] = [
  {
    id: 'simpleChat',
    avatar: '/imgs/module/AI.png',
    name: 'Simple conversation',
    intro: 'An extremely simple AI dialogue application',
    type: AppTypeEnum.simple,
    modules: [
      {
        moduleId: 'userGuide',
        name: 'User guidance',
        avatar: '/imgs/module/userGuide.png',
        flowType: 'userGuide',
        position: {
          x: 454.98510354678695,
          y: 721.4016845336229
        },
        inputs: [
          {
            key: 'welcomeText',
            type: 'hidden',
            valueType: 'string',
            label: 'Opening remark',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'variables',
            type: 'hidden',
            valueType: 'any',
            label: 'Dialog box variable',
            value: [],
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'questionGuide',
            valueType: 'boolean',
            type: 'switch',
            label: 'Problem guidance',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'tts',
            type: 'hidden',
            valueType: 'any',
            label: 'Voice broadcast',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          }
        ],
        outputs: []
      },
      {
        moduleId: 'userChatInput',
        name: 'User problem (dialog entrance)',
        avatar: '/imgs/module/userChatInput.png',
        flowType: 'questionInput',
        position: {
          x: 464.32198615344566,
          y: 1602.2698463081606
        },
        inputs: [
          {
            key: 'userChatInput',
            type: 'systemInput',
            valueType: 'string',
            label: 'User problem',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          }
        ],
        outputs: [
          {
            key: 'userChatInput',
            label: 'User problem',
            type: 'source',
            valueType: 'string',
            targets: [
              {
                moduleId: 'chatModule',
                key: 'userChatInput'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'chatModule',
        name: 'AI dialogue',
        avatar: '/imgs/module/AI.png',
        flowType: 'chatNode',
        showStatus: true,
        position: {
          x: 1150.8317145593148,
          y: 957.9676672880053
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
            label: 'Dialog',
            required: true,
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: 'gpt-3.5-turbo-16k',
            connected: false
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
                label: 'Disperse',
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
            label: 'The upper limit',
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
            connected: false
          },
          {
            key: 'isResponseAnswerText',
            type: 'hidden',
            label: 'Return to AI content',
            value: true,
            valueType: 'boolean',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'quoteTemplate',
            type: 'hidden',
            label: 'Quote content template',
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'quotePrompt',
            type: 'hidden',
            label: 'Quote content prompt words',
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'aiSettings',
            type: 'aiSettings',
            label: '',
            valueType: 'any',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'systemPrompt',
            type: 'textarea',
            label: 'System prompt',
            max: 300,
            valueType: 'string',
            description:
              'The guidance of the model fixed can guide the model to chat direction by adjusting the content.This content will be fixed at the beginning of the context.Can use variables, such as {Language}}',
            placeholder:
              'The guidance of the model fixed can guide the model to chat direction by adjusting the content.This content will be fixed at the beginning of the context.Can use variables, such as {Language}}',
            showTargetInApp: true,
            showTargetInPlugin: true,
            connected: false
          },
          {
            key: 'history',
            type: 'numberInput',
            label: 'core.module.input.label.chat history',
            required: true,
            min: 0,
            max: 30,
            valueType: 'chatHistory',
            value: 6,
            showTargetInApp: true,
            showTargetInPlugin: true,
            connected: false
          },
          {
            key: 'quoteQA',
            type: 'target',
            label: 'Cited content',
            description: "Object number format, structure：\n [{Q: 'Questions', A: 'Answer'}]",
            valueType: 'datasetQuote',
            showTargetInApp: true,
            showTargetInPlugin: true,
            connected: false
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
            label: 'AI reply',
            description: 'Will be triggered after the stream replies',
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
            label: 'New context',
            description:
              'Taking the historical record of this reply content, return as a new context',
            valueType: 'chatHistory',
            type: 'source',
            targets: []
          }
        ]
      }
    ]
  },
  {
    id: 'simpleDatasetChat',
    avatar: '/imgs/module/db.png',
    name: 'Knowledge Base + Dialogue Guide',
    intro:
      'Search for a knowledge base when asking questions, inject the search results into the LLM model for reference and answer',
    type: AppTypeEnum.simple,
    modules: [
      {
        moduleId: 'userGuide',
        name: 'User guidance',
        avatar: '/imgs/module/userGuide.png',
        flowType: 'userGuide',
        position: {
          x: 447.98520778293346,
          y: 721.4016845336229
        },
        inputs: [
          {
            key: 'welcomeText',
            type: 'hidden',
            valueType: 'string',
            label: 'Opening remark',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value:
              'Hello, I am the assistant of the knowledge base, please do not forget to choose the knowledge base ~  n [Who are you]  n [How to use]',
            connected: false
          },
          {
            key: 'variables',
            type: 'hidden',
            valueType: 'any',
            label: 'Dialog box variable',
            value: [],
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'questionGuide',
            valueType: 'boolean',
            type: 'switch',
            label: 'Problem guidance',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: false,
            connected: false
          },
          {
            key: 'tts',
            type: 'hidden',
            valueType: 'any',
            label: 'Voice broadcast',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: {
              type: 'web'
            },
            connected: false
          }
        ],
        outputs: []
      },
      {
        moduleId: 'userChatInput',
        name: 'User problem (dialog entrance)',
        avatar: '/imgs/module/userChatInput.png',
        flowType: 'questionInput',
        position: {
          x: 324.81436595478294,
          y: 1527.0012457753612
        },
        inputs: [
          {
            key: 'userChatInput',
            type: 'systemInput',
            valueType: 'string',
            label: 'User problem',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          }
        ],
        outputs: [
          {
            key: 'userChatInput',
            label: 'User problem',
            type: 'source',
            valueType: 'string',
            targets: [
              {
                moduleId: 'datasetSearch',
                key: 'userChatInput'
              },
              {
                moduleId: 'chatModule',
                key: 'userChatInput'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'datasetSearch',
        name: 'Knowledge Base Search',
        avatar: '/imgs/module/db.png',
        flowType: 'datasetSearchNode',
        showStatus: true,
        position: {
          x: 1351.5043753345153,
          y: 947.0780385418003
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
            key: 'datasets',
            type: 'selectDataset',
            label: 'Related knowledge base',
            value: [],
            valueType: 'selectDataset',
            list: [],
            required: true,
            showTargetInApp: false,
            showTargetInPlugin: true,
            connected: false
          },
          {
            key: 'similarity',
            type: 'hidden',
            label: 'Minimum correlation',
            value: 0.4,
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
            connected: false
          },
          {
            key: 'limit',
            type: 'hidden',
            label: 'Reference the upper limit',
            description:
              'The largest number of tokens in a single search, about 1 word in Chinese = 1.7TOKENS, about 1 word in English = 1Tokens',
            value: 1500,
            valueType: 'number',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'searchMode',
            type: 'hidden',
            label: 'core.dataset.search.Mode',
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: 'embedding',
            connected: false
          },
          {
            key: 'datasetParamsModal',
            type: 'selectDatasetParamsModal',
            label: '',
            valueType: 'any',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
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
            label: 'The search result is empty',
            type: 'source',
            valueType: 'boolean',
            targets: []
          },
          {
            key: 'unEmpty',
            label: 'The search results are not empty',
            type: 'source',
            valueType: 'boolean',
            targets: []
          },
          {
            key: 'quoteQA',
            label: 'Cited content',
            description:
              'Always return to the array. If you want to perform additional operations when the search results are executed in the air, you need to use the two inputs above and the trigger of the target module',
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
        moduleId: 'chatModule',
        name: 'AI dialogue',
        avatar: '/imgs/module/AI.png',
        flowType: 'chatNode',
        showStatus: true,
        position: {
          x: 2022.7264786978908,
          y: 1006.3102431257475
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
            label: 'Dialog',
            required: true,
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: 'gpt-3.5-turbo-16k',
            connected: false
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
                label: 'Disperse',
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
            label: 'The upper limit',
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
            connected: false
          },
          {
            key: 'isResponseAnswerText',
            type: 'hidden',
            label: 'Return to AI content',
            value: true,
            valueType: 'boolean',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'quoteTemplate',
            type: 'hidden',
            label: 'Quote content template',
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: '',
            connected: false
          },
          {
            key: 'quotePrompt',
            type: 'hidden',
            label: 'Quote content prompt words',
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: '',
            connected: false
          },
          {
            key: 'aiSettings',
            type: 'aiSettings',
            label: '',
            valueType: 'any',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'systemPrompt',
            type: 'textarea',
            label: 'System prompt',
            max: 300,
            valueType: 'string',
            description:
              'The guidance of the model fixed can guide the model to chat direction by adjusting the content.This content will be fixed at the beginning of the context.Can use variables, such as {Language}}',
            placeholder:
              'The guidance of the model fixed can guide the model to chat direction by adjusting the content.This content will be fixed at the beginning of the context.Can use variables, such as {Language}}',
            showTargetInApp: true,
            showTargetInPlugin: true,
            value: '',
            connected: false
          },
          {
            key: 'history',
            type: 'numberInput',
            label: 'core.module.input.label.chat history',
            required: true,
            min: 0,
            max: 30,
            valueType: 'chatHistory',
            value: 6,
            showTargetInApp: true,
            showTargetInPlugin: true,
            connected: false
          },
          {
            key: 'quoteQA',
            type: 'target',
            label: 'Cited content',
            description: "Object number format, structure:\n [{Q: 'Questions', A: 'Answer'}]",
            valueType: 'datasetQuote',
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
            label: 'AI reply',
            description: 'Will be triggered after the stream replies',
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
            label: 'New context',
            description:
              'Taking the historical record of this reply content, return as a new context',
            valueType: 'chatHistory',
            type: 'source',
            targets: []
          }
        ]
      }
    ]
  },
  {
    id: 'chatGuide',
    avatar: '/imgs/module/userGuide.png',
    name: 'Dialogue guidance + variable',
    intro:
      'You can send a prompt at the beginning of the dialogue, or let the user fill in some content as a variable for this conversation',
    type: AppTypeEnum.simple,
    modules: [
      {
        moduleId: 'userGuide',
        name: 'User guidance',
        avatar: '/imgs/module/userGuide.png',
        flowType: 'userGuide',
        position: {
          x: 447.98520778293346,
          y: 721.4016845336229
        },
        inputs: [
          {
            key: 'welcomeText',
            type: 'hidden',
            valueType: 'string',
            label: 'Opening remark',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value:
              'Hello, I can translate various languages for you, please tell me what language do you need to translate into?',
            connected: false
          },
          {
            key: 'variables',
            type: 'hidden',
            valueType: 'any',
            label: 'Dialog box variable',
            value: [
              {
                id: '35c640eb-cf22-431f-bb57-3fc21643880e',
                key: 'language',
                label: 'Target language',
                type: 'input',
                required: true,
                maxLen: 50,
                enums: [
                  {
                    value: ''
                  }
                ]
              },
              {
                id: '2011ff08-91aa-4f60-ae69-f311ab4797b3',
                key: 'language2',
                label: 'Drop -down box test',
                type: 'select',
                required: false,
                maxLen: 50,
                enums: [
                  {
                    value: 'English'
                  },
                  {
                    value: 'French'
                  }
                ]
              }
            ],
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'questionGuide',
            valueType: 'boolean',
            type: 'switch',
            label: 'Problem guidance',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: false,
            connected: false
          },
          {
            key: 'tts',
            type: 'hidden',
            valueType: 'any',
            label: 'Voice broadcast',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          }
        ],
        outputs: []
      },
      {
        moduleId: 'userChatInput',
        name: 'User problem (dialog entrance)',
        avatar: '/imgs/module/userChatInput.png',
        flowType: 'questionInput',
        position: {
          x: 464.32198615344566,
          y: 1602.2698463081606
        },
        inputs: [
          {
            key: 'userChatInput',
            type: 'systemInput',
            valueType: 'string',
            label: 'User problem',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          }
        ],
        outputs: [
          {
            key: 'userChatInput',
            label: 'User problem',
            type: 'source',
            valueType: 'string',
            targets: [
              {
                moduleId: 'chatModule',
                key: 'userChatInput'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'chatModule',
        name: 'AI dialogue',
        avatar: '/imgs/module/AI.png',
        flowType: 'chatNode',
        showStatus: true,
        position: {
          x: 981.9682828103937,
          y: 890.014595014464
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
            label: 'Dialog',
            required: true,
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: 'gpt-3.5-turbo-16k',
            connected: false
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
                label: 'Disperse',
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
            label: 'The upper limit',
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
            connected: false
          },
          {
            key: 'isResponseAnswerText',
            type: 'hidden',
            label: 'Return to AI content',
            value: true,
            valueType: 'boolean',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'quoteTemplate',
            type: 'hidden',
            label: 'Quote content template',
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'quotePrompt',
            type: 'hidden',
            label: 'Quote content prompt words',
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'aiSettings',
            type: 'aiSettings',
            label: '',
            valueType: 'any',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'systemPrompt',
            type: 'textarea',
            label: 'System prompt',
            max: 300,
            valueType: 'string',
            description:
              'The guidance of the model fixed can guide the model to chat direction by adjusting the content.This content will be fixed at the beginning of the context.Can use variables, such as {Language}}',
            placeholder:
              'The guidance of the model fixed can guide the model to chat direction by adjusting the content.This content will be fixed at the beginning of the context.Can use variables, such as {Language}}',
            showTargetInApp: true,
            showTargetInPlugin: true,
            value:
              'Please translate my question directly into {Language}}, no need to answer the question.',
            connected: false
          },
          {
            key: 'history',
            type: 'numberInput',
            label: 'core.module.input.label.chat history',
            required: true,
            min: 0,
            max: 30,
            valueType: 'chatHistory',
            value: 6,
            showTargetInApp: true,
            showTargetInPlugin: true,
            connected: false
          },
          {
            key: 'quoteQA',
            type: 'target',
            label: 'Cited content',
            description: "Object number format, structure:\n [{Q: 'Questions', A: 'Answer'}]",
            valueType: 'datasetQuote',
            showTargetInApp: true,
            showTargetInPlugin: true,
            connected: false
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
            label: 'New context',
            description:
              'Taking the historical record of this reply content, return as a new context',
            valueType: 'chatHistory',
            type: 'source',
            targets: []
          }
        ]
      }
    ]
  },
  {
    id: 'CQ',
    avatar: '/imgs/module/cq.png',
    name: 'Problem Classification + Knowledge Base',
    intro:
      'First classify the users problems, and then perform different operations according to different types of problems',
    type: AppTypeEnum.advanced,
    modules: [
      {
        moduleId: '7z5g5h',
        name: 'User problem (dialog entrance)',
        avatar: '/imgs/module/userChatInput.png',
        flowType: 'questionInput',
        position: {
          x: -269.50851681351924,
          y: 1657.6123698022448
        },
        inputs: [
          {
            key: 'userChatInput',
            type: 'systemInput',
            valueType: 'string',
            label: 'User problem',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          }
        ],
        outputs: [
          {
            key: 'userChatInput',
            label: 'User problem',
            type: 'source',
            valueType: 'string',
            targets: [
              {
                moduleId: '79iwqi',
                key: 'userChatInput'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'remuj3',
        name: 'question category',
        avatar: '/imgs/module/cq.png',
        flowType: 'classifyQuestion',
        showStatus: true,
        position: {
          x: 730.6899384278805,
          y: 1079.2201234653105
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
            type: 'selectCQModel',
            valueType: 'string',
            label: 'Classification model',
            required: true,
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: 'gpt-3.5-turbo',
            connected: false
          },
          {
            key: 'systemPrompt',
            type: 'textarea',
            valueType: 'string',
            label: 'background knowledge',
            description:
              'You can add some specific content introductions to better identify the type of user problem.This content is usually introduced to the model that it doesnt know.',
            placeholder:
              'For example:  n1. AIGC (artificial intelligence generating content) refers to the use of artificial intelligence technology to automatically generate digital content, such as text, images, music, videos, etc. n2. AIGC technology includes but not limited to natural language processing, computer vision, machine learning and deep learning.These technologies can create new content or modify existing content to meet specific creativity, education, entertainment or information needs.',
            showTargetInApp: true,
            showTargetInPlugin: true,
            value: '',
            connected: false
          },
          {
            key: 'history',
            type: 'numberInput',
            label: 'core.module.input.label.chat history',
            required: true,
            min: 0,
            max: 30,
            valueType: 'chatHistory',
            value: 6,
            showTargetInApp: true,
            showTargetInPlugin: true,
            connected: false
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
          },
          {
            key: 'agents',
            type: 'custom',
            valueType: 'any',
            label: '',
            value: [
              {
                value: 'Questions about the movie "Star Trek"',
                key: 'wqre'
              },
              {
                value: 'Greeting, greetings and other issues',
                key: 'sdfa'
              },
              {
                value: 'other problems',
                key: 'oy1c'
              }
            ],
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          }
        ],
        outputs: [
          {
            key: 'wqre',
            label: '',
            type: 'hidden',
            targets: [
              {
                moduleId: 'fljhzy',
                key: 'switch'
              }
            ]
          },
          {
            key: 'sdfa',
            label: '',
            type: 'hidden',
            targets: [
              {
                moduleId: 'a99p6z',
                key: 'switch'
              }
            ]
          },
          {
            key: 'oy1c',
            label: '',
            type: 'hidden',
            targets: [
              {
                moduleId: 'iejcou',
                key: 'switch'
              }
            ]
          },
          {
            key: 'agex',
            label: '',
            type: 'hidden',
            targets: []
          }
        ]
      },
      {
        moduleId: 'a99p6z',
        name: '指定回复',
        avatar: '/imgs/module/reply.png',
        flowType: 'answerNode',
        position: {
          x: 1294.314623049058,
          y: 1623.9470929531146
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
            key: 'text',
            type: 'textarea',
            valueType: 'any',
            label: '回复的内容',
            description:
              '可以使用 \\n 来实现连续换行。\n可以通过外部模块输入实现回复，外部模块输入时会覆盖当前填写的内容。\n如传入非字符串类型数据将会自动转成字符串',
            placeholder:
              '可以使用 \\n 来实现连续换行。\n可以通过外部模块输入实现回复，外部模块输入时会覆盖当前填写的内容。\n如传入非字符串类型数据将会自动转成字符串',
            showTargetInApp: true,
            showTargetInPlugin: true,
            value: '你好，有什么可以帮助你的？',
            connected: false
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
        moduleId: 'iejcou',
        name: '指定回复',
        avatar: '/imgs/module/reply.png',
        flowType: 'answerNode',
        position: {
          x: 1290.9284595230658,
          y: 1992.4810074310749
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
            key: 'text',
            type: 'textarea',
            valueType: 'any',
            label: '回复的内容',
            description:
              '可以使用 \\n 来实现连续换行。\n可以通过外部模块输入实现回复，外部模块输入时会覆盖当前填写的内容。\n如传入非字符串类型数据将会自动转成字符串',
            placeholder:
              '可以使用 \\n 来实现连续换行。\n可以通过外部模块输入实现回复，外部模块输入时会覆盖当前填写的内容。\n如传入非字符串类型数据将会自动转成字符串',
            showTargetInApp: true,
            showTargetInPlugin: true,
            value: '你好，我仅能回答电影《星际穿越》相关问题，请问你有什么问题么？',
            connected: false
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
        moduleId: 'nlfwkc',
        name: 'AI 对话',
        avatar: '/imgs/module/AI.png',
        flowType: 'chatNode',
        showStatus: true,
        position: {
          x: 2260.436476009152,
          y: 1104.6583548423682
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
            label: '对话模型',
            required: true,
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: 'gpt-3.5-turbo-16k',
            connected: false
          },
          {
            key: 'temperature',
            type: 'hidden',
            label: '温度',
            value: 0,
            valueType: 'number',
            min: 0,
            max: 10,
            step: 1,
            markList: [
              {
                label: '严谨',
                value: 0
              },
              {
                label: '发散',
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
            label: '回复上限',
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
            connected: false
          },
          {
            key: 'isResponseAnswerText',
            type: 'hidden',
            label: '返回AI内容',
            value: true,
            valueType: 'boolean',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'quoteTemplate',
            type: 'hidden',
            label: '引用内容模板',
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'quotePrompt',
            type: 'hidden',
            label: '引用内容提示词',
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'aiSettings',
            type: 'aiSettings',
            label: '',
            valueType: 'any',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'systemPrompt',
            type: 'textarea',
            label: '系统提示词',
            max: 300,
            valueType: 'string',
            description:
              '模型固定的引导词，通过调整该内容，可以引导模型聊天方向。该内容会被固定在上下文的开头。可使用变量，例如 {{language}}',
            placeholder:
              '模型固定的引导词，通过调整该内容，可以引导模型聊天方向。该内容会被固定在上下文的开头。可使用变量，例如 {{language}}',
            showTargetInApp: true,
            showTargetInPlugin: true,
            value: '',
            connected: false
          },
          {
            key: 'history',
            type: 'numberInput',
            label: 'core.module.input.label.chat history',
            required: true,
            min: 0,
            max: 30,
            valueType: 'chatHistory',
            value: 6,
            showTargetInApp: true,
            showTargetInPlugin: true,
            connected: false
          },
          {
            key: 'quoteQA',
            type: 'target',
            label: '引用内容',
            description: "对象数组格式，结构：\n [{q:'问题',a:'回答'}]",
            valueType: 'datasetQuote',
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
        moduleId: 'fljhzy',
        name: '知识库搜索',
        avatar: '/imgs/module/db.png',
        flowType: 'datasetSearchNode',
        showStatus: true,
        position: {
          x: 1307.1997559129973,
          y: 908.9246215273222
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
            value: [],
            valueType: 'selectDataset',
            list: [],
            required: true,
            showTargetInApp: false,
            showTargetInPlugin: true,
            connected: false
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
            connected: false
          },
          {
            key: 'limit',
            type: 'hidden',
            label: '引用上限',
            description: '单次搜索最大的 Tokens 数量，中文约1字=1.7Tokens，英文约1字=1Tokens',
            value: 1500,
            valueType: 'number',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'searchMode',
            type: 'hidden',
            label: 'core.dataset.search.Mode',
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: 'embedding',
            connected: false
          },
          {
            key: 'datasetParamsModal',
            type: 'selectDatasetParamsModal',
            label: '',
            valueType: 'any',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
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
            targets: [
              {
                moduleId: 'tc90wz',
                key: 'switch'
              }
            ]
          },
          {
            key: 'unEmpty',
            label: '搜索结果不为空',
            type: 'source',
            valueType: 'boolean',
            targets: [
              {
                moduleId: 'nlfwkc',
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
                moduleId: 'nlfwkc',
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
        moduleId: 'q9equb',
        name: '用户引导',
        avatar: '/imgs/module/userGuide.png',
        flowType: 'userGuide',
        position: {
          x: -272.66416216517086,
          y: 842.9928682053646
        },
        inputs: [
          {
            key: 'welcomeText',
            type: 'hidden',
            valueType: 'string',
            label: '开场白',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value:
              '你好，我是电影《星际穿越》 AI 助手，有什么可以帮助你的？\n[导演是谁]\n[剧情介绍]\n[票房分析]',
            connected: false
          },
          {
            key: 'variables',
            type: 'hidden',
            valueType: 'any',
            label: '对话框变量',
            value: [],
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'questionGuide',
            valueType: 'boolean',
            type: 'switch',
            label: '问题引导',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          },
          {
            key: 'tts',
            type: 'hidden',
            valueType: 'any',
            label: '语音播报',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
          }
        ],
        outputs: []
      },
      {
        moduleId: 'tc90wz',
        name: '指定回复',
        avatar: '/imgs/module/reply.png',
        flowType: 'answerNode',
        position: {
          x: 2262.720467249169,
          y: 750.6776669274682
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
            key: 'text',
            type: 'textarea',
            valueType: 'any',
            label: '回复的内容',
            description:
              '可以使用 \\n 来实现连续换行。\n可以通过外部模块输入实现回复，外部模块输入时会覆盖当前填写的内容。\n如传入非字符串类型数据将会自动转成字符串',
            placeholder:
              '可以使用 \\n 来实现连续换行。\n可以通过外部模块输入实现回复，外部模块输入时会覆盖当前填写的内容。\n如传入非字符串类型数据将会自动转成字符串',
            showTargetInApp: true,
            showTargetInPlugin: true,
            value: '对不起，我找不到你的问题，请更加详细的描述你的问题。',
            connected: false
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
        moduleId: '9act94',
        name: '用户问题(对话入口)',
        avatar: '/imgs/module/userChatInput.png',
        flowType: 'questionInput',
        position: {
          x: 1902.0261451535691,
          y: 1826.2701495060023
        },
        inputs: [
          {
            key: 'userChatInput',
            type: 'systemInput',
            valueType: 'string',
            label: '用户问题',
            showTargetInApp: false,
            showTargetInPlugin: false,
            connected: false
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
                moduleId: 'nlfwkc',
                key: 'userChatInput'
              }
            ]
          }
        ]
      },
      {
        moduleId: '79iwqi',
        name: 'core.module.template.cfr',
        avatar: '/imgs/module/cfr.svg',
        flowType: 'cfr',
        showStatus: true,
        position: {
          x: 149.7113934317785,
          y: 1312.2668782737812
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
            type: 'selectExtractModel',
            label: 'core.module.input.label.aiModel',
            required: true,
            valueType: 'string',
            showTargetInApp: false,
            showTargetInPlugin: false,
            value: 'gpt-3.5-turbo',
            connected: false
          },
          {
            key: 'systemPrompt',
            type: 'textarea',
            label: 'core.module.input.label.cfr background',
            max: 300,
            valueType: 'string',
            description: 'core.module.input.description.cfr background',
            placeholder: 'core.module.input.placeholder.cfr background',
            showTargetInApp: true,
            showTargetInPlugin: true,
            value: '关于电影《星际穿越》的讨论。',
            connected: false
          },
          {
            key: 'history',
            type: 'numberInput',
            label: 'core.module.input.label.chat history',
            required: true,
            min: 0,
            max: 30,
            valueType: 'chatHistory',
            value: 6,
            showTargetInApp: true,
            showTargetInPlugin: true,
            connected: false
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
            key: 'system_text',
            label: 'core.module.output.label.cfr result',
            valueType: 'string',
            type: 'source',
            targets: [
              {
                moduleId: 'remuj3',
                key: 'userChatInput'
              },
              {
                moduleId: 'fljhzy',
                key: 'userChatInput'
              }
            ]
          }
        ]
      }
    ]
  }
];
