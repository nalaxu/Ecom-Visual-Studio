import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // SQLite 数据库 URL
  DATABASE_URL: z.string().default('file:./dev.db'),
  
  // 本地存储目录
  UPLOAD_DIR: z.string().default('./public/uploads'),
  
  // 大模型 API Keys (可选，根据实际使用的模型加载)
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
});

// 解析和验证当前环境变量
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ 环境变量配置错误:', _env.error.format());
  throw new Error('Invalid environment variables');
}

/**
 * 全局配置对象 (经过强类型验证)
 */
export const config = _env.data;