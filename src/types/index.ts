export interface KPI {
  id: string;
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
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
  plan_revenue?: number;
  plan_costs?: number;
  plan_profit?: number;
  previous_year_revenue?: number;
  latitude?: number;
  longitude?: number;
}

export interface Filter {
  id: string;
  label: string;
  options: string[];
  selected: string;
}

export interface Dimension {
  id: string;
  name: string;
  field: string;
  values?: string[];
  hierarchy?: string[];
}

export interface Measure {
  id: string;
  name: string;
  field: string;
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count';
  color?: string;
  format?: 'number' | 'currency' | 'percent';
}

export interface WidgetFilter {
  dimensionId: string;
  field: string;
  selectedValues: string[];
}

export interface VarianceConfig {
  enabled: boolean;
  compareType: 'plan' | 'previousYear' | 'previousPeriod';
  compareMeasure?: string;
  showAbsolute: boolean;
  showPercentage: boolean;
}

export interface DrillDownConfig {
  enabled: boolean;
  currentDimension: string;
  hierarchy: string[];
  currentLevel: number;
}

export type ChartType = 'bar' | 'column' | 'line' | 'area' | 'pie' | 'donut' | 'stacked' | 'waterfall' | 'pareto' | 'gauge' | 'heatmap' | 'scatter' | 'treemap' | 'geomap';

export interface Widget {
  id: string;
  type: 'chart' | 'kpi' | 'table' | 'text';
  chartType?: ChartType;
  title: string;
  dimensions: Dimension[];
  measures: Measure[];
  filters: WidgetFilter[];
  linkedAnalysis?: boolean;
  variance?: VarianceConfig;
  drillDown?: DrillDownConfig;
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

export interface Page {
  id: string;
  title: string;
  widgets: Widget[];
  layout?: LayoutItem[];
  linkedAnalysis?: boolean;
}

export interface Bookmark {
  id: string;
  name: string;
  filters: Filter[];
  widgetFilters: WidgetFilter[];
  pageIndex: number;
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  isSaved: boolean;
  isFavorite?: boolean;
  template?: string;
  tags?: string[];
  version?: number;
  bookmarks?: Bookmark[];
  pages: Page[];
}

export interface DataModelColumn {
  id: string;
  name: string;
  field: string;
  type: 'dimension' | 'measure';
  dataType: 'string' | 'number' | 'date' | 'currency' | 'geo' | 'percent';
}

export interface DataModel {
  id: string;
  name: string;
  description: string;
  type: 'import' | 'live';
  source: string;
  columns: DataModelColumn[];
  lastRefresh?: string;
  rowCount?: number;
}

export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: string;
  pages: Page[];
}

export interface SmartInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'forecast';
  title: string;
  description: string;
  confidence: number;
  relatedDimension?: string;
  relatedMeasure?: string;
  timestamp: string;
}

export interface NLPQuery {
  query: string;
  suggestedChart?: ChartType;
  suggestedDimensions?: string[];
  suggestedMeasures?: string[];
  confidence: number;
}

export interface SearchResult {
  type: 'story' | 'page' | 'widget' | 'model';
  id: string;
  title: string;
  description: string;
  storyId?: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface AppTheme {
  mode: 'light' | 'dark';
  primaryColor: string;
}
