-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create meal_entries table
CREATE TABLE meal_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL,
    image_url TEXT,
    CONSTRAINT valid_meal_type CHECK (
        meal_type IN ('breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner')
    )
);

-- Create meal_items table
CREATE TABLE meal_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    meal_entry_id UUID REFERENCES meal_entries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    CONSTRAINT meal_items_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

-- Create indexes for better query performance
CREATE INDEX idx_meal_entries_date ON meal_entries(date);
CREATE INDEX idx_meal_items_meal_entry ON meal_items(meal_entry_id);

-- Create storage bucket for meal images
INSERT INTO storage.buckets (id, name, public)
VALUES ('meal-images', 'meal-images', true);

-- Set up storage policies for meal images (public access since it's single user)
CREATE POLICY "Public access to meal images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'meal-images');

CREATE POLICY "Allow image uploads"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'meal-images');

CREATE POLICY "Allow image updates"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'meal-images')
    WITH CHECK (bucket_id = 'meal-images');

CREATE POLICY "Allow image deletions"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'meal-images');