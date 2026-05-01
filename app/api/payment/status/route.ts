import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const outTradeNo = searchParams.get('out_trade_no');

    if (!outTradeNo) {
      return NextResponse.json({ error: "缺少订单号" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('payment_orders')
      .select('status, credits, money')
      .eq('out_trade_no', outTradeNo)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    return NextResponse.json({
      status: data.status,
      credits: data.credits,
      money: data.money
    });

  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}