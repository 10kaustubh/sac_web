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
  bookmarks?: Bookmark[];
  comments?: Comment[];
  version: number;
  versionHistory?: VersionHistory[];
}

export interface Bookmark {
  id: string;
  name: string;
  filters: Filter[];
  widgetFilters: WidgetFilter[];
  pageIndex: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  widgetId?: string;
  pageId: string;
  text: string;
  author: string;
  createdAt: string;
  replies?: Comment[];
}

export interface VersionHistory {
  version: number;
  timestamp: string;
  author: string;
  changes: string;
}

export interface Page {
  id: string;
  title: string;
  widgets: Widget[];
  layout?: LayoutItem[];
  linkedAnalysis?: boolean;
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
  type: 'chart' | 'kpi' | 'table' | 'text' | 'input' | 'geomap';
  chartType?: ChartType;
  title: string;
  dimensions: Dimension[];
  measures: Measure[];
  filters: WidgetFilter[];
  drillDown?: DrillDownConfig;
  formatting?: WidgetFormatting;
  sortConfig?: SortConfig;
  linkedAnalysis?: boolean;
  variance?: VarianceConfig;
  comments?: Comment[];
  calculatedMeasures?: CalculatedMeasure[];
}

export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'column' 
  | 'stacked' 
  | 'area' 
  | 'donut'
  | 'waterfall'
  | 'bubble'
  | 'heatmap'
  | 'pareto'
  | 'treemap'
  | 'gauge'
  | 'scatter'
  | 'geomap';

export interface VarianceConfig {
  enabled: boolean;
  compareType: 'plan' | 'previousYear' | 'previousPeriod' | 'custom';
  compareMeasure?: string;
  showAbsolute: boolean;
  showPercentage: boolean;
}

export interface CalculatedMeasure {
  id: string;
  name: string;
  formula: string;
  format: 'number' | 'currency' | 'percent';
}

export interface DrillDownConfig {
  enabled: boolean;
  currentDimension: string;
  hierarchy: string[];
  currentLevel: number;
  filterValue?: string;
}

export interface WidgetFormatting {
  showLegend: boolean;
  showLabels: boolean;
  showGrid: boolean;
  colorPalette: string;
  numberFormat: 'number' | 'currency' | 'percent';
  decimalPlaces: number;
  axisAlignment?: boolean;
  conditionalFormatting?: ConditionalFormat[];
}

export interface ConditionalFormat {
  id: string;
  condition: 'greaterThan' | 'lessThan' | 'equals' | 'between';
  value: number;
  value2?: number;
  color: string;
  backgroundColor?: string;
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

export interface InputControl {
  id: string;
  type: 'dropdown' | 'slider' | 'datepicker' | 'checkbox';
  label: string;
  dimension: string;
  values: string[];
  selected: string | string[];
  cascading?: boolean;
  linkedControls?: string[];
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

export interface DataModel {
  id: string;
  name: string;
  description: string;
  type: 'import' | 'live';
  source: string;
  columns: DataColumn[];
  lastRefresh: string;
  rowCount: number;
  blendedWith?: string[];
  currencyConversion?: CurrencyConfig;
}

export interface CurrencyConfig {
  enabled: boolean;
  baseCurrency: string;
  targetCurrency: string;
  rateTable?: string;
}

export interface DataColumn {
  id: string;
  name: string;
  field: string;
  type: 'dimension' | 'measure';
  dataType: 'string' | 'number' | 'date' | 'currency' | 'geo';
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
  type: 'story' | 'model' | 'page' | 'widget';
  id: string;
  title: string;
  description: string;
  storyId?: string;
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

export interface DataBlend {
  id: string;
  name: string;
  primaryModel: string;
  secondaryModels: string[];
  joinType: 'inner' | 'left' | 'right' | 'full';
  joinFields: { primary: string; secondary: string }[];
}
