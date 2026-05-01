import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('ai_images_creator_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting credits:', error);
      return NextResponse.json({ error: "获取点数失败" }, { status: 500 });
    }

    return NextResponse.json({ credits: data?.credits ?? 0 });
  } catch (error) {
    console.error('Credits API error:', error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}