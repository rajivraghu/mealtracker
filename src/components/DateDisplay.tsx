import React from 'react';
import { Calendar } from 'lucide-react';

export default function DateDisplay() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
      <Calendar className="w-5 h-5" />
      <span className="text-lg">{formattedDate}</span>
    </div>
  );
}