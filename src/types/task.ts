// src/types/task.ts
import { PlatformType } from './platform';
import { ModelConfig } from './model';
import { PromptTemplate } from './template';

/**
 * 任务输出类型
 */
export type TaskOutputType = 'white_bg' | 'dimension' | 'scene' | 'copy';

/**
 * 任务状态
 */
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * 产品类别 (类目)
 */
export type ProductCategory = 'rug' | 'desk_mat' | 'curtain' | 'other'; // 后续可以扩展

/**
 * 任务基础模型 (映射到 Prisma Model, 解析了 JSON 字段)
 */
export interface Task {
  id: string;
  name: string;
  category: ProductCategory;
  platform: PlatformType;
  outputType: TaskOutputType;
  status: TaskStatus;
  
  templateId?: string | null;
  template?: PromptTemplate | null;
  
  modelConfigId?: string | null;
  modelConfig?: ModelConfig | null;

  metadata?: Record<string, any> | null; // 原文是 string (JSON)
  errorMessage?: string | null;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  images?: TaskImage[];
  copyResults?: CopyResult[];
}

/**
 * 图片角色
 */
export type ImageRole = 'input' | 'preprocessed' | 'output';

/**
 * 任务图片 (映射到 Prisma TaskImage)
 */
export interface TaskImage {
  id: string;
  taskId: string;
  role: ImageRole;
  imageType: TaskOutputType;
  
  storagePath: string; // 本地路径或 URI
  fileName: string;
  mimeType: string;
  fileSize: number; // 字节
  
  // 原文是 string (JSON)，在此解析为对象
  dimensions?: { width: number; height: number } | null;

  qualityScore?: number | null;
  qualityStatus?: 'pass' | 'warn' | 'fail' | null;
  qualityDetail?: Record<string, any> | null; // 原文 JSON

  sortOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * 文案生成结果 (映射到 Prisma CopyResult)
 */
export interface CopyResult {
  id: string;
  taskId: string;
  platform: PlatformType;
  
  title: string;
  bulletPoints: string[]; // 原文是 string (JSON array)
  description: string;
  keywords?: string[] | null; // 原文是逗号分隔字符串或 JSON

  language: string; // 默认 'en'

  createdAt: Date;
  updatedAt: Date;
}
