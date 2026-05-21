import { AppProvider, useAppState } from '@/store/app-context';
import { Layout } from '@/components/layout/Layout';
import { WalletPanel } from '@/components/wallet/WalletPanel';
import { StakePanel } from '@/components/stake/StakePanel';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';
import { SecurityPanel } from '@/components/security/SecurityPanel';
import { ToastContainer } from '@/components/common/ToastContainer';
import '@/styles/globals.css';

function AppContent() {
  const { state } = useAppState();

  return (
    <Layout>
      {state.currentView === 'wallet' && <WalletPanel />}
      {state.currentView === 'stake' && <StakePanel />}
      {state.currentView === 'dashboard' && <DashboardPanel />}
      {state.currentView === 'security' && <SecurityPanel />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
