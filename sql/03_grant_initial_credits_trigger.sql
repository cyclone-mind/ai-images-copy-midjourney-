-- 自动授予新用户 3 点数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.ai_images_creator_credits (user_id, credits)
    VALUES (NEW.id, 3);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 用户注册时触发
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- 如果 想要更改新用户赠送新的点数，需要先删除触发器再创建。
-- 可以先执行：DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users; -- 再执行本SQL
