import { Paper, Typography, Box } from "@mui/material";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import {
  cartesianGridConfig,
  xAxisConfig,
  yAxisConfig,
  tooltipConfig,
  defaultMargin,
  scatterConfig,
  getChartColorValues,
} from "./chartConfig";

interface ScatterChartCardProps {
  title?: string;
  data: Array<{ [key: string]: string | number }>;
  xKey: string;
  yKey: string;
  zKey?: string; // Optional size key for bubble chart
  color?: string;
  height?: number;
}

export function ScatterChartCard({
  title,
  data,
  xKey,
  yKey,
  zKey,
  color,
  height = 300,
}: ScatterChartCardProps) {
  const colors = getChartColorValues();
  const scatterColor = color || colors.blueLight;
  return (
    <Paper
      sx={{
        p: "var(--spacing-6)",
        borderRadius: "var(--radius-lg)",
        border: "var(--border-width-thin) solid var(--border-default)",
        backgroundColor: "var(--white)",
        height: "100%",
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
      <Box sx={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={defaultMargin}>
            <CartesianGrid {...cartesianGridConfig} />
            <XAxis type="number" dataKey={xKey} {...xAxisConfig} />
            <YAxis type="number" dataKey={yKey} {...yAxisConfig} />
            {zKey && <ZAxis type="number" dataKey={zKey} range={[50, 400]} />}
            <Tooltip cursor={{ strokeDasharray: "3 3" }} {...tooltipConfig} />
            <Scatter data={data} fill={scatterColor} {...scatterConfig} />
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}