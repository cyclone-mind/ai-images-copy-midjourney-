-- 用户点数表
CREATE TABLE IF NOT EXISTS public.ai_images_creator_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credits DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (credits >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT ai_images_creator_credits_user_id_key UNIQUE (user_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS ai_images_creator_credits_user_id_idx ON public.ai_images_creator_credits(user_id);

-- 更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 自动更新 updated_at 触发器
CREATE TRIGGER update_ai_images_creator_credits_updated_at
    BEFORE UPDATE ON public.ai_images_creator_credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 开启 RLS
ALTER TABLE public.ai_images_creator_credits ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的点数
CREATE POLICY "Users can view own credits" ON public.ai_images_creator_credits
    FOR SELECT USING (auth.uid() = user_id);

-- 用户只能更新自己的点数
CREATE POLICY "Users can update own credits" ON public.ai_images_creator_credits
    FOR UPDATE USING (auth.uid() = user_id);

-- 服务端可插入点数（用于管理员操作）
CREATE POLICY "Service can insert credits" ON public.ai_images_creator_credits
    FOR INSERT WITH CHECK (true);
