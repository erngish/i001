import type { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '@/components/common/ToastContainer';
import { SafetyBanner } from '@/components/security/SafetyBanner';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <Header />
      <SafetyBanner />
      <main className="app-main">
        {children}
      </main>
      <BottomNav />
      <ToastContainer />
    </div>
  );
}
