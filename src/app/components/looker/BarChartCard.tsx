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
  const chartMargin = { ...defaultMargin, bottom: 50 };
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
          <BarChart data={data} margin={chartMargin}>
            <CartesianGrid {...cartesianGridConfig} />
            <XAxis
              dataKey={xAxisKey}
              {...xAxisConfig}
              // Force Recharts to render every tick label (prevents some labels being omitted)
              interval={0}
              // Reserve reasonable vertical space for labels and increase distance from axis
              height={60}
              tickMargin={12}
              // Rotation offset so labels sit below the bars without excessive gap
              tick={{ ...xAxisConfig.tick, angle: -30, dy: 8 }}
            />
            <YAxis {...yAxisConfig} />
            <Tooltip {...tooltipConfig} />
            <Bar dataKey={dataKey} fill={barColor} radius={barRadius} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}