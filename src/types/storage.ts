// src/types/storage.ts

/**
 * 存储提供者实现 (目前以本地文件系统为主)
 */
export type StorageProviderType = 'local' | 's3' | 'r2';

/**
 * 文件元数据
 */
export interface FileMetadata {
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  createdAt: Date;
}

/**
 * 存储抽象层接口 (接口隔离原则)
 * 使得项目可以方便地从本地存储迁移到云存储
 */
export interface IStorageService {
  /**
   * 上传文件
   * @param buffer 文件 Buffer
   * @param path 目标相对路径 (包含文件名)
   * @param mimeType MIME 类型
   * @returns 完整的存储 URI 或相对路径
   */
  upload(buffer: Buffer, path: string, mimeType: string): Promise<string>;

  /**
   * 读取文件
   * @param path 存储路径
   */
  read(path: string): Promise<Buffer>;

  /**
   * 删除文件
   * @param path 存储路径
   */
  delete(path: string): Promise<void>;

  /**
   * 获取文件元数据
   */
  getMetadata(path: string): Promise<FileMetadata>;
  
  /**
   * 检查文件是否存在
   */
  exists(path: string): Promise<boolean>;
}
