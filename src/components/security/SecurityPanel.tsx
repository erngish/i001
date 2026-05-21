import { useState, useCallback } from 'react';
import { securityService } from '@/services/security';
import { RiskAlert, RiskLevelIndicator } from './RiskAlert';
import { useAppState } from '@/store/app-context';
import type { SecurityReport, StakeToken } from '@/types';
import './SecurityPanel.css';

export function SecurityPanel() {
  const { state, dispatch } = useAppState();
  const [isChecking, setIsChecking] = useState(false);
  const [report, setReport] = useState<SecurityReport | null>(state.securityReport);

  const runFullCheck = useCallback(async (token: StakeToken = 'ETH', amount: string = '0') => {
    setIsChecking(true);
    try {
      const result = await securityService.runSecurityCheck(token, amount);
      setReport(result);
      dispatch({ type: 'SET_SECURITY_REPORT', payload: result });
    } catch (error) {
      console.error('Security check failed:', error);
    } finally {
      setIsChecking(false);
    }
  }, [dispatch]);

  const runDemoCheck = useCallback(async () => {
    await runFullCheck('ETH', '0.01');
  }, [runFullCheck]);

  return (
    <div className="security-panel">
      <div className="security-panel-header">
        <div className="security-guard-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="shield-grad" x1="0" y1="0" x2="48" y2="48">
                <stop offset="0%" stopColor="#0066FF" />
                <stop offset="100%" stopColor="#00D4AA" />
              </linearGradient>
            </defs>
            <path d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z" fill="url(#shield-grad)" opacity="0.15" />
            <path d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z" stroke="url(#shield-grad)" strokeWidth="2" fill="none" />
            <path d="M17 24l5 5 9-9" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2 className="security-panel-title">安风守护</h2>
          <p className="security-panel-subtitle">深度安全检查，守护每一笔质押</p>
        </div>
      </div>

      {/* Security Principles */}
      <div className="security-principles">
        <div className="principle-card">
          <span className="principle-icon">🔐</span>
          <div>
            <h4>自托管签名</h4>
            <p>基于 Token Core 理念，私钥永不离开你的设备</p>
          </div>
        </div>
        <div className="principle-card">
          <span className="principle-icon">🔍</span>
          <div>
            <h4>多层风险扫描</h4>
            <p>合约验证、授权检查、钓鱼检测、金额异常全方位守护</p>
          </div>
        </div>
        <div className="principle-card">
          <span className="principle-icon">🧠</span>
          <div>
            <h4>AI 意图审查</h4>
            <p>智能解析操作意图，识别潜在风险操作</p>
          </div>
        </div>
      </div>

      {/* Run Check Button */}
      <button
        className="btn-run-check"
        onClick={runDemoCheck}
        disabled={isChecking}
      >
        {isChecking ? (
          <>
            <span className="spinner" />
            安风正在扫描...
          </>
        ) : (
          <>
            🛡️ 运行安全检查
          </>
        )}
      </button>

      {/* Security Report */}
      {report && (
        <div className="security-report">
          <div className="report-header">
            <h3>安全检查报告</h3>
            <RiskLevelIndicator level={report.overallLevel} />
          </div>
          <div className="report-summary">
            <span className={`report-status ${report.canProceed ? 'safe' : 'unsafe'}`}>
              {report.canProceed ? '✅ 可以继续' : '🛑 建议停止'}
            </span>
            <span className="report-time">
              {new Date(report.timestamp).toLocaleTimeString('zh-CN')}
            </span>
          </div>
          <div className="report-checks">
            {report.checks.map((check) => (
              <RiskAlert key={check.id} check={check} />
            ))}
          </div>
        </div>
      )}

      {/* Security Tips */}
      <div className="security-tips">
        <h3>安全小贴士</h3>
        <div className="tip-item">
          <span className="tip-number">1</span>
          <p>永远不要将助记词告诉任何人，包括客服人员</p>
        </div>
        <div className="tip-item">
          <span className="tip-number">2</span>
          <p>质押前务必确认合约地址与官方一致</p>
        </div>
        <div className="tip-item">
          <span className="tip-number">3</span>
          <p>定期检查已授权的合约，撤销不再使用的授权</p>
        </div>
        <div className="tip-item">
          <span className="tip-number">4</span>
          <p>大额操作前先在测试网验证流程</p>
        </div>
        <div className="tip-item">
          <span className="tip-number">5</span>
          <p>保持钱包软件更新，使用最新安全补丁</p>
        </div>
      </div>
    </div>
  );
}
