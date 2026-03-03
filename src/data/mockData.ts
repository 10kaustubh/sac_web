import { KPI, Story, Filter, DataRow, Dimension, Measure, DataModel, StoryTemplate } from '../types';

export const rawData: DataRow[] = [
  // 2024 Data
  { id: '1', region: 'North America', product: 'Product A', year: '2024', month: 'Jan', revenue: 186000, costs: 120000, profit: 66000, quantity: 450 },
  { id: '2', region: 'North America', product: 'Product B', year: '2024', month: 'Jan', revenue: 145000, costs: 95000, profit: 50000, quantity: 380 },
  { id: '3', region: 'North America', product: 'Product C', year: '2024', month: 'Jan', revenue: 125000, costs: 82000, profit: 43000, quantity: 320 },
  { id: '4', region: 'North America', product: 'Product A', year: '2024', month: 'Feb', revenue: 205000, costs: 125000, profit: 80000, quantity: 520 },
  { id: '5', region: 'North America', product: 'Product B', year: '2024', month: 'Feb', revenue: 165000, costs: 105000, profit: 60000, quantity: 410 },
  { id: '6', region: 'North America', product: 'Product C', year: '2024', month: 'Feb', revenue: 138000, costs: 90000, profit: 48000, quantity: 350 },
  { id: '7', region: 'North America', product: 'Product A', year: '2024', month: 'Mar', revenue: 237000, costs: 130000, profit: 107000, quantity: 580 },
  { id: '8', region: 'North America', product: 'Product B', year: '2024', month: 'Mar', revenue: 178000, costs: 112000, profit: 66000, quantity: 445 },
  { id: '9', region: 'North America', product: 'Product C', year: '2024', month: 'Mar', revenue: 152000, costs: 98000, profit: 54000, quantity: 385 },
  { id: '10', region: 'North America', product: 'Product A', year: '2024', month: 'Apr', revenue: 245000, costs: 135000, profit: 110000, quantity: 600 },
  { id: '11', region: 'North America', product: 'Product B', year: '2024', month: 'Apr', revenue: 185000, costs: 118000, profit: 67000, quantity: 460 },
  { id: '12', region: 'North America', product: 'Product C', year: '2024', month: 'Apr', revenue: 162000, costs: 105000, profit: 57000, quantity: 405 },
  { id: '13', region: 'Europe', product: 'Product A', year: '2024', month: 'Jan', revenue: 156000, costs: 100000, profit: 56000, quantity: 390 },
  { id: '14', region: 'Europe', product: 'Product B', year: '2024', month: 'Jan', revenue: 132000, costs: 88000, profit: 44000, quantity: 330 },
  { id: '15', region: 'Europe', product: 'Product C', year: '2024', month: 'Jan', revenue: 118000, costs: 78000, profit: 40000, quantity: 295 },
  { id: '16', region: 'Europe', product: 'Product A', year: '2024', month: 'Feb', revenue: 175000, costs: 108000, profit: 67000, quantity: 440 },
  { id: '17', region: 'Europe', product: 'Product B', year: '2024', month: 'Feb', revenue: 148000, costs: 96000, profit: 52000, quantity: 370 },
  { id: '18', region: 'Europe', product: 'Product C', year: '2024', month: 'Feb', revenue: 128000, costs: 85000, profit: 43000, quantity: 320 },
  { id: '19', region: 'Europe', product: 'Product A', year: '2024', month: 'Mar', revenue: 198000, costs: 118000, profit: 80000, quantity: 495 },
  { id: '20', region: 'Europe', product: 'Product B', year: '2024', month: 'Mar', revenue: 162000, costs: 102000, profit: 60000, quantity: 405 },
  { id: '21', region: 'Europe', product: 'Product C', year: '2024', month: 'Mar', revenue: 142000, costs: 92000, profit: 50000, quantity: 355 },
  { id: '22', region: 'Europe', product: 'Product A', year: '2024', month: 'Apr', revenue: 210000, costs: 125000, profit: 85000, quantity: 525 },
  { id: '23', region: 'Europe', product: 'Product B', year: '2024', month: 'Apr', revenue: 175000, costs: 110000, profit: 65000, quantity: 438 },
  { id: '24', region: 'Europe', product: 'Product C', year: '2024', month: 'Apr', revenue: 155000, costs: 100000, profit: 55000, quantity: 388 },
  { id: '25', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Jan', revenue: 120000, costs: 78000, profit: 42000, quantity: 300 },
  { id: '26', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Jan', revenue: 98000, costs: 65000, profit: 33000, quantity: 245 },
  { id: '27', region: 'Asia Pacific', product: 'Product C', year: '2024', month: 'Jan', revenue: 85000, costs: 58000, profit: 27000, quantity: 212 },
  { id: '28', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Feb', revenue: 138000, costs: 85000, profit: 53000, quantity: 345 },
  { id: '29', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Feb', revenue: 112000, costs: 72000, profit: 40000, quantity: 280 },
  { id: '30', region: 'Asia Pacific', product: 'Product C', year: '2024', month: 'Feb', revenue: 95000, costs: 62000, profit: 33000, quantity: 238 },
  { id: '31', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Mar', revenue: 155000, costs: 92000, profit: 63000, quantity: 388 },
  { id: '32', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Mar', revenue: 128000, costs: 80000, profit: 48000, quantity: 320 },
  { id: '33', region: 'Asia Pacific', product: 'Product C', year: '2024', month: 'Mar', revenue: 108000, costs: 70000, profit: 38000, quantity: 270 },
  { id: '34', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Apr', revenue: 168000, costs: 98000, profit: 70000, quantity: 420 },
  { id: '35', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Apr', revenue: 142000, costs: 88000, profit: 54000, quantity: 355 },
  { id: '36', region: 'Asia Pacific', product: 'Product C', year: '2024', month: 'Apr', revenue: 118000, costs: 75000, profit: 43000, quantity: 295 },
  { id: '37', region: 'Latin America', product: 'Product A', year: '2024', month: 'Jan', revenue: 85000, costs: 55000, profit: 30000, quantity: 212 },
  { id: '38', region: 'Latin America', product: 'Product B', year: '2024', month: 'Jan', revenue: 72000, costs: 48000, profit: 24000, quantity: 180 },
  { id: '39', region: 'Latin America', product: 'Product C', year: '2024', month: 'Jan', revenue: 62000, costs: 42000, profit: 20000, quantity: 155 },
  { id: '40', region: 'Latin America', product: 'Product A', year: '2024', month: 'Feb', revenue: 95000, costs: 60000, profit: 35000, quantity: 238 },
  { id: '41', region: 'Latin America', product: 'Product B', year: '2024', month: 'Feb', revenue: 82000, costs: 53000, profit: 29000, quantity: 205 },
  { id: '42', region: 'Latin America', product: 'Product C', year: '2024', month: 'Feb', revenue: 70000, costs: 46000, profit: 24000, quantity: 175 },
  { id: '43', region: 'Latin America', product: 'Product A', year: '2024', month: 'Mar', revenue: 108000, costs: 68000, profit: 40000, quantity: 270 },
  { id: '44', region: 'Latin America', product: 'Product B', year: '2024', month: 'Mar', revenue: 92000, costs: 58000, profit: 34000, quantity: 230 },
  { id: '45', region: 'Latin America', product: 'Product C', year: '2024', month: 'Mar', revenue: 78000, costs: 50000, profit: 28000, quantity: 195 },
  { id: '46', region: 'Latin America', product: 'Product A', year: '2024', month: 'Apr', revenue: 118000, costs: 72000, profit: 46000, quantity: 295 },
  { id: '47', region: 'Latin America', product: 'Product B', year: '2024', month: 'Apr', revenue: 102000, costs: 65000, profit: 37000, quantity: 255 },
  { id: '48', region: 'Latin America', product: 'Product C', year: '2024', month: 'Apr', revenue: 88000, costs: 56000, profit: 32000, quantity: 220 },
  // 2023 Data
  { id: '49', region: 'North America', product: 'Product A', year: '2023', month: 'Jan', revenue: 165000, costs: 110000, profit: 55000, quantity: 400 },
  { id: '50', region: 'North America', product: 'Product B', year: '2023', month: 'Jan', revenue: 128000, costs: 85000, profit: 43000, quantity: 340 },
  { id: '51', region: 'North America', product: 'Product C', year: '2023', month: 'Jan', revenue: 108000, costs: 72000, profit: 36000, quantity: 280 },
  { id: '52', region: 'North America', product: 'Product A', year: '2023', month: 'Feb', revenue: 178000, costs: 115000, profit: 63000, quantity: 445 },
  { id: '53', region: 'North America', product: 'Product B', year: '2023', month: 'Feb', revenue: 142000, costs: 92000, profit: 50000, quantity: 355 },
  { id: '54', region: 'North America', product: 'Product C', year: '2023', month: 'Feb', revenue: 118000, costs: 78000, profit: 40000, quantity: 295 },
  { id: '55', region: 'Europe', product: 'Product A', year: '2023', month: 'Jan', revenue: 142000, costs: 92000, profit: 50000, quantity: 355 },
  { id: '56', region: 'Europe', product: 'Product B', year: '2023', month: 'Jan', revenue: 118000, costs: 78000, profit: 40000, quantity: 295 },
  { id: '57', region: 'Europe', product: 'Product C', year: '2023', month: 'Jan', revenue: 102000, costs: 68000, profit: 34000, quantity: 255 },
  { id: '58', region: 'Europe', product: 'Product A', year: '2023', month: 'Feb', revenue: 158000, costs: 100000, profit: 58000, quantity: 395 },
  { id: '59', region: 'Europe', product: 'Product B', year: '2023', month: 'Feb', revenue: 132000, costs: 86000, profit: 46000, quantity: 330 },
  { id: '60', region: 'Europe', product: 'Product C', year: '2023', month: 'Feb', revenue: 112000, costs: 74000, profit: 38000, quantity: 280 },
  { id: '61', region: 'Asia Pacific', product: 'Product A', year: '2023', month: 'Jan', revenue: 105000, costs: 70000, profit: 35000, quantity: 262 },
  { id: '62', region: 'Asia Pacific', product: 'Product B', year: '2023', month: 'Jan', revenue: 88000, costs: 58000, profit: 30000, quantity: 220 },
  { id: '63', region: 'Asia Pacific', product: 'Product C', year: '2023', month: 'Jan', revenue: 75000, costs: 50000, profit: 25000, quantity: 188 },
  { id: '64', region: 'Latin America', product: 'Product A', year: '2023', month: 'Jan', revenue: 72000, costs: 48000, profit: 24000, quantity: 180 },
  { id: '65', region: 'Latin America', product: 'Product B', year: '2023', month: 'Jan', revenue: 62000, costs: 42000, profit: 20000, quantity: 155 },
  { id: '66', region: 'Latin America', product: 'Product C', year: '2023', month: 'Jan', revenue: 52000, costs: 35000, profit: 17000, quantity: 130 },
];

export const availableDimensions: Dimension[] = [
  { id: 'dim1', name: 'Region', field: 'region', values: ['North America', 'Europe', 'Asia Pacific', 'Latin America'] },
  { id: 'dim2', name: 'Product', field: 'product', values: ['Product A', 'Product B', 'Product C'] },
  { id: 'dim3', name: 'Year', field: 'year', values: ['2024', '2023'] },
  { id: 'dim4', name: 'Month', field: 'month', values: ['Jan', 'Feb', 'Mar', 'Apr'] },
];

export const availableMeasures: Measure[] = [
  { id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum', color: '#0a6ed1' },
  { id: 'meas2', name: 'Costs', field: 'costs', aggregation: 'sum', color: '#df6e0c' },
  { id: 'meas3', name: 'Profit', field: 'profit', aggregation: 'sum', color: '#36a41d' },
  { id: 'meas4', name: 'Quantity', field: 'quantity', aggregation: 'sum', color: '#a100c2' },
];

export const dataModels: DataModel[] = [
  {
    id: 'model1',
    name: 'Sales Performance',
    description: 'Comprehensive sales data including revenue, costs, and profit by region and product',
    type: 'import',
    source: 'SAP S/4HANA',
    columns: [
      { id: 'col1', name: 'Region', field: 'region', type: 'dimension', dataType: 'string' },
      { id: 'col2', name: 'Product', field: 'product', type: 'dimension', dataType: 'string' },
      { id: 'col3', name: 'Year', field: 'year', type: 'dimension', dataType: 'string' },
      { id: 'col4', name: 'Month', field: 'month', type: 'dimension', dataType: 'string' },
      { id: 'col5', name: 'Revenue', field: 'revenue', type: 'measure', dataType: 'number' },
      { id: 'col6', name: 'Costs', field: 'costs', type: 'measure', dataType: 'number' },
      { id: 'col7', name: 'Profit', field: 'profit', type: 'measure', dataType: 'number' },
      { id: 'col8', name: 'Quantity', field: 'quantity', type: 'measure', dataType: 'number' },
    ],
    lastRefresh: '2024-01-20 09:30:00',
    rowCount: 66
  },
  {
    id: 'model2',
    name: 'Customer Analytics',
    description: 'Customer segmentation, lifetime value, and behavioral analytics',
    type: 'live',
    source: 'SAP HANA Cloud',
    columns: [
      { id: 'col1', name: 'Customer ID', field: 'customerId', type: 'dimension', dataType: 'string' },
      { id: 'col2', name: 'Customer Name', field: 'customerName', type: 'dimension', dataType: 'string' },
      { id: 'col3', name: 'Segment', field: 'segment', type: 'dimension', dataType: 'string' },
      { id: 'col4', name: 'Industry', field: 'industry', type: 'dimension', dataType: 'string' },
      { id: 'col5', name: 'Country', field: 'country', type: 'dimension', dataType: 'string' },
      { id: 'col6', name: 'Lifetime Value', field: 'ltv', type: 'measure', dataType: 'number' },
      { id: 'col7', name: 'Total Orders', field: 'totalOrders', type: 'measure', dataType: 'number' },
      { id: 'col8', name: 'Avg Order Value', field: 'avgOrderValue', type: 'measure', dataType: 'number' },
      { id: 'col9', name: 'Churn Risk', field: 'churnRisk', type: 'measure', dataType: 'number' },
    ],
    lastRefresh: '2024-01-20 12:00:00',
    rowCount: 15420
  },
  {
    id: 'model3',
    name: 'Inventory Management',
    description: 'Real-time inventory levels, stock movements, and warehouse data',
    type: 'live',
    source: 'SAP EWM',
    columns: [
      { id: 'col1', name: 'SKU', field: 'sku', type: 'dimension', dataType: 'string' },
      { id: 'col2', name: 'Product Name', field: 'productName', type: 'dimension', dataType: 'string' },
      { id: 'col3', name: 'Warehouse', field: 'warehouse', type: 'dimension', dataType: 'string' },
      { id: 'col4', name: 'Location', field: 'location', type: 'dimension', dataType: 'string' },
      { id: 'col5', name: 'Category', field: 'category', type: 'dimension', dataType: 'string' },
      { id: 'col6', name: 'Stock Level', field: 'stockLevel', type: 'measure', dataType: 'number' },
      { id: 'col7', name: 'Reorder Point', field: 'reorderPoint', type: 'measure', dataType: 'number' },
      { id: 'col8', name: 'Unit Cost', field: 'unitCost', type: 'measure', dataType: 'number' },
      { id: 'col9', name: 'Stock Value', field: 'stockValue', type: 'measure', dataType: 'number' },
    ],
    lastRefresh: '2024-01-20 14:30:00',
    rowCount: 8750
  },
  {
    id: 'model4',
    name: 'Financial Planning',
    description: 'Budget, actuals, and variance analysis for financial planning',
    type: 'import',
    source: 'Excel Upload',
    columns: [
      { id: 'col1', name: 'Cost Center', field: 'costCenter', type: 'dimension', dataType: 'string' },
      { id: 'col2', name: 'Department', field: 'department', type: 'dimension', dataType: 'string' },
      { id: 'col3', name: 'Account', field: 'account', type: 'dimension', dataType: 'string' },
      { id: 'col4', name: 'Fiscal Year', field: 'fiscalYear', type: 'dimension', dataType: 'string' },
      { id: 'col5', name: 'Period', field: 'period', type: 'dimension', dataType: 'string' },
      { id: 'col6', name: 'Budget', field: 'budget', type: 'measure', dataType: 'number' },
      { id: 'col7', name: 'Actual', field: 'actual', type: 'measure', dataType: 'number' },
      { id: 'col8', name: 'Variance', field: 'variance', type: 'measure', dataType: 'number' },
      { id: 'col9', name: 'Variance %', field: 'variancePercent', type: 'measure', dataType: 'number' },
    ],
    lastRefresh: '2024-01-19 16:00:00',
    rowCount: 4280
  },
  {
    id: 'model5',
    name: 'HR Analytics',
    description: 'Employee data, headcount, turnover, and workforce analytics',
    type: 'live',
    source: 'SAP SuccessFactors',
    columns: [
      { id: 'col1', name: 'Employee ID', field: 'employeeId', type: 'dimension', dataType: 'string' },
      { id: 'col2', name: 'Department', field: 'department', type: 'dimension', dataType: 'string' },
      { id: 'col3', name: 'Job Level', field: 'jobLevel', type: 'dimension', dataType: 'string' },
      { id: 'col4', name: 'Location', field: 'location', type: 'dimension', dataType: 'string' },
      { id: 'col5', name: 'Hire Date', field: 'hireDate', type: 'dimension', dataType: 'date' },
      { id: 'col6', name: 'Salary', field: 'salary', type: 'measure', dataType: 'number' },
      { id: 'col7', name: 'Bonus', field: 'bonus', type: 'measure', dataType: 'number' },
      { id: 'col8', name: 'Performance Score', field: 'performanceScore', type: 'measure', dataType: 'number' },
      { id: 'col9', name: 'Training Hours', field: 'trainingHours', type: 'measure', dataType: 'number' },
    ],
    lastRefresh: '2024-01-20 08:00:00',
    rowCount: 3250
  },
  {
    id: 'model6',
    name: 'Supply Chain',
    description: 'Supplier performance, procurement, and logistics data',
    type: 'live',
    source: 'SAP Ariba',
    columns: [
      { id: 'col1', name: 'Supplier ID', field: 'supplierId', type: 'dimension', dataType: 'string' },
      { id: 'col2', name: 'Supplier Name', field: 'supplierName', type: 'dimension', dataType: 'string' },
      { id: 'col3', name: 'Category', field: 'category', type: 'dimension', dataType: 'string' },
      { id: 'col4', name: 'Region', field: 'region', type: 'dimension', dataType: 'string' },
      { id: 'col5', name: 'Contract Type', field: 'contractType', type: 'dimension', dataType: 'string' },
      { id: 'col6', name: 'Spend', field: 'spend', type: 'measure', dataType: 'number' },
      { id: 'col7', name: 'On-Time Delivery %', field: 'onTimeDelivery', type: 'measure', dataType: 'number' },
      { id: 'col8', name: 'Quality Score', field: 'qualityScore', type: 'measure', dataType: 'number' },
      { id: 'col9', name: 'Lead Time (Days)', field: 'leadTime', type: 'measure', dataType: 'number' },
    ],
    lastRefresh: '2024-01-20 11:00:00',
    rowCount: 1850
  }
];

export const storyTemplates: StoryTemplate[] = [
  {
    id: 'template1',
    name: 'Executive Dashboard',
    description: 'High-level KPIs and trends for executive reporting',
    thumbnail: '📊',
    category: 'Finance',
    pages: [
      {
        id: 'tp1',
        title: 'Overview',
        widgets: [
          {
            id: 'tw1',
            type: 'kpi',
            title: 'Revenue KPI',
            dimensions: [availableDimensions[0]],
            measures: [availableMeasures[0]],
            filters: []
          },
          {
            id: 'tw2',
            type: 'chart',
            chartType: 'line',
            title: 'Revenue Trend',
            dimensions: [availableDimensions[3]],
            measures: [availableMeasures[0], availableMeasures[2]],
            filters: []
          }
        ]
      }
    ]
  },
  {
    id: 'template2',
    name: 'Sales Analysis',
    description: 'Detailed sales performance by region and product',
    thumbnail: '📈',
    category: 'Sales',
    pages: [
      {
        id: 'tp1',
        title: 'Regional Sales',
        widgets: [
          {
            id: 'tw1',
            type: 'chart',
            chartType: 'column',
            title: 'Sales by Region',
            dimensions: [availableDimensions[0]],
            measures: [availableMeasures[0]],
            filters: []
          },
          {
            id: 'tw2',
            type: 'chart',
            chartType: 'pie',
            title: 'Product Mix',
            dimensions: [availableDimensions[1]],
            measures: [availableMeasures[0]],
            filters: []
          }
        ]
      },
      {
        id: 'tp2',
        title: 'Product Details',
        widgets: [
          {
            id: 'tw3',
            type: 'table',
            title: 'Product Performance',
            dimensions: [availableDimensions[1]],
            measures: [availableMeasures[0], availableMeasures[2]],
            filters: []
          }
        ]
      }
    ]
  },
  {
    id: 'template3',
    name: 'Cost Analysis',
    description: 'Operating costs and margin analysis',
    thumbnail: '��',
    category: 'Finance',
    pages: [
      {
        id: 'tp1',
        title: 'Cost Overview',
        widgets: [
          {
            id: 'tw1',
            type: 'chart',
            chartType: 'stacked',
            title: 'Revenue vs Costs',
            dimensions: [availableDimensions[3]],
            measures: [availableMeasures[0], availableMeasures[1]],
            filters: []
          }
        ]
      }
    ]
  },
  {
    id: 'template4',
    name: 'Blank Canvas',
    description: 'Start with a blank story',
    thumbnail: '📄',
    category: 'General',
    pages: [
      {
        id: 'tp1',
        title: 'Page 1',
        widgets: []
      }
    ]
  }
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
    tags: ['finance', 'quarterly'],
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
        ],
        layout: [{ i: 'w1', x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 2 }]
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
    tags: ['sales', 'regional'],
    pages: [
      {
        id: 'p1',
        title: 'Sales Overview',
        widgets: [],
        layout: []
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
    tags: ['costs', 'operations'],
    pages: [
      {
        id: 'p1',
        title: 'Cost Breakdown',
        widgets: [],
        layout: []
      }
    ]
  },
];

export const filters: Filter[] = [
  { id: '1', label: 'Year', options: ['All', '2024', '2023'], selected: 'All' },
  { id: '2', label: 'Region', options: ['All', 'North America', 'Europe', 'Asia Pacific', 'Latin America'], selected: 'All' },
  { id: '3', label: 'Product', options: ['All', 'Product A', 'Product B', 'Product C'], selected: 'All' },
];
