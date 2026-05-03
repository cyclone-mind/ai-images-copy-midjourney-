-- 图片生成历史记录表
CREATE TABLE IF NOT EXISTS public.ai_images_creator_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT,
    image_urls TEXT[] NOT NULL CHECK (array_length(image_urls, 1) = 4),
    credits_used DECIMAL(10,2) NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS ai_images_creator_history_user_id_idx ON public.ai_images_creator_history(user_id);
CREATE INDEX IF NOT EXISTS ai_images_creator_history_created_at_idx ON public.ai_images_creator_history(created_at DESC);

-- 开启 RLS
ALTER TABLE public.ai_images_creator_history ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的历史记录
CREATE POLICY "Users can view own history" ON public.ai_images_creator_history
    FOR SELECT USING (auth.uid() = user_id);

-- 用户只能插入自己的历史记录
CREATE POLICY "Users can insert own history" ON public.ai_images_creator_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);
