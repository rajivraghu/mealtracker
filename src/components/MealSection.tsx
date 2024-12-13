import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import ImagePreview from './ImagePreview';
import { api, MealItem } from '../lib/api';

interface MealSectionProps {
  title: string;
  emoji: string;
  accentColor: string;
  selectedDate: string;
}

export default function MealSection({ title, emoji, accentColor, selectedDate }: MealSectionProps) {
  const [items, setItems] = useState<MealItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [sectionImage, setSectionImage] = useState<string | null>(null);
  const [mealEntryId, setMealEntryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mealType = title.toLowerCase().replace(' ', '_');

  useEffect(() => {
    setIsLoading(true);
    loadMealData().finally(() => setIsLoading(false));
  }, [selectedDate]);

  const loadMealData = async () => {
    try {
      const entries = await api.getMealEntriesByDate(selectedDate);
      const entry = entries.find(e => e.mealType === mealType);
      
      if (entry) {
        setMealEntryId(entry.id);
        setItems(entry.items);
        setSectionImage(entry.imageUrl);
      } else {
        const newEntryId = await api.createMealEntry(selectedDate, mealType);
        setMealEntryId(newEntryId);
        setItems([]);
        setSectionImage(null);
      }
    } catch (error) {
      console.error('Error loading meal data:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && mealEntryId) {
      setIsLoading(true);
      try {
        const imageUrl = await api.uploadImage(file, mealEntryId);
        setSectionImage(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const addItem = async () => {
    if (newItemName.trim() && mealEntryId) {
      setIsLoading(true);
      try {
        await api.addMealItem(mealEntryId, newItemName);
        setItems([...items, { id: Date.now().toString(), name: newItemName }]);
        setNewItemName('');
      } catch (error) {
        console.error('Error adding item:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeItem = async (id: string) => {
    setIsLoading(true);
    try {
      await api.removeMealItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg mb-6 ${accentColor} relative`}>
      {isLoading && (
        <div className="fixed inset-0 bg-white/75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
        </div>
      )}
      
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {emoji} {title}
            </h2>
          </div>
          
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 hover:bg-red-50 rounded-full"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add new item..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              disabled={isLoading}
            />
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <ImagePreview
          imageUrl={sectionImage}
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
