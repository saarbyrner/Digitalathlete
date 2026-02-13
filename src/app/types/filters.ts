// Filter type definitions for Looker-style dashboard filters

export type FilterType = 'select' | 'multi-select' | 'boolean' | 'date-range' | 'search';

export interface FilterOption {
  value: string | number | boolean;
  label: string;
}

export interface FilterConfig {
  /** Unique identifier for the filter */
  id: string;
  /** Display label shown above the filter */
  label: string;
  /** Type of filter control to render */
  type: FilterType;
  /** Key used in the filter state object */
  dataKey: string;
  /** Static options for select/multi-select filters */
  options?: FilterOption[];
  /** Field name to generate options from data dynamically */
  optionsFromData?: string;
  /** Default value when filter is reset */
  defaultValue?: string | string[] | boolean | null;
  /** Placeholder text (defaults to "Is any value") */
  placeholder?: string;
  /** Optional width override (e.g., "200px", "auto") */
  width?: string;
  /** Row number for multi-row layout grouping */
  row?: number;
  /** Whether this filter can have a null/"any" value */
  allowAnyValue?: boolean;
}

export interface DashboardFilterConfig {
  /** Dashboard identifier */
  dashboardId: string;
  /** Array of filter configurations */
  filters: FilterConfig[];
}

/** Dynamic filter state - keys are dataKeys from FilterConfig */
export interface DynamicFilterState {
  [key: string]: string | string[] | boolean | null | undefined;
}

/** Props for the main filter bar component */
export interface LookerFilterBarProps {
  /** Filter configuration array */
  config: FilterConfig[];
  /** Optional data to generate dynamic filter options */
  data?: Record<string, unknown>[];
  /** Current filter values */
  values: DynamicFilterState;
  /** Callback when any filter value changes */
  onChange: (key: string, value: string | string[] | boolean | null) => void;
  /** Callback to reset all filters */
  onReset?: () => void;
  /** Whether the filter bar is expanded */
  isExpanded?: boolean;
  /** Render filters in a single horizontal line (no wrapping) */
  singleLine?: boolean;
  /** Additional CSS class */
  className?: string;
}

/** Props for individual filter components */
export interface LookerSelectProps {
  id: string;
  label: string;
  value: string | null;
  options: FilterOption[];
  placeholder?: string;
  onChange: (value: string | null) => void;
  width?: string;
  className?: string;
}

export interface LookerMultiSelectProps {
  id: string;
  label: string;
  value: string[];
  options: FilterOption[];
  placeholder?: string;
  onChange: (value: string[]) => void;
  width?: string;
  className?: string;
}

export interface LookerBooleanToggleProps {
  id: string;
  label: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  trueLabel?: string;
  falseLabel?: string;
  width?: string;
  className?: string;
}
