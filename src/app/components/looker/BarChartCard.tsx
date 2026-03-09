import { Paper, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  cartesianGridConfig,
  xAxisConfig,
  yAxisConfig,
  tooltipConfig,
  defaultMargin,
  barRadius,
  getChartColorValues,
} from "./chartConfig";

interface BarChartCardProps {
  title?: string;
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
}

export function BarChartCard({
  title,
  data,
  dataKey,
  xAxisKey,
  color,
  height = 300,
}: BarChartCardProps) {
  const colors = getChartColorValues();
  const barColor = color || colors.blueLight;
  // Adjust bottom margin for rotated X-axis tick labels to a normal spacing
  const chartMargin = { ...defaultMargin, bottom: 10 };
  // Compute adaptive label offset based on longest label to avoid too much or too little spacing
  const rawLabels = data?.map((d) => String(d[xAxisKey] ?? "")) || [];
  const maxLabelLen = rawLabels.length ? Math.max(...rawLabels.map((s) => s.length)) : 0;
  // Simpler, smaller adaptive offset: base 6px, increase modestly for very long labels, clamp 6-12
  const labelDy = Math.min(12, Math.max(6, Math.floor(maxLabelLen / 10) * 4));
  // Move labels closer by ~20px as requested (clamp to >= 0)
  const labelDyAdjusted = Math.max(0, labelDy - 20);
  // Add a small padding so labels rendered outside the SVG aren't clipped
  // Increase by ~20px to ensure labels are visible (user requested +20px)
  const extraPadding = Math.max(6, Math.min(40, labelDyAdjusted + 26));
  const totalHeight = height + extraPadding;
  // Ensure the chart's internal SVG has a matching bottom margin so ticks aren't clipped
  const chartMarginWithPadding = { ...chartMargin, bottom: (chartMargin.bottom || 0) + extraPadding };

  return (
    <Paper
      sx={{
        p: "var(--spacing-6)",
        borderRadius: "var(--radius-lg)",
        border: "var(--border-width-thin) solid var(--border-default)",
        backgroundColor: "var(--white)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{
            fontFamily: "var(--font-family-base)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--text-primary)",
            mb: "var(--spacing-4)",
          }}
        >
          {title}
        </Typography>
      )}
      <Box sx={{ width: "100%", height: `${totalHeight}px`, minHeight: `${totalHeight}px`, minWidth: 0, overflow: 'visible' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={totalHeight}>
          <BarChart data={data} margin={chartMarginWithPadding}>
            <CartesianGrid {...cartesianGridConfig} />
            <XAxis
              dataKey={xAxisKey}
              {...xAxisConfig}
              // Force Recharts to render every tick label (prevents some labels being omitted)
              interval={0}
              // Reserve reasonable vertical space for labels and increase distance from axis
              height={44}
              // Slight margin; exact vertical spacing is handled by computed `labelDyAdjusted`
              tickMargin={4}
              // Top-align rotated labels so they extend downward; `dy` adapts to label length
              tick={{
                ...xAxisConfig.tick,
                angle: -30,
                dy: labelDyAdjusted,
                textAnchor: "end",
                // Use alphabetic baseline so the dy behaves predictably across browsers
                dominantBaseline: "alphabetic",
              }}
            />
            <YAxis {...yAxisConfig} />
            <Tooltip {...tooltipConfig} />
            <Bar dataKey={dataKey} name={dataKey} fill={barColor} radius={barRadius} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}