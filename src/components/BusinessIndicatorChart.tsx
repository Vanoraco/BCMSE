import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';
import type { WorldBankResponse } from '../types/worldBank';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Multiple business indicators for Ethiopia
const INDICATORS = [
  { id: 'IC.BUS.EASE.XQ', name: 'Ease of Doing Business Score' },
  { id: 'IC.BUS.DFRN.XQ', name: 'Distance to Frontier Score' },
  { id: 'IC.REG.DURS', name: 'Time Required to Start a Business (days)' },
  { id: 'IC.REG.PROC', name: 'Start-up Procedures to Register a Business' }
];

export function BusinessIndicatorChart() {
  const [data, setData] = useState<{
    labels: string[];
    datasets: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = INDICATORS.map(indicator =>
          fetch(`https://api.worldbank.org/v2/country/ETH/indicator/${indicator.id}?format=json&date=2010:2020`)
            .then(res => res.json())
        );

        const results = await Promise.all(promises);
        const datasets = results.map((result: WorldBankResponse, index) => ({
          label: INDICATORS[index].name,
          data: result[1]
            .sort((a, b) => parseInt(a.date) - parseInt(b.date))
            .map(item => item.value),
          borderColor: [
            '#2563eb', // blue
            '#16a34a', // green
            '#dc2626', // red
            '#9333ea'  // purple
          ][index],
          tension: 0.3,
          fill: false,
        }));

        const years = results[0][1]
          .sort((a: { date: string; }, b: { date: string; }) => parseInt(a.date) - parseInt(b.date))
          .map((item: { date: any; }) => item.date);

        setData({
          labels: years,
          datasets,
        });
      } catch (err) {
        setError('Failed to fetch data from World Bank API');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Ethiopian Business Environment Indicators',
        font: {
          size: 16,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: number) => value.toFixed(1),
        }
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Ethiopian Business Environment Analysis</h2>
      </div>
      {data && <Line options={options} data={data} height={80} />}
      <div className="mt-6 text-sm text-gray-600">
        <p>Data source: World Bank Development Indicators</p>
      </div>
    </div>
  );
}