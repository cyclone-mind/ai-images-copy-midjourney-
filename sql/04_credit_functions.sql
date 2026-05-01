-- 扣除点数函数
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS INTEGER AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_credits INTEGER;
BEGIN
  SELECT credits INTO v_current_credits
  FROM public.ai_images_creator_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_current_credits IS NULL THEN
    RAISE EXCEPTION '用户点数记录不存在';
  END IF;

  IF v_current_credits < p_amount THEN
    RAISE EXCEPTION '点数不足';
  END IF;

  UPDATE public.ai_images_creator_credits
  SET credits = credits - p_amount, updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN v_current_credits - p_amount;
END;
$$ LANGUAGE plpgsql;

-- 退还点数函数
CREATE OR REPLACE FUNCTION refund_credits(p_user_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS INTEGER AS $$
DECLARE
  v_current_credits INTEGER;
BEGIN
  SELECT credits INTO v_current_credits
  FROM public.ai_images_creator_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_current_credits IS NULL THEN
    RAISE EXCEPTION '用户点数记录不存在';
  END IF;

  UPDATE public.ai_images_creator_credits
  SET credits = credits + p_amount, updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN v_current_credits + p_amount;
END;
$$ LANGUAGE plpgsql;