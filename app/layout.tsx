import type { Metadata } from 'next';
import './globals.css';
import { ERPProvider } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Vizha OS – Modern Enterprise Event Production ERP',
  description: 'Modern Minimalistic Enterprise Multi-Tenant Event Management ERP built with Next.js 15, TypeScript, Tailwind CSS, Prisma & Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased flex flex-col selection:bg-zinc-900 selection:text-white">
        <ERPProvider>
          <Navbar />
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </ERPProvider>
      </body>
    </html>
  );
}
