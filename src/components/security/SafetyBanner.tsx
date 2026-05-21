import { SAFETY } from '@/utils/constants';
import './SafetyBanner.css';

export function SafetyBanner() {
  if (!SAFETY.isDemo) return null;

  return (
    <div className="safety-banner">
      <div className="safety-banner-inner">
        <span className="safety-icon">🛡️</span>
        <div className="safety-text">
          <span className="safety-label">演示模式</span>
          <span className="safety-desc">
            当前使用测试网环境，请勿输入真实助记词或发送真实资产
          </span>
        </div>
      </div>
    </div>
  );
}
