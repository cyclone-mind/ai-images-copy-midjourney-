import { Badge } from "@/components/ui/badge";

function About() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-8 max-w-3xl">
          <div>
            <Badge variant="outline">关于我们</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl tracking-tighter font-regular">
            用 AI 重新定义创意
          </h1>
          <p className="text-xl leading-relaxed tracking-tight text-muted-foreground">
            我们是一家专注于人工智能创意工具的科技公司。致力于将最前沿的 AI
            技术带入每个人的手中，让创意表达变得前所未有的简单。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold">愿景</h3>
              <p className="text-muted-foreground">
                让每个人都能轻松创作惊艳的视觉内容，无论你是否具备设计经验。
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold">技术</h3>
              <p className="text-muted-foreground">
                基于最先进的多模态 AI 模型，为用户提供极致的图像生成体验。
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold">团队</h3>
              <p className="text-muted-foreground">
                由来自顶级科技公司的工程师和设计师组成的多元化团队。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { About };