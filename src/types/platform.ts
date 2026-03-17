// src/types/platform.ts

/**
 * 平台类型
 */
export type PlatformType = 'amazon' | 'temu' | 'mercado_libre' | 'shopify' | 'independent';

/**
 * Amazon平台特定要求
 */
export interface AmazonRequirements {
  imageSizeMin: number; // 像素
  imageSizeMax: number; // 像素
  mainImageBg: 'pure_white'; // 纯白底色 (RGB: 255,255,255)
  titleMaxLength: number; // 字符限制
  bulletPointCountMin: number;
  bulletPointCountMax: number;
}

/**
 * Temu平台特定要求
 */
export interface TemuRequirements {
  imageRatio: '1:1' | '4:5' | '3:4';
  titleMaxLength: number; // 字符
  descriptionMaxLength: number;
}

/**
 * 平台配置集合
 */
export type PlatformConfig = {
  amazon: AmazonRequirements;
  temu: TemuRequirements;
  mercado_libre: any; // 占位
  shopify: any; // 占位
  independent: any; // 占位
};

export interface PlatformConfigStore {
  activePlatform: PlatformType;
  // 可以根据需要添加当前平台的具体实例要求
}
