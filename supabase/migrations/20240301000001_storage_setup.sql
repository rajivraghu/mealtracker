-- Create storage bucket for meal images
INSERT INTO storage.buckets (id, name, public)
VALUES ('meal-images', 'meal-images', true);

-- Set up storage policies for meal images
CREATE POLICY "Anyone can view meal images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'meal-images');

CREATE POLICY "Authenticated users can upload meal images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'meal-images'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own meal images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'meal-images' AND owner = auth.uid())
    WITH CHECK (bucket_id = 'meal-images' AND owner = auth.uid());

CREATE POLICY "Users can delete their own meal images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'meal-images' AND owner = auth.uid());