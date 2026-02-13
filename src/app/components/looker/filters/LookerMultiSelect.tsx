"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { LookerFilterLabel } from "./LookerFilterLabel";
import type { LookerMultiSelectProps, FilterOption } from "@/app/types/filters";

/**
 * Looker-style multi-select dropdown component
 * Features:
 * - Label positioned above
 * - "Is any value" placeholder when empty
 * - Checkbox-based selection in dropdown
 * - Shows selected count or "Is any value"
 * - Pill-shaped container matching Looker style
 */
export function LookerMultiSelect({
  id,
  label,
  value,
  options,
  placeholder = "Is any value",
  onChange,
  width,
  className,
}: LookerMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (optionValue: string) => {
    const currentSet = new Set(value);
    if (currentSet.has(optionValue)) {
      currentSet.delete(optionValue);
    } else {
      currentSet.add(optionValue);
    }
    onChange(Array.from(currentSet));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleSelectAll = () => {
    onChange(options.map((o) => String(o.value)));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  // Display text
  const displayText = React.useMemo(() => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const opt = options.find((o) => String(o.value) === value[0]);
      return opt?.label || value[0];
    }
    if (value.length === options.length) return "All selected";
    return `${value.length} selected`;
  }, [value, options, placeholder]);

  return (
    <div className={cn("flex flex-col", className)} style={{ width: width || "auto", minWidth: "160px" }}>
      <LookerFilterLabel htmlFor={id}>{label}</LookerFilterLabel>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            id={id}
            type="button"
            className={cn(
              // Base styles
              "inline-flex items-center justify-between gap-2",
              "h-9 px-3 py-2",
              // Looker pill shape
              "rounded-full",
              // Use design tokens for bg/border
              "bg-[var(--looker-filter-bg)] border border-[var(--looker-filter-border)]",
              "text-sm",
              // Text color based on selection state
              value.length === 0 ? "text-[var(--looker-filter-placeholder)] italic" : "text-[var(--looker-filter-text-color)]",
              // Hover state
              "hover:border-[var(--looker-filter-border-hover)]",
              // Focus state
              "focus:outline-none focus:ring-2 focus-visible:ring-[var(--looker-filter-border-focus)] focus:border-[var(--looker-filter-border-focus)]",
              // When open
              "data-[state=open]:border-[var(--looker-filter-border-hover)] data-[state=open]:ring-2 data-[state=open]:ring-[var(--looker-filter-border-focus)]",
              // Transition
              "transition-all duration-150"
            )}
          >
            <span className="truncate">{displayText}</span>
            <div className="flex items-center gap-1">
              {value.length > 0 && (
                <span
                  onClick={handleClear}
                  className="rounded-full p-0.5 hover:bg-[var(--neutral-200)] cursor-pointer"
                >
                  <XIcon className="size-3.5 text-[var(--looker-filter-placeholder)]" />
                </span>
              )}
              <ChevronDownIcon className="size-4 text-[var(--looker-filter-placeholder)] opacity-60" />
            </div>
          </button>
        </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className={cn(
              "z-50 min-w-[200px] overflow-hidden",
              "rounded-lg border border-[var(--looker-filter-border)]",
              "bg-[var(--looker-filter-bg)] shadow-md",
              // Animation
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2",
              "data-[side=top]:slide-in-from-bottom-2"
            )}
            sideOffset={4}
            align="start"
          >
            {/* Quick actions */}
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-[var(--looker-filter-border)]">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-[var(--blue-accent)] hover:underline"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-[var(--looker-filter-placeholder)] hover:underline"
              >
                Clear
              </button>
            </div>

            {/* Options */}
            <div className="p-1 max-h-[250px] overflow-y-auto">
              {options.map((option) => {
                const isSelected = value.includes(String(option.value));
                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => handleToggle(String(option.value))}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center",
                      "rounded-md py-2 pl-8 pr-2 text-sm",
                      "text-[var(--looker-filter-text-color)]",
                      "outline-none",
                      "hover:bg-[var(--neutral-200)]",
                      isSelected && "bg-[var(--neutral-100)]"
                    )}
                  >
                    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                      <div
                        className={cn(
                          "h-4 w-4 rounded border flex items-center justify-center",
                          "transition-colors duration-150",
                          isSelected
                            ? "bg-[var(--looker-toggle-active-bg)] border-[var(--looker-toggle-active-bg)]"
                            : "bg-[var(--looker-filter-bg)] border-[var(--looker-filter-border)]"
                        )}
                      >
                        {isSelected && <CheckIcon className="size-3 text-white" />}
                      </div>
                    </span>
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}
