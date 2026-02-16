import { Paper, Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartLegendContent } from "../ui/chart";
import { getChartColors, tooltipConfig, legendConfig } from "./chartConfig";

interface DonutChartCardProps {
  title?: string;
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  height?: number;
}

export function DonutChartCard({ title, data, colors, height = 300 }: DonutChartCardProps) {
  const chartColors = colors || getChartColors(data.length);
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
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipConfig} />
            <Legend {...legendConfig} content={ChartLegendContent} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}