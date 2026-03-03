import { KPI, Story, Filter, DataRow, Dimension, Measure } from '../types';

export const rawData: DataRow[] = [
  { id: '1', region: 'North America', product: 'Product A', year: '2024', month: 'Jan', revenue: 186000, costs: 120000, profit: 66000, quantity: 450 },
  { id: '2', region: 'North America', product: 'Product B', year: '2024', month: 'Jan', revenue: 145000, costs: 95000, profit: 50000, quantity: 380 },
  { id: '3', region: 'North America', product: 'Product A', year: '2024', month: 'Feb', revenue: 205000, costs: 125000, profit: 80000, quantity: 520 },
  { id: '4', region: 'North America', product: 'Product B', year: '2024', month: 'Feb', revenue: 165000, costs: 105000, profit: 60000, quantity: 410 },
  { id: '5', region: 'North America', product: 'Product A', year: '2024', month: 'Mar', revenue: 237000, costs: 130000, profit: 107000, quantity: 580 },
  { id: '6', region: 'North America', product: 'Product B', year: '2024', month: 'Mar', revenue: 178000, costs: 112000, profit: 66000, quantity: 445 },
  { id: '7', region: 'Europe', product: 'Product A', year: '2024', month: 'Jan', revenue: 156000, costs: 100000, profit: 56000, quantity: 390 },
  { id: '8', region: 'Europe', product: 'Product B', year: '2024', month: 'Jan', revenue: 132000, costs: 88000, profit: 44000, quantity: 330 },
  { id: '9', region: 'Europe', product: 'Product A', year: '2024', month: 'Feb', revenue: 175000, costs: 108000, profit: 67000, quantity: 440 },
  { id: '10', region: 'Europe', product: 'Product B', year: '2024', month: 'Feb', revenue: 148000, costs: 96000, profit: 52000, quantity: 370 },
  { id: '11', region: 'Europe', product: 'Product A', year: '2024', month: 'Mar', revenue: 198000, costs: 118000, profit: 80000, quantity: 495 },
  { id: '12', region: 'Europe', product: 'Product B', year: '2024', month: 'Mar', revenue: 162000, costs: 102000, profit: 60000, quantity: 405 },
  { id: '13', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Jan', revenue: 120000, costs: 78000, profit: 42000, quantity: 300 },
  { id: '14', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Jan', revenue: 98000, costs: 65000, profit: 33000, quantity: 245 },
  { id: '15', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Feb', revenue: 138000, costs: 85000, profit: 53000, quantity: 345 },
  { id: '16', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Feb', revenue: 112000, costs: 72000, profit: 40000, quantity: 280 },
  { id: '17', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Mar', revenue: 155000, costs: 92000, profit: 63000, quantity: 388 },
  { id: '18', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Mar', revenue: 128000, costs: 80000, profit: 48000, quantity: 320 },
  { id: '19', region: 'Latin America', product: 'Product A', year: '2024', month: 'Jan', revenue: 85000, costs: 55000, profit: 30000, quantity: 212 },
  { id: '20', region: 'Latin America', product: 'Product B', year: '2024', month: 'Jan', revenue: 72000, costs: 48000, profit: 24000, quantity: 180 },
  { id: '21', region: 'Latin America', product: 'Product A', year: '2024', month: 'Feb', revenue: 95000, costs: 60000, profit: 35000, quantity: 238 },
  { id: '22', region: 'Latin America', product: 'Product B', year: '2024', month: 'Feb', revenue: 82000, costs: 53000, profit: 29000, quantity: 205 },
  { id: '23', region: 'Latin America', product: 'Product A', year: '2024', month: 'Mar', revenue: 108000, costs: 68000, profit: 40000, quantity: 270 },
  { id: '24', region: 'Latin America', product: 'Product B', year: '2024', month: 'Mar', revenue: 92000, costs: 58000, profit: 34000, quantity: 230 },
  { id: '25', region: 'North America', product: 'Product A', year: '2023', month: 'Jan', revenue: 165000, costs: 110000, profit: 55000, quantity: 400 },
  { id: '26', region: 'North America', product: 'Product B', year: '2023', month: 'Jan', revenue: 128000, costs: 85000, profit: 43000, quantity: 340 },
  { id: '27', region: 'Europe', product: 'Product A', year: '2023', month: 'Jan', revenue: 142000, costs: 92000, profit: 50000, quantity: 355 },
  { id: '28', region: 'Europe', product: 'Product B', year: '2023', month: 'Jan', revenue: 118000, costs: 78000, profit: 40000, quantity: 295 },
];

export const availableDimensions: Dimension[] = [
  { id: 'dim1', name: 'Region', field: 'region', values: ['North America', 'Europe', 'Asia Pacific', 'Latin America'] },
  { id: 'dim2', name: 'Product', field: 'product', values: ['Product A', 'Product B'] },
  { id: 'dim3', name: 'Year', field: 'year', values: ['2024', '2023'] },
  { id: 'dim4', name: 'Month', field: 'month', values: ['Jan', 'Feb', 'Mar'] },
];

export const availableMeasures: Measure[] = [
  { id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum', color: '#0a6ed1' },
  { id: 'meas2', name: 'Costs', field: 'costs', aggregation: 'sum', color: '#df6e0c' },
  { id: 'meas3', name: 'Profit', field: 'profit', aggregation: 'sum', color: '#36a41d' },
  { id: 'meas4', name: 'Quantity', field: 'quantity', aggregation: 'sum', color: '#a100c2' },
];

export const kpis: KPI[] = [
  { id: '1', title: 'Total Revenue', value: 2450000, unit: '$', trend: 'up', change: 12.5 },
  { id: '2', title: 'Gross Margin', value: 34.2, unit: '%', trend: 'up', change: 2.1 },
  { id: '3', title: 'Operating Costs', value: 890000, unit: '$', trend: 'down', change: -5.3 },
  { id: '4', title: 'Customer Count', value: 12450, unit: '', trend: 'up', change: 8.7 },
];

export const defaultStories: Story[] = [
  {
    id: '1',
    title: 'Q4 Financial Overview',
    description: 'Quarterly financial performance analysis',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    author: 'John Doe',
    isSaved: true,
    pages: [
      {
        id: 'p1',
        title: 'Overview',
        widgets: [
          {
            id: 'w1',
            type: 'chart',
            chartType: 'column',
            title: 'Revenue & Profit by Region',
            dimensions: [availableDimensions[0]],
            measures: [availableMeasures[0], availableMeasures[2]],
            filters: []
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Sales Performance Dashboard',
    description: 'Regional sales metrics and KPIs',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    author: 'Jane Smith',
    isSaved: true,
    pages: [
      {
        id: 'p1',
        title: 'Sales Overview',
        widgets: []
      }
    ]
  },
  {
    id: '3',
    title: 'Cost Analysis Report',
    description: 'Operating cost breakdown by department',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
    author: 'Mike Johnson',
    isSaved: true,
    pages: [
      {
        id: 'p1',
        title: 'Cost Breakdown',
        widgets: []
      }
    ]
  },
];

export const filters: Filter[] = [
  { id: '1', label: 'Year', options: ['All', '2024', '2023'], selected: 'All' },
  { id: '2', label: 'Region', options: ['All', 'North America', 'Europe', 'Asia Pacific', 'Latin America'], selected: 'All' },
  { id: '3', label: 'Product', options: ['All', 'Product A', 'Product B'], selected: 'All' },
];
