"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Plus, CreditCard, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MyGallery } from "@/components/ui/my-gallery";
import { PaymentDialog } from "@/components/ui/payment-dialog";
import { PaymentResultDialog } from "@/components/ui/payment-result-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface HistoryItem {
  id: string;
  prompt: string;
  image_urls: string[];
  credits_used: number;
  created_at: string;
}

function ProtectedContent() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentResultOpen, setPaymentResultOpen] = useState(false);
  const [outTradeNo, setOutTradeNo] = useState<string | null>(null);

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

  useEffect(() => {
    const tradeNo = searchParams.get("out_trade_no");
    const result = searchParams.get("result");

    if (tradeNo && result === "1") {
      setOutTradeNo(tradeNo);
      setPaymentResultOpen(true);
    }
  }, [searchParams]);

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

  const handlePaymentSuccess = (newCredits: number) => {
    setCredits(newCredits);
    setPaymentResultOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("out_trade_no");
    url.searchParams.delete("result");
    window.history.replaceState({}, "", url.toString());
  };

  const handlePaymentResultClose = () => {
    setPaymentResultOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("out_trade_no");
    url.searchParams.delete("result");
    window.history.replaceState({}, "", url.toString());
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
              {/* <Button variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button> */}
              <Button onClick={() => setPaymentDialogOpen(true)}>
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
          <h2 className="text-xl font-semibold mb-4">我的图库</h2>
          <MyGallery history={history} isLoading={isLoading} />
        </div>
      </div>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onPaymentSuccess={(newCredits) => setCredits(newCredits)}
      />

      <PaymentResultDialog
        open={paymentResultOpen}
        outTradeNo={outTradeNo}
        onOpenChange={setPaymentResultOpen}
        onSuccess={handlePaymentSuccess}
        onClose={handlePaymentResultClose}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-4 items-center">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="h-12 w-full md:w-48" />
        </div>
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProtectedContent />
    </Suspense>
  );
}