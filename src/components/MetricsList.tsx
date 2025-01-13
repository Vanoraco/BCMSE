import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { format, subYears } from 'date-fns';

interface MetricsListProps {
  selectedDate: Date;
}

interface Metric {
  name: string;
  value: number;
  change: number;
  status: 'up' | 'down' | 'stable';
}

const INDICATORS = {
  'IC.BUS.EASE.XQ': 'Starting a Business',
  'IC.REG.COST.PC.ZS': 'Business Registration Cost',
  'IC.EXP.COST.CD': 'Export Cost',
  'IC.REG.DURS': 'Time to Register (days)'
};

export function MetricsList({ selectedDate }: MetricsListProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const promises = Object.entries(INDICATORS).map(async ([indicator, name]) => {
          const response = await fetch(
            `https://api.worldbank.org/v2/country/ETH/indicator/${indicator}?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
          );
          const [metadata, values] = await response.json();
          
          if (!values || values.length < 2) return null;
          
          const currentValue = values[0].value || 0;
          const previousValue = values[1].value || 0;
          const change = ((currentValue - previousValue) / previousValue) * 100;
          
          return {
            name,
            value: Math.round(currentValue * 10) / 10,
            change: Math.round(change * 10) / 10,
            status: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
          };
        });

        const results = await Promise.all(promises);
        setMetrics(results.filter(Boolean) as Metric[]);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
        <div className="space-y-4">
          <div className="animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{metric.name}</p>
              <p className="text-sm text-gray-600">Value: {metric.value}</p>
            </div>
            <div className="flex items-center gap-2">
              {metric.status === 'up' && (
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+{metric.change}%</span>
                </div>
              )}
              {metric.status === 'down' && (
                <div className="flex items-center text-red-600">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>{metric.change}%</span>
                </div>
              )}
              {metric.status === 'stable' && (
                <div className="flex items-center text-gray-600">
                  <Minus className="w-4 h-4" />
                  <span>{metric.change}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}