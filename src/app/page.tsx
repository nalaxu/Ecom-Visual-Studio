'use client';

import * as React from 'react';
import { useState } from 'react';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { ArrowRight, Wand2 } from 'lucide-react';
import { PlatformType, TaskOutputType } from '@/types/task';

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // 表单状态
  const [platform, setPlatform] = useState<PlatformType>('amazon');
  const [outputType, setOutputType] = useState<TaskOutputType>('white_bg');

  const handleImageSet = (file: File | null, url: string | null) => {
    setSelectedFile(file);
    setPreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('请先上传一张商品原图');
      return;
    }

    try {
      // 1. 发送图片到昨天的 /api/upload 接口
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

      alert(`图片上传成功！服务器保存路径: ${uploadData.url}\n\n接下来我们会基于此图创建 ${platform} 平台的任务。`);
      
      // TODO: 接下来你就可以把 uploadData.url 和 platform 等数据提交给创建一个 Task 的接口了
      // await fetch('/api/tasks', { ... })

    } catch (error: any) {
      console.error(error);
      alert('发生错误: ' + error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">创建新任务</h2>
          <p className="text-muted-foreground mt-1">上传您的商品原图，选择目标平台，AI 会自动为您加工处理并生成适用尺寸和文案。</p>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">1. 上传商品图</h3>
          <ImageUploader onImageSelected={handleImageSet} />
        </div>
      </div>

      <div className="lg:mt-16">
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col gap-6 sticky top-24">
          
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">2</span>
              目标电商平台
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <label className={`cursor-pointer border rounded-lg p-3 text-sm text-center font-medium transition-all ${platform === 'amazon' ? 'border-primary bg-primary/5 text-primary' : 'hover:bg-muted'}`}>
                <input type="radio" className="hidden" name="platform" value="amazon" checked={platform === 'amazon'} onChange={() => setPlatform('amazon')} />
                Amazon
              </label>
              <label className={`cursor-pointer border rounded-lg p-3 text-sm text-center font-medium transition-all ${platform === 'temu' ? 'border-primary bg-primary/5 text-primary' : 'hover:bg-muted'}`}>
                <input type="radio" className="hidden" name="platform" value="temu" checked={platform === 'temu'} onChange={() => setPlatform('temu')} />
                Temu
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">3</span>
              需要生成的类型
            </h3>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={outputType}
              onChange={(e) => setOutputType(e.target.value as TaskOutputType)}
            >
              <option value="white_bg">纯白底主图 (合规)</option>
              <option value="scene">AI 场景渲染图</option>
              <option value="dimension">带尺寸标注说明图</option>
            </select>
          </div>

          <div className="pt-4 border-t">
            <button 
              type="submit" 
              disabled={!selectedFile}
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
            >
              开始 AI 处理 <Wand2 className="w-4 h-4" />
            </button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              点击提交会先将图片上传，然后初始化一条数据库任务。
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
