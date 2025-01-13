import React from 'react';
import { BarChart2, FileText } from 'lucide-react';

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function TabNavigation({ activeTab, setActiveTab }: TabProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab('indicators')}
          className={`${
            activeTab === 'indicators'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
        >
          <BarChart2 className="w-5 h-5 mr-2" />
          Business Indicators
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`${
            activeTab === 'analysis'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
        >
          <FileText className="w-5 h-5 mr-2" />
          Analysis Report
        </button>
      </nav>
    </div>
  );
}