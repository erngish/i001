import type { SecurityCheck, RiskLevel } from '@/types';
import { SECURITY_LEVELS } from '@/utils/constants';
import './RiskAlert.css';

interface RiskAlertProps {
  check: SecurityCheck;
  onLearnMore?: () => void;
}

export function RiskAlert({ check, onLearnMore }: RiskAlertProps) {
  const levelConfig = SECURITY_LEVELS[check.level];

  return (
    <div className={`risk-alert risk-alert-${check.level}`} style={{
      borderLeftColor: levelConfig.color,
      background: levelConfig.bg,
    }}>
      <div className="risk-alert-header">
        <span className="risk-level-badge" style={{
          background: levelConfig.color,
          color: 'white',
        }}>
          {levelConfig.label}
        </span>
        <span className="risk-category">{getCategoryLabel(check.category)}</span>
      </div>
      <div className="risk-alert-body">
        <h4 className="risk-alert-title">{check.title}</h4>
        <p className="risk-alert-desc">{check.description}</p>
        {!check.passed && check.recommendation && (
          <p className="risk-alert-recommendation">
            💡 建议：{check.recommendation}
          </p>
        )}
      </div>
      {check.level === 'danger' && onLearnMore && (
        <button className="risk-alert-learn-more" onClick={onLearnMore}>
          了解更多 →
        </button>
      )}
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'contract-risk': '合约风险',
    'approval-risk': '授权风险',
    'phishing-risk': '钓鱼风险',
    'amount-risk': '金额风险',
    'network-risk': '网络风险',
    'simulation': '模拟检查',
  };
  return labels[category] || category;
}

export function RiskLevelIndicator({ level }: { level: RiskLevel }) {
  const config = SECURITY_LEVELS[level];
  return (
    <div className="risk-level-indicator" style={{ background: config.bg }}>
      <span className="risk-level-dot" style={{ background: config.color }} />
      <span style={{ color: config.color, fontWeight: 600, fontSize: '13px' }}>
        {config.label}
      </span>
    </div>
  );
}
