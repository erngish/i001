import { useCallback, useEffect } from 'react';
import { useAppState } from '@/store/app-context';
import { pufferApi } from '@/services/puffer-api';

export function usePufferData() {
  const { state, dispatch } = useAppState();

  const fetchRate = useCallback(async () => {
    try {
      const rate = await pufferApi.getPufEthRate();
      dispatch({ type: 'SET_PUFETH_RATE', payload: rate });
    } catch {
      // Use fallback data for demo
      dispatch({
        type: 'SET_PUFETH_RATE',
        payload: {
          pufEthPerEth: '0.959',
          ethPerPufEth: '1.042',
          totalAssets: '450000.123',
          totalSupply: '432000.456',
        },
      });
    }
  }, [dispatch]);

  const fetchVaultApys = useCallback(async () => {
    try {
      const apys = await pufferApi.getVaultsApy();
      dispatch({ type: 'SET_VAULT_APYS', payload: apys });
    } catch {
      // Use fallback data
      dispatch({
        type: 'SET_VAULT_APYS',
        payload: [
          { vault: 'unifiETH', vaultAddress: '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc', apy7d: 4.2, apy14d: 4.5, apy30d: 4.8, apy60d: 5.1 },
          { vault: 'unifiUSD', vaultAddress: '0x82c40e07277eBb92935f79cE92268F80dDc7caB4', apy7d: 3.8, apy14d: 3.9, apy30d: 4.1, apy60d: 4.3 },
          { vault: 'unifiBTC', vaultAddress: '0x170d847a8320f3b6a77ee15b0cae430e3ec933a0', apy7d: 2.5, apy14d: 2.7, apy30d: 3.0, apy60d: 3.2 },
          { vault: 'pufETHs', vaultAddress: '0x62a4ce0722ee65635c0f8339dd814d549b6f6735', apy7d: 5.1, apy14d: 5.3, apy30d: 5.6, apy60d: 5.8 },
        ],
      });
    }
  }, [dispatch]);

  const fetchProtocolTvl = useCallback(async () => {
    try {
      const tvl = await pufferApi.getProtocolTvl();
      dispatch({ type: 'SET_PROTOCOL_TVL', payload: tvl });
    } catch {
      dispatch({
        type: 'SET_PROTOCOL_TVL',
        payload: {
          totalTvl: '450000',
          totalTvlUsd: '1500000000',
          pufEthStakingApy: 4.8,
        },
      });
    }
  }, [dispatch]);

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([fetchRate(), fetchVaultApys(), fetchProtocolTvl()]);
  }, [fetchRate, fetchVaultApys, fetchProtocolTvl]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, [fetchAll]);

  return {
    pufEthRate: state.pufEthRate,
    vaultApys: state.vaultApys,
    protocolTvl: state.protocolTvl,
    fetchRate,
    fetchVaultApys,
    fetchProtocolTvl,
    fetchAll,
  };
}
