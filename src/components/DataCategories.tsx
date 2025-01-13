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

        // New indicators for Ease of Doing Business
        const daysToStartBusinessResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/IC.BUS.EASE.XQ?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const taxComplianceResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/IC.BUS.TAX?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const creditAccessScoreResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/IC.BUS.CRED?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );

        // New indicators for Infrastructure & Logistics
        const internetPenetrationResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/IT.NET.USER.ZS?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const powerSupplyReliabilityResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/EG.ELC.ACCS.ZS?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const roadNetworkResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/IS.ROD.DNST.KM?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );

        // New indicators for Market & Investment
        const fdiInflowResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/BX.KLT.DINV.CD.WD?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const newBusinessRegistrationsResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/IC.REG.DURS?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const marketGrowthRateResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/NY.GDP.MKTP.CD?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );

        // New indicators for Regulatory Environment
        const transparencyIndexResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/IT.CAP.PUBS?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const politicalStabilityResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/IT.CAP.PUBS?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const tradePolicyScoreResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/IT.CAP.PUBS?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );

        // New indicators for Demographics & Workforce
        const populationGrowthResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/SP.POP.GROW?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const urbanPopulationResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/SP.URB.TOTL.IN.ZS?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );
        const literacyRateResponse = await fetch(
          `https://api.worldbank.org/v2/country/ETH/indicator/SE.ADT.LITR.ZS?format=json&date=${format(subYears(selectedDate, 1), 'yyyy')}:${format(selectedDate, 'yyyy')}`
        );

        // Process responses
        const gdpData = await gdpResponse.json();
        const inflationData = await inflationResponse.json();
        const unemploymentData = await unemploymentResponse.json();
        const daysToStartBusinessData = await daysToStartBusinessResponse.json();
        const taxComplianceData = await taxComplianceResponse.json();
        const creditAccessScoreData = await creditAccessScoreResponse.json();
        const internetPenetrationData = await internetPenetrationResponse.json();
        const powerSupplyReliabilityData = await powerSupplyReliabilityResponse.json();
        const roadNetworkData = await roadNetworkResponse.json();
        const fdiInflowData = await fdiInflowResponse.json();
        const newBusinessRegistrationsData = await newBusinessRegistrationsResponse.json();
        const marketGrowthRateData = await marketGrowthRateResponse.json();
        const transparencyIndexData = await transparencyIndexResponse.json();
        const politicalStabilityData = await politicalStabilityResponse.json();
        const tradePolicyScoreData = await tradePolicyScoreResponse.json();
        const populationGrowthData = await populationGrowthResponse.json();
        const urbanPopulationData = await urbanPopulationResponse.json();
        const literacyRateData = await literacyRateResponse.json();

        // Check if data exists before accessing
        const categoriesData: CategoryData[] = [
          {
            title: "Economic Indicators",
            description: "Key economic metrics and growth indicators",
            metrics: [
              {
                name: "GDP Growth Rate",
                value: `${(gdpData[1]?.[0]?.value ?? 0).toFixed(2)}%`,
                change: calculateChange(gdpData[1]),
                status: getStatus(calculateChange(gdpData[1]))
              },
              {
                name: "Inflation Rate",
                value: `${(inflationData[1]?.[0]?.value ?? 0).toFixed(2)}%`,
                change: calculateChange(inflationData[1]),
                status: getStatus(-calculateChange(inflationData[1]))
              },
              {
                name: "Unemployment",
                value: `${(unemploymentData[1]?.[0]?.value ?? 0).toFixed(2)}%`,
                change: calculateChange(unemploymentData[1]),
                status: getStatus(-calculateChange(unemploymentData[1]))
              }
            ]
          },
          {
            title: "Ease of Doing Business",
            description: "Business registration and operation metrics",
            metrics: [
              {
                name: "Days to Start Business",
                value: `${(daysToStartBusinessData[1]?.[0]?.value ?? 0).toFixed(2)}`,
                change: calculateChange(daysToStartBusinessData[1]),
                status: getStatus(calculateChange(daysToStartBusinessData[1]))
              },
              {
                name: "Tax Compliance (hours/year)",
                value: `${(taxComplianceData[1]?.[0]?.value ?? 0).toFixed(2)}`,
                change: calculateChange(taxComplianceData[1]),
                status: getStatus(calculateChange(taxComplianceData[1]))
              },
              {
                name: "Credit Access Score",
                value: `${(creditAccessScoreData[1]?.[0]?.value ?? 0).toFixed(2)}/100`,
                change: calculateChange(creditAccessScoreData[1]),
                status: getStatus(calculateChange(creditAccessScoreData[1]))
              }
            ]
          },
          {
            title: "Infrastructure & Logistics",
            description: "Quality and availability of infrastructure",
            metrics: [
              {
                name: "Internet Penetration",
                value: `${(internetPenetrationData[1]?.[0]?.value ?? 0).toFixed(2)}%`,
                change: calculateChange(internetPenetrationData[1]),
                status: getStatus(calculateChange(internetPenetrationData[1]))
              },
              {
                name: "Power Supply Reliability",
                value: `${(powerSupplyReliabilityData[1]?.[0]?.value ?? 0).toFixed(2)}%`,
                change: calculateChange(powerSupplyReliabilityData[1]),
                status: getStatus(calculateChange(powerSupplyReliabilityData[1]))
              },
              {
                name: "Road Network (km)",
                value: `${(roadNetworkData[1]?.[0]?.value ?? 0).toFixed(2)}`,
                change: calculateChange(roadNetworkData[1]),
                status: getStatus(calculateChange(roadNetworkData[1]))
              }
            ]
          },
          {
            title: "Market & Investment",
            description: "Investment climate and market opportunities",
            metrics: [
              {
                name: "FDI Inflow ($B)",
                value: `${(fdiInflowData[1]?.[0]?.value ?? 0).toFixed(2)}`,
                change: calculateChange(fdiInflowData[1]),
                status: getStatus(calculateChange(fdiInflowData[1]))
              },
              {
                name: "New Business Registrations",
                value: `${(newBusinessRegistrationsData[1]?.[0]?.value ?? 0).toFixed(2)}`,
                change: calculateChange(newBusinessRegistrationsData[1]),
                status: getStatus(calculateChange(newBusinessRegistrationsData[1]))
              },
              {
                name: "Market Growth Rate",
                value: `${(marketGrowthRateData[1]?.[0]?.value ?? 0).toFixed(2)}%`,
                change: calculateChange(marketGrowthRateData[1]),
                status: getStatus(calculateChange(marketGrowthRateData[1]))
              }
            ]
          },
          {
            title: "Regulatory Environment",
            description: "Governance and regulatory framework",
            metrics: [
              {
                name: "Transparency Index",
                value: `${(transparencyIndexData[1]?.[0]?.value ?? 0).toFixed(2)}/100`,
                change: calculateChange(transparencyIndexData[1]),
                status: getStatus(calculateChange(transparencyIndexData[1]))
              },
              {
                name: "Political Stability",
                value: `${(politicalStabilityData[1]?.[0]?.value ?? 0)}`,
                change: 0,
                status: getStatus(0)
              },
              {
                name: "Trade Policy Score",
                value: `${(tradePolicyScoreData[1]?.[0]?.value ?? 0).toFixed(2)}/100`,
                change: calculateChange(tradePolicyScoreData[1]),
                status: getStatus(calculateChange(tradePolicyScoreData[1]))
              }
            ]
          },
          {
            title: "Demographics & Workforce",
            description: "Population and workforce statistics",
            metrics: [
              {
                name: "Population Growth",
                value: `${(populationGrowthData[1]?.[0]?.value ?? 0).toFixed(2)}%`,
                change: calculateChange(populationGrowthData[1]),
                status: getStatus(calculateChange(populationGrowthData[1]))
              },
              {
                name: "Urban Population",
                value: `${(urbanPopulationData[1]?.[0]?.value ?? 0).toFixed(2)}%`,
                change: calculateChange(urbanPopulationData[1]),
                status: getStatus(calculateChange(urbanPopulationData[1]))
              },
              {
                name: "Literacy Rate",
                value: `${(literacyRateData[1]?.[0]?.value ?? 0).toFixed(2)}%`,
                change: calculateChange(literacyRateData[1]),
                status: getStatus(calculateChange(literacyRateData[1]))
              }
            ]
          }
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
    return previous === 0 ? 0 : Math.round((((current - previous) / previous) * 100 + Number.EPSILON) * 100) / 100;
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