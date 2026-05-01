"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AnimatedNavigationTabs({ items }: Props) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-center">
        <ul className="flex items-center justify-center">
          {items.map((item) => (
            <li key={item.id}>
              {item.isAuth ? (
                user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Hey, {user.email}</span>
                    <Button size="sm" variant="outline" onClick={logout}>Logout</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Link
                      href="/login"
                      className={cn(
                        "px-5 py-2 relative duration-300 transition-colors hover:!text-primary",
                        pathname === "/login" ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      登录
                      {pathname === "/login" && (
                        <motion.div
                          layoutId="active-auth"
                          className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                        />
                      )}
                    </Link>
                    <Link
                      href="/sign-up"
                      className={cn(
                        "px-5 py-2 relative duration-300 transition-colors hover:!text-primary",
                        pathname === "/sign-up" ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      注册
                      {pathname === "/sign-up" && (
                        <motion.div
                          layoutId="active-auth"
                          className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                        />
                      )}
                    </Link>
                  </div>
                )
              ) : (
                <Link
                  href={item.href || "/"}
                  className={cn(
                    "px-5 py-2 relative duration-300 transition-colors hover:!text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.tile}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="active"
                      className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                    />
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

type Props = {
  id: number;
  tile: string;
  href?: string;
  isAuth?: boolean;
};
