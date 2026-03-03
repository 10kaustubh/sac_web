export interface KPI {
  id: string;
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  change: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  pages: Page[];
  isSaved: boolean;
}

export interface Page {
  id: string;
  title: string;
  widgets: Widget[];
}

export interface Widget {
  id: string;
  type: 'chart' | 'kpi' | 'table';
  chartType?: 'line' | 'bar' | 'pie' | 'column' | 'stacked';
  title: string;
  dimensions: Dimension[];
  measures: Measure[];
  filters: WidgetFilter[];
}

export interface Dimension {
  id: string;
  name: string;
  field: string;
  values: string[];
}

export interface Measure {
  id: string;
  name: string;
  field: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  color?: string;
}

export interface WidgetFilter {
  dimensionId: string;
  selectedValues: string[];
}

export interface Filter {
  id: string;
  label: string;
  options: string[];
  selected: string;
}

export interface DataRow {
  id: string;
  region: string;
  product: string;
  year: string;
  month: string;
  revenue: number;
  costs: number;
  profit: number;
  quantity: number;
}
