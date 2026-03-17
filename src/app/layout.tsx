import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ecom Visual Studio',
  description: 'AI-powered E-commerce Visual Assets Generation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen w-full flex-col bg-muted/10">
          <Sidebar />
          <div className="flex flex-col md:pl-64">
            <Header />
            <PageContainer>
              {children}
            </PageContainer>
          </div>
        </div>
      </body>
    </html>
  );
}
