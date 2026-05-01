import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const userId = user.id;
  const creditsUsed = 1;

  try {
    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "请输入图像描述" }, { status: 400 });
    }

    const deductResult = await supabase.rpc('deduct_credits', {
      p_user_id: userId,
      p_amount: creditsUsed
    });

    if (deductResult.error) {
      if (deductResult.error.message.includes('点数不足')) {
        return NextResponse.json({ error: "点数不足" }, { status: 400 });
      }
      console.error('Error deducting credits:', deductResult.error);
      return NextResponse.json({ error: deductResult.error.message }, { status: 500 });
    }

    let imageUrls: string[] = [];
    let generationId: string = '';

    try {
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
        throw new Error(errorMessages[data.base_resp.status_code] || `未知错误 (${data.base_resp.status_code})`);
      }

      if (!data.data?.image_urls || data.data.image_urls.length === 0) {
        throw new Error("生成失败，未返回图片");
      }

      imageUrls = data.data.image_urls;
      generationId = data.id || '';

    } catch (generationError) {
      await supabase.rpc('refund_credits', {
        p_user_id: userId,
        p_amount: creditsUsed
      });

      throw generationError;
    }

    const { error: historyError } = await supabase
      .from('ai_images_creator_history')
      .insert({
        user_id: userId,
        prompt: prompt,
        image_urls: imageUrls,
        credits_used: creditsUsed
      });

    if (historyError) {
      console.error('Error saving history:', historyError);
    }

    return NextResponse.json({
      imageUrls: imageUrls,
      id: generationId,
      remainingCredits: deductResult.data
    });

  } catch (error) {
    console.error("Image generation error:", error);
    const message = error instanceof Error ? error.message : "生成图片时发生错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}