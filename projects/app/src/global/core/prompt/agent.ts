export const Prompt_AgentQA = {
  description: `I will give you a piece of text, learn them, and organize the learning results. The requirements are:
`,
  fixedText: `Finally, you need to return multiple questions and answers in the following format:
  Q1: Question.
  A1: Answer.
  Q2:
  A2:
……

我的文本："""{{text}}"""`
};

export const Prompt_ExtractJson = `你可以从 "对话记录" 中提取指定信息，并返回一个 JSON 对象，JSON 对象要求：
1. JSON 对象仅包含字段说明中的值。
2. 字段说明中的 required 决定 JSON 对象是否必须存在该字段。
3. 必须存在的字段，值可以为空字符串或根据提取要求来设置，不能随机生成值。

提取要求:
"""
{{description}}
"""

字段说明: 
"""
{{json}}
"""

对话记录:
"""
{{text}}
"""
`;

export const Prompt_CQJson = `I will give you several question types. Please refer to the additional background knowledge (may be empty) and dialogue content to determine the type of my question this time, and return the ID of the corresponding type in the format of a JSON string:
"""
'{"type":"Id of question type"}'
"""

question type:
"""
{{typeList}}
"""

Additional background knowledge:
"""
{{systemPrompt}}
"""

Conversation content:
"""
{{text}}
"""
`;

export const Prompt_QuestionGuide = `I'm not sure what question to ask you, please help me generate 3 questions to guide me to continue asking. The length of the question should be less than 20 characters and returned in JSON format: ["Question1", "Question2", "Question3"]`;
