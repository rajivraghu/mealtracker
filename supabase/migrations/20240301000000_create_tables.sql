-- Create meal_entries table
CREATE TABLE meal_entries (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL,
    image_url TEXT,
    CONSTRAINT valid_meal_type CHECK (meal_type IN ('breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner'))
);

-- Create meal_items table
CREATE TABLE meal_items (
    id UUID PRIMARY KEY,
    meal_entry_id UUID NOT NULL REFERENCES meal_entries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_meal_entries_date ON meal_entries(date);
CREATE INDEX idx_meal_items_meal_entry_id ON meal_items(meal_entry_id);