import { Story, Filter, DataRow, Dimension, Measure, DataModel, StoryTemplate, SmartInsight } from '../types';

export const rawData: DataRow[] = [
  { id: '1', region: 'North America', product: 'Product A', year: '2024', month: 'Jan', revenue: 186000, costs: 120000, profit: 66000, quantity: 450, plan_revenue: 180000, plan_costs: 115000, plan_profit: 65000, previous_year_revenue: 165000, latitude: 40.7128, longitude: -74.0060 },
  { id: '2', region: 'North America', product: 'Product B', year: '2024', month: 'Jan', revenue: 145000, costs: 95000, profit: 50000, quantity: 380, plan_revenue: 140000, plan_costs: 90000, plan_profit: 50000, previous_year_revenue: 128000, latitude: 40.7128, longitude: -74.0060 },
  { id: '3', region: 'North America', product: 'Product C', year: '2024', month: 'Jan', revenue: 125000, costs: 82000, profit: 43000, quantity: 320, plan_revenue: 120000, plan_costs: 80000, plan_profit: 40000, previous_year_revenue: 108000, latitude: 40.7128, longitude: -74.0060 },
  { id: '4', region: 'North America', product: 'Product A', year: '2024', month: 'Feb', revenue: 205000, costs: 125000, profit: 80000, quantity: 520, plan_revenue: 195000, plan_costs: 120000, plan_profit: 75000, previous_year_revenue: 178000, latitude: 40.7128, longitude: -74.0060 },
  { id: '5', region: 'North America', product: 'Product B', year: '2024', month: 'Feb', revenue: 165000, costs: 105000, profit: 60000, quantity: 410, plan_revenue: 160000, plan_costs: 100000, plan_profit: 60000, previous_year_revenue: 142000, latitude: 40.7128, longitude: -74.0060 },
  { id: '6', region: 'North America', product: 'Product C', year: '2024', month: 'Feb', revenue: 138000, costs: 90000, profit: 48000, quantity: 350, plan_revenue: 135000, plan_costs: 88000, plan_profit: 47000, previous_year_revenue: 118000, latitude: 40.7128, longitude: -74.0060 },
  { id: '7', region: 'North America', product: 'Product A', year: '2024', month: 'Mar', revenue: 237000, costs: 130000, profit: 107000, quantity: 580, plan_revenue: 220000, plan_costs: 125000, plan_profit: 95000, previous_year_revenue: 198000, latitude: 40.7128, longitude: -74.0060 },
  { id: '8', region: 'North America', product: 'Product B', year: '2024', month: 'Mar', revenue: 178000, costs: 112000, profit: 66000, quantity: 445, plan_revenue: 170000, plan_costs: 108000, plan_profit: 62000, previous_year_revenue: 155000, latitude: 40.7128, longitude: -74.0060 },
  { id: '9', region: 'North America', product: 'Product C', year: '2024', month: 'Mar', revenue: 152000, costs: 98000, profit: 54000, quantity: 385, plan_revenue: 148000, plan_costs: 95000, plan_profit: 53000, previous_year_revenue: 130000, latitude: 40.7128, longitude: -74.0060 },
  { id: '10', region: 'North America', product: 'Product A', year: '2024', month: 'Apr', revenue: 245000, costs: 135000, profit: 110000, quantity: 600, plan_revenue: 230000, plan_costs: 130000, plan_profit: 100000, previous_year_revenue: 210000, latitude: 40.7128, longitude: -74.0060 },
  { id: '11', region: 'North America', product: 'Product B', year: '2024', month: 'Apr', revenue: 185000, costs: 118000, profit: 67000, quantity: 460, plan_revenue: 175000, plan_costs: 112000, plan_profit: 63000, previous_year_revenue: 162000, latitude: 40.7128, longitude: -74.0060 },
  { id: '12', region: 'North America', product: 'Product C', year: '2024', month: 'Apr', revenue: 162000, costs: 105000, profit: 57000, quantity: 405, plan_revenue: 155000, plan_costs: 100000, plan_profit: 55000, previous_year_revenue: 140000, latitude: 40.7128, longitude: -74.0060 },
  { id: '13', region: 'Europe', product: 'Product A', year: '2024', month: 'Jan', revenue: 156000, costs: 100000, profit: 56000, quantity: 390, plan_revenue: 150000, plan_costs: 98000, plan_profit: 52000, previous_year_revenue: 142000, latitude: 51.5074, longitude: -0.1278 },
  { id: '14', region: 'Europe', product: 'Product B', year: '2024', month: 'Jan', revenue: 132000, costs: 88000, profit: 44000, quantity: 330, plan_revenue: 128000, plan_costs: 85000, plan_profit: 43000, previous_year_revenue: 118000, latitude: 51.5074, longitude: -0.1278 },
  { id: '15', region: 'Europe', product: 'Product C', year: '2024', month: 'Jan', revenue: 118000, costs: 78000, profit: 40000, quantity: 295, plan_revenue: 115000, plan_costs: 75000, plan_profit: 40000, previous_year_revenue: 102000, latitude: 51.5074, longitude: -0.1278 },
  { id: '16', region: 'Europe', product: 'Product A', year: '2024', month: 'Feb', revenue: 175000, costs: 108000, profit: 67000, quantity: 440, plan_revenue: 168000, plan_costs: 105000, plan_profit: 63000, previous_year_revenue: 158000, latitude: 51.5074, longitude: -0.1278 },
  { id: '17', region: 'Europe', product: 'Product B', year: '2024', month: 'Feb', revenue: 148000, costs: 96000, profit: 52000, quantity: 370, plan_revenue: 142000, plan_costs: 92000, plan_profit: 50000, previous_year_revenue: 132000, latitude: 51.5074, longitude: -0.1278 },
  { id: '18', region: 'Europe', product: 'Product C', year: '2024', month: 'Feb', revenue: 128000, costs: 85000, profit: 43000, quantity: 320, plan_revenue: 125000, plan_costs: 82000, plan_profit: 43000, previous_year_revenue: 112000, latitude: 51.5074, longitude: -0.1278 },
  { id: '19', region: 'Europe', product: 'Product A', year: '2024', month: 'Mar', revenue: 198000, costs: 118000, profit: 80000, quantity: 495, plan_revenue: 185000, plan_costs: 112000, plan_profit: 73000, previous_year_revenue: 175000, latitude: 51.5074, longitude: -0.1278 },
  { id: '20', region: 'Europe', product: 'Product B', year: '2024', month: 'Mar', revenue: 162000, costs: 102000, profit: 60000, quantity: 405, plan_revenue: 155000, plan_costs: 98000, plan_profit: 57000, previous_year_revenue: 148000, latitude: 51.5074, longitude: -0.1278 },
  { id: '21', region: 'Europe', product: 'Product C', year: '2024', month: 'Mar', revenue: 142000, costs: 92000, profit: 50000, quantity: 355, plan_revenue: 138000, plan_costs: 90000, plan_profit: 48000, previous_year_revenue: 125000, latitude: 51.5074, longitude: -0.1278 },
  { id: '22', region: 'Europe', product: 'Product A', year: '2024', month: 'Apr', revenue: 210000, costs: 125000, profit: 85000, quantity: 525, plan_revenue: 198000, plan_costs: 118000, plan_profit: 80000, previous_year_revenue: 188000, latitude: 51.5074, longitude: -0.1278 },
  { id: '23', region: 'Europe', product: 'Product B', year: '2024', month: 'Apr', revenue: 175000, costs: 110000, profit: 65000, quantity: 438, plan_revenue: 168000, plan_costs: 105000, plan_profit: 63000, previous_year_revenue: 158000, latitude: 51.5074, longitude: -0.1278 },
  { id: '24', region: 'Europe', product: 'Product C', year: '2024', month: 'Apr', revenue: 155000, costs: 100000, profit: 55000, quantity: 388, plan_revenue: 150000, plan_costs: 96000, plan_profit: 54000, previous_year_revenue: 138000, latitude: 51.5074, longitude: -0.1278 },
  { id: '25', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Jan', revenue: 120000, costs: 78000, profit: 42000, quantity: 300, plan_revenue: 115000, plan_costs: 75000, plan_profit: 40000, previous_year_revenue: 105000, latitude: 35.6762, longitude: 139.6503 },
  { id: '26', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Jan', revenue: 98000, costs: 65000, profit: 33000, quantity: 245, plan_revenue: 95000, plan_costs: 62000, plan_profit: 33000, previous_year_revenue: 88000, latitude: 35.6762, longitude: 139.6503 },
  { id: '27', region: 'Asia Pacific', product: 'Product C', year: '2024', month: 'Jan', revenue: 85000, costs: 58000, profit: 27000, quantity: 212, plan_revenue: 82000, plan_costs: 55000, plan_profit: 27000, previous_year_revenue: 75000, latitude: 35.6762, longitude: 139.6503 },
  { id: '28', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Feb', revenue: 138000, costs: 85000, profit: 53000, quantity: 345, plan_revenue: 130000, plan_costs: 82000, plan_profit: 48000, previous_year_revenue: 118000, latitude: 35.6762, longitude: 139.6503 },
  { id: '29', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Feb', revenue: 112000, costs: 72000, profit: 40000, quantity: 280, plan_revenue: 108000, plan_costs: 70000, plan_profit: 38000, previous_year_revenue: 98000, latitude: 35.6762, longitude: 139.6503 },
  { id: '30', region: 'Asia Pacific', product: 'Product C', year: '2024', month: 'Feb', revenue: 95000, costs: 62000, profit: 33000, quantity: 238, plan_revenue: 92000, plan_costs: 60000, plan_profit: 32000, previous_year_revenue: 82000, latitude: 35.6762, longitude: 139.6503 },
  { id: '31', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Mar', revenue: 155000, costs: 92000, profit: 63000, quantity: 388, plan_revenue: 145000, plan_costs: 88000, plan_profit: 57000, previous_year_revenue: 135000, latitude: 35.6762, longitude: 139.6503 },
  { id: '32', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Mar', revenue: 128000, costs: 80000, profit: 48000, quantity: 320, plan_revenue: 122000, plan_costs: 78000, plan_profit: 44000, previous_year_revenue: 112000, latitude: 35.6762, longitude: 139.6503 },
  { id: '33', region: 'Asia Pacific', product: 'Product C', year: '2024', month: 'Mar', revenue: 108000, costs: 70000, profit: 38000, quantity: 270, plan_revenue: 105000, plan_costs: 68000, plan_profit: 37000, previous_year_revenue: 95000, latitude: 35.6762, longitude: 139.6503 },
  { id: '34', region: 'Asia Pacific', product: 'Product A', year: '2024', month: 'Apr', revenue: 168000, costs: 98000, profit: 70000, quantity: 420, plan_revenue: 158000, plan_costs: 94000, plan_profit: 64000, previous_year_revenue: 148000, latitude: 35.6762, longitude: 139.6503 },
  { id: '35', region: 'Asia Pacific', product: 'Product B', year: '2024', month: 'Apr', revenue: 142000, costs: 88000, profit: 54000, quantity: 355, plan_revenue: 135000, plan_costs: 85000, plan_profit: 50000, previous_year_revenue: 125000, latitude: 35.6762, longitude: 139.6503 },
  { id: '36', region: 'Asia Pacific', product: 'Product C', year: '2024', month: 'Apr', revenue: 118000, costs: 75000, profit: 43000, quantity: 295, plan_revenue: 112000, plan_costs: 72000, plan_profit: 40000, previous_year_revenue: 105000, latitude: 35.6762, longitude: 139.6503 },
  { id: '37', region: 'Latin America', product: 'Product A', year: '2024', month: 'Jan', revenue: 85000, costs: 55000, profit: 30000, quantity: 212, plan_revenue: 82000, plan_costs: 53000, plan_profit: 29000, previous_year_revenue: 72000, latitude: -23.5505, longitude: -46.6333 },
  { id: '38', region: 'Latin America', product: 'Product B', year: '2024', month: 'Jan', revenue: 72000, costs: 48000, profit: 24000, quantity: 180, plan_revenue: 70000, plan_costs: 46000, plan_profit: 24000, previous_year_revenue: 62000, latitude: -23.5505, longitude: -46.6333 },
  { id: '39', region: 'Latin America', product: 'Product C', year: '2024', month: 'Jan', revenue: 62000, costs: 42000, profit: 20000, quantity: 155, plan_revenue: 60000, plan_costs: 40000, plan_profit: 20000, previous_year_revenue: 52000, latitude: -23.5505, longitude: -46.6333 },
  { id: '40', region: 'Latin America', product: 'Product A', year: '2024', month: 'Feb', revenue: 95000, costs: 60000, profit: 35000, quantity: 238, plan_revenue: 90000, plan_costs: 58000, plan_profit: 32000, previous_year_revenue: 82000, latitude: -23.5505, longitude: -46.6333 },
  { id: '41', region: 'Latin America', product: 'Product B', year: '2024', month: 'Feb', revenue: 82000, costs: 53000, profit: 29000, quantity: 205, plan_revenue: 78000, plan_costs: 50000, plan_profit: 28000, previous_year_revenue: 70000, latitude: -23.5505, longitude: -46.6333 },
  { id: '42', region: 'Latin America', product: 'Product C', year: '2024', month: 'Feb', revenue: 70000, costs: 46000, profit: 24000, quantity: 175, plan_revenue: 68000, plan_costs: 44000, plan_profit: 24000, previous_year_revenue: 60000, latitude: -23.5505, longitude: -46.6333 },
  { id: '43', region: 'Latin America', product: 'Product A', year: '2024', month: 'Mar', revenue: 108000, costs: 68000, profit: 40000, quantity: 270, plan_revenue: 102000, plan_costs: 65000, plan_profit: 37000, previous_year_revenue: 92000, latitude: -23.5505, longitude: -46.6333 },
  { id: '44', region: 'Latin America', product: 'Product B', year: '2024', month: 'Mar', revenue: 92000, costs: 58000, profit: 34000, quantity: 230, plan_revenue: 88000, plan_costs: 56000, plan_profit: 32000, previous_year_revenue: 78000, latitude: -23.5505, longitude: -46.6333 },
  { id: '45', region: 'Latin America', product: 'Product C', year: '2024', month: 'Mar', revenue: 78000, costs: 50000, profit: 28000, quantity: 195, plan_revenue: 75000, plan_costs: 48000, plan_profit: 27000, previous_year_revenue: 68000, latitude: -23.5505, longitude: -46.6333 },
  { id: '46', region: 'Latin America', product: 'Product A', year: '2024', month: 'Apr', revenue: 118000, costs: 72000, profit: 46000, quantity: 295, plan_revenue: 110000, plan_costs: 68000, plan_profit: 42000, previous_year_revenue: 102000, latitude: -23.5505, longitude: -46.6333 },
  { id: '47', region: 'Latin America', product: 'Product B', year: '2024', month: 'Apr', revenue: 102000, costs: 65000, profit: 37000, quantity: 255, plan_revenue: 98000, plan_costs: 62000, plan_profit: 36000, previous_year_revenue: 88000, latitude: -23.5505, longitude: -46.6333 },
  { id: '48', region: 'Latin America', product: 'Product C', year: '2024', month: 'Apr', revenue: 88000, costs: 56000, profit: 32000, quantity: 220, plan_revenue: 85000, plan_costs: 54000, plan_profit: 31000, previous_year_revenue: 75000, latitude: -23.5505, longitude: -46.6333 },
];

export const customerData = [
  { customerId: 'C001', customerName: 'Acme Corp', segment: 'Enterprise', industry: 'Technology', country: 'USA', ltv: 250000, totalOrders: 45, avgOrderValue: 5500, churnRisk: 0.12 },
  { customerId: 'C002', customerName: 'Global Tech', segment: 'Enterprise', industry: 'Technology', country: 'UK', ltv: 180000, totalOrders: 32, avgOrderValue: 5600, churnRisk: 0.08 },
  { customerId: 'C003', customerName: 'Retail Plus', segment: 'Mid-Market', industry: 'Retail', country: 'Germany', ltv: 95000, totalOrders: 28, avgOrderValue: 3400, churnRisk: 0.25 },
  { customerId: 'C004', customerName: 'Finance Pro', segment: 'Enterprise', industry: 'Finance', country: 'USA', ltv: 320000, totalOrders: 52, avgOrderValue: 6150, churnRisk: 0.05 },
  { customerId: 'C005', customerName: 'Health Systems', segment: 'Mid-Market', industry: 'Healthcare', country: 'Canada', ltv: 145000, totalOrders: 38, avgOrderValue: 3800, churnRisk: 0.18 },
  { customerId: 'C006', customerName: 'Edu Learn', segment: 'SMB', industry: 'Education', country: 'Australia', ltv: 65000, totalOrders: 22, avgOrderValue: 2950, churnRisk: 0.32 },
  { customerId: 'C007', customerName: 'Mfg Industries', segment: 'Enterprise', industry: 'Manufacturing', country: 'Japan', ltv: 280000, totalOrders: 48, avgOrderValue: 5800, churnRisk: 0.10 },
  { customerId: 'C008', customerName: 'Service Co', segment: 'Mid-Market', industry: 'Services', country: 'France', ltv: 120000, totalOrders: 35, avgOrderValue: 3400, churnRisk: 0.22 },
];

export const inventoryData = [
  { sku: 'SKU-001', productName: 'Widget A', warehouse: 'US-East', category: 'Electronics', stockLevel: 1500, reorderPoint: 500, unitCost: 45, stockValue: 67500 },
  { sku: 'SKU-002', productName: 'Widget B', warehouse: 'US-East', category: 'Electronics', stockLevel: 2200, reorderPoint: 800, unitCost: 32, stockValue: 70400 },
  { sku: 'SKU-003', productName: 'Gadget X', warehouse: 'US-West', category: 'Accessories', stockLevel: 3500, reorderPoint: 1000, unitCost: 18, stockValue: 63000 },
  { sku: 'SKU-004', productName: 'Gadget Y', warehouse: 'EU-Central', category: 'Accessories', stockLevel: 1800, reorderPoint: 600, unitCost: 22, stockValue: 39600 },
  { sku: 'SKU-005', productName: 'Component Z', warehouse: 'Asia-Pacific', category: 'Components', stockLevel: 5000, reorderPoint: 1500, unitCost: 8, stockValue: 40000 },
  { sku: 'SKU-006', productName: 'Device Pro', warehouse: 'US-East', category: 'Devices', stockLevel: 800, reorderPoint: 300, unitCost: 120, stockValue: 96000 },
];

export const financialData = [
  { costCenter: 'CC-100', department: 'Sales', account: 'Revenue', fiscalYear: '2024', period: 'Q1', budget: 500000, actual: 525000, variance: 25000, variancePercent: 5 },
  { costCenter: 'CC-100', department: 'Sales', account: 'Expenses', fiscalYear: '2024', period: 'Q1', budget: 150000, actual: 142000, variance: -8000, variancePercent: -5.3 },
  { costCenter: 'CC-200', department: 'Marketing', account: 'Revenue', fiscalYear: '2024', period: 'Q1', budget: 200000, actual: 185000, variance: -15000, variancePercent: -7.5 },
  { costCenter: 'CC-200', department: 'Marketing', account: 'Expenses', fiscalYear: '2024', period: 'Q1', budget: 180000, actual: 195000, variance: 15000, variancePercent: 8.3 },
  { costCenter: 'CC-300', department: 'Operations', account: 'Revenue', fiscalYear: '2024', period: 'Q1', budget: 350000, actual: 362000, variance: 12000, variancePercent: 3.4 },
  { costCenter: 'CC-300', department: 'Operations', account: 'Expenses', fiscalYear: '2024', period: 'Q1', budget: 280000, actual: 275000, variance: -5000, variancePercent: -1.8 },
  { costCenter: 'CC-400', department: 'IT', account: 'Expenses', fiscalYear: '2024', period: 'Q1', budget: 120000, actual: 118000, variance: -2000, variancePercent: -1.7 },
  { costCenter: 'CC-500', department: 'HR', account: 'Expenses', fiscalYear: '2024', period: 'Q1', budget: 95000, actual: 92000, variance: -3000, variancePercent: -3.2 },
];

export const hrData = [
  { employeeId: 'E001', department: 'Engineering', jobLevel: 'Senior', location: 'New York', hireDate: '2020-03-15', salary: 125000, bonus: 15000, performanceScore: 4.5, trainingHours: 40 },
  { employeeId: 'E002', department: 'Engineering', jobLevel: 'Mid', location: 'San Francisco', hireDate: '2021-06-01', salary: 95000, bonus: 8000, performanceScore: 4.2, trainingHours: 32 },
  { employeeId: 'E003', department: 'Sales', jobLevel: 'Senior', location: 'Chicago', hireDate: '2019-01-10', salary: 110000, bonus: 25000, performanceScore: 4.8, trainingHours: 24 },
  { employeeId: 'E004', department: 'Sales', jobLevel: 'Junior', location: 'Boston', hireDate: '2023-02-20', salary: 65000, bonus: 5000, performanceScore: 3.8, trainingHours: 48 },
  { employeeId: 'E005', department: 'Marketing', jobLevel: 'Mid', location: 'Los Angeles', hireDate: '2022-04-15', salary: 85000, bonus: 7500, performanceScore: 4.0, trainingHours: 28 },
  { employeeId: 'E006', department: 'HR', jobLevel: 'Senior', location: 'New York', hireDate: '2018-09-01', salary: 105000, bonus: 12000, performanceScore: 4.3, trainingHours: 36 },
  { employeeId: 'E007', department: 'Finance', jobLevel: 'Mid', location: 'Chicago', hireDate: '2021-11-10', salary: 92000, bonus: 9000, performanceScore: 4.1, trainingHours: 30 },
  { employeeId: 'E008', department: 'Operations', jobLevel: 'Junior', location: 'Dallas', hireDate: '2023-07-01', salary: 58000, bonus: 3500, performanceScore: 3.5, trainingHours: 52 },
];

export const supplyChainData = [
  { supplierId: 'SUP-001', supplierName: 'Tech Components Inc', category: 'Electronics', region: 'North America', contractType: 'Preferred', spend: 450000, onTimeDelivery: 96.5, qualityScore: 4.8, leadTime: 14 },
  { supplierId: 'SUP-002', supplierName: 'Global Materials Ltd', category: 'Raw Materials', region: 'Europe', contractType: 'Standard', spend: 320000, onTimeDelivery: 92.3, qualityScore: 4.2, leadTime: 21 },
  { supplierId: 'SUP-003', supplierName: 'Asia Manufacturing', category: 'Components', region: 'Asia Pacific', contractType: 'Preferred', spend: 580000, onTimeDelivery: 94.8, qualityScore: 4.5, leadTime: 28 },
  { supplierId: 'SUP-004', supplierName: 'PackRight Solutions', category: 'Packaging', region: 'North America', contractType: 'Standard', spend: 125000, onTimeDelivery: 98.2, qualityScore: 4.6, leadTime: 7 },
  { supplierId: 'SUP-005', supplierName: 'Euro Parts GmbH', category: 'Components', region: 'Europe', contractType: 'Strategic', spend: 680000, onTimeDelivery: 97.1, qualityScore: 4.9, leadTime: 18 },
  { supplierId: 'SUP-006', supplierName: 'Quick Logistics', category: 'Services', region: 'North America', contractType: 'Standard', spend: 220000, onTimeDelivery: 99.1, qualityScore: 4.7, leadTime: 3 },
];

export const availableDimensions: Dimension[] = [
  { id: 'dim1', name: 'Region', field: 'region', values: ['North America', 'Europe', 'Asia Pacific', 'Latin America'] },
  { id: 'dim2', name: 'Product', field: 'product', values: ['Product A', 'Product B', 'Product C'] },
  { id: 'dim3', name: 'Year', field: 'year', values: ['2024', '2023'] },
  { id: 'dim4', name: 'Month', field: 'month', values: ['Jan', 'Feb', 'Mar', 'Apr'] },
];

export const availableMeasures: Measure[] = [
  { id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum', color: '#0a6ed1', format: 'currency' },
  { id: 'meas2', name: 'Costs', field: 'costs', aggregation: 'sum', color: '#df6e0c', format: 'currency' },
  { id: 'meas3', name: 'Profit', field: 'profit', aggregation: 'sum', color: '#36a41d', format: 'currency' },
  { id: 'meas4', name: 'Quantity', field: 'quantity', aggregation: 'sum', color: '#a100c2', format: 'number' },
  { id: 'meas5', name: 'Plan Revenue', field: 'plan_revenue', aggregation: 'sum', color: '#00b4f0', format: 'currency' },
  { id: 'meas6', name: 'Plan Costs', field: 'plan_costs', aggregation: 'sum', color: '#ff9800', format: 'currency' },
  { id: 'meas7', name: 'Plan Profit', field: 'plan_profit', aggregation: 'sum', color: '#4caf50', format: 'currency' },
  { id: 'meas8', name: 'Previous Year Revenue', field: 'previous_year_revenue', aggregation: 'sum', color: '#9c27b0', format: 'currency' },
];

export const smartInsights: SmartInsight[] = [
  { id: 'insight1', type: 'trend', title: 'Revenue Growth Trend', description: 'North America revenue shows consistent 12% month-over-month growth.', confidence: 0.92, relatedDimension: 'region', relatedMeasure: 'revenue', timestamp: new Date().toISOString() },
  { id: 'insight2', type: 'anomaly', title: 'Cost Spike Detected', description: 'Asia Pacific costs increased 18% in March.', confidence: 0.87, relatedDimension: 'region', relatedMeasure: 'costs', timestamp: new Date().toISOString() },
  { id: 'insight3', type: 'correlation', title: 'Product A Drives Profit', description: 'Product A contributes 45% of total profit.', confidence: 0.95, relatedDimension: 'product', relatedMeasure: 'profit', timestamp: new Date().toISOString() },
];

export const modelConfigs: { [key: string]: { dimensions: Dimension[], measures: Measure[], filters: Filter[], data: any[] } } = {
  'model1': {
    dimensions: availableDimensions,
    measures: availableMeasures,
    filters: [
      { id: '1', label: 'Year', options: ['All', '2024', '2023'], selected: 'All' },
      { id: '2', label: 'Region', options: ['All', 'North America', 'Europe', 'Asia Pacific', 'Latin America'], selected: 'All' },
      { id: '3', label: 'Product', options: ['All', 'Product A', 'Product B', 'Product C'], selected: 'All' },
    ],
    data: rawData
  },
  'model2': {
    dimensions: [
      { id: 'cust-dim1', name: 'Segment', field: 'segment', values: ['Enterprise', 'Mid-Market', 'SMB'] },
      { id: 'cust-dim2', name: 'Industry', field: 'industry', values: ['Technology', 'Retail', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Services'] },
      { id: 'cust-dim3', name: 'Country', field: 'country', values: ['USA', 'UK', 'Germany', 'Canada', 'Australia', 'Japan', 'France'] },
    ],
    measures: [
      { id: 'cust-meas1', name: 'Lifetime Value', field: 'ltv', aggregation: 'sum', color: '#0a6ed1', format: 'currency' },
      { id: 'cust-meas2', name: 'Total Orders', field: 'totalOrders', aggregation: 'sum', color: '#36a41d', format: 'number' },
      { id: 'cust-meas3', name: 'Avg Order Value', field: 'avgOrderValue', aggregation: 'avg', color: '#df6e0c', format: 'currency' },
      { id: 'cust-meas4', name: 'Churn Risk', field: 'churnRisk', aggregation: 'avg', color: '#e74c3c', format: 'percent' },
    ],
    filters: [
      { id: '1', label: 'Segment', options: ['All', 'Enterprise', 'Mid-Market', 'SMB'], selected: 'All' },
      { id: '2', label: 'Industry', options: ['All', 'Technology', 'Retail', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Services'], selected: 'All' },
      { id: '3', label: 'Country', options: ['All', 'USA', 'UK', 'Germany', 'Canada', 'Australia', 'Japan', 'France'], selected: 'All' },
    ],
    data: customerData
  },
  'model3': {
    dimensions: [
      { id: 'inv-dim1', name: 'Warehouse', field: 'warehouse', values: ['US-East', 'US-West', 'EU-Central', 'Asia-Pacific'] },
      { id: 'inv-dim2', name: 'Category', field: 'category', values: ['Electronics', 'Accessories', 'Components', 'Devices'] },
      { id: 'inv-dim3', name: 'Product Name', field: 'productName', values: ['Widget A', 'Widget B', 'Gadget X', 'Gadget Y', 'Component Z', 'Device Pro'] },
    ],
    measures: [
      { id: 'inv-meas1', name: 'Stock Level', field: 'stockLevel', aggregation: 'sum', color: '#0a6ed1', format: 'number' },
      { id: 'inv-meas2', name: 'Reorder Point', field: 'reorderPoint', aggregation: 'sum', color: '#ff9800', format: 'number' },
      { id: 'inv-meas3', name: 'Unit Cost', field: 'unitCost', aggregation: 'avg', color: '#36a41d', format: 'currency' },
      { id: 'inv-meas4', name: 'Stock Value', field: 'stockValue', aggregation: 'sum', color: '#9c27b0', format: 'currency' },
    ],
    filters: [
      { id: '1', label: 'Warehouse', options: ['All', 'US-East', 'US-West', 'EU-Central', 'Asia-Pacific'], selected: 'All' },
      { id: '2', label: 'Category', options: ['All', 'Electronics', 'Accessories', 'Components', 'Devices'], selected: 'All' },
    ],
    data: inventoryData
  },
  'model4': {
    dimensions: [
      { id: 'fin-dim1', name: 'Department', field: 'department', values: ['Sales', 'Marketing', 'Operations', 'IT', 'HR', 'Finance'] },
      { id: 'fin-dim2', name: 'Account', field: 'account', values: ['Revenue', 'Expenses'] },
      { id: 'fin-dim3', name: 'Fiscal Year', field: 'fiscalYear', values: ['2024', '2023'] },
      { id: 'fin-dim4', name: 'Period', field: 'period', values: ['Q1', 'Q2', 'Q3', 'Q4'] },
    ],
    measures: [
      { id: 'fin-meas1', name: 'Budget', field: 'budget', aggregation: 'sum', color: '#0a6ed1', format: 'currency' },
      { id: 'fin-meas2', name: 'Actual', field: 'actual', aggregation: 'sum', color: '#36a41d', format: 'currency' },
      { id: 'fin-meas3', name: 'Variance', field: 'variance', aggregation: 'sum', color: '#e74c3c', format: 'currency' },
      { id: 'fin-meas4', name: 'Variance %', field: 'variancePercent', aggregation: 'avg', color: '#ff9800', format: 'percent' },
    ],
    filters: [
      { id: '1', label: 'Department', options: ['All', 'Sales', 'Marketing', 'Operations', 'IT', 'HR', 'Finance'], selected: 'All' },
      { id: '2', label: 'Account', options: ['All', 'Revenue', 'Expenses'], selected: 'All' },
      { id: '3', label: 'Period', options: ['All', 'Q1', 'Q2', 'Q3', 'Q4'], selected: 'All' },
    ],
    data: financialData
  },
  'model5': {
    dimensions: [
      { id: 'hr-dim1', name: 'Department', field: 'department', values: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'] },
      { id: 'hr-dim2', name: 'Job Level', field: 'jobLevel', values: ['Senior', 'Mid', 'Junior'] },
      { id: 'hr-dim3', name: 'Location', field: 'location', values: ['New York', 'San Francisco', 'Chicago', 'Boston', 'Los Angeles', 'Dallas'] },
    ],
    measures: [
      { id: 'hr-meas1', name: 'Salary', field: 'salary', aggregation: 'sum', color: '#0a6ed1', format: 'currency' },
      { id: 'hr-meas2', name: 'Bonus', field: 'bonus', aggregation: 'sum', color: '#36a41d', format: 'currency' },
      { id: 'hr-meas3', name: 'Performance Score', field: 'performanceScore', aggregation: 'avg', color: '#ff9800', format: 'number' },
      { id: 'hr-meas4', name: 'Training Hours', field: 'trainingHours', aggregation: 'sum', color: '#9c27b0', format: 'number' },
    ],
    filters: [
      { id: '1', label: 'Department', options: ['All', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'], selected: 'All' },
      { id: '2', label: 'Job Level', options: ['All', 'Senior', 'Mid', 'Junior'], selected: 'All' },
      { id: '3', label: 'Location', options: ['All', 'New York', 'San Francisco', 'Chicago', 'Boston', 'Los Angeles', 'Dallas'], selected: 'All' },
    ],
    data: hrData
  },
  'model6': {
    dimensions: [
      { id: 'sc-dim1', name: 'Category', field: 'category', values: ['Electronics', 'Raw Materials', 'Components', 'Packaging', 'Services'] },
      { id: 'sc-dim2', name: 'Region', field: 'region', values: ['North America', 'Europe', 'Asia Pacific'] },
      { id: 'sc-dim3', name: 'Contract Type', field: 'contractType', values: ['Preferred', 'Standard', 'Strategic'] },
    ],
    measures: [
      { id: 'sc-meas1', name: 'Spend', field: 'spend', aggregation: 'sum', color: '#0a6ed1', format: 'currency' },
      { id: 'sc-meas2', name: 'On-Time Delivery %', field: 'onTimeDelivery', aggregation: 'avg', color: '#36a41d', format: 'percent' },
      { id: 'sc-meas3', name: 'Quality Score', field: 'qualityScore', aggregation: 'avg', color: '#ff9800', format: 'number' },
      { id: 'sc-meas4', name: 'Lead Time (Days)', field: 'leadTime', aggregation: 'avg', color: '#9c27b0', format: 'number' },
    ],
    filters: [
      { id: '1', label: 'Category', options: ['All', 'Electronics', 'Raw Materials', 'Components', 'Packaging', 'Services'], selected: 'All' },
      { id: '2', label: 'Region', options: ['All', 'North America', 'Europe', 'Asia Pacific'], selected: 'All' },
      { id: '3', label: 'Contract Type', options: ['All', 'Preferred', 'Standard', 'Strategic'], selected: 'All' },
    ],
    data: supplyChainData
  }
};

export const dataModels: DataModel[] = [
  { id: 'model1', name: 'Sales Performance', description: 'Sales data including revenue, costs, and profit by region and product', type: 'import', source: 'SAP S/4HANA', columns: [], lastRefresh: '2024-01-20 09:30:00', rowCount: 48 },
  { id: 'model2', name: 'Customer Analytics', description: 'Customer segmentation, lifetime value, and behavioral analytics', type: 'live', source: 'SAP HANA Cloud', columns: [], lastRefresh: '2024-01-20 12:00:00', rowCount: 8 },
  { id: 'model3', name: 'Inventory Management', description: 'Real-time inventory levels, stock movements, and warehouse data', type: 'live', source: 'SAP EWM', columns: [], lastRefresh: '2024-01-20 14:30:00', rowCount: 6 },
  { id: 'model4', name: 'Financial Planning', description: 'Budget, actuals, and variance analysis for financial planning', type: 'import', source: 'SAP BPC', columns: [], lastRefresh: '2024-01-19 16:00:00', rowCount: 8 },
  { id: 'model5', name: 'HR Analytics', description: 'Employee data, headcount, turnover, and workforce analytics', type: 'live', source: 'SAP SuccessFactors', columns: [], lastRefresh: '2024-01-20 08:00:00', rowCount: 8 },
  { id: 'model6', name: 'Supply Chain', description: 'Supplier performance, procurement, and logistics data', type: 'live', source: 'SAP Ariba', columns: [], lastRefresh: '2024-01-20 11:00:00', rowCount: 6 },
];

// Pre-built widgets for templates
const executiveWidgets = [
  {
    id: 'exec-w1',
    type: 'kpi' as const,
    title: 'Total Revenue',
    dimensions: [{ id: 'dim1', name: 'Region', field: 'region' }],
    measures: [{ id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const }],
    filters: [],
    linkedAnalysis: true
  },
  {
    id: 'exec-w2',
    type: 'chart' as const,
    chartType: 'column' as const,
    title: 'Revenue by Region',
    dimensions: [{ id: 'dim1', name: 'Region', field: 'region' }],
    measures: [{ id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const }],
    filters: [],
    linkedAnalysis: true
  },
  {
    id: 'exec-w3',
    type: 'chart' as const,
    chartType: 'line' as const,
    title: 'Revenue Trend',
    dimensions: [{ id: 'dim4', name: 'Month', field: 'month' }],
    measures: [{ id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const }],
    filters: [],
    linkedAnalysis: true
  },
  {
    id: 'exec-w4',
    type: 'chart' as const,
    chartType: 'pie' as const,
    title: 'Revenue by Product',
    dimensions: [{ id: 'dim2', name: 'Product', field: 'product' }],
    measures: [{ id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const }],
    filters: [],
    linkedAnalysis: true
  }
];

const salesWidgets = [
  {
    id: 'sales-w1',
    type: 'chart' as const,
    chartType: 'column' as const,
    title: 'Sales by Region',
    dimensions: [{ id: 'dim1', name: 'Region', field: 'region' }],
    measures: [
      { id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const },
      { id: 'meas3', name: 'Profit', field: 'profit', aggregation: 'sum' as const, color: '#36a41d', format: 'currency' as const }
    ],
    filters: [],
    linkedAnalysis: true
  },
  {
    id: 'sales-w2',
    type: 'chart' as const,
    chartType: 'line' as const,
    title: 'Monthly Sales Trend',
    dimensions: [{ id: 'dim4', name: 'Month', field: 'month' }],
    measures: [{ id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const }],
    filters: [],
    linkedAnalysis: true
  },
  {
    id: 'sales-w3',
    type: 'table' as const,
    title: 'Sales Details',
    dimensions: [{ id: 'dim1', name: 'Region', field: 'region' }, { id: 'dim2', name: 'Product', field: 'product' }],
    measures: [
      { id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const },
      { id: 'meas2', name: 'Costs', field: 'costs', aggregation: 'sum' as const, color: '#df6e0c', format: 'currency' as const },
      { id: 'meas3', name: 'Profit', field: 'profit', aggregation: 'sum' as const, color: '#36a41d', format: 'currency' as const }
    ],
    filters: [],
    linkedAnalysis: true
  },
  {
    id: 'sales-w4',
    type: 'chart' as const,
    chartType: 'stacked' as const,
    title: 'Product Mix by Region',
    dimensions: [{ id: 'dim1', name: 'Region', field: 'region' }],
    measures: [{ id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const }],
    filters: [],
    linkedAnalysis: true
  }
];

const varianceWidgets = [
  {
    id: 'var-w1',
    type: 'chart' as const,
    chartType: 'column' as const,
    title: 'Actual vs Plan by Region',
    dimensions: [{ id: 'dim1', name: 'Region', field: 'region' }],
    measures: [
      { id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const },
      { id: 'meas5', name: 'Plan Revenue', field: 'plan_revenue', aggregation: 'sum' as const, color: '#00b4f0', format: 'currency' as const }
    ],
    filters: [],
    linkedAnalysis: true,
    variance: {
      enabled: true,
      compareType: 'plan' as const,
      showAbsolute: true,
      showPercentage: true
    }
  },
  {
    id: 'var-w2',
    type: 'table' as const,
    title: 'Variance Analysis',
    dimensions: [{ id: 'dim1', name: 'Region', field: 'region' }],
    measures: [
      { id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const },
      { id: 'meas5', name: 'Plan Revenue', field: 'plan_revenue', aggregation: 'sum' as const, color: '#00b4f0', format: 'currency' as const }
    ],
    filters: [],
    linkedAnalysis: true,
    variance: {
      enabled: true,
      compareType: 'plan' as const,
      compareMeasure: 'plan_revenue',
      showAbsolute: true,
      showPercentage: true
    }
  },
  {
    id: 'var-w3',
    type: 'chart' as const,
    chartType: 'waterfall' as const,
    title: 'Revenue Variance Waterfall',
    dimensions: [{ id: 'dim1', name: 'Region', field: 'region' }],
    measures: [{ id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const }],
    filters: [],
    linkedAnalysis: true
  }
];

export const storyTemplates: StoryTemplate[] = [
  { 
    id: 'template1', 
    name: 'Executive Dashboard', 
    description: 'High-level KPIs and trends', 
    category: 'Finance', 
    pages: [
      { 
        id: 'exec-p1', 
        title: 'Overview', 
        widgets: executiveWidgets,
        linkedAnalysis: true
      },
      {
        id: 'exec-p2',
        title: 'Details',
        widgets: [
          {
            id: 'exec-w5',
            type: 'table' as const,
            title: 'Revenue Details by Region',
            dimensions: [{ id: 'dim1', name: 'Region', field: 'region' }],
            measures: [
              { id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const },
              { id: 'meas3', name: 'Profit', field: 'profit', aggregation: 'sum' as const, color: '#36a41d', format: 'currency' as const }
            ],
            filters: [],
            linkedAnalysis: true
          }
        ],
        linkedAnalysis: true
      }
    ] 
  },
  { 
    id: 'template2', 
    name: 'Sales Analysis', 
    description: 'Detailed sales performance', 
    category: 'Sales', 
    pages: [
      { 
        id: 'sales-p1', 
        title: 'Sales Overview', 
        widgets: salesWidgets.slice(0, 2),
        linkedAnalysis: true
      },
      {
        id: 'sales-p2',
        title: 'Product Analysis',
        widgets: salesWidgets.slice(2),
        linkedAnalysis: true
      },
      {
        id: 'sales-p3',
        title: 'Regional Breakdown',
        widgets: [
          {
            id: 'sales-w5',
            type: 'chart' as const,
            chartType: 'bar' as const,
            title: 'Top Products by Revenue',
            dimensions: [{ id: 'dim2', name: 'Product', field: 'product' }],
            measures: [{ id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const }],
            filters: [],
            linkedAnalysis: true
          }
        ],
        linkedAnalysis: true
      }
    ] 
  },
  { 
    id: 'template3', 
    name: 'Variance Analysis', 
    description: 'Actual vs Plan comparison', 
    category: 'Finance', 
    pages: [
      { 
        id: 'var-p1', 
        title: 'Variance Overview', 
        widgets: varianceWidgets,
        linkedAnalysis: true
      },
      {
        id: 'var-p2',
        title: 'Detailed Variance',
        widgets: [
          {
            id: 'var-w4',
            type: 'chart' as const,
            chartType: 'column' as const,
            title: 'Product Variance',
            dimensions: [{ id: 'dim2', name: 'Product', field: 'product' }],
            measures: [
              { id: 'meas1', name: 'Revenue', field: 'revenue', aggregation: 'sum' as const, color: '#0a6ed1', format: 'currency' as const },
              { id: 'meas5', name: 'Plan Revenue', field: 'plan_revenue', aggregation: 'sum' as const, color: '#00b4f0', format: 'currency' as const }
            ],
            filters: [],
            linkedAnalysis: true
          }
        ],
        linkedAnalysis: true
      }
    ] 
  },
  { 
    id: 'template4', 
    name: 'Blank Canvas', 
    description: 'Start from scratch', 
    category: 'General', 
    pages: [
      { 
        id: 'blank-p1', 
        title: 'Page 1', 
        widgets: [],
        linkedAnalysis: true
      }
    ] 
  },
];

export const kpis = [
  { id: '1', title: 'Total Revenue', value: 2450000, unit: '$', trend: 'up', change: 12.5 },
  { id: '2', title: 'Gross Margin', value: 34.2, unit: '%', trend: 'up', change: 2.1 },
  { id: '3', title: 'Operating Costs', value: 890000, unit: '$', trend: 'down', change: -5.3 },
  { id: '4', title: 'Customer Count', value: 12450, unit: '', trend: 'up', change: 8.7 },
];

export const defaultStories: Story[] = [
  { id: '1', title: 'Q4 Financial Overview', description: 'Quarterly financial performance analysis', createdAt: '2024-01-15', updatedAt: '2024-01-15', author: 'John Doe', isSaved: true, version: 1, pages: [{ id: 'p1', title: 'Overview', widgets: executiveWidgets, linkedAnalysis: true }] },
  { id: '2', title: 'Sales Performance Dashboard', description: 'Regional sales metrics and KPIs', createdAt: '2024-01-10', updatedAt: '2024-01-10', author: 'Jane Smith', isSaved: true, version: 1, pages: [{ id: 'p1', title: 'Sales', widgets: salesWidgets.slice(0, 2), linkedAnalysis: true }] },
  { id: '3', title: 'Cost Analysis Report', description: 'Operating cost breakdown', createdAt: '2024-01-08', updatedAt: '2024-01-08', author: 'Mike Johnson', isSaved: true, version: 1, pages: [{ id: 'p1', title: 'Costs', widgets: varianceWidgets.slice(0, 2) }] },
];

export const filters: Filter[] = [
  { id: '1', label: 'Year', options: ['All', '2024', '2023'], selected: 'All' },
  { id: '2', label: 'Region', options: ['All', 'North America', 'Europe', 'Asia Pacific', 'Latin America'], selected: 'All' },
  { id: '3', label: 'Product', options: ['All', 'Product A', 'Product B', 'Product C'], selected: 'All' },
];
