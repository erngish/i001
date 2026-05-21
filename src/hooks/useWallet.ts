import { useCallback } from 'react';
import { useAppState } from '@/store/app-context';
import { walletService } from '@/services/wallet';
import { pufferApi } from '@/services/puffer-api';
import { generateId } from '@/utils/helpers';
import type { WalletState, ToastMessage } from '@/types';

export function useWallet() {
  const { state, dispatch } = useAppState();

  const connect = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const walletState = await walletService.connectMetaMask();
      dispatch({ type: 'SET_WALLET', payload: walletState });

      // Fetch pufETH balance
      try {
        const pufEthBalance = await walletService.getPufEthBalance(walletState.address);
        dispatch({
          type: 'SET_WALLET',
          payload: { ...walletState, pufEthBalance },
        });
      } catch {
        // pufETH balance might fail on testnet, that's ok
      }

      addToast({
        id: generateId(),
        type: 'success',
        title: '钱包连接成功',
        description: `已连接 ${walletState.address.slice(0, 8)}...`,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '连接失败';
      addToast({
        id: generateId(),
        type: 'error',
        title: '连接失败',
        description: msg,
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const disconnect = useCallback(() => {
    walletService.disconnect();
    dispatch({ type: 'DISCONNECT_WALLET' });
    addToast({
      id: generateId(),
      type: 'info',
      title: '已断开连接',
    });
  }, [dispatch]);

  const refreshBalance = useCallback(async () => {
    if (!state.wallet.isConnected) return;
    try {
      const balance = await walletService.getEthBalance(state.wallet.address);
      let pufEthBalance = '0';
      try {
        pufEthBalance = await walletService.getPufEthBalance(state.wallet.address);
      } catch {
        // May fail on testnet
      }
      dispatch({
        type: 'SET_WALLET',
        payload: { ...state.wallet, balance, pufEthBalance },
      });
    } catch {
      // Silent fail
    }
  }, [state.wallet, dispatch]);

  const addToast = useCallback((toast: ToastMessage) => {
    dispatch({ type: 'ADD_TOAST', payload: toast });
    if (toast.duration !== 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
      }, toast.duration || 5000);
    }
  }, [dispatch]);

  return {
    wallet: state.wallet,
    isConnected: state.wallet.isConnected,
    isLoading: state.isLoading,
    connect,
    disconnect,
    refreshBalance,
    addToast,
  };
}
