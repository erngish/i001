import type { ReactNode } from 'react';
import { AppProvider } from '@/store/app-context';
import { Layout } from '@/components/layout/Layout';
import '@/styles/globals.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AppProvider>
      <Layout>
        {children}
      </Layout>
    </AppProvider>
  );
}
