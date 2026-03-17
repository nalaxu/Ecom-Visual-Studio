import * as React from 'react';

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10 backdrop-blur-sm">
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold md:hidden">Ecom Studio</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* 后续可以放 UserProfile, ThemeToggle 等 */}
        <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold">
          ME
        </div>
      </div>
    </header>
  );
}
