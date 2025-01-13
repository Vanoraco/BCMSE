import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function AnalysisReport() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-500" />
          Executive Summary
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Ethiopia's business climate shows mixed performance with notable improvements in several key areas,
          while facing persistent challenges that require attention. The country maintains strong economic
          growth momentum despite regional and global headwinds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Key Strengths
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Strong GDP growth rate of 6.2%, indicating robust economic expansion</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Significant improvement in business registration procedures</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Growing FDI inflows, reaching $2.5B with 15% YoY growth</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Improving infrastructure with 78% power supply reliability</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <XCircle className="w-5 h-5 mr-2 text-red-500" />
            Key Challenges
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-red-500 rounded-full"></span>
              <span>High inflation rate at 14.5% affecting business stability</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-red-500 rounded-full"></span>
              <span>Limited credit access with a score of 45/100</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-red-500 rounded-full"></span>
              <span>Low internet penetration at 23.5% hampering digital transformation</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 mt-2 mr-2 bg-red-500 rounded-full"></span>
              <span>Relatively low transparency index score of 34/100</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          Recommendations
        </h3>
        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-medium mb-2">Short-term Actions</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Implement monetary policies to control inflation</li>
              <li>Streamline business registration processes further</li>
              <li>Enhance digital infrastructure and connectivity</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Long-term Strategies</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Develop comprehensive credit access programs</li>
              <li>Invest in workforce development and education</li>
              <li>Strengthen governance and transparency frameworks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}