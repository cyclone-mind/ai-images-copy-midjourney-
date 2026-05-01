import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

function verifySign(params: Record<string, string>, key: string): boolean {
  const sign = params.sign;
  if (!sign) return false;

  const sortedKeys = Object.keys(params).sort();
  const signStr = sortedKeys
    .filter(k => params[k] && k !== 'sign' && k !== 'sign_type')
    .map(k => `${k}=${params[k]}`)
    .join('&');

  const md5 = crypto.createHash('md5');
  md5.update(signStr + key);
  const calculatedSign = md5.digest('hex');

  return calculatedSign === sign;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pid = searchParams.get('pid');
    const tradeNo = searchParams.get('trade_no');
    const outTradeNo = searchParams.get('out_trade_no');
    const tradeStatus = searchParams.get('trade_status');
    const money = searchParams.get('money');
    const sign = searchParams.get('sign');
    const type = searchParams.get('type');
    const name = searchParams.get('name');
    const param = searchParams.get('param');

    if (!pid || !outTradeNo || !tradeStatus || !money || !sign) {
      return new Response('fail', { status: 400 });
    }

    const key = process.env.ZPAY_KEY;
    if (!key) {
      console.error('ZPAY_KEY not configured');
      return new Response('fail', { status: 500 });
    }

    const params: Record<string, string> = {
      pid: pid || '',
      name: name || '',
      money: money || '',
      out_trade_no: outTradeNo || '',
      trade_no: tradeNo || '',
      trade_status: tradeStatus || '',
      type: type || '',
      param: param || ''
    };

    if (!verifySign(params, key)) {
      console.error('Sign verification failed');
      return new Response('fail', { status: 400 });
    }

    const adminClient = await createAdminClient();

    const { data: order, error: findError } = await adminClient
      .from('payment_orders')
      .select('*')
      .eq('out_trade_no', outTradeNo)
      .single();

    if (findError || !order) {
      console.error('Order not found:', outTradeNo);
      return new Response('fail', { status: 400 });
    }

    if (order.status === 'success') {
      return new Response('success', { status: 200 });
    }

    if (tradeStatus !== 'TRADE_SUCCESS') {
      await adminClient
        .from('payment_orders')
        .update({ status: 'failed' })
        .eq('out_trade_no', outTradeNo);
      return new Response('success', { status: 200 });
    }

    const orderMoney = parseFloat(order.money.toString());
    const paymentMoney = parseFloat(money);
    if (orderMoney !== paymentMoney) {
      console.error('Money mismatch:', orderMoney, paymentMoney);
      return new Response('fail', { status: 400 });
    }

    await adminClient
      .from('payment_orders')
      .update({
        status: 'success',
        trade_no: tradeNo,
        paid_at: new Date().toISOString()
      })
      .eq('out_trade_no', outTradeNo);

    const { error: updateCreditsError } = await adminClient.rpc('add_credits', {
      p_user_id: order.user_id,
      p_amount: order.credits
    });

    if (updateCreditsError) {
      console.error('Error updating credits:', updateCreditsError);
      return new Response('fail', { status: 400 });
    }

    return new Response('success', { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('fail', { status: 400 });
  }
}