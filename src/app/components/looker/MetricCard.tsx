import { Paper, Typography, Box } from "@mui/material";
import { getChartColorValues } from "./chartConfig";

interface MetricCardProps {
  value: string | number;
  label: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

export function MetricCard({ value, label, trend, color }: MetricCardProps) {
  const colors = getChartColorValues();
  const numberColor = color || "var(--chart-metric-number)";
  
  return (
    <Paper
      sx={{
        p: "var(--spacing-4)",
        borderRadius: "var(--radius-lg)",
        border: "var(--border-width-thin) solid var(--border-default)",
        backgroundColor: "var(--white)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "var(--spacing-2)",
      }}
    >
      <Typography
        sx={{
          fontFamily: "var(--font-family-base)",
          fontSize: "var(--font-size-h5)",
          fontWeight: "var(--font-weight-semibold)",
          color: numberColor,
          lineHeight: "var(--line-height-tight)",
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: "var(--font-family-base)",
          color: colors.axisText,
          fontSize: "var(--font-size-body2)",
          fontWeight: "var(--font-weight-regular)",
          lineHeight: "var(--line-height-normal)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </Typography>
      {trend && (
        <Typography
          sx={{
            fontFamily: "var(--font-family-base)",
            color: trend.isPositive ? "var(--chart-metric-trend-up)" : "var(--chart-metric-trend-down)",
            fontSize: "var(--font-size-caption)",
            fontWeight: "var(--font-weight-regular)",
          }}
        >
          {trend.isPositive ? "↑" : "↓"} {trend.value}
        </Typography>
      )}
    </Paper>
  );
}