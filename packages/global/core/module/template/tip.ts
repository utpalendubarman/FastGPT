export const chatNodeSystemPromptTip =
  'The model has a fixed guide word. By adjusting this content, you can guide the model in the chat direction. The content will be anchored at the beginning of the context. Variables can be used, such as {{language}}';
export const userGuideTip =
  'You can set introductory words before the conversation, set global variables, and set next steps.';
export const welcomeTextTip =
  'Before each conversation starts, send an initial content. Supports standard Markdown syntax, additional tags that can be used:\n[Shortcut keys]: users can directly send the question after clicking it';
export const variableTip =
  'Before the conversation starts, the user can be asked to fill in some content as specific variables for this round of conversation. This module is located after the opening boot. \nVariables can be injected into the string type input of other modules in the form of {{variable key}}, such as: prompt words, qualifiers, etc.';
