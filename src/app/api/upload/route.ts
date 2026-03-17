import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { generateShortId } from '@/lib/utils';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 将 File 接口转换为 Node.js 可以处理的 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 生成安全的、唯一的文件名
    const ext = path.extname(file.name) || '';
    const datePrefix = new Date().toISOString().split('T')[0]; // 分目录存储，如: 2026-03-17
    const uniqueFilename = `${generateShortId()}${ext}`;
    
    // 相对路径: 格式大概是 `2026-03-17/t8a9x8.jpg`
    const relativePath = path.join(datePrefix, uniqueFilename);

    // 真正的黑魔法在这里：调用我们 Step 5 写好的抽象层
    // 因为它是基于依赖倒置的，所以不管 storage 是存本地还是存 S3，它都只会返回能访问的 URL 路径
    const accessUrl = await storage.upload(buffer, relativePath, file.type);

    return NextResponse.json({
      success: true,
      url: accessUrl,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error('[API_UPLOAD_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    );
  }
}
