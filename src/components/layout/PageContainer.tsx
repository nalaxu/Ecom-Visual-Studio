import * as React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

/**
 * 页面容器封装，规范内容区域的内边距和最大宽度
 */
export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="flex-1 flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl">
        {children}
      </div>
    </main>
  );
}
