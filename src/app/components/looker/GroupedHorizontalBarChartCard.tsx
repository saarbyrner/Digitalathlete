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
import { ChartLegendContent } from "../ui/chart";
import {
  getChartColors,
  cartesianGridConfig,
  xAxisConfig,
  yAxisConfig,
  tooltipConfig,
  legendConfig,
} from "./chartConfig";

interface GroupedHorizontalBarChartCardProps {
  title?: string;
  data: Array<{ [key: string]: string | number }>;
  dataKeys: string[];
  yAxisKey: string;
  colors?: string[];
  height?: number;
  maxValue?: number;
}

export function GroupedHorizontalBarChartCard({
  title,
  data,
  dataKeys,
  yAxisKey,
  colors,
  height = 600,
  maxValue,
}: GroupedHorizontalBarChartCardProps) {
  const chartColors = colors || getChartColors(dataKeys.length);
  // Compute a sensible max for the x-axis if none provided. Take the largest value across
  // provided dataKeys, add a 10% margin and round up to the nearest 5 for a clean axis.
  const computedMax = (() => {
    if (typeof maxValue === "number") return maxValue;
    if (!data || data.length === 0) return 10;
    const rawMax = Math.max(
      ...data.map((d) => Math.max(...dataKeys.map((k) => Number(d[k] || 0))))
    );
    const withMargin = Math.ceil(rawMax * 1.1);
    // round up to nearest 5
    return Math.max(5, Math.ceil(withMargin / 5) * 5);
  })();
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
      <Box sx={{ width: "100%", height: `${height}px`, minHeight: `${height}px`, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={height} minWidth={0} minHeight={height}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
          >
            <CartesianGrid {...cartesianGridConfig} horizontal={false} />
            <XAxis
              type="number"
              domain={[0, computedMax]}
              {...xAxisConfig}
            />
            <YAxis
              type="category"
              dataKey={yAxisKey}
              {...yAxisConfig}
              width={110}
            />
            <Tooltip {...tooltipConfig} />
            <Legend {...legendConfig} content={ChartLegendContent} />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartColors[index % chartColors.length]}
                radius={[0, 4, 4, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
