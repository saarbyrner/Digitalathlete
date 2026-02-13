import { Paper, Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getChartColorValues } from "./chartConfig";

interface GaugeCardProps {
  value: number;
  max?: number;
  label: string;
  color?: string;
}

export function GaugeCard({ value, max = 100, label, color }: GaugeCardProps) {
  const colors = getChartColorValues();
  const gaugeColor = color || colors.gaugePrimary;
  const percentage = (value / max) * 100;
  const data = [
    { name: "value", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ];

  return (
    <Paper
      sx={{
        p: "var(--spacing-3)",
        borderRadius: "var(--radius-lg)",
        border: "var(--border-width-thin) solid var(--border-default)",
        backgroundColor: "var(--white)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minWidth: 0,
      }}
    >
      <Box sx={{ width: "100%", height: "140px", minHeight: "140px", minWidth: 0, position: "relative" }}>
        <ResponsiveContainer width="100%" height={140} minWidth={0} minHeight={140}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={gaugeColor} />
              <Cell fill={colors.gaugeBackground} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -20%)",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--font-size-h5)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--text-primary)",
              lineHeight: "var(--line-height-tight)",
            }}
          >
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{
          fontFamily: "var(--font-family-base)",
          color: "var(--text-secondary)",
          fontSize: "var(--font-size-body2)",
          fontWeight: "var(--font-weight-regular)",
          textAlign: "center",
          mt: "var(--spacing-1)",
        }}
      >
        {label}
      </Typography>
    </Paper>
  );
}