import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function Contact() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <Badge variant="outline">联系我们</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl tracking-tighter font-regular text-center">
            获取帮助
          </h1>
          <p className="text-xl leading-relaxed tracking-tight text-muted-foreground text-center">
            有问题或建议？我们很乐意听取您的意见。
          </p>

          <Card className="mt-8">
            <CardContent className="pt-6">
              <form className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input id="name" placeholder="您的姓名" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="subject">主题</Label>
                  <Input id="subject" placeholder="如何帮助您？" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="message">留言</Label>
                  <textarea
                    id="message"
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="请详细描述您的问题或建议..."
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  发送消息
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-muted-foreground">
            <p>或发送邮件至：support@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Contact };