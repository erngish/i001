# 蒲风·安栈 | PuffGuard Safe Stack — 提交材料

## 项目简介（中文）

**蒲风·安栈**（PuffGuard Safe Stack）是一款安全优先的 imToken 风格 Puffer 质押 Mini App，深度融合 imToken 安全设计理念与 Puffer 协议生态。用户通过自然语言或一键操作完成 ETH/stETH/wstETH 质押铸造 pufETH，过程中「安风守护」AI 系统进行多层深度安全检查和风险提示，强烈体现「你的钱包你掌控」和安全质押理念。

名称寓意：**蒲**（Puffer）+ **风**（安全守护之风，蒲公英飘散的安全理念）+ **安栈**（安全驿站，质押的安全港湾）

## Project Introduction (English)

**PuffGuard Safe Stack** is a security-first imToken-style Puffer staking Mini App that deeply integrates imToken's security design philosophy with the Puffer protocol ecosystem. Users can stake ETH/stETH/wstETH to mint pufETH through natural language or one-click operations, while the "Guardian Wind" AI system performs multi-layer deep security checks and risk alerts throughout the process, strongly embodying the "Your Wallet, Your Control" and secure staking philosophy.

The name combines "Puff" (Puffer) + "Wind" (the guardian wind of security, inspired by dandelion seeds spreading safety) + "Safe Stack" (a secure harbor for staking).

---

## 创作笔记

### 1. Token Core 使用

Token Core（https://github.com/consenlabs/token-core-monorepo）是 imToken 的钱包核心库，提供了密钥管理、交易签名等底层能力。在本项目中，我们参考了 Token Core 的设计理念：

- **自托管签名**：所有交易签名在用户设备本地完成，私钥永不离开钱包应用。我们通过 ethers.js 的 BrowserProvider + Signer 实现了与 Token Core 相同的自托管签名模式。
- **密钥管理安全**：参考 Token Core 的密钥派生和存储方案，在演示环境中严格限制助记词输入，并通过 SafetyBanner 组件持续提醒用户不要在演示环境输入真实助记词。
- **多链支持**：Token Core 支持多链架构，我们同样设计了多网络配置（Mainnet/Sepolia/Holesky），通过 chainId 识别和切换网络。

### 2. Puffer SDK 使用

我们集成了 @pufferfinance/puffer-sdk（v1.31.0）和 Puffer API v2：

- **API 集成**：通过 `https://api-v2.puffer.fi/imtoken-hackathon` 端点获取实时数据：
  - `/pufeth/rate` — pufETH/ETH 汇率
  - `/vaults/apy` — UniFi Vault APY 数据
  - `/vaults/tvl` — Vault TVL 数据
  - `/protocol/tvl` — 协议总 TVL
  - `/tokens/prices` — 代币价格
- **合约交互**：使用 ethers.js 直接与 PufferVault 合约交互，支持 ETH 直接质押和 ERC20（stETH/wstETH）质押。
- **容错设计**：API 调用失败时使用合理的 fallback 数据，确保演示体验流畅。

### 3. 安全设计（核心亮点）

安全是本项目的灵魂，我们深度融入了 Token UI Security 材料的安全检查逻辑：

#### 3.1 六层安全检查体系

| 层级 | 检查项 | 说明 |
|------|--------|------|
| 1 | 合约验证状态 | 确认目标合约已在 Etherscan/Sourcify 验证源码 |
| 2 | 审计状态 | 确认合约经过专业安全审计（Trail of Bits 等） |
| 3 | 授权风险 | 检查 ERC20 授权额度，防止过度授权 |
| 4 | 钓鱼防护 | 合约地址与官方地址比对，检测地址混淆 |
| 5 | 金额安全 | 大额操作预警、余额保留提醒 |
| 6 | 网络环境 | 测试网/主网识别、链 ID 验证 |

#### 3.2 风险分级响应

- **信息（Info）**：正常状态，绿色提示
- **警告（Warning）**：需注意，黄色提示
- **危险（Danger）**：高风险，红色提示，建议停止
- **阻止（Block）**：极高风险，禁止继续

#### 3.3 AI 意图安全分析

用户输入自然语言（如"质押 0.01 ETH"）时，系统会：
1. 解析操作意图（质押/赎回）
2. 识别代币类型（ETH/stETH/wstETH）
3. 提取金额
4. 检测潜在风险（全部质押、大额操作等）
5. 给出置信度评分

#### 3.4 安全原则（参考 Token UI Security SKILL.md）

- **原则一：不信任，要验证** — 所有合约地址必须与官方白名单比对
- **原则二：最小授权** — 仅授权必要的交易金额，不使用无限授权
- **原则三：透明可审计** — 每次操作生成完整安全检查报告
- **原则四：用户掌控** — 自托管签名，私钥永不离开设备
- **原则五：渐进式安全** — 根据风险等级渐进提示，不一刀切

### 4. 迭代过程

#### v0.1 — 项目初始化
- 搭建 Vite + React + TypeScript 项目骨架
- 集成 ethers.js、Puffer SDK、Puffer API
- 实现基础钱包连接和余额查询

#### v0.2 — 质押流程
- 实现 ETH/stETH/wstETH → pufETH 质押流程
- 添加实时汇率和 APY 显示
- 实现自然语言意图解析

#### v0.3 — 安全守护系统
- 参考 Token UI Security 材料实现六层安全检查
- 添加风险分级响应系统
- 实现 AI 意图安全分析
- 添加 SafetyBanner 和 RiskAlert 组件

#### v0.4 — 仪表盘与视觉
- 实现 pufETH 余额、收益预估、质押历史
- 添加收益趋势图
- 实现 imToken 风格 UI + 蒲公英/风元素视觉

#### v1.0 — 完整版本
- 代码审查和 TypeScript 类型修复
- 确保 `npm run build` 成功
- 添加完整文档和提交材料

---

## 技术栈

- **框架**：Vite + React 18 + TypeScript
- **Web3**：ethers.js v6
- **协议**：@pufferfinance/puffer-sdk v1.31.0
- **API**：Puffer API v2 (imtoken-hackathon endpoint)
- **状态管理**：React Context + useReducer
- **样式**：CSS Custom Properties (imToken Design Tokens)
- **动画**：CSS Keyframes (蒲公英飘散/风元素)

## 安全铁律

1. 所有演示优先用测试网，明确标注安全边界
2. 大量真实融入 Token UI Security 材料的安全检查逻辑
3. 绝不误导用户暴露助记词
4. 自托管签名，私钥永不离开用户设备
5. 每次质押操作前强制执行安全检查
