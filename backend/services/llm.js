import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root or workspace root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

let genAIClient = null;

if (apiKey && apiKey.trim().length > 0) {
  try {
    genAIClient = new GoogleGenAI({ apiKey: apiKey.trim() });
    console.log(`[LLM Service] Initialized GoogleGenAI with model: ${modelName}`);
  } catch (err) {
    console.warn('[LLM Service] Failed to initialize GoogleGenAI client:', err.message);
  }
} else {
  console.log('[LLM Service] No GEMINI_API_KEY detected. Fallback deterministic engine active.');
}

/**
 * Check if live Gemini API is configured
 */
export function isGeminiConfigured() {
  return Boolean(genAIClient && apiKey && apiKey.trim().length > 0);
}

/**
 * Get active model name
 */
export function getModelName() {
  return modelName;
}

/**
 * Call Gemini model to generate content
 * @param {string} prompt 
 * @param {string} systemInstruction 
 * @returns {Promise<string>}
 */
export async function generateText(prompt, systemInstruction = '') {
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY not configured.');
  }

  try {
    const config = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await genAIClient.models.generateContent({
      model: modelName,
      contents: prompt,
      config
    });

    if (response && response.text) {
      return response.text.trim();
    }
    
    // Check parts structure if text getter is not direct
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.candidates[0].content.parts[0].text.trim();
    }

    throw new Error('Empty response from Gemini API');
  } catch (err) {
    console.error('[LLM Service] generateText error:', err.message);
    throw err;
  }
}

/**
 * Call Gemini model requesting JSON output
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

  // Clean code fences if present
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    console.error('[LLM Service] Failed to parse JSON from response. Raw text was:', rawText);
    throw new Error(`Failed to parse structured JSON from Gemini: ${parseErr.message}`);
  }
}
