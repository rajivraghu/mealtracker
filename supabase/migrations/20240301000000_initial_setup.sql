-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create an enum for meal types
CREATE TYPE meal_type AS ENUM (
    'breakfast',
    'morning_snack',
    'lunch',
    'afternoon_snack',
    'dinner'
);

-- Create meal_entries table
CREATE TABLE meal_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type meal_type NOT NULL,
    image_url TEXT,
    CONSTRAINT date_meal_type_unique UNIQUE (date, meal_type, user_id)
);

-- Create meal_items table
CREATE TABLE meal_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    meal_entry_id UUID REFERENCES meal_entries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    CONSTRAINT meal_items_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

-- Create indexes
CREATE INDEX idx_meal_entries_user_date ON meal_entries(user_id, date);
CREATE INDEX idx_meal_entries_meal_type ON meal_entries(meal_type);
CREATE INDEX idx_meal_items_meal_entry ON meal_items(meal_entry_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';