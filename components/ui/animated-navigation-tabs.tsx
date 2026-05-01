"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AnimatedNavigationTabs({ items }: Props) {
  const [active, setActive] = useState<Props>(items[0]);
  const [isHover, setIsHover] = useState<Props | null>(null);
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
    window.location.href = "/auth/login";
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
                      href="/auth/login"
                      className={cn(
                        "px-5 py-2 relative duration-300 transition-colors hover:!text-primary",
                        active.id === item.id ? "text-primary" : "text-muted-foreground"
                      )}
                      onClick={() => setActive(item)}
                      onMouseEnter={() => setIsHover(item)}
                      onMouseLeave={() => setIsHover(null)}
                    >
                      登录
                      {isHover?.id === item.id && (
                        <motion.div
                          layoutId="hover-bg-auth"
                          className="absolute bottom-0 left-0 right-0 w-full h-full bg-primary/10"
                          style={{ borderRadius: 6 }}
                        />
                      )}
                      {active.id === item.id && (
                        <motion.div
                          layoutId="active-auth"
                          className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                        />
                      )}
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      className={cn(
                        "px-5 py-2 relative duration-300 transition-colors hover:!text-primary",
                        active.id === item.id + 1 ? "text-primary" : "text-muted-foreground"
                      )}
                      onClick={() => setActive({ ...item, id: item.id + 1 })}
                      onMouseEnter={() => setIsHover({ ...item, id: item.id + 1 })}
                      onMouseLeave={() => setIsHover(null)}
                    >
                      注册
                      {isHover?.id === item.id + 1 && (
                        <motion.div
                          layoutId="hover-bg-auth"
                          className="absolute bottom-0 left-0 right-0 w-full h-full bg-primary/10"
                          style={{ borderRadius: 6 }}
                        />
                      )}
                      {active.id === item.id + 1 && (
                        <motion.div
                          layoutId="active-auth"
                          className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                        />
                      )}
                    </Link>
                  </div>
                )
              ) : (
                <button
                  className={cn(
                    "px-5 py-2 relative duration-300 transition-colors hover:!text-primary",
                    active.id === item.id ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setActive(item)}
                  onMouseEnter={() => setIsHover(item)}
                  onMouseLeave={() => setIsHover(null)}
                >
                  {item.tile}
                  {isHover?.id === item.id && (
                    <motion.div
                      layoutId="hover-bg"
                      className="absolute bottom-0 left-0 right-0 w-full h-full bg-primary/10"
                      style={{
                        borderRadius: 6,
                      }}
                    />
                  )}
                  {active.id === item.id && (
                    <motion.div
                      layoutId="active"
                      className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                    />
                  )}
                  {isHover?.id === item.id && (
                    <motion.div
                      layoutId="hover"
                      className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                    />
                  )}
                </button>
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
  isAuth?: boolean;
};
