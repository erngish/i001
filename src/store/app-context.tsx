import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { WalletState, AppView, TransactionRecord, ToastMessage, SecurityReport, PufEthRate, VaultApy, ProtocolTvl } from '@/types';

interface AppState {
  wallet: WalletState;
  currentView: AppView;
  transactions: TransactionRecord[];
  toasts: ToastMessage[];
  securityReport: SecurityReport | null;
  pufEthRate: PufEthRate | null;
  vaultApys: VaultApy[];
  protocolTvl: ProtocolTvl | null;
  isLoading: boolean;
  isStaking: boolean;
  network: string;
}

type Action =
  | { type: 'SET_WALLET'; payload: WalletState }
  | { type: 'DISCONNECT_WALLET' }
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'ADD_TRANSACTION'; payload: TransactionRecord }
  | { type: 'UPDATE_TRANSACTION'; payload: { hash: string; updates: Partial<TransactionRecord> } }
  | { type: 'ADD_TOAST'; payload: ToastMessage }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_SECURITY_REPORT'; payload: SecurityReport | null }
  | { type: 'SET_PUFETH_RATE'; payload: PufEthRate }
  | { type: 'SET_VAULT_APYS'; payload: VaultApy[] }
  | { type: 'SET_PROTOCOL_TVL'; payload: ProtocolTvl }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_STAKING'; payload: boolean }
  | { type: 'SET_NETWORK'; payload: string };

const initialState: AppState = {
  wallet: {
    address: '',
    isConnected: false,
    chainId: null,
    balance: '0',
    pufEthBalance: '0',
  },
  currentView: 'wallet',
  transactions: [],
  toasts: [],
  securityReport: null,
  pufEthRate: null,
  vaultApys: [],
  protocolTvl: null,
  isLoading: false,
  isStaking: false,
  network: 'sepolia',
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_WALLET':
      return { ...state, wallet: action.payload };
    case 'DISCONNECT_WALLET':
      return { ...state, wallet: initialState.wallet, transactions: [] };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(tx =>
          tx.hash === action.payload.hash ? { ...tx, ...action.payload.updates } : tx
        ),
      };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'SET_SECURITY_REPORT':
      return { ...state, securityReport: action.payload };
    case 'SET_PUFETH_RATE':
      return { ...state, pufEthRate: action.payload };
    case 'SET_VAULT_APYS':
      return { ...state, vaultApys: action.payload };
    case 'SET_PROTOCOL_TVL':
      return { ...state, protocolTvl: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_STAKING':
      return { ...state, isStaking: action.payload };
    case 'SET_NETWORK':
      return { ...state, network: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

export type { AppState, Action };
