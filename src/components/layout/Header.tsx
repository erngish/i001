import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/utils/helpers';
import './Header.css';

export function Header() {
  const { wallet, isConnected, connect, disconnect } = useWallet();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="64" y2="64">
                  <stop offset="0%" stopColor="#0066FF" />
                  <stop offset="100%" stopColor="#00D4AA" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="30" fill="url(#logo-grad)" />
              <path d="M20 38 C20 28, 26 20, 32 18 C38 20, 44 28, 44 38 C44 42, 38 46, 32 46 C26 46, 20 42, 20 38Z" fill="white" opacity="0.9" />
              <path d="M28 34 Q32 28, 36 34" stroke="#0066FF" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="30" cy="32" r="1.5" fill="#0066FF" />
              <circle cx="34" cy="32" r="1.5" fill="#0066FF" />
            </svg>
          </div>
          <div className="header-title">
            <h1>蒲风·安栈</h1>
            <span className="header-subtitle">PuffGuard Safe Stack</span>
          </div>
        </div>

        <div className="header-wallet">
          {isConnected ? (
            <div className="header-wallet-info">
              <div className="wallet-indicator" />
              <span className="wallet-address">{shortenAddress(wallet.address)}</span>
              <button className="btn-disconnect" onClick={disconnect}>
                断开
              </button>
            </div>
          ) : (
            <button className="btn-connect" onClick={connect}>
              连接钱包
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
