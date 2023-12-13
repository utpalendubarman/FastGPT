import { PromptTemplateItem } from '@fastgpt/global/core/ai/type.d';

export const Prompt_QuoteTemplateList: PromptTemplateItem[] = [
  {
    title: 'Standard Template',
    desc: 'Standard prompt words, used for knowledge bases with unfixed structures. ',
    value: `{{q}}\n{{a}}`
  },
  {
    title: 'Q&A template',
    desc: 'Knowledge base suitable for QA question and answer structure, or knowledge base where most of the core introduction is located in a. ',
    value: `{instruction:"{{q}}",output:"{{a}}"}`
  },
  {
    title: 'Standard Strict Template',
    desc: "Based on the standard template, make stricter requirements for the model's answers. ",
    value: `{{q}}\n{{a}}`
  },
  {
    title: 'Strict Question and Answer Template',
    desc: "Based on the question and answer template, impose stricter requirements on the model's answers. ",
    value: `{question:"{{q}}",answer:"{{a}}"}`
  }
];

export const Prompt_QuotePromptList: PromptTemplateItem[] = [
  {
    title: 'Standard Template',
    desc: '',
    value: `your knowledge base:
"""
{{quote}}
"""
Answer the request:
1. Prioritize using knowledge base content to answer questions.
2. You can answer I don't know.
3. Don't mention the knowledge you obtained from a knowledge base.
4. When the knowledge base contains markdown content, it will be returned in markdown format.
My question is:"{{question}}"`
  },
  {
    title: 'Q&A template',
    desc: '',
    value: `your knowledge base:
"""
{{quote}}
"""
Answer the request:
1. Give priority to using knowledge base content to answer questions, where instruction is the relevant introduction and output is the expected answer or supplement.
2. You can answer I don't know.
3. Don't mention the knowledge you obtained from a knowledge base.
4. When the knowledge base contains markdown content, it will be returned in markdown format.
My question is:"{{question}}"`
  },
  {
    title: 'Standard Strict Template',
    desc: '',
    value: `your knowledge base:
"""
{{quote}}
"""
Answer the request:
1. Answer the question using only knowledge base content.
2. For questions that have nothing to do with the knowledge base, you can directly answer that I don't know.
3. Don't mention the knowledge you obtained from a knowledge base.
4. When the knowledge base contains markdown content, it will be returned in markdown format.
My question is:"{{question}}"`
  },
  {
    title: 'Strict Question and Answer Template',
    desc: '',
    value: `your knowledge base:
"""
{{quote}}
"""
Answer the request:
1. Select an appropriate answer from the knowledge base to answer, where instruction is the relevant question and answer is the known answer.
2. For questions that have nothing to do with the knowledge base, you can directly answer that I don't know.
3. Don't mention the knowledge you obtained from a knowledge base.
My question is:"{{question}}"`
  }
];
