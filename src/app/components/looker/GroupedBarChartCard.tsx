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
  defaultMargin,
  barRadius,
} from "./chartConfig";

interface GroupedBarChartCardProps {
  title?: string;
  data: Array<{ [key: string]: string | number }>;
  dataKeys: string[];
  xAxisKey: string;
  colors?: string[];
  height?: number;
}

export function GroupedBarChartCard({
  title,
  data,
  dataKeys,
  xAxisKey,
  colors,
  height = 300,
}: GroupedBarChartCardProps) {
  const chartColors = colors || getChartColors(dataKeys.length);
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
          <BarChart data={data} margin={defaultMargin}>
            <CartesianGrid {...cartesianGridConfig} />
            <XAxis dataKey={xAxisKey} {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <Tooltip {...tooltipConfig} />
            <Legend {...legendConfig} content={ChartLegendContent} />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartColors[index % chartColors.length]}
                radius={barRadius}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}