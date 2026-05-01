import Image from "next/image";
import Link from "next/link";
import { MoveRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Hero() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">AI 驱动的创意工具</Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
                用文字描绘想象
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                只需输入一段描述文字，即可生成惊艳的图像作品。告别繁琐的设计流程，让 AI
                成为你的创意伙伴，快速将灵感变为现实。
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <Button size="lg" className="gap-4" variant="outline" asChild>
                <Link href="/login">
                  预约演示 <Sparkles className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" className="gap-4" asChild>
                <Link href="/login">
                  免费开始 <MoveRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="relative rounded-md aspect-square overflow-hidden">
              <Image 
                src="/images/ai-images1.jpeg" 
                alt="AI generated art 1" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority
              />
            </div>
            <div className="relative rounded-md row-span-2 overflow-hidden">
              <Image 
                src="/images/ai-images3.png" 
                alt="AI generated art 2" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority
              />
            </div>
            <div className="relative rounded-md aspect-square overflow-hidden">
              <Image 
                src="/images/ai-images2.png" 
                alt="AI generated art 3" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };