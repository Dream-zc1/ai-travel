import { createOpenAI } from "@ai-sdk/openai";

// export const groq = createOpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.GROQ_API_KEY,
// });

export const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});
