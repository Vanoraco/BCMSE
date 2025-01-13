import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onChange }: DatePickerProps) {
  return (
    <div className="relative flex items-center">
      <Calendar className="w-5 h-5 text-gray-500 absolute left-3" />
      <input
        type="date"
        value={format(selectedDate, 'yyyy-MM-dd')}
        onChange={(e) => onChange(new Date(e.target.value))}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}