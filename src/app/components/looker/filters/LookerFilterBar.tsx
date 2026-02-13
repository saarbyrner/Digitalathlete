"use client";

import * as React from "react";
import { cn } from "@/app/components/ui/utils";
import { LookerSelect } from "./LookerSelect";
import { LookerMultiSelect } from "./LookerMultiSelect";
import { LookerBooleanToggle } from "./LookerBooleanToggle";
import type {
  FilterConfig,
  FilterOption,
  LookerFilterBarProps,
  DynamicFilterState,
} from "@/app/types/filters";

/**
 * Extract unique values from data array for a given field
 */
function getUniqueOptions(data: Record<string, unknown>[], field: string): FilterOption[] {
  const uniqueValues = [...new Set(data.map((item) => item[field]).filter(Boolean))];
  return uniqueValues
    .sort((a, b) => String(a).localeCompare(String(b)))
    .map((value) => ({
      value: String(value),
      label: String(value),
    }));
}

/**
 * Resolve options for a filter - either static or generated from data
 */
function resolveOptions(
  config: FilterConfig,
  data?: Record<string, unknown>[]
): FilterOption[] {
  if (config.options && config.options.length > 0) {
    return config.options;
  }
  if (config.optionsFromData && data) {
    return getUniqueOptions(data, config.optionsFromData);
  }
  return [];
}

/**
 * Group filters by row number for multi-row layout
 */
function groupFiltersByRow(filters: FilterConfig[]): Map<number, FilterConfig[]> {
  const grouped = new Map<number, FilterConfig[]>();
  
  filters.forEach((filter) => {
    const row = filter.row ?? 1; // Default to row 1 if not specified
    const existing = grouped.get(row) || [];
    grouped.set(row, [...existing, filter]);
  });
  
  return grouped;
}

/**
 * Looker-style filter bar component
 * 
 * Renders filters dynamically from configuration with:
 * - Multi-row layout support
 * - Dynamic option generation from data
 * - Support for select, multi-select, and boolean toggle filters
 * - Animations for expand/collapse
 */
export function LookerFilterBar({
  config,
  data,
  values,
  onChange,
  onReset,
  isExpanded = true,
  className,
  singleLine = false,
}: LookerFilterBarProps) {
  const groupedFilters = React.useMemo(() => groupFiltersByRow(config), [config]);

  // If no filters are configured for this dashboard, render nothing
  if (!config || config.length === 0) {
    return null;
  }

  const renderFilter = (filterConfig: FilterConfig) => {
    const options = resolveOptions(filterConfig, data);
    const currentValue = values[filterConfig.dataKey];

    switch (filterConfig.type) {
      case "select":
        return (
          <LookerSelect
            key={filterConfig.id}
            id={filterConfig.id}
            label={filterConfig.label}
            value={(currentValue as string) ?? null}
            options={options}
            placeholder={filterConfig.placeholder}
            onChange={(val) => onChange(filterConfig.dataKey, val)}
            width={filterConfig.width}
          />
        );

      case "multi-select":
        return (
          <LookerMultiSelect
            key={filterConfig.id}
            id={filterConfig.id}
            label={filterConfig.label}
            value={(currentValue as string[]) ?? []}
            options={options}
            placeholder={filterConfig.placeholder}
            onChange={(val) => onChange(filterConfig.dataKey, val)}
            width={filterConfig.width}
          />
        );

      case "boolean":
        return (
          <LookerBooleanToggle
            key={filterConfig.id}
            id={filterConfig.id}
            label={filterConfig.label}
            value={(currentValue as boolean) ?? null}
            onChange={(val) => onChange(filterConfig.dataKey, val)}
            width={filterConfig.width}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      <div className={cn("pb-4", singleLine ? "overflow-x-auto" : "flex flex-col gap-4")}> 
        {singleLine ? (
          <div className="looker-filter-row">
            {config.map((f) => (
              <div key={f.id} className="inline-flex items-start">
                {renderFilter(f)}
              </div>
            ))}
          </div>
        ) : (
          Array.from(groupedFilters.entries())
            .sort(([a], [b]) => a - b)
            .map(([rowNum, rowFilters]) => (
              <div
                key={rowNum}
                className="flex flex-wrap items-start gap-3"
              >
                {rowFilters.map(renderFilter)}
              </div>
            ))
        )}
        
        {/* Reset button */}
        {onReset && (
          <div className="flex items-center pt-2">
            <button
              type="button"
              onClick={onReset}
              className={cn(
                "text-xs text-[var(--grey-100)] hover:text-[var(--grey-200)]",
                "hover:underline transition-colors"
              )}
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Hook to manage filter state with defaults from config
 */
export function useLookerFilters(config: FilterConfig[]) {
  const getDefaultValues = React.useCallback((): DynamicFilterState => {
    const defaults: DynamicFilterState = {};
    config.forEach((filter) => {
      if (filter.defaultValue !== undefined) {
        defaults[filter.dataKey] = filter.defaultValue;
      } else {
        // Set default based on type
        switch (filter.type) {
          case "multi-select":
            defaults[filter.dataKey] = [];
            break;
          case "boolean":
            defaults[filter.dataKey] = null;
            break;
          default:
            defaults[filter.dataKey] = null;
        }
      }
    });
    return defaults;
  }, [config]);

  const [values, setValues] = React.useState<DynamicFilterState>(getDefaultValues);

  const handleChange = React.useCallback(
    (key: string, value: string | string[] | boolean | null) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleReset = React.useCallback(() => {
    setValues(getDefaultValues());
  }, [getDefaultValues]);

  return {
    values,
    setValues,
    handleChange,
    handleReset,
  };
}
