"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { LookerFilterLabel } from "./LookerFilterLabel";
import type { LookerSelectProps, FilterOption } from "@/app/types/filters";

/**
 * Looker-style single-select dropdown component
 * Features:
 * - Label positioned above
 * - "Is any value" placeholder when null
 * - Pill-shaped container with subtle border
 * - Matches Looker embedded dashboard filter aesthetic
 */
export function LookerSelect({
  id,
  label,
  value,
  options,
  placeholder = "Is any value",
  onChange,
  width,
  className,
}: LookerSelectProps) {
  const handleValueChange = (newValue: string) => {
    // Special handling for "any" value to set null
    onChange(newValue === "__any__" ? null : newValue);
  };

  return (
    <div className={cn("flex flex-col", className)} style={{ width: width || "auto", minWidth: "140px" }}>
      <LookerFilterLabel htmlFor={id}>{label}</LookerFilterLabel>
      <SelectPrimitive.Root
        value={value ?? "__any__"}
        onValueChange={handleValueChange}
      >
        <SelectPrimitive.Trigger
          id={id}
          className={cn(
            // Base styles
            "inline-flex items-center justify-between gap-2",
            "h-9 px-3 py-2",
            // Looker pill shape
            "rounded-full",
            // Use design system tokens for bg/border/text
            "bg-[var(--looker-filter-bg)] border border-[var(--looker-filter-border)]",
            "text-sm text-[var(--looker-filter-text-color)]",
            // Placeholder styling
            `data-[placeholder]:text-[var(--looker-filter-placeholder)]`,
            // Hover state
            "hover:border-[var(--looker-filter-border-hover)]",
            // Focus state
            "focus:outline-none focus:ring-2",
            "focus-visible:ring-[var(--looker-filter-border-focus)] focus:border-[var(--looker-filter-border-focus)]",
            // Transition
            "transition-all duration-150",
            // Icon styling
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 [&_svg]:text-[var(--looker-filter-placeholder)]"
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder}>
            {value ? options.find(o => String(o.value) === value)?.label : placeholder}
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon asChild>
            <ChevronDownIcon className="size-4 opacity-60" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 min-w-[8rem] overflow-hidden",
              "rounded-lg border border-[var(--border-default)]",
              "bg-white shadow-md",
              // Animation
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2",
              "data-[side=top]:slide-in-from-bottom-2"
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1 max-h-[300px]">
              {/* "Is any value" option */}
              <SelectPrimitive.Item
                value="__any__"
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center",
                    "rounded-md py-2 pl-8 pr-2 text-sm",
                    // placeholder styling
                    "italic text-[var(--looker-filter-placeholder)]",
                    "outline-none",
                    "hover:bg-[var(--neutral-200)]",
                    "focus:bg-[var(--neutral-200)]",
                    "data-[state=checked]:bg-[var(--neutral-200)]"
                  )}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <CheckIcon className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{placeholder}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>

              {/* Separator */}
              <SelectPrimitive.Separator className="h-px bg-[var(--border-default)] my-1 -mx-1" />

              {/* Options */}
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={String(option.value)}
                  value={String(option.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center",
                    "rounded-md py-2 pl-8 pr-2 text-sm",
                    // use design token for item text
                    "text-[var(--looker-filter-text-color)]",
                    "outline-none",
                    "hover:bg-[var(--neutral-200)]",
                    "focus:bg-[var(--neutral-200)]",
                    "data-[state=checked]:bg-[var(--neutral-200)] data-[state=checked]:font-medium"
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <CheckIcon className="size-4" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
