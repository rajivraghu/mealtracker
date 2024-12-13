import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateDisplayProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateDisplay({ selectedDate, onDateChange }: DateDisplayProps) {
  const [date, setDate] = useState(selectedDate);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    onDateChange(newDate);
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
      <Calendar className="w-5 h-5" />
      <span className="text-lg">{formattedDate}</span>
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        className="ml-4 p-2 border border-gray-300 rounded"
      />
    </div>
  );
}