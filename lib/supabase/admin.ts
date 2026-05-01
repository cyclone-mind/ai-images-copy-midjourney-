import { createClient } from "@/lib/supabase/server";

export async function createAdminClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return { supabase, user };
}

export async function deductCredit(supabase: any, userId: string, amount: number = 1) {
  const { data, error } = await supabase.rpc(' deduct_credits', {
    p_user_id: userId,
    p_amount: amount
  });

  if (error) {
    console.error('Error deducting credit:', error);
    throw error;
  }

  return data;
}

export async function refundCredit(supabase: any, userId: string, amount: number = 1) {
  const { data, error } = await supabase.rpc('refund_credits', {
    p_user_id: userId,
    p_amount: amount
  });

  if (error) {
    console.error('Error refunding credit:', error);
    throw error;
  }

  return data;
}

export async function addHistory(
  supabase: any,
  userId: string,
  prompt: string,
  imageUrls: string[],
  creditsUsed: number = 1
) {
  const { data, error } = await supabase
    .from('ai_images_creator_history')
    .insert({
      user_id: userId,
      prompt,
      image_urls: imageUrls,
      credits_used: creditsUsed
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding history:', error);
    throw error;
  }

  return data;
}

export async function getCredits(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('ai_images_creator_credits')
    .select('credits')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error getting credits:', error);
    throw error;
  }

  return data?.credits ?? 0;
}

export async function getHistory(supabase: any, userId: string, limit: number = 20) {
  const { data, error } = await supabase
    .from('ai_images_creator_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting history:', error);
    throw error;
  }

  return data ?? [];
}