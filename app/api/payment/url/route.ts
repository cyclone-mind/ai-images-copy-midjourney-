import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOutTradeNo, generateSign } from "@/lib/payment";

export const dynamic = 'force-dynamic';

interface PaymentPackage {
  money: string;
  credits: number;
  name: string;
}

const PAYMENT_PACKAGES: PaymentPackage[] = [
  { money: "1.00", credits: 1, name: "1点数" },
  { money: "5.00", credits: 5, name: "5点数" },
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { money } = await request.json();

    const pkg = PAYMENT_PACKAGES.find(p => p.money === money);
    if (!pkg) {
      return NextResponse.json({ error: "无效的充值套餐" }, { status: 400 });
    }

    const adminClient = await createAdminClient();
    const outTradeNo = generateOutTradeNo();
    const pid = process.env.ZPAY_PID!;
    const key = process.env.ZPAY_KEY!;
    const notifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/webhook`;
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/protected`;

    const { error: insertError } = await adminClient
      .from('payment_orders')
      .insert({
        user_id: user.id,
        out_trade_no: outTradeNo,
        pid: pid,
        money: parseFloat(pkg.money),
        credits: pkg.credits,
        status: 'pending'
      });

    if (insertError) {
      console.error('Error inserting payment order:', insertError);
      return NextResponse.json({ error: "创建订单失败" }, { status: 500 });
    }

    const params: Record<string, string> = {
      pid: pid,
      name: pkg.name,
      money: pkg.money,
      out_trade_no: outTradeNo,
      notify_url: notifyUrl,
      return_url: returnUrl,
      sign_type: 'MD5'
    };

    const sign = generateSign(params, key);
    params.sign = sign;

    const queryString = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');

    const paymentUrl = `https://zpayz.cn/submit.php?${queryString}`;

    return NextResponse.json({
      paymentUrl,
      outTradeNo
    });

  } catch (error) {
    console.error('Payment URL error:', error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}