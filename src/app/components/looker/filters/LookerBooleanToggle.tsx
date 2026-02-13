"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/app/components/ui/utils";
import { LookerFilterLabel } from "./LookerFilterLabel";
import type { LookerBooleanToggleProps } from "@/app/types/filters";

/**
 * Looker-style boolean toggle component with True/False buttons
 * Features:
 * - Label positioned above
 * - Side-by-side True/False toggle buttons
 * - Supports null state ("Is any value")
 * - Active state has filled background
 */
export function LookerBooleanToggle({
  id,
  label,
  value,
  onChange,
  trueLabel = "True",
  falseLabel = "False",
  width,
  className,
}: LookerBooleanToggleProps) {
  // Convert boolean/null to string for toggle group
  const stringValue = value === null ? "" : value ? "true" : "false";

  const handleValueChange = (newValue: string) => {
    if (newValue === "") {
      // Clicking the same button deselects it -> null state
      onChange(null);
    } else {
      onChange(newValue === "true");
    }
  };

  return (
    <div className={cn("flex flex-col", className)} style={{ width: width || "auto", minWidth: "140px" }}>
      <LookerFilterLabel htmlFor={id}>{label}</LookerFilterLabel>
      <div className="flex items-center gap-0">
        {/* "Is any value" indicator when null */}
        {value === null && (
          <span className="text-sm text-[var(--looker-filter-placeholder)] italic mr-2 whitespace-nowrap">
            Is any value
          </span>
        )}
        <ToggleGroupPrimitive.Root
          type="single"
          value={stringValue}
          onValueChange={handleValueChange}
          className="inline-flex rounded-full border border-[var(--looker-filter-border)] bg-[var(--looker-filter-bg)] overflow-hidden"
        >
          <ToggleGroupPrimitive.Item
            value="true"
            aria-label={trueLabel}
            className={cn(
              // Base styles
              "inline-flex items-center justify-center",
              "h-9 px-4 min-w-[60px]",
              "text-sm font-medium",
              "transition-all duration-150",
              "outline-none",
              // Default (inactive) state
              "bg-[var(--looker-toggle-inactive-bg)] text-[var(--looker-toggle-inactive-text)]",
              "hover:bg-[var(--neutral-200)]",
              // Active state - filled with primary color
              "data-[state=on]:bg-[var(--looker-toggle-active-bg)] data-[state=on]:text-[var(--looker-toggle-active-text)]",
              "data-[state=on]:hover:brightness-95",
              // Focus
              "focus:z-10 focus-visible:ring-2 focus-visible:ring-[var(--looker-filter-border-focus)]",
              // Border between buttons
              "border-r border-[var(--looker-filter-border)]"
            )}
          >
            {trueLabel}
          </ToggleGroupPrimitive.Item>
          <ToggleGroupPrimitive.Item
            value="false"
            aria-label={falseLabel}
            className={cn(
              // Base styles
              "inline-flex items-center justify-center",
              "h-9 px-4 min-w-[60px]",
              "text-sm font-medium",
              "transition-all duration-150",
              "outline-none",
              // Default (inactive) state
              "bg-[var(--looker-toggle-inactive-bg)] text-[var(--looker-toggle-inactive-text)]",
              "hover:bg-[var(--neutral-200)]",
              // Active state - filled with primary color
              "data-[state=on]:bg-[var(--looker-toggle-active-bg)] data-[state=on]:text-[var(--looker-toggle-active-text)]",
              "data-[state=on]:hover:brightness-95",
              // Focus
              "focus:z-10 focus-visible:ring-2 focus-visible:ring-[var(--looker-filter-border-focus)]"
            )}
          >
            {falseLabel}
          </ToggleGroupPrimitive.Item>
        </ToggleGroupPrimitive.Root>
      </div>
    </div>
  );
}
