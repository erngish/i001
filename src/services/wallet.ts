import { ethers } from 'ethers';
import { CONTRACTS, NETWORKS, SAFETY } from '@/utils/constants';
import type { WalletState, StakeToken, StakeResult, TransactionRecord } from '@/types';

// ERC20 ABI (minimal)
const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

// PufferVault ABI (minimal for deposit)
const PUFFER_VAULT_ABI = [
  'function deposit(address token, uint256 amount) returns (uint256)',
  'function depositETH() payable returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function previewDeposit(address token, uint256 amount) view returns (uint256)',
  'function getRate() view returns (uint256)',
];

class WalletService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  async connectMetaMask(): Promise<WalletState> {
    if (!window.ethereum) {
      throw new Error('请安装 MetaMask 或其他 Web3 钱包');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    const address = await this.signer.getAddress();
    const network = await this.provider.getNetwork();
    const balance = await this.provider.getBalance(address);

    return {
      address,
      isConnected: true,
      chainId: Number(network.chainId),
      balance: ethers.formatEther(balance),
      pufEthBalance: '0',
    };
  }

  async switchToSepolia(): Promise<void> {
    if (!window.ethereum) throw new Error('No wallet provider');
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia
      });
    } catch (switchError: unknown) {
      const err = switchError as { code?: number };
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia Testnet',
            nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        });
      } else {
        throw switchError;
      }
    }
  }

  async getEthBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error('Wallet not connected');
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getPufEthBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error('Wallet not connected');
    const vaultContract = new ethers.Contract(
      CONTRACTS.pufETH,
      ERC20_ABI,
      this.provider
    );
    const balance = await vaultContract.balanceOf(address);
    return ethers.formatEther(balance);
  }

  async stakeEth(amount: string): Promise<StakeResult> {
    if (!this.signer) throw new Error('Wallet not connected');

    const vaultContract = new ethers.Contract(
      CONTRACTS.PufferVault,
      PUFFER_VAULT_ABI,
      this.signer
    );

    const weiAmount = ethers.parseEther(amount);
    const tx = await vaultContract.depositETH({ value: weiAmount });
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
      pufEthReceived: '0', // Will be calculated from events
      blockNumber: receipt.blockNumber,
    };
  }

  async stakeToken(token: StakeToken, amount: string): Promise<StakeResult> {
    if (!this.signer) throw new Error('Wallet not connected');

    const tokenAddress = token === 'stETH' ? CONTRACTS.stETH : CONTRACTS.wstETH;
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
    const vaultContract = new ethers.Contract(
      CONTRACTS.PufferVault,
      PUFFER_VAULT_ABI,
      this.signer
    );

    const weiAmount = ethers.parseEther(amount);

    // Check and set approval
    const signerAddress = await this.signer.getAddress();
    const allowance = await tokenContract.allowance(signerAddress, CONTRACTS.PufferVault);
    if (allowance < weiAmount) {
      const approveTx = await tokenContract.approve(CONTRACTS.PufferVault, weiAmount);
      await approveTx.wait();
    }

    const tx = await vaultContract.deposit(tokenAddress, weiAmount);
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
      pufEthReceived: '0',
      blockNumber: receipt.blockNumber,
    };
  }

  async estimateGas(token: StakeToken, amount: string): Promise<string> {
    if (!this.provider || !this.signer) throw new Error('Wallet not connected');

    const weiAmount = ethers.parseEther(amount);
    const signerAddress = await this.signer.getAddress();

    if (token === 'ETH') {
      const gasEstimate = await this.provider.estimateGas({
        from: signerAddress,
        to: CONTRACTS.PufferVault,
        value: weiAmount,
        data: '0x2e1a7d4d', // depositETH selector
      });
      const feeData = await this.provider.getFeeData();
      const gasCost = gasEstimate * (feeData.gasPrice || BigInt(0));
      return ethers.formatEther(gasCost);
    }

    return '0.001'; // Default estimate
  }

  async verifyContract(address: string): Promise<boolean> {
    // In production, this would check Etherscan/Sourcify verification
    const knownContracts = Object.values(CONTRACTS).map(c => c.toLowerCase());
    return knownContracts.includes(address.toLowerCase());
  }

  async stake(token: StakeToken, amount: string): Promise<StakeResult> {
    if (token === 'ETH') {
      return this.stakeEth(amount);
    }
    return this.stakeToken(token, amount);
  }

  disconnect(): void {
    this.provider = null;
    this.signer = null;
  }
}

export const walletService = new WalletService();
export default WalletService;
