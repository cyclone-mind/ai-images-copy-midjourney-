"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess?: (credits: number) => void;
}

interface PaymentPackage {
  money: string;
  credits: number;
  label: string;
}

const PACKAGES: PaymentPackage[] = [
  { money: "1.00", credits: 1, label: "1 元 = 1 点数" },
  { money: "5.00", credits: 5, label: "5 元 = 5 点数" },
];

export function PaymentDialog({ open, onOpenChange, onPaymentSuccess }: PaymentDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState<PaymentPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!selectedPackage) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payment/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ money: selectedPackage.money }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "创建支付订单失败");
      }

      window.location.href = data.paymentUrl;

    } catch (err) {
      setError(err instanceof Error ? err.message : "支付失败");
      setIsLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSelectedPackage(null);
      setError(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            充值点数
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>选择充值套餐</Label>
            <div className="grid grid-cols-2 gap-3">
              {PACKAGES.map((pkg) => (
                <Card
                  key={pkg.money}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPackage?.money === pkg.money
                      ? "border-primary ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl font-bold text-primary">
                        {pkg.credits}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        点数
                      </span>
                      <span className="text-lg font-semibold">
                        ¥{pkg.money}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!selectedPackage || isLoading}
            onClick={handlePayment}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                创建订单中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                立即充值
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            点击充值即表示同意我们的服务条款
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}