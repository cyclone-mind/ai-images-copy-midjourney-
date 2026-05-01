-- 支付记录表
CREATE TABLE IF NOT EXISTS public.payment_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    out_trade_no VARCHAR(64) NOT NULL UNIQUE,
    pid VARCHAR(64) NOT NULL,
    money DECIMAL(10, 2) NOT NULL,
    credits INTEGER NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    trade_no VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- 创建索引
CREATE INDEX IF NOT EXISTS payment_orders_user_id_idx ON public.payment_orders(user_id);
CREATE INDEX IF NOT EXISTS payment_orders_out_trade_no_idx ON public.payment_orders(out_trade_no);
CREATE INDEX IF NOT EXISTS payment_orders_status_idx ON public.payment_orders(status);

-- 开启 RLS
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的订单
CREATE POLICY "Users can view own payment orders" ON public.payment_orders
    FOR SELECT USING (auth.uid() = user_id);

-- 允许插入订单（服务端操作）
CREATE POLICY "Service can insert payment orders" ON public.payment_orders
    FOR INSERT WITH CHECK (true);

-- 允许更新订单状态
CREATE POLICY "Service can update payment orders" ON public.payment_orders
    FOR UPDATE USING (true);

-- 更新时间戳的函数
CREATE OR REPLACE FUNCTION update_payment_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 自动更新 updated_at 触发器
CREATE TRIGGER update_payment_orders_updated_at
    BEFORE UPDATE ON public.payment_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_updated_at_column();