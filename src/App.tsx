import React, { useState } from 'react';
import MealSection from './components/MealSection';
import DateDisplay from './components/DateDisplay';
import { Utensils } from 'lucide-react';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-4">
          <Utensils className="w-8 h-8 text-blue-500 mr-2" />
          <h1 className="text-4xl font-bold text-gray-800">Daily Meal Tracker</h1>
        </div>

        <DateDisplay selectedDate={selectedDate} onDateChange={setSelectedDate} />

        <div className="max-w-5xl mx-auto">
          <MealSection
            title="Breakfast"
            emoji="🌅"
            accentColor="bg-orange-50"
            selectedDate={selectedDate}
          />
          <MealSection
            title="Morning Snack"
            emoji="🥨"
            accentColor="bg-yellow-50"
            selectedDate={selectedDate}
          />
          <MealSection
            title="Lunch"
            emoji="🍽️"
            accentColor="bg-green-50"
            selectedDate={selectedDate}
          />
          <MealSection
            title="Afternoon Snack"
            emoji="🍎"
            accentColor="bg-red-50"
            selectedDate={selectedDate}
          />
          <MealSection
            title="Dinner"
            emoji="🌙"
            accentColor="bg-purple-50"
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}

export default App;