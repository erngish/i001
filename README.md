# 蒲风·安栈 | PuffGuard Safe Stack

> 安全优先的 imToken 风格 Puffer 质押 Mini App  
> imToken 10周年 AI 共创活动 + Puffer 合作伙伴赛道参赛作品

## 🌬️ 项目简介

**蒲风·安栈**（PuffGuard Safe Stack）是一款以安全为核心的 Puffer 质押工具，深度融合 imToken 安全设计理念与 Puffer 协议生态。用户通过自然语言或一键操作完成 ETH/stETH/wstETH 质押铸造 pufETH，过程中「安风守护」AI 系统进行多层深度安全检查和风险提示，强烈体现「你的钱包你掌控」和安全质押理念。

名称寓意：**蒲**（Puffer）+ **风**（安全守护之风，蒲公英飘散的安全理念）+ **安栈**（安全驿站，质押的安全港湾）

## ✨ 核心功能

### 1. 钱包集成
- MetaMask / Web3 钱包连接
- 助记词导入（仅限测试网演示）
- ETH / pufETH 余额实时显示
- 多网络支持（Mainnet / Sepolia / Holesky）

### 2. Puffer 质押流程
- 支持 ETH / stETH / wstETH 质押铸造 pufETH
- 实时汇率显示（pufETH/ETH 兑换率）
- APY 收益展示
- UniFi Vault 机会一览
- 自然语言意图解析：「质押 0.01 ETH」→ 自动填充

### 3. 安全守护系统（核心亮点）
- **合约验证检查**：确认目标合约已在 Etherscan 验证
- **审计状态检查**：确认合约经过专业安全审计
- **授权风险检查**：检测 ERC20 授权额度是否合理
- **金额安全检查**：大额操作预警、余额保留提醒
- **网络环境检查**：测试网/主网识别、链 ID 验证
- **钓鱼防护检查**：合约地址与官方地址比对
- **AI 意图安全分析**：自然语言输入风险识别
- 安全检查报告：综合风险评级（信息/警告/危险/阻止）

### 4. 仪表盘
- pufETH 余额与 ETH 估值
- 收益预估（日/月/年）
- 收益趋势图
- 质押历史记录

### 5. 安全设计
- 所有演示优先使用测试网
- 明确标注安全边界和风险提示
- 绝不误导用户暴露助记词
- 深度融入 Token UI Security 材料的安全检查逻辑

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────┐
│                   UI Layer                    │
│  React + TypeScript + CSS (imToken Style)     │
├─────────────────────────────────────────────┤
│              Component Layer                  │
│  WalletPanel / StakePanel / DashboardPanel    │
│  SecurityPanel / RiskAlert / SafetyBanner     │
├─────────────────────────────────────────────┤
│               Service Layer                   │
│  WalletService / PufferApiService             │
│  SecurityService (AI Intent + Multi-check)    │
├─────────────────────────────────────────────┤
│              Integration Layer                │
│  ethers.js v6 / @pufferfinance/puffer-sdk     │
│  Puffer API v2 / Token Core Design Patterns   │
├─────────────────────────────────────────────┤
│               Chain Layer                     │
│  Ethereum Mainnet / Sepolia / Holesky         │
│  PufferVault / pufETH / UniFi Vaults          │
└─────────────────────────────────────────────┘
```

## 📁 项目结构

```
puffguard/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/          # ToastContainer
│   │   ├── dashboard/       # DashboardPanel
│   │   ├── layout/          # Layout, Header, BottomNav
│   │   ├── security/        # SecurityPanel, RiskAlert, SafetyBanner
│   │   ├── stake/           # StakePanel
│   │   └── wallet/          # WalletPanel
│   ├── hooks/
│   │   ├── useWallet.ts     # 钱包连接/断开/余额
│   │   └── usePufferData.ts # Puffer API 数据获取
│   ├── services/
│   │   ├── puffer-api.ts    # Puffer API v2 集成
│   │   ├── security.ts      # 安全检查服务
│   │   └── wallet.ts        # 钱包交互服务
│   ├── store/
│   │   └── app-context.tsx  # 全局状态管理
│   ├── types/
│   │   └── index.ts         # TypeScript 类型定义
│   ├── utils/
│   │   ├── constants.ts     # 合约地址/网络配置/安全常量
│   │   └── helpers.ts       # 工具函数
│   ├── styles/
│   │   └── globals.css      # 全局样式 + imToken 设计令牌
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npx tsc --noEmit

# 代码检查
npm run lint
```

## 🌐 部署

### Vercel 部署

1. Fork 本仓库到你的 GitHub
2. 在 Vercel 中导入项目
3. Framework Preset 选择 `Vite`
4. 点击 Deploy

### 手动部署

```bash
npm run build
# dist/ 目录即为可部署的静态文件
```

## 🔐 安全说明

- **演示模式**：默认使用 Sepolia 测试网，请勿输入真实助记词
- **自托管签名**：所有交易签名在用户设备本地完成，私钥永不离开钱包
- **多层安全检查**：质押前强制执行 6 层安全检查
- **风险分级**：信息 → 警告 → 危险 → 阻止，四级风险响应
- **合约验证**：仅与已验证、已审计的 Puffer 官方合约交互

## 📚 参考材料

- [Token Core](https://github.com/consenlabs/token-core-monorepo) - 钱包核心库
- [Token UI](https://github.com/consenlabs/token-ui) - UI 组件库 + Security 设计
- [Puffer SDK](https://www.npmjs.com/package/@pufferfinance/puffer-sdk) - Puffer 协议 SDK
- [Puffer API v2](https://api-v2.puffer.fi/imtoken-hackathon) - Puffer REST API
- [Puffer Hackathon 示例](https://github.com/PufferFinance/puffer-imtoken-hackathon) - 官方示例仓库

## 📝 License

MIT
