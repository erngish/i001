// ===== Wallet Types =====
export interface WalletState {
  address: string;
  isConnected: boolean;
  chainId: number | null;
  balance: string;
  pufEthBalance: string;
}

export interface WalletInfo {
  address: string;
  name: string;
  type: 'created' | 'imported' | 'metamask';
  createdAt: number;
}

// ===== Puffer Types =====
export interface PufEthRate {
  pufEthPerEth: string;
  ethPerPufEth: string;
  totalAssets: string;
  totalSupply: string;
}

export interface PufEthMetrics {
  marketCap: string;
  dailyVolume: string;
  holderCount: number;
}

export interface VaultApy {
  vault: string;
  vaultAddress: string;
  apy7d: number;
  apy14d: number;
  apy30d: number;
  apy60d: number;
}

export interface VaultTvl {
  vault: string;
  vaultAddress: string;
  tvl: string;
  tvlUsd: string;
}

export interface ProtocolTvl {
  totalTvl: string;
  totalTvlUsd: string;
  pufEthStakingApy: number;
}

export interface TokenPrice {
  address: string;
  priceUsd: string;
  symbol: string;
}

export interface StakeParams {
  token: StakeToken;
  amount: string;
  recipient?: string;
}

export type StakeToken = 'ETH' | 'stETH' | 'wstETH';

export interface StakeResult {
  txHash: string;
  pufEthReceived: string;
  blockNumber: number;
}

// ===== Security Types =====
export type RiskLevel = 'info' | 'warning' | 'danger' | 'block';

export interface SecurityCheck {
  id: string;
  level: RiskLevel;
  title: string;
  description: string;
  category: SecurityCategory;
  passed: boolean;
  recommendation?: string;
}

export type SecurityCategory =
  | 'contract-risk'
  | 'approval-risk'
  | 'phishing-risk'
  | 'amount-risk'
  | 'network-risk'
  | 'simulation';

export interface SecurityReport {
  checks: SecurityCheck[];
  overallLevel: RiskLevel;
  canProceed: boolean;
  timestamp: number;
}

// ===== Transaction Types =====
export interface TransactionRecord {
  hash: string;
  type: 'stake' | 'unstake' | 'vault-deposit';
  token: StakeToken;
  amount: string;
  pufEthReceived: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
}

// ===== Dashboard Types =====
export interface DashboardData {
  ethBalance: string;
  pufEthBalance: string;
  pufEthValueInEth: string;
  totalEarnings: string;
  stakingApy: number;
  recentTransactions: TransactionRecord[];
}

// ===== UI Types =====
export type AppView = 'wallet' | 'stake' | 'dashboard' | 'security';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}
