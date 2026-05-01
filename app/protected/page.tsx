import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Plus, CreditCard } from "lucide-react";

export default function ProtectedPage() {
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
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">5</span>
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
          <Button size="lg" className="w-full md:w-auto">
            <Sparkles className="w-4 h-4 mr-2" />
            生成图像
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">我的创作</h2>
          <Card className="aspect-video max-w-2xl w-full">
            <CardContent className="flex items-center justify-center h-full p-0">
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Sparkles className="w-8 h-8" />
                <span className="text-sm">暂无图像</span>
                <span className="text-xs">生成你的第一张图像</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}