export interface WorldBankResponse {
  [0]: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
  [1]: WorldBankIndicator[];
}

export interface WorldBankIndicator {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  value: number;
  unit: string;
  obs_status: string;
  decimal: number;
}