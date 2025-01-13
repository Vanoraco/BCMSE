import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { CategoryData } from '../types/dashboard';

interface CategoryCardProps {
  data: CategoryData;
}

export function CategoryCard({ data }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{data.description}</p>
      <div className="space-y-3">
        {data.metrics.map((metric) => (
          <div key={metric.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">{metric.name}</p>
              <p className="text-lg">{metric.value}</p>
            </div>
            {metric.change !== undefined && (
              <div className={`flex items-center gap-1 ${
                metric.status === 'positive' ? 'text-green-600' :
                metric.status === 'negative' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {metric.status === 'positive' && <ArrowUpRight className="w-4 h-4" />}
                {metric.status === 'negative' && <ArrowDownRight className="w-4 h-4" />}
                {metric.status === 'neutral' && <Minus className="w-4 h-4" />}
                <span>{metric.change > 0 ? '+' : ''}{metric.change}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}