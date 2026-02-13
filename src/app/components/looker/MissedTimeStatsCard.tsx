import { Paper, Typography, Box } from "@mui/material";
import { getChartColorValues } from "./chartConfig";

interface MissedTimeStatsCardProps {
  season: number;
  teamAvg: number;
  nflAvg: number;
  standingPosition: number;
  isTied: boolean;
  numberOfInjuries: number;
}

export function MissedTimeStatsCard({
  season,
  teamAvg,
  nflAvg,
  standingPosition,
  isTied,
  numberOfInjuries,
}: MissedTimeStatsCardProps) {
  const colors = getChartColorValues();
  // Calculate position of team marker on visualization (0-100 scale)
  const teamPosition = Math.min(100, (teamAvg / 30) * 100);
  const nflPosition = Math.min(100, (nflAvg / 30) * 100);

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
        minWidth: 320,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: "var(--font-family-base)",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--text-primary)",
          mb: "var(--spacing-4)",
        }}
      >
        Missed Time Injuries - {season}
      </Typography>

      {/* Visualization */}
      <Box
        sx={{
          position: "relative",
          height: 60,
          mb: "var(--spacing-4)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Dotted line */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            borderTop: `2px dotted ${colors.grid}`,
            transform: "translateY(-50%)",
          }}
        />

        {/* NFL Avg marker (Orange) */}
        <Box
          sx={{
            position: "absolute",
            left: `${nflPosition}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: colors.chart3,
              border: `2px solid ${colors.chart3}`,
              mb: 0.5,
            }}
          />
        </Box>

        {/* Team Avg marker (Teal) */}
        <Box
          sx={{            position: "absolute",
            left: `${teamPosition}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: colors.chart5,
              border: `2px solid ${colors.chart5}`,
              mb: 0.5,
            }}
          />
        </Box>
      </Box>

      {/* Stats Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--spacing-4)",
        }}
      >
        {/* Team Avg */}
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-family-base)",
              fontSize: 12,
              color: colors.axisText,
              mb: 0.5,
            }}
          >
            Team Avg
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-family-base)",
              fontWeight: "var(--font-weight-semibold)",
              fontSize: 24,
              color: "var(--text-primary)",
            }}
          >
            {teamAvg.toFixed(1)}
          </Typography>
        </Box>

        {/* NFL Avg */}
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-family-base)",
              fontSize: 12,
              color: colors.axisText,
              mb: 0.5,
            }}
          >
            NFL Avg
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-family-base)",
              fontWeight: "var(--font-weight-semibold)",
              fontSize: 24,
              color: "var(--text-primary)",
            }}
          >
            {nflAvg.toFixed(1)}
          </Typography>
        </Box>

        {/* Standing Position */}
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-family-base)",
              fontSize: 12,
              color: colors.axisText,
              mb: 0.5,
            }}
          >
            Standing Position
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-family-base)",
              fontWeight: "var(--font-weight-semibold)",
              fontSize: 24,
              color: "var(--text-primary)",
            }}
          >
            {standingPosition} {isTied && "(tied)"}
          </Typography>
        </Box>

        {/* Number of Injuries */}
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-family-base)",
              fontSize: 12,
              color: colors.axisText,
              mb: 0.5,
            }}
          >
            Number of Injuries
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-family-base)",
              fontWeight: "var(--font-weight-semibold)",
              fontSize: 24,
              color: "var(--text-primary)",
            }}
          >
            {numberOfInjuries}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
