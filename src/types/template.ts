// src/types/template.ts
import { PlatformType } from './platform';
import { TaskOutputType, ProductCategory } from './task';

/**
 * 提示词模板 (映射到 Prisma PromptTemplate)
 */
export interface PromptTemplate {
  id: string;
  name: string;
  category: ProductCategory;
  outputType: TaskOutputType;
  platform?: PlatformType | null;

  promptText: string;
  
  variables: string[]; // 模板中需要注入的变量名, 原文是 string (JSON array)

  isBuiltin: boolean; // 系统自带或用户自定义
  isFavorite: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * 渲染模板时需要的上下文参数
 */
export interface TemplateRenderContext {
  productName?: string;
  category?: ProductCategory;
  platform?: PlatformType;
  dimensions?: string;
  material?: string;
  style?: string;
  [key: string]: any; // 其他动态传入的变量
}
