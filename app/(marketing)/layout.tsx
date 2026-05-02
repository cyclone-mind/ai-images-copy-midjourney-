import { ThemeProvider } from "@/components/providers/theme-provider";
import { AnimatedNavigationTabs } from "@/components/ui/animated-navigation-tabs";
import "../globals.css";

const NAV_ITEMS = [
  { id: 1, tile: "首页", href: "/" },
  { id: 2, tile: "关于", href: "/about" },
  { id: 3, tile: "支持", href: "/support" },
  { id: 4, tile: "联系", href: "/contact" },
  { id: 5, tile: "登陆", href: "/login", isAuth: true },
];

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <AnimatedNavigationTabs items={NAV_ITEMS} />
      {children}
    </ThemeProvider>
  );
}