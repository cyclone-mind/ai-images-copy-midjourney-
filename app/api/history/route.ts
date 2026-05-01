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
      .from('ai_images_creator_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error getting history:', error);
      return NextResponse.json({ error: "获取历史记录失败" }, { status: 500 });
    }

    return NextResponse.json({ history: data ?? [] });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}