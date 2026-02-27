export interface Customer {
  id: number;
  gender: 'Male' | 'Female';
  age: number;
  annualIncome: number; // in thousands
  spendingScore: number; // 1-100
  churn: boolean;
  segment?: string;
}

export interface DataStats {
  totalCustomers: number;
  avgAge: number;
  avgIncome: number;
  avgSpendingScore: number;
  churnRate: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DATA_MANAGEMENT = 'DATA_MANAGEMENT',
  INSIGHTS = 'INSIGHTS',
}
