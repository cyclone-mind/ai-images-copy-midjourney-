import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "请输入图像描述" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.minimaxi.com/v1/image_generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MINIMAX_APIKEY}`,
      },
      body: JSON.stringify({
        model: "image-01",
        prompt: prompt,
        aspect_ratio: "16:9",
        response_format: "url",
        n: 4,
        prompt_optimizer: true,
      }),
    });

    const data = await response.json();

    if (data.base_resp && data.base_resp.status_code !== 0) {
      const errorMessages: Record<number, string> = {
        1002: "触发限流，请稍后再试",
        1004: "账号鉴权失败，请检查 API-Key 是否正确",
        1008: "账号余额不足",
        1026: "图片描述涉及敏感内容",
        2013: "传入参数异常",
        2049: "无效的 API Key",
      };
      return NextResponse.json(
        { error: errorMessages[data.base_resp.status_code] || `未知错误 (${data.base_resp.status_code})` },
        { status: 400 }
      );
    }

    if (!data.data?.image_urls || data.data.image_urls.length === 0) {
      return NextResponse.json(
        { error: "生成失败，未返回图片" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrls: data.data.image_urls,
      id: data.id,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "生成图片时发生错误" },
      { status: 500 }
    );
  }
}