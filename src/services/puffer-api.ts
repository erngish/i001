import { PUFFER_API_BASE } from '@/utils/constants';
import type { PufEthRate, PufEthMetrics, VaultApy, VaultTvl, ProtocolTvl, TokenPrice } from '@/types';

class PufferApiService {
  private baseUrl: string;

  constructor(baseUrl: string = PUFFER_API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Puffer API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getPufEthRate(): Promise<PufEthRate> {
    return this.fetch<PufEthRate>('/pufeth/rate');
  }

  async getPufEthMetrics(): Promise<PufEthMetrics> {
    return this.fetch<PufEthMetrics>('/pufeth/metrics');
  }

  async getVaultsApy(): Promise<VaultApy[]> {
    return this.fetch<VaultApy[]>('/vaults/apy');
  }

  async getVaultsTvl(): Promise<VaultTvl[]> {
    return this.fetch<VaultTvl[]>('/vaults/tvl');
  }

  async getProtocolTvl(): Promise<ProtocolTvl> {
    return this.fetch<ProtocolTvl>('/protocol/tvl');
  }

  async getTokenPrices(addresses: string[]): Promise<TokenPrice[]> {
    const addressesParam = addresses.join('%');
    return this.fetch<TokenPrice[]>(`/tokens/prices?addresses=${addressesParam}`);
  }

  async getGaugeApr(identifier: string): Promise<{ apr: number }> {
    return this.fetch<{ apr: number }>(`/gauges/apr?identifier=${identifier}`);
  }

  async healthCheck(): Promise<{ status: string }> {
    return this.fetch<{ status: string }>('/health');
  }
}

export const pufferApi = new PufferApiService();
export default PufferApiService;
