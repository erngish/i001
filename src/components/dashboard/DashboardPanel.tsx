import { useWallet } from '@/hooks/useWallet';
import { usePufferData } from '@/hooks/usePufferData';
import { useAppState } from '@/store/app-context';
import { formatEth, formatApy, formatUsd, getExplorerUrl } from '@/utils/helpers';
import './DashboardPanel.css';

export function DashboardPanel() {
  const { wallet, isConnected, connect } = useWallet();
  const { pufEthRate, protocolTvl } = usePufferData();
  const { state } = useAppState();

  if (!isConnected) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-connect-prompt">
          <h3>连接钱包查看仪表盘</h3>
          <button className="btn-primary" onClick={connect}>
            🔗 连接钱包
          </button>
        </div>
      </div>
    );
  }

  const pufEthValue = pufEthRate && wallet.pufEthBalance
    ? (parseFloat(wallet.pufEthBalance) * parseFloat(pufEthRate.ethPerPufEth)).toFixed(6)
    : '0';

  const estimatedEarnings = pufEthRate && wallet.pufEthBalance
    ? (parseFloat(pufEthValue) * (protocolTvl?.pufEthStakingApy || 4.8) / 100 / 365).toFixed(6)
    : '0';

  return (
    <div className="dashboard-panel">
      {/* Overview Card */}
      <div className="dashboard-overview">
        <div className="overview-card">
          <div className="overview-header">
            <span className="overview-label">pufETH 余额</span>
            <span className="overview-badge">Puffer</span>
          </div>
          <div className="overview-value">
            {formatEth(wallet.pufEthBalance)} <span className="overview-unit">pufETH</span>
          </div>
          <div className="overview-sub">
            ≈ {formatEth(pufEthValue)} ETH
            {protocolTvl && (
              <span className="overview-apy">
                APY {formatApy(protocolTvl.pufEthStakingApy)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-label">ETH 余额</span>
          <span className="stat-value">{formatEth(wallet.balance)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">日收益预估</span>
          <span className="stat-value stat-green">+{formatEth(estimatedEarnings)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">pufETH/ETH</span>
          <span className="stat-value">{pufEthRate?.ethPerPufEth || '1.042'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">协议 TVL</span>
          <span className="stat-value">
            {protocolTvl ? formatUsd(parseFloat(protocolTvl.totalTvlUsd)) : '$1.5B'}
          </span>
        </div>
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="dashboard-chart">
        <h3>收益趋势</h3>
        <div className="chart-placeholder">
          <div className="chart-bars">
            {[40, 55, 45, 60, 70, 65, 80, 75, 90, 85, 95, 100].map((h, i) => (
              <div
                key={i}
                className="chart-bar"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, var(--primary), var(--secondary))`,
                  opacity: 0.3 + (i / 12) * 0.7,
                }}
              />
            ))}
          </div>
          <div className="chart-labels">
            <span>1月</span>
            <span>6月</span>
            <span>12月</span>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="dashboard-history">
        <h3>质押历史</h3>
        {state.transactions.length === 0 ? (
          <div className="history-empty">
            <span className="empty-icon">📋</span>
            <p>暂无质押记录</p>
            <span className="empty-hint">完成首次质押后，记录将显示在这里</span>
          </div>
        ) : (
          <div className="history-list">
            {state.transactions.map((tx) => (
              <div key={tx.hash} className="history-item">
                <div className="history-item-left">
                  <span className={`history-type ${tx.type}`}>
                    {tx.type === 'stake' ? '⬆️' : '⬇️'} {tx.type === 'stake' ? '质押' : '赎回'}
                  </span>
                  <span className="history-token">{tx.amount} {tx.token}</span>
                </div>
                <div className="history-item-right">
                  <span className="history-pufeth">+{tx.pufEthReceived} pufETH</span>
                  <a
                    href={getExplorerUrl(tx.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="history-link"
                  >
                    查看 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
