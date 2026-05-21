import { useState, useCallback } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { usePufferData } from '@/hooks/usePufferData';
import { useAppState } from '@/store/app-context';
import { securityService } from '@/services/security';
import { walletService } from '@/services/wallet';
import { formatEth, formatApy, generateId, parseEthAmount } from '@/utils/helpers';
import { SAFETY, CONTRACTS } from '@/utils/constants';
import { RiskAlert } from '@/components/security/RiskAlert';
import type { StakeToken, SecurityReport } from '@/types';
import './StakePanel.css';

const TOKENS: { key: StakeToken; label: string; icon: string }[] = [
  { key: 'ETH', label: 'ETH', icon: '⟠' },
  { key: 'stETH', label: 'stETH', icon: '🥩' },
  { key: 'wstETH', label: 'wstETH', icon: '📦' },
];

export function StakePanel() {
  const { wallet, isConnected, connect, addToast } = useWallet();
  const { pufEthRate, protocolTvl, vaultApys } = usePufferData();
  const { state, dispatch } = useAppState();

  const [selectedToken, setSelectedToken] = useState<StakeToken>('ETH');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'review' | 'security' | 'signing' | 'done'>('input');
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
  const [txHash, setTxHash] = useState('');
  const [intentInput, setIntentInput] = useState('');
  const [showIntent, setShowIntent] = useState(false);

  const estimatedPufEth = pufEthRate && amount
    ? (parseFloat(amount) * parseFloat(pufEthRate.pufEthPerEth)).toFixed(6)
    : '0';

  const handleIntentParse = useCallback(async () => {
    if (!intentInput.trim()) return;
    try {
      const result = await securityService.parseIntent(intentInput);
      if (result.understood) {
        setSelectedToken(result.token);
        if (result.amount && result.amount !== '0') {
          setAmount(result.amount);
        }
        if (result.warnings.length > 0) {
          result.warnings.forEach((w: string) => {
            addToast({
              id: generateId(),
              type: 'warning',
              title: '意图解析警告',
              description: w,
            });
          });
        }
        addToast({
          id: generateId(),
          type: 'success',
          title: '意图已解析',
          description: `操作：质押 ${result.amount} ${result.token}（置信度 ${Math.round(result.confidence * 100)}%）`,
        });
        setShowIntent(false);
      } else {
        addToast({
          id: generateId(),
          type: 'warning',
          title: '无法理解意图',
          description: '请尝试："质押 0.01 ETH" 或 "stake 0.01 ETH"',
        });
      }
    } catch {
      addToast({
        id: generateId(),
        type: 'error',
        title: '意图解析失败',
        description: '请稍后重试',
      });
    }
  }, [intentInput, addToast]);

  const handleSecurityCheck = useCallback(async () => {
    setStep('security');
    try {
      const report = await securityService.runSecurityCheck(selectedToken, amount);
      setSecurityReport(report);
      dispatch({ type: 'SET_SECURITY_REPORT', payload: report });
    } catch {
      addToast({
        id: generateId(),
        type: 'error',
        title: '安全检查失败',
        description: '请稍后重试',
      });
      setStep('review');
    }
  }, [selectedToken, amount, dispatch, addToast]);

  const handleStake = useCallback(async () => {
    if (!isConnected) {
      connect();
      return;
    }

    setStep('signing');
    dispatch({ type: 'SET_STAKING', payload: true });

    try {
      const result = await walletService.stake(selectedToken, amount);
      setTxHash(result.txHash);
      setStep('done');

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          hash: result.txHash,
          type: 'stake',
          token: selectedToken,
          amount,
          pufEthReceived: estimatedPufEth,
          timestamp: Date.now(),
          status: 'confirmed',
          blockNumber: result.blockNumber,
        },
      });

      addToast({
        id: generateId(),
        type: 'success',
        title: '质押成功！',
        description: `已质押 ${amount} ${selectedToken}，获得 ${estimatedPufEth} pufETH`,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '质押失败';
      addToast({
        id: generateId(),
        type: 'error',
        title: '质押失败',
        description: msg,
      });
      setStep('review');
    } finally {
      dispatch({ type: 'SET_STAKING', payload: false });
    }
  }, [isConnected, selectedToken, amount, estimatedPufEth, connect, dispatch, addToast]);

  if (!isConnected) {
    return (
      <div className="stake-panel">
        <div className="stake-connect-prompt">
          <h3>连接钱包开始质押</h3>
          <p>安全连接你的钱包，即可开始 Puffer 质押</p>
          <button className="btn-primary" onClick={connect}>
            🔗 连接钱包
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stake-panel">
      {/* Step: Input */}
      {step === 'input' && (
        <div className="stake-input animate-fade-in">
          <div className="stake-header">
            <h2>质押铸造 pufETH</h2>
            <p>将 ETH / stETH / wstETH 质押到 Puffer 协议，铸造 pufETH</p>
          </div>

          {/* AI Intent Input */}
          <div className="intent-section">
            <button
              className="btn-intent-toggle"
              onClick={() => setShowIntent(!showIntent)}
            >
              🧠 AI 意图输入
            </button>
            {showIntent && (
              <div className="intent-input-area animate-slide-up">
                <div className="intent-hint">
                  试试说："质押 0.01 ETH" 或 "stake 0.005 stETH"
                </div>
                <div className="intent-input-row">
                  <input
                    type="text"
                    className="intent-input"
                    placeholder="用自然语言描述你的质押意图..."
                    value={intentInput}
                    onChange={(e) => setIntentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleIntentParse()}
                  />
                  <button className="btn-intent-go" onClick={handleIntentParse}>
                    解析
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Token Selection */}
          <div className="token-selector">
            <label>选择质押代币</label>
            <div className="token-options">
              {TOKENS.map((t) => (
                <button
                  key={t.key}
                  className={`token-option ${selectedToken === t.key ? 'active' : ''}`}
                  onClick={() => setSelectedToken(t.key)}
                >
                  <span className="token-icon">{t.icon}</span>
                  <span className="token-name">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="amount-input-section">
            <label>质押数量</label>
            <div className="amount-input-row">
              <input
                type="number"
                className="amount-input"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.001"
              />
              <span className="amount-suffix">{selectedToken}</span>
            </div>
            <div className="amount-info">
              <span>余额: {formatEth(wallet.balance)} {selectedToken}</span>
              <button className="btn-max" onClick={() => {
                const maxAmount = Math.max(0, parseFloat(wallet.balance) - 0.01);
                setAmount(maxAmount.toFixed(6));
              }}>
                MAX
              </button>
            </div>
            {SAFETY.isDemo && parseFloat(amount) > parseFloat(SAFETY.maxStakeAmount) && (
              <div className="amount-warning">
                ⚠️ 演示模式建议不超过 {SAFETY.maxStakeAmount} ETH
              </div>
            )}
          </div>

          {/* Rate Preview */}
          <div className="rate-preview">
            <div className="rate-row">
              <span>汇率</span>
              <span>1 ETH ≈ {pufEthRate?.pufEthPerEth || '0.959'} pufETH</span>
            </div>
            <div className="rate-row">
              <span>预计获得</span>
              <span className="rate-highlight">{estimatedPufEth} pufETH</span>
            </div>
            <div className="rate-row">
              <span>当前 APY</span>
              <span className="rate-apy">
                {protocolTvl ? formatApy(protocolTvl.pufEthStakingApy) : '4.80%'}
              </span>
            </div>
          </div>

          {/* UniFi Vault Opportunities */}
          {vaultApys.length > 0 && (
            <div className="vault-opportunities">
              <h3>UniFi Vault 机会</h3>
              {vaultApys.map((vault) => (
                <div key={vault.vault} className="vault-item">
                  <div className="vault-info">
                    <span className="vault-name">{vault.vault}</span>
                    <span className="vault-apy">{formatApy(vault.apy30d)} APY</span>
                  </div>
                  <div className="vault-apy-detail">
                    <span>7d: {formatApy(vault.apy7d)}</span>
                    <span>30d: {formatApy(vault.apy30d)}</span>
                    <span>60d: {formatApy(vault.apy60d)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Continue Button */}
          <button
            className="btn-primary btn-continue"
            onClick={() => setStep('review')}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            继续 → 安全审查
          </button>
        </div>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className="stake-review animate-fade-in">
          <h2>交易确认</h2>
          <p>请仔细核对以下信息，确认后将进行安全检查</p>

          <div className="review-card">
            <div className="review-row">
              <span>操作</span>
              <span>质押</span>
            </div>
            <div className="review-row">
              <span>代币</span>
              <span>{selectedToken}</span>
            </div>
            <div className="review-row">
              <span>数量</span>
              <span className="review-amount">{amount} {selectedToken}</span>
            </div>
            <div className="review-row">
              <span>预计获得</span>
              <span className="review-pufeth">{estimatedPufEth} pufETH</span>
            </div>
            <div className="review-row">
              <span>目标合约</span>
              <span className="review-contract">{CONTRACTS.PufferVault.slice(0, 10)}...</span>
            </div>
            <div className="review-row">
              <span>网络</span>
              <span>{SAFETY.isDemo ? 'Sepolia 测试网' : 'Ethereum 主网'}</span>
            </div>
          </div>

          <div className="review-actions">
            <button className="btn-secondary" onClick={() => setStep('input')}>
              ← 返回修改
            </button>
            <button className="btn-primary" onClick={handleSecurityCheck}>
              🛡️ 安全检查
            </button>
          </div>
        </div>
      )}

      {/* Step: Security Check */}
      {step === 'security' && securityReport && (
        <div className="stake-security animate-fade-in">
          <h2>🛡️ 安风守护检查</h2>
          <p>安全检查已完成，请查看以下报告</p>

          <div className={`security-verdict ${securityReport.canProceed ? 'safe' : 'unsafe'}`}>
            {securityReport.canProceed ? (
              <><span className="verdict-icon">✅</span> 安全检查通过，可以继续</>
            ) : (
              <><span className="verdict-icon">🛑</span> 发现风险，建议停止操作</>
            )}
          </div>

          <div className="security-checks-list">
            {securityReport.checks.map((check) => (
              <RiskAlert key={check.id} check={check} />
            ))}
          </div>

          <div className="security-actions">
            <button className="btn-secondary" onClick={() => setStep('review')}>
              ← 返回
            </button>
            {securityReport.canProceed ? (
              <button className="btn-primary btn-stake-confirm" onClick={handleStake}>
                ✅ 确认质押
              </button>
            ) : (
              <button className="btn-danger-outline" onClick={() => setStep('input')}>
                取消操作
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step: Signing */}
      {step === 'signing' && (
        <div className="stake-signing animate-fade-in">
          <div className="signing-animation">
            <div className="signing-ring" />
            <span className="signing-icon">🔐</span>
          </div>
          <h2>等待签名确认</h2>
          <p>请在钱包中确认交易签名</p>
          <p className="signing-hint">
            💡 私钥永不离开你的设备，签名在本地完成
          </p>
        </div>
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <div className="stake-done animate-fade-in">
          <div className="done-icon">🎉</div>
          <h2>质押成功！</h2>
          <div className="done-card">
            <div className="done-row">
              <span>质押数量</span>
              <span>{amount} {selectedToken}</span>
            </div>
            <div className="done-row">
              <span>获得 pufETH</span>
              <span className="done-pufeth">{estimatedPufEth} pufETH</span>
            </div>
            {txHash && (
              <div className="done-row">
                <span>交易哈希</span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="done-tx-link"
                >
                  {txHash.slice(0, 10)}...→
                </a>
              </div>
            )}
          </div>
          <button className="btn-primary" onClick={() => {
            setStep('input');
            setAmount('');
            setSecurityReport(null);
            setTxHash('');
          }}>
            继续质押
          </button>
        </div>
      )}
    </div>
  );
}
