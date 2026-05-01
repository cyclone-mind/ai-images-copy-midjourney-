"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "@/components/ui/image-preview";
import { Sparkles, Plus, CreditCard, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface HistoryItem {
  id: string;
  prompt: string;
  image_urls: string[];
  credits_used: number;
  created_at: string;
}

export default function ProtectedPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const supabase = createClient();

  const fetchCredits = useCallback(async () => {
    try {
      const response = await fetch("/api/credits");
      const data = await response.json();
      if (response.ok) {
        setCredits(data.credits);
      }
    } catch (err) {
      console.error("Failed to fetch credits:", err);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch("/api/history");
      const data = await response.json();
      if (response.ok) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }, []);

  const loadUserData = useCallback(async () => {
    setIsInitialLoading(true);
    await Promise.all([fetchCredits(), fetchHistory()]);
    setIsInitialLoading(false);
  }, [fetchCredits, fetchHistory]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("请输入图像描述");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/image-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成图片时发生错误");
      }

      if (data.imageUrls && data.imageUrls.length > 0) {
        setImageUrls(data.imageUrls);
        setCredits(data.remainingCredits ?? credits - 1);
        await fetchHistory();
      } else {
        throw new Error("生成失败，未返回图片");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成图片时发生错误");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">AI 图像生成</h1>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="描述你想要生成的图像..."
                className="h-12 text-lg"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">{isInitialLoading ? "..." : credits}</span>
                <span className="text-muted-foreground text-sm">点数</span>
              </div>
              <Button variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
              <Button>
                <CreditCard className="w-4 h-4 mr-2" />
                充值
              </Button>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          <Button
            size="lg"
            className="w-full md:w-auto"
            onClick={handleGenerate}
            disabled={isLoading || isInitialLoading}
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                生成图像
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">我的创作</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="aspect-video">
                  <CardContent className="flex items-center justify-center h-full p-0">
                    <div className="w-full h-full bg-muted animate-pulse rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : imageUrls.length > 0 ? (
            <div className="w-full max-w-2xl">
              <ImageGallery
                images={imageUrls}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              />
            </div>
          ) : history.length > 0 ? (
            <div className="w-full max-w-2xl">
              <ImageGallery
                images={history[0].image_urls}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              />
            </div>
          ) : (
            <Card className="aspect-video max-w-2xl w-full">
              <CardContent className="flex items-center justify-center h-full p-0">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Sparkles className="w-8 h-8" />
                  <span className="text-sm">暂无图像</span>
                  <span className="text-xs">生成你的第一张图像</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}