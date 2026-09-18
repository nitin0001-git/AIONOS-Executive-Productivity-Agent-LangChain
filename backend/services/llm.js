import { ChatGoogle } from '@langchain/google';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser, JsonOutputParser } from '@langchain/core/output_parsers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root or workspace root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

let chatModel = null;

if (apiKey && apiKey.length > 0) {
  try {
    chatModel = new ChatGoogle({
      apiKey,
      model: modelName,
      temperature: 0.1,
    });
    console.log(`[LangChain Service] Initialized ChatGoogle with model: ${modelName}`);
  } catch (err) {
    console.warn('[LangChain Service] Failed to initialize ChatGoogle model:', err.message);
  }
} else {
  console.log('[LangChain Service] No GEMINI_API_KEY detected. Fallback deterministic engine active.');
}

/**
 * Check if live LangChain Gemini model is configured
 */
export function isGeminiConfigured() {
  return Boolean(chatModel && apiKey && apiKey.length > 0);
}

/**
 * Get active model name
 */
export function getModelName() {
  return modelName;
}

/**
 * Return the initialized LangChain ChatGoogle model instance
 */
export function getChatModel() {
  return chatModel;
}

/**
 * Call Gemini through LangChain Runnable to generate text
 * @param {string} prompt 
 * @param {string} systemInstruction 
 * @returns {Promise<string>}
 */
export async function generateText(prompt, systemInstruction = '') {
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY not configured.');
  }

  try {
    const messages = [];
    if (systemInstruction) {
      messages.push(['system', systemInstruction]);
    }
    messages.push(['human', '{input}']);

    const promptTemplate = ChatPromptTemplate.fromMessages(messages);
    const outputParser = new StringOutputParser();
    const chain = promptTemplate.pipe(chatModel).pipe(outputParser);

    const result = await chain.invoke({ input: prompt });
    return (result || '').trim();
  } catch (err) {
    console.error('[LangChain Service] generateText error:', err.message);
    throw err;
  }
}

/**
 * Call Gemini through LangChain Runnable and parse structured JSON output
 * @param {string} prompt 
 * @param {string} systemInstruction 
 * @returns {Promise<any>}
 */
export async function generateJson(prompt, systemInstruction = '') {
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY not configured.');
  }

  const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond with valid, parseable JSON ONLY. Do not include markdown code fences (\`\`\`json), explanations, or surrounding text.`;
  const rawText = await generateText(jsonPrompt, systemInstruction);

  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    console.error('[LangChain Service] Failed to parse JSON from response. Raw text was:', rawText);
    throw new Error(`Failed to parse structured JSON from LangChain Gemini: ${parseErr.message}`);
  }
}
