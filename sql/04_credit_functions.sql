-- 扣除点数函数
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_amount DECIMAL(10,2) DEFAULT 1)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  v_current_credits DECIMAL(10,2);
  v_new_credits DECIMAL(10,2);
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
CREATE OR REPLACE FUNCTION refund_credits(p_user_id UUID, p_amount DECIMAL(10,2) DEFAULT 1)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  v_current_credits DECIMAL(10,2);
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

-- 增加点数函数
CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_amount DECIMAL(10,2) DEFAULT 1)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  v_current_credits DECIMAL(10,2);
BEGIN
  SELECT credits INTO v_current_credits
  FROM public.ai_images_creator_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_current_credits IS NULL THEN
    INSERT INTO public.ai_images_creator_credits (user_id, credits)
    VALUES (p_user_id, p_amount)
    RETURNING credits INTO v_current_credits;
  ELSE
    UPDATE public.ai_images_creator_credits
    SET credits = credits + p_amount, updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING credits INTO v_current_credits;
  END IF;

  RETURN v_current_credits;
END;
$$ LANGUAGE plpgsql;