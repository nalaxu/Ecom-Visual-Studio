// src/types/model.ts

/**
 * 模型提供商
 */
export type ModelProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'local';

/**
 * 模型支持的能力 (例如: 文案生成, 图像理解, 图像生成)
 */
export type ModelCapability = 'text_generation' | 'vision_understanding' | 'image_generation' | 'tool_calling';

/**
 * AI模型配置 (映射到 Prisma ModelConfig)
 */
export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  baseUrl?: string | null;
  apiKey?: string | null; // 实际使用时需注意不要暴露到客户端
  modelName: string; // 具体模型版本, 如 'gpt-4o', 'claude-3-5-sonnet'

  capabilities: ModelCapability[]; // 原文是 string (JSON array)

  timeout: number; // 毫秒
  maxRetries: number;
  isEnabled: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * 模型调用请求的基本参数
 */
export interface ModelRequestPayload {
  prompt: string;
  systemPrompt?: string;
  images?: { b64: string; mimeType: string }[]; // 用于视觉模型
  temperature?: number;
}

/**
 * 模型调用的统一响应
 */
export interface ModelResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
