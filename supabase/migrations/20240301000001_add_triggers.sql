-- Create triggers for updated_at
CREATE TRIGGER update_meal_entries_updated_at
    BEFORE UPDATE ON meal_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_items_updated_at
    BEFORE UPDATE ON meal_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();