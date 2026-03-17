import { promises as fs } from 'fs';
import * as path from 'path';
import { IStorageService, FileMetadata } from '@/types/storage';
import { config } from '../config';

/**
 * 本地文件系统存储提供者实现
 */
export class LocalStorageProvider implements IStorageService {
  private baseDir: string;

  constructor(baseDir?: string) {
    // 默认使用配置的 UPLOAD_DIR
    this.baseDir = baseDir || config.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
    this.ensureBaseDir();
  }

  /**
   * 确保基础目录存在
   */
  private async ensureBaseDir() {
    try {
      await fs.access(this.baseDir);
    } catch {
      await fs.mkdir(this.baseDir, { recursive: true });
    }
  }

  /**
   * 解析出安全的绝对路径，防止路径穿越 (Path Traversal) 漏洞
   */
  private resolveSafePath(relativePath: string): string {
    const absolutePath = path.resolve(this.baseDir, relativePath);
    if (!absolutePath.startsWith(path.resolve(this.baseDir))) {
      throw new Error(`Invalid path: ${relativePath}`);
    }
    return absolutePath;
  }

  async upload(buffer: Buffer, relativePath: string, mimeType?: string): Promise<string> {
    const fullPath = this.resolveSafePath(relativePath);
    
    // 确保子目录存在
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(fullPath, buffer);
    
    // 我们返回可以在浏览器直接访问的相对路径 (假设挂载在 public 下)
    // 实际项目中可能需要更复杂的 URI 构建逻辑
    // 为了兼容 Windows 的反斜杠，我们需要统一转换为正斜杠
    const normalizedPath = relativePath.replace(/\\/g, '/');
    return `/uploads/${normalizedPath}`;
  }

  async read(relativePath: string): Promise<Buffer> {
    const fullPath = this.resolveSafePath(relativePath);
    return await fs.readFile(fullPath);
  }

  async delete(relativePath: string): Promise<void> {
    const fullPath = this.resolveSafePath(relativePath);
    try {
      await fs.unlink(fullPath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // 文件不存在当作删除成功
    }
  }

  async getMetadata(relativePath: string): Promise<FileMetadata> {
    const fullPath = this.resolveSafePath(relativePath);
    const stats = await fs.stat(fullPath);
    
    return {
      size: stats.size,
      mimeType: 'application/octet-stream', // 本地无法直接获取 mimeType，这里给个默认值
      createdAt: stats.birthtime,
    };
  }

  async exists(relativePath: string): Promise<boolean> {
    const fullPath = this.resolveSafePath(relativePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}
