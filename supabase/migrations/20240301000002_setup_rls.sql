-- Enable Row Level Security (RLS)
ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;

-- Create policies for meal_entries
CREATE POLICY "Users can view their own meal entries"
    ON meal_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal entries"
    ON meal_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal entries"
    ON meal_entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal entries"
    ON meal_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for meal_items
CREATE POLICY "Users can view their own meal items"
    ON meal_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM meal_entries
            WHERE meal_entries.id = meal_items.meal_entry_id
            AND meal_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert meal items to their entries"
    ON meal_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM meal_entries
            WHERE meal_entries.id = meal_items.meal_entry_id
            AND meal_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own meal items"
    ON meal_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM meal_entries
            WHERE meal_entries.id = meal_items.meal_entry_id
            AND meal_entries.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM meal_entries
            WHERE meal_entries.id = meal_items.meal_entry_id
            AND meal_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own meal items"
    ON meal_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM meal_entries
            WHERE meal_entries.id = meal_items.meal_entry_id
            AND meal_entries.user_id = auth.uid()
        )
    );