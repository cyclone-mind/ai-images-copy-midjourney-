-- 创建 Storage bucket (需要设置为 Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-images',
  'generated-images',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- 允许所有用户上传自己的图片
CREATE POLICY "Users can upload own images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'generated-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 允许所有用户读取图片
CREATE POLICY "Public can read images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'generated-images'
  );

-- 允许用户删除自己的图片
CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'generated-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 允许用户更新自己的图片
CREATE POLICY "Users can update own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'generated-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );