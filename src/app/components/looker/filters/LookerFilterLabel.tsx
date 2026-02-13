import * as React from "react";
import { cn } from "@/app/components/ui/utils";

interface LookerFilterLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Looker-style filter label - positioned above the filter control
 * Uses muted grey color and small font size to match Looker's aesthetic
 */
export function LookerFilterLabel({
  htmlFor,
  children,
  className,
}: LookerFilterLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-xs font-medium mb-1.5",
        "select-none",
        // Use design system token for label color
        "text-[var(--looker-filter-label-color)]",
        className
      )}
    >
      {children}
    </label>
  );
}
