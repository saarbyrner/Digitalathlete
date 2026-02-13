import { Grid } from "@/app/components/playbook";
import { LineChartCard } from "./LineChartCard";
import {
  getTeamMissedTimeStats,
  getTeam3YearAvg,
  getNFLAvgForSeason,
} from "@/app/data/missedTimeData";

interface SeasonTrendChartProps {
  teamId: number;
  season: number;
  height?: number;
}

const TREND_POINTS = ["ER", "TC1", "TC2", "P1", "P2", "P3", "P0"];

// Deterministic cumulative fractions for each trend point (must end at 1)
const CUMULATIVE_FRACTIONS = [0.02, 0.08, 0.15, 0.45, 0.6, 0.8, 1];

function buildCumulativeSeries(finalValue: number) {
  return TREND_POINTS.map((label, idx) => ({
    trend: label,
    value: Math.round(finalValue * CUMULATIVE_FRACTIONS[idx]),
  }));
}

export function SeasonTrendChart({ teamId, season, height = 340 }: SeasonTrendChartProps) {
  const seasons = [2021, 2022, 2023, 2024];

  // Build per-season series using final missedTimeInjuries for that season
  const seriesBySeason = seasons.map((s) => {
    const stats = getTeamMissedTimeStats(teamId, s);
    const final = stats?.missedTimeInjuries || 0;
    return buildCumulativeSeries(final).map((p) => ({ trend: p.trend, [String(s)]: p.value }));
  });

  // Reduce to a single array with keys for each season
  const merged: Array<Record<string, number | string>> = TREND_POINTS.map((t, idx) => {
    const obj: Record<string, number | string> = { trend: t };
    seasons.forEach((s) => {
      const stats = getTeamMissedTimeStats(teamId, s);
      const final = stats?.missedTimeInjuries || 0;
      obj[String(s)] = Math.round(final * CUMULATIVE_FRACTIONS[idx]);
    });
    return obj;
  });

  // 3-year average across previous seasons (for the selected season use seasons -1..-3)
  const threeYearAvgFinal = getTeam3YearAvg(teamId, season);
  const nflAvgFinal = getNFLAvgForSeason(season);

  // Add 3-year avg and NFL avg as lines
  const data = merged.map((row) => ({
    ...row,
    "3yrAvg": Math.round(threeYearAvgFinal * CUMULATIVE_FRACTIONS[TREND_POINTS.indexOf(String(row.trend))] || 0),
    "NFLAvg": Math.round(nflAvgFinal * CUMULATIVE_FRACTIONS[TREND_POINTS.indexOf(String(row.trend))] || 0),
  }));

  const dataKeys = seasons.map((s) => String(s)).concat(["3yrAvg", "NFLAvg"]);
  // Colors will use the chartConfig defaults via LineChartCard

  return (
    <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
      <LineChartCard
        title={`Missed Time Injuries Over Season - ${season}`}
        data={data}
        dataKeys={dataKeys}
        xAxisKey="trend"
        height={height}
      />
    </Grid>
  );
}
