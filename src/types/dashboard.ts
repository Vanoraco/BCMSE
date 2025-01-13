export interface BusinessMetric {
  id: string;
  name: string;
  category: 'regulatory' | 'economic' | 'infrastructure' | 'financial';
  description: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  date?: Date;
}

export interface CategoryData {
  title: string;
  description: string;
  metrics: {
    name: string;
    value: string | number;
    change?: number;
    status?: 'positive' | 'negative' | 'neutral';
    date?: Date;
  }[];
}

export interface CountryData {
  code: string;
  name: string;
  region: string;
}

export interface DateFilterProps {
  selectedDate: Date;
}