import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 动态合并 Tailwind CSS 类名，解决类名冲突的工具函数（shadcn/ui 推荐规范）
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 延迟等待 (Promise)
 * @param ms 毫秒
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 格式化文件大小为易读形式
 * @param bytes 字节数
 * @param decimals 小数点精度
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * 生成安全的随机字符串 (用作前缀或短ID)
 */
export function generateShortId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}