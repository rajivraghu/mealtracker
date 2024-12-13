import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

export interface MealItem {
  id: string;
  name: string;
}

export interface MealEntry {
  id: string;
  date: string;
  mealType: string;
  imageUrl: string | null;
  items: MealItem[];
}

export const api = {
  async createMealEntry(date: string, mealType: string): Promise<string> {
    const { data, error } = await supabase
      .from('meal_entries')
      .insert({
        id: uuidv4(),
        date,
        meal_type: mealType,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  async addMealItem(mealEntryId: string, name: string): Promise<void> {
    const { error } = await supabase
      .from('meal_items')
      .insert({
        id: uuidv4(),
        meal_entry_id: mealEntryId,
        name,
      });

    if (error) throw error;
  },

  async removeMealItem(itemId: string): Promise<void> {
    const { error } = await supabase
      .from('meal_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  },

  async uploadImage(file: File, mealEntryId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${mealEntryId}.${fileExt}`;
    const filePath = `meal-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('meal-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('meal-images')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('meal_entries')
      .update({ image_url: publicUrl })
      .eq('id', mealEntryId);

    if (updateError) throw updateError;

    return publicUrl;
  },

  async getMealEntriesByDate(date: string): Promise<MealEntry[]> {
    const { data: entries, error: entriesError } = await supabase
      .from('meal_entries')
      .select('*')
      .eq('date', date);

    if (entriesError) throw entriesError;

    const { data: items, error: itemsError } = await supabase
      .from('meal_items')
      .select('*')
      .in('meal_entry_id', entries.map(entry => entry.id));

    if (itemsError) throw itemsError;

    return entries.map(entry => ({
      id: entry.id,
      date: entry.date,
      mealType: entry.meal_type,
      imageUrl: entry.image_url,
      items: items
        .filter(item => item.meal_entry_id === entry.id)
        .map(item => ({
          id: item.id,
          name: item.name,
        })),
    }));
  },
};