import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatEth(value: string | bigint, decimals = 6): string {
  const num = typeof value === 'bigint'
    ? Number(value) / 1e18
    : parseFloat(value);
  if (isNaN(num)) return '0';
  if (num === 0) return '0';
  if (num < 0.000001) return '<0.000001';
  return num.toFixed(decimals);
}

export function formatUsd(value: string | number, decimals = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0.00';
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export function formatApy(value: number): string {
  if (isNaN(value)) return '0.00%';
  return `${value.toFixed(2)}%`;
}

export function parseEthAmount(value: string): bigint {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return BigInt(0);
  // Convert to wei (18 decimals)
  const weiStr = (num * 1e18).toFixed(0);
  return BigInt(weiStr);
}

export function weiToEth(wei: bigint | string): string {
  const num = typeof wei === 'string' ? BigInt(wei) : wei;
  const eth = Number(num) / 1e18;
  return eth.toString();
}

export function getExplorerUrl(hash: string, network: string = 'mainnet'): string {
  const explorers: Record<string, string> = {
    mainnet: 'https://etherscan.io',
    sepolia: 'https://sepolia.etherscan.io',
    holesky: 'https://holesky.etherscan.io',
  };
  const base = explorers[network] || explorers.mainnet;
  if (hash.startsWith('0x') && hash.length === 66) {
    return `${base}/tx/${hash}`;
  }
  return `${base}/address/${hash}`;
}

export function getTimestamp(): number {
  return Date.now();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
