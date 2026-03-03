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
  template?: string;
  tags?: string[];
}

export interface Page {
  id: string;
  title: string;
  widgets: Widget[];
  layout?: LayoutItem[];
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface Widget {
  id: string;
  type: 'chart' | 'kpi' | 'table' | 'text';
  chartType?: 'line' | 'bar' | 'pie' | 'column' | 'stacked' | 'area' | 'donut';
  title: string;
  dimensions: Dimension[];
  measures: Measure[];
  filters: WidgetFilter[];
  drillDown?: DrillDownConfig;
  formatting?: WidgetFormatting;
  sortConfig?: SortConfig;
}

export interface DrillDownConfig {
  enabled: boolean;
  currentDimension: string;
  filterValue?: string;
}

export interface WidgetFormatting {
  showLegend: boolean;
  showLabels: boolean;
  showGrid: boolean;
  colorPalette: string;
  numberFormat: 'number' | 'currency' | 'percent';
  decimalPlaces: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface Dimension {
  id: string;
  name: string;
  field: string;
  values: string[];
  hierarchy?: string[];
}

export interface Measure {
  id: string;
  name: string;
  field: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  color?: string;
  format?: 'number' | 'currency' | 'percent';
}

export interface WidgetFilter {
  dimensionId: string;
  field: string;
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

export interface DataModel {
  id: string;
  name: string;
  description: string;
  type: 'import' | 'live';
  source: string;
  columns: DataColumn[];
  lastRefresh: string;
  rowCount: number;
}

export interface DataColumn {
  id: string;
  name: string;
  field: string;
  type: 'dimension' | 'measure';
  dataType: 'string' | 'number' | 'date';
}

export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  pages: Page[];
}

export interface AppTheme {
  mode: 'light' | 'dark';
  primaryColor: string;
}

export interface SearchResult {
  type: 'story' | 'model' | 'page';
  id: string;
  title: string;
  description: string;
  storyId?: string;
}
