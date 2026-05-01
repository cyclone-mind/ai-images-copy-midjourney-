# Copy Midjourney

AI 图像生成平台，支持 Midjourney 风格的图像生成功能。

## 功能特性

- **AI 图像生成** - 基于 MiniMax API 的图像生成服务
- **用户认证** - 邮箱注册登录，安全的会话管理
- **点数系统** - 用户点数控制，支持充值
- **支付集成** - 支持支付宝、微信支付
- **历史记录** - 查看过往生成记录
- **响应式设计** - 适配桌面端和移动端

## 技术栈

- **前端** - Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui
- **后端** - Next.js API Routes
- **数据库** - Supabase (PostgreSQL)
- **存储** - Supabase Storage
- **支付** - ZPay 支付接口

## 快速开始

### 1. 环境配置

复制 `.env.example` 为 `.env.local`，填写以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的Supabase公钥
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MiniMax API
MINIMAX_APIKEY=你的MiniMax API密钥

# ZPay 支付
ZPAY_PID=你的ZPay商户ID
ZPAY_KEY=你的ZPay密钥
```

### 2. 数据库初始化

在 Supabase SQL Editor 中依次执行 `sql/` 目录下的文件：

```bash
sql/01_create_credits_table.sql   # 点数表
sql/02_create_history_table.sql  # 历史记录表
sql/03_grant_initial_credits_trigger.sql  # 新用户初始点数
sql/04_credit_functions.sql       # 点数操作函数
sql/05_create_storage_bucket.sql  # 存储桶
sql/06_create_payment_orders_table.sql  # 支付订单表
```

### 3. 启动开发服务器

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 部署

### Vercel 部署

1. Fork 本项目
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

### Supabase 配置

确保在 Supabase Dashboard 中启用 Email Auth，并配置好 RLS 策略。

## 项目结构

```
app/
├── (auth)/           # 认证相关页面
│   ├── sign-in/
│   └── sign-up/
├── (marketing)/      # 营销页面
│   └── page.tsx
├── api/              # API 路由
│   ├── image-generation/
│   └── payment/
├── protected/        # 受保护页面
lib/
├── supabase/         # Supabase 客户端配置
└── payment.ts        # 支付签名工具
```

## 环境变量说明

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目地址 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase 公钥 |
| `NEXT_PUBLIC_APP_URL` | 应用 URL |
| `MINIMAX_APIKEY` | MiniMax API 密钥 |
| `ZPAY_PID` | ZPay 商户 ID |
| `ZPAY_KEY` | ZPay 密钥 |

## License

MIT
