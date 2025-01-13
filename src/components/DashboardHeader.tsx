import React from 'react';
import { BarChart2, Globe, AlertTriangle, TrendingUp } from 'lucide-react';
import { format, subYears } from 'date-fns';

interface DashboardHeaderProps {
  selectedDate: Date;
}

export function DashboardHeader({ selectedDate }: DashboardHeaderProps) {
  const [data, setData] = React.useState({
    overallScore: 0,
    globalRank: 0,
    riskLevel: 'N/A',
    yoyChange: 0
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GDP per capita as a proxy for overall score
        const response = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/NY.GDP.PCAP.CD?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const [metadata, values] = await response.json();
        
        if (values && values.length >= 2) {
          const currentValue = values[0].value || 0;
          const previousValue = values[1].value || 0;
          const yoyChange = ((currentValue - previousValue) / previousValue) * 100;
          
          setData({
            overallScore: Math.round(currentValue * 10) / 10,
            globalRank: 159, // This would need a separate API call for actual ranking
            riskLevel: yoyChange > 0 ? 'Low' : 'Moderate',
            yoyChange: Math.round(yoyChange * 10) / 10
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BarChart2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">GDP per Capita ($)</p>
            <p className="text-xl font-bold">{data.overallScore}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Globe className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Global Rank</p>
            <p className="text-xl font-bold">{data.globalRank}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Risk Level</p>
            <p className="text-xl font-bold">{data.riskLevel}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">YoY Change</p>
            <p className="text-xl font-bold">{data.yoyChange > 0 ? '+' : ''}{data.yoyChange}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}