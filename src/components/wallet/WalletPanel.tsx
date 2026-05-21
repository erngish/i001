import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { SAFETY } from '@/utils/constants';
import { shortenAddress, formatEth } from '@/utils/helpers';
import './WalletPanel.css';

export function WalletPanel() {
  const { wallet, isConnected, isLoading, connect, disconnect } = useWallet();
  const [showImport, setShowImport] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [showMnemonicWarning, setShowMnemonicWarning] = useState(false);

  const handleImportSubmit = () => {
    if (mnemonic.trim()) {
      setShowMnemonicWarning(true);
    }
  };

  if (!isConnected) {
    return (
      <div className="wallet-panel">
        <div className="wallet-hero">
          <div className="wallet-hero-visual">
            <div className="dandelion-bg">
              <div className="dandelion-seed animate-float" style={{ top: '10%', left: '20%', animationDelay: '0s' }} />
              <div className="dandelion-seed animate-float" style={{ top: '30%', right: '15%', animationDelay: '0.5s' }} />
              <div className="dandelion-seed animate-float" style={{ bottom: '20%', left: '30%', animationDelay: '1s' }} />
              <div className="dandelion-seed animate-float" style={{ top: '50%', right: '30%', animationDelay: '1.5s' }} />
            </div>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <defs>
                <linearGradient id="wallet-grad" x1="0" y1="0" x2="80" y2="80">
                  <stop offset="0%" stopColor="#0066FF" />
                  <stop offset="100%" stopColor="#00D4AA" />
                </linearGradient>
              </defs>
              <circle cx="40" cy="40" r="38" fill="url(#wallet-grad)" opacity="0.1" />
              <circle cx="40" cy="40" r="38" stroke="url(#wallet-grad)" strokeWidth="2" fill="none" />
              <rect x="18" y="28" width="44" height="28" rx="4" stroke="url(#wallet-grad)" strokeWidth="2" fill="none" />
              <path d="M18 36h44" stroke="url(#wallet-grad)" strokeWidth="1.5" />
              <circle cx="52" cy="44" r="3" fill="url(#wallet-grad)" />
            </svg>
          </div>
          <h2 className="wallet-hero-title">你的钱包你掌控</h2>
          <p className="wallet-hero-desc">
            基于 Token Core 自托管理念，私钥永不离开你的设备。<br/>
            安全连接钱包，开始 Puffer 质押之旅。
          </p>
        </div>

        <div className="wallet-actions">
          <button
            className="btn-primary btn-connect-wallet"
            onClick={connect}
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="spinner" /> 连接中...</>
            ) : (
              <>🔗 连接 MetaMask 钱包</>
            )}
          </button>

          <button
            className="btn-secondary"
            onClick={() => setShowImport(!showImport)}
          >
            📝 导入钱包（助记词）
          </button>
        </div>

        {showImport && (
          <div className="import-section animate-slide-up">
            <div className="import-warning">
              <span className="warning-icon">🛑</span>
              <div>
                <strong>{SAFETY.mnemonicWarning}</strong>
                <p>本演示仅支持测试网助记词导入，绝不收集或传输助记词数据。</p>
              </div>
            </div>
            <div className="import-input-group">
              <label>助记词（12/24 词）</label>
              <textarea
                className="mnemonic-input"
                placeholder="在此输入测试网助记词..."
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                rows={3}
              />
            </div>
            <button
              className="btn-primary btn-import"
              onClick={handleImportSubmit}
              disabled={!mnemonic.trim()}
            >
              导入钱包
            </button>
            {showMnemonicWarning && (
              <div className="import-confirm-warning animate-fade-in">
                <p>⚠️ 确认：您输入的是<strong>测试网专用</strong>助记词，而非包含真实资产的主网助记词？</p>
                <div className="warning-actions">
                  <button className="btn-danger" onClick={() => setShowMnemonicWarning(false)}>
                    取消
                  </button>
                  <button className="btn-confirm" onClick={() => {
                    setShowMnemonicWarning(false);
                    connect();
                  }}>
                    确认是测试网
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="wallet-features">
          <div className="feature-item">
            <span className="feature-icon">🔐</span>
            <div>
              <h4>自托管签名</h4>
              <p>私钥仅存储在本地，交易签名在设备端完成</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <div>
              <h4>安风守护</h4>
              <p>每笔交易前自动进行多层安全检查</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🌊</span>
            <div>
              <h4>Puffer 质押</h4>
              <p>安全铸造 pufETH，享受以太坊质押收益</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-panel">
      <div className="wallet-connected">
        <div className="wallet-card">
          <div className="wallet-card-header">
            <span className="wallet-type-badge">MetaMask</span>
            <div className="wallet-status">
              <span className="status-dot" />
              已连接
            </div>
          </div>
          <div className="wallet-address-display">
            {shortenAddress(wallet.address, 6)}
          </div>
          <div className="wallet-balances">
            <div className="balance-item">
              <span className="balance-label">ETH</span>
              <span className="balance-value">{formatEth(wallet.balance)}</span>
            </div>
            <div className="balance-divider" />
            <div className="balance-item">
              <span className="balance-label">pufETH</span>
              <span className="balance-value">{formatEth(wallet.pufEthBalance)}</span>
            </div>
          </div>
        </div>

        <div className="wallet-quick-actions">
          <button className="quick-action" onClick={() => {/* navigate to stake */}}>
            <span className="qa-icon">⚡</span>
            <span>质押</span>
          </button>
          <button className="quick-action" onClick={() => {/* navigate to security */}}>
            <span className="qa-icon">🛡️</span>
            <span>安全检查</span>
          </button>
          <button className="quick-action" onClick={disconnect}>
            <span className="qa-icon">🔌</span>
            <span>断开</span>
          </button>
        </div>
      </div>
    </div>
  );
}
