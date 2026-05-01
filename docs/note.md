# 项目踩坑记录

## 1. AnimatedNavigationTabs 组件需要 "use client" 指令

**问题**：组件使用 `useState`，但在 Server Component 中使用
**解决**：在组件文件顶部添加 `"use client";`

## 2. 认证中间件拦截了 /about 和 /support 页面

**问题**：点击"关于"和"支持"被重定向到 `/auth/login`
**原因**：`lib/supabase/proxy.ts` 中的认证检查逻辑拦截了所有非白名单路径
**解决**：将 `/about` 和 `/support` 添加到白名单

## 3. Hydration 不匹配警告

**问题**：浏览器扩展（uplog_extension）在 `<body>` 注入属性，导致 SSR/CSR 不一致
**解决**：在 `<body>` 标签添加 `suppressHydrationWarning`

## 4. 路由分组 (Route Group) 去除 /auth 前缀

**问题**：需要 `/auth/sign-in` 变成 `/sign-in`
**解决**：将 `app/auth` 重命名为 `app/(auth)`，URL 不再包含 `/auth` 前缀

## 5. 布局解耦 - 导航栏只在营销页面显示

**问题**：认证页面不需要导航栏
**解决**：

- 根 `app/layout.tsx` 移除导航组件
- 创建 `app/(marketing)/layout.tsx` 放置导航组件

## 6. Next.js Image 组件优化

**问题**：缺少 `sizes` 和 `priority` 属性导致性能问题
**解决**：

- 添加 `sizes="(max-width: 768px) 100vw, 50vw"` 防止下载过大图片
- 为首屏图片添加 `priority` 属性提升 LCP

## 7. 客户端组件无法访问服务端环境变量

**问题**：MiniMax API Key (`MINIMAX_APIKEY`) 在客户端组件中无法读取
**原因**：不带 `NEXT_PUBLIC_` 前缀的环境变量无法在客户端访问
**解决**：创建 API Route (`/api/image-generation`) 在服务端调用 MiniMax API

## 8. Next.js Image 域名未配置

**问题**：`next/image` 组件的 `src` 域名未在 `next.config.ts` 中配置
**解决**：添加 `remotePatterns` 配置：

```ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "hailuo-image-algeng-data.oss-cn-wulanchabu.aliyuncs.com",
    },
  ],
},
```

## 9. Image fill 属性需要父元素 position 支持

**问题**：使用 `fill` 属性时父元素 position 不能是 static
**解决**：为父元素添加 `relative` 类
