"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface PaymentResultDialogProps {
  open: boolean;
  outTradeNo: string | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (credits: number) => void;
  onClose?: () => void;
}

type PaymentStatus = "pending" | "success" | "failed" | "timeout";

export function PaymentResultDialog({
  open,
  outTradeNo,
  onOpenChange,
  onSuccess,
  onClose,
}: PaymentResultDialogProps) {
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [credits, setCredits] = useState<number>(0);
  const [countdown, setCountdown] = useState(30);

  const checkPaymentStatus = useCallback(async () => {
    if (!outTradeNo) return false;

    try {
      const response = await fetch(`/api/payment/status?out_trade_no=${outTradeNo}`);
      const data = await response.json();

      if (response.ok && data.status) {
        setStatus(data.status === "success" ? "success" : "failed");
        setCredits(data.credits || 0);
        return data.status === "success";
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
    }
    return false;
  }, [outTradeNo]);

  useEffect(() => {
    if (!open || !outTradeNo) return;

    setStatus("pending");
    setCountdown(30);

    let pollInterval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const startPolling = async () => {
      const isSuccess = await checkPaymentStatus();
      if (isSuccess) {
        if (onSuccess) onSuccess(credits);
        return;
      }
      if (status === "failed") return;

      pollInterval = setTimeout(startPolling, 2000);
    };

    startPolling();

    countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimeout(pollInterval);
          clearInterval(countdownInterval);
          setStatus("timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(pollInterval);
      clearInterval(countdownInterval);
    };
  }, [open, outTradeNo, checkPaymentStatus, status, credits, onSuccess]);

  const handleClose = () => {
    setStatus("pending");
    setCountdown(30);
    onOpenChange(false);
    if (onClose) {
      onClose();
    }
  };

  const getStatusContent = () => {
    switch (status) {
      case "pending":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-lg font-medium">支付验证中...</p>
              <p className="text-sm text-muted-foreground mt-2">
                请完成支付后等待验证
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                剩余等待时间: {countdown} 秒
              </p>
            </div>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <div className="text-center">
              <p className="text-lg font-medium text-green-500">支付成功！</p>
              <p className="text-sm text-muted-foreground mt-2">
                已获得 {credits} 点数
              </p>
            </div>
            <Button onClick={handleClose} className="mt-4">
              开始使用
            </Button>
          </div>
        );
      case "failed":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <XCircle className="w-12 h-12 text-red-500" />
            <div className="text-center">
              <p className="text-lg font-medium text-red-500">支付失败</p>
              <p className="text-sm text-muted-foreground mt-2">
                如已付款，请联系客服处理
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={handleClose}>
                关闭
              </Button>
              <Button onClick={() => window.location.reload()}>
                重试
              </Button>
            </div>
          </div>
        );
      case "timeout":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <Clock className="w-12 h-12 text-yellow-500" />
            <div className="text-center">
              <p className="text-lg font-medium text-yellow-500">验证超时</p>
              <p className="text-sm text-muted-foreground mt-2">
                支付结果验证超时，请稍后刷新页面查看
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={handleClose}>
                关闭
              </Button>
              <Button onClick={() => window.location.reload()}>
                刷新页面
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>支付结果</DialogTitle>
        </DialogHeader>
        {getStatusContent()}
      </DialogContent>
    </Dialog>
  );
}