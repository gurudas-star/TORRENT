export type Language = 'EN' | 'HI' | 'GU';

export interface BillData {
  customerNumber: string;
  customerName: string;
  billingPeriod: string;
  amount: number;
  dueDate: string;
  status: 'Unpaid' | 'Paid' | 'Overdue';
  unitsConsumed: number;
  meterNumber: string;
  address: string;
  previousBalance: number;
  currentCharges: number;
  subsidy: number;
  dueDatePenalty: number;
}

export interface OutageStatus {
  area: string;
  status: 'Active Outage' | 'Scheduled Maintenance' | 'Normal Grid Operation';
  affectedCount?: number;
  estimatedRestoration?: string;
  cause?: string;
  lastUpdated: string;
}

export interface Complaint {
  id: string;
  customerNumber: string;
  category: string;
  description: string;
  status: 'Registered' | 'Assigned' | 'In Progress' | 'Resolved';
  date: string;
  expectedResolution?: string;
}

export interface UsageHistory {
  month: string;
  kwh: number;
  cost: number;
  avgTemp?: number;
}

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  badge?: string;
  flowId?: string;
  modalType?: 'pay' | 'view' | 'outage' | 'complaint' | 'connection' | 'login';
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  image: string;
}
