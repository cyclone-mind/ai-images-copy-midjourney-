import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Support() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <Badge variant="outline">支持中心</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl tracking-tighter font-regular text-center">
            我们随时为你提供帮助
          </h1>
          <p className="text-xl leading-relaxed tracking-tight text-muted-foreground text-center">
            找到常见问题的答案，或联系我们的支持团队获取帮助。
          </p>

          <div className="mt-8 flex flex-col gap-6">
            <h2 className="text-2xl font-semibold">常见问题</h2>
            <div className="flex flex-col gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">如何开始使用文生图功能？</h3>
                <p className="text-muted-foreground">只需注册账号并登录，然后在生成页面输入你的文字描述，点击生成按钮即可创建图像。</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">生成图片需要多长时间？</h3>
                <p className="text-muted-foreground">通常在几秒钟内即可完成生成，具体时间取决于图片复杂度和服务器负载。</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">生成的图片可以商用吗？</h3>
                <p className="text-muted-foreground">是的，您拥有生成图片的完全使用权，可用于个人和商业项目。</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">如何联系人工客服？</h3>
                <p className="text-muted-foreground">您可以通过页面底部的联系方式或发送邮件至 support@example.com 获取帮助。</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center mt-8">
            <p className="text-muted-foreground">还有其他问题？</p>
            <Button asChild size="lg">
              <Link href="/sign-in">联系我们</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Support };