import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AnimatedNavigationTabs } from "@/components/ui/animated-navigation-tabs";
import "./globals.css";

const NAV_ITEMS = [
  { id: 1, tile: "首页", href: "/" },
  { id: 2, tile: "关于", href: "/about" },
  { id: 3, tile: "支持", href: "/support" },
  { id: 4, tile: "登陆", href: "/auth/sign-in", isAuth: true },
];

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatedNavigationTabs items={NAV_ITEMS} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
