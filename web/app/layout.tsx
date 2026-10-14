import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';

export const metadata: Metadata = {
  title: 'PulsOps — Gym Management SaaS ERP',
  description: 'Production-Grade Multi-Tenant Gym Management Cloud ERP with Full Arabic & English Support',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-[#0A0A0A] text-white antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
