import { Paper, Typography, Box } from "@mui/material";
import {
  ComposedChart,
  Bar,
  Line,
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
  lineConfig,
} from "./chartConfig";

interface ComposedBarLineChartCardProps {
  title?: string;
  data: Array<{ [key: string]: string | number }>;
  barDataKeys: string[];
  lineDataKeys: string[];
  xAxisKey: string;
  colors?: string[];
  lineColors?: string[];
  height?: number;
  yAxisLabel?: string;
  rightYAxisLabel?: string;
}

export function ComposedBarLineChartCard({
  title,
  data,
  barDataKeys,
  lineDataKeys,
  xAxisKey,
  colors,
  lineColors,
  height = 300,
  yAxisLabel,
  rightYAxisLabel,
}: ComposedBarLineChartCardProps) {
  const chartColors = colors || getChartColors(barDataKeys.length);
  const lineChartColors = lineColors || getChartColors(lineDataKeys.length || 1);

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
          <ComposedChart data={data} margin={defaultMargin}>
            <CartesianGrid {...cartesianGridConfig} />
            <XAxis dataKey={xAxisKey} {...xAxisConfig} />
            <YAxis 
              yAxisId="left"
              {...yAxisConfig}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'center', style: { textAnchor: 'middle' } } : undefined}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              {...yAxisConfig}
              label={rightYAxisLabel ? { value: rightYAxisLabel, angle: 90, position: 'center', style: { textAnchor: 'middle' } } : undefined}
            />
            <Tooltip {...tooltipConfig} />
            <Legend {...legendConfig} content={ChartLegendContent} />
            {barDataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="stack"
                fill={chartColors[index % chartColors.length]}
                yAxisId="left"
              />
            ))}
            {lineDataKeys.map((key, index) => (
              <Line
                key={key}
                dataKey={key}
                stroke={lineChartColors[index % lineChartColors.length]}
                yAxisId="right"
                {...lineConfig}
                strokeWidth={2}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
