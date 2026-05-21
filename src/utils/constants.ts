// Puffer API Base URL
export const PUFFER_API_BASE = 'https://api-v2.puffer.fi/imtoken-hackathon';

// Contract Addresses (Ethereum Mainnet)
export const CONTRACTS = {
  PufferVault: '0xD9A442856C234a39a81a089C06451EBAa4306a72',
  pufETH: '0xd9a442856c234a39a81a089c06451ebaa4306a72',
  PUFFER: '0x4d1c297d39c5c1277964d0e3f8aa901493664530',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  stETH: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  wstETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
} as const;

export const UNIFI_VAULTS = {
  unifiETH: {
    vault: '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc',
    teller: '0x08eb2eccdf6ebd7aba601791f23ec5b5f68a1d53',
  },
  unifiUSD: {
    vault: '0x82c40e07277eBb92935f79cE92268F80dDc7caB4',
    teller: '0x5d3Fb47FE7f3F4Ce8fe55518f7E4F7D6061B54DD',
  },
  unifiBTC: {
    vault: '0x170d847a8320f3b6a77ee15b0cae430e3ec933a0',
    teller: '0x0743647a607822781f9d0a639454e76289182f0b',
  },
  pufETHs: {
    vault: '0x62a4ce0722ee65635c0f8339dd814d549b6f6735',
    teller: '0xd049ebeaa59b75ba8ee38f9f6830db7293320236',
  },
} as const;

// Network Config
export const NETWORKS = {
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    symbol: 'ETH',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
    symbol: 'ETH',
  },
  holesky: {
    chainId: 17000,
    name: 'Holesky Testnet',
    rpcUrl: 'https://ethereum-holesky-rpc.publicnode.com',
    explorer: 'https://holesky.etherscan.io',
    symbol: 'ETH',
  },
} as const;

// Security Constants
export const SECURITY_LEVELS = {
  info: { color: '#0066FF', bg: '#EBF5FF', label: '信息', icon: 'ℹ️' },
  warning: { color: '#F59E0B', bg: '#FFFBEB', label: '警告', icon: '⚠️' },
  danger: { color: '#EF4444', bg: '#FEF2F2', label: '危险', icon: '🚨' },
  block: { color: '#991B1B', bg: '#450A0A', label: '阻止', icon: '🛑' },
} as const;

// imToken Design Tokens
export const DESIGN_TOKENS = {
  primary: '#0066FF',
  primaryLight: '#EBF5FF',
  secondary: '#00D4AA',
  secondaryLight: '#E6FAF5',
  background: '#FFFFFF',
  surfacePage: '#F8FAFC',
  card: '#FFFFFF',
  foreground: '#111d4a',
  mutedForeground: '#99a1af',
  border: '#E2E8F0',
  radius: '12px',
  radiusSm: '8px',
  radiusLg: '16px',
} as const;

// Demo/Testnet Safety
export const SAFETY = {
  isDemo: true,
  defaultNetwork: 'sepolia' as const,
  maxStakeAmount: '0.01', // ETH limit for demo
  safetyNotice: '⚠️ 演示模式：当前使用测试网，请勿输入真实助记词',
  mnemonicWarning: '🛑 绝不在演示环境中输入真实助记词！本应用仅用于测试网演示。',
} as const;
