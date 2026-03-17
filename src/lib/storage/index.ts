import { LocalStorageProvider } from './local';
import { IStorageService } from '@/types/storage';

// 这里是一个单例实例，用于全局使用
// 我们使用的是接口进行类型推断，这样后续如果要替换为 S3 只需要在这里改一行代码即可
export const storage: IStorageService = new LocalStorageProvider();

export * from './local';
