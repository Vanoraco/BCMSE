import React, { useEffect, useState } from 'react';
import { CategoryCard } from './CategoryCard';
import type { CategoryData } from '../types/dashboard';
import { format, subYears } from 'date-fns';

interface DataCategoriesProps {
  selectedDate: Date;
}

export function DataCategories({ selectedDate }: DataCategoriesProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Economic Indicators
        const gdpResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/NY.GDP.MKTP.KD.ZG?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const inflationResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/FP.CPI.TOTL.ZG?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const unemploymentResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/SL.UEM.TOTL.ZS?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );

        const [, gdpData] = await gdpResponse.json();
        const [, inflationData] = await inflationResponse.json();
        const [, unemploymentData] = await unemploymentResponse.json();

        const categoriesData: CategoryData[] = [
          {
            title: "Economic Indicators",
            description: "Key economic metrics and growth indicators",
            metrics: [
              {
                name: "GDP Growth Rate",
                value: `${(gdpData[0]?.value || 0).toFixed(1)}%`,
                change: calculateChange(gdpData),
                status: getStatus(calculateChange(gdpData))
              },
              {
                name: "Inflation Rate",
                value: `${(inflationData[0]?.value || 0).toFixed(1)}%`,
                change: calculateChange(inflationData),
                status: getStatus(-calculateChange(inflationData))
              },
              {
                name: "Unemployment",
                value: `${(unemploymentData[0]?.value || 0).toFixed(1)}%`,
                change: calculateChange(unemploymentData),
                status: getStatus(-calculateChange(unemploymentData))
              }
            ]
          },
          // Add more categories with real data here
        ];

        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const calculateChange = (data: any[]) => {
    if (!data || data.length < 2) return 0;
    const current = data[0]?.value || 0;
    const previous = data[1]?.value || 0;
    return previous === 0 ? 0 : ((current - previous) / previous) * 100;
  };

  const getStatus = (change: number) => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.title} data={category} />
      ))}
    </div>
  );
}