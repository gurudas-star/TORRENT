import { BillData, OutageStatus, Complaint, UsageHistory, NewsItem } from '../types';

export const MOCK_BILLS: Record<string, BillData> = {
  '10023456': {
    customerNumber: '10023456',
    customerName: 'Rajesh V. Sharma',
    billingPeriod: 'August 2026',
    amount: 2450,
    dueDate: '25 September 2026',
    status: 'Unpaid',
    unitsConsumed: 326,
    meterNumber: 'MTR-TP-882910',
    address: 'Flat 402, Samanvay Heights, Satellite, Ahmedabad (Gujarat)',
    previousBalance: 0,
    currentCharges: 2320,
    subsidy: 0,
    dueDatePenalty: 130
  },
  '98765432': {
    customerNumber: '98765432',
    customerName: 'Priya K. Patel',
    billingPeriod: 'August 2026',
    amount: 1820,
    dueDate: '28 September 2026',
    status: 'Unpaid',
    unitsConsumed: 248,
    meterNumber: 'MTR-TP-993812',
    address: 'Plot 14, Ring Road Industrial Estate, Surat (Gujarat)',
    previousBalance: 0,
    currentCharges: 1820,
    subsidy: 0,
    dueDatePenalty: 0
  },
  '55512345': {
    customerNumber: '55512345',
    customerName: 'Bhiwandi Textile Mills Ltd.',
    billingPeriod: 'August 2026',
    amount: 48500,
    dueDate: '20 September 2026',
    status: 'Unpaid',
    unitsConsumed: 6200,
    meterNumber: 'MTR-TP-334109',
    address: 'Power Loom Zone, Bhiwandi Circle, Thane (Maharashtra)',
    previousBalance: 0,
    currentCharges: 48500,
    subsidy: 0,
    dueDatePenalty: 0
  }
};

export const DEFAULT_DEMO_BILL: BillData = {
  customerNumber: '10023456',
  customerName: 'Torrent Power Valued Consumer',
  billingPeriod: 'August 2026',
  amount: 2450,
  dueDate: '25 September 2026',
  status: 'Unpaid',
  unitsConsumed: 326,
  meterNumber: 'MTR-TP-882910',
  address: 'Tapovan Circle, Ambavadi, Ahmedabad - 380015',
  previousBalance: 0,
  currentCharges: 2320,
  subsidy: 0,
  dueDatePenalty: 130
};

export const MOCK_OUTAGES: Record<string, OutageStatus> = {
  '380015': {
    area: 'Ahmedabad (Satellite, Ambavadi & Vastrapur Circle)',
    status: 'Normal Grid Operation',
    affectedCount: 0,
    estimatedRestoration: 'No active feeder outages reported',
    cause: 'Routine 11kV Substation Telemetry Active',
    lastUpdated: '5 mins ago'
  },
  '395003': {
    area: 'Surat (Varachha & Ring Road Sector 2)',
    status: 'Scheduled Maintenance',
    affectedCount: 420,
    estimatedRestoration: 'Today at 02:30 PM (transformer upgrade)',
    cause: 'Pre-scheduled EHV line bay augmentation',
    lastUpdated: '30 mins ago'
  }
};

export const DEFAULT_OUTAGE: OutageStatus = {
  area: 'Torrent Power Distribution Zone',
  status: 'Normal Grid Operation',
  lastUpdated: 'Just now'
};

export const MOCK_USAGE_HISTORY: UsageHistory[] = [
  { month: 'Mar 26', kwh: 240, cost: 1680 },
  { month: 'Apr 26', kwh: 275, cost: 1985 },
  { month: 'May 26', kwh: 340, cost: 2550 },
  { month: 'Jun 26', kwh: 380, cost: 2900 },
  { month: 'Jul 26', kwh: 298, cost: 2150 },
  { month: 'Aug 26', kwh: 326, cost: 2450 }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Torrent Power Commissions 1200 MW DGEN & 1147.5 MW SUGEN Mega Power Assets',
    category: 'Thermal & Gas Generation',
    date: '05 Sept 2026',
    readTime: '4 min read',
    summary: 'High-efficiency combined-cycle gas turbine plants at Dahej and Akhakhol delivering bulk power to state grid off-takers.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'news-2',
    title: 'Expanding Distribution Operations in Dadra & Nagar Haveli, Daman and Diu',
    category: 'Distribution Licensee',
    date: '28 Aug 2026',
    readTime: '3 min read',
    summary: 'Successful 51% stake acquisition in Union Territory licensed distribution operations serving residential and industrial hubs.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'news-3',
    title: 'Torrent Group Expands Renewable Energy Portfolio Beyond 2,000 MW',
    category: 'Clean Energy & CSR',
    date: '15 Aug 2026',
    readTime: '5 min read',
    summary: 'Adding Charanka Solar Park and coastal wind power clusters as part of the group’s mission of transforming lives and environment.',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
  }
];
