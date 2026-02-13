import { NFL_TEAMS } from "./nflTeams";
import { INJURY_RECORDS, InjuryRecord } from "./mockInjuryData";

export interface MissedTimeStats {
  teamId: number;
  teamName: string;
  teamAbbr: string;
  season: number;
  totalInjuries: number;
  missedTimeInjuries: number; // Injuries resulting in missed time (>3 days)
  totalDaysMissed: number;
  avgDaysPerInjury: number;
}

// Helper: Determine if an injury resulted in significant missed time (>3 days)
function isMissedTimeInjury(injury: InjuryRecord): boolean {
  return injury.daysOut > 3;
}

// Calculate missed time stats for all teams across all seasons
export function generateMissedTimeStats(): MissedTimeStats[] {
  const stats: MissedTimeStats[] = [];
  const seasons = [2021, 2022, 2023, 2024];

  NFL_TEAMS.forEach((team) => {
    seasons.forEach((season) => {
      const teamSeasonInjuries = INJURY_RECORDS.filter(
        (record) => record.teamId === team.id && record.season === season
      );

      const missedTimeInjuries = teamSeasonInjuries.filter(isMissedTimeInjury);
      const totalDaysMissed = missedTimeInjuries.reduce(
        (sum, injury) => sum + injury.daysOut,
        0
      );

      stats.push({
        teamId: team.id,
        teamName: team.name,
        teamAbbr: team.abbreviation,
        season,
        totalInjuries: teamSeasonInjuries.length,
        missedTimeInjuries: missedTimeInjuries.length,
        totalDaysMissed,
        avgDaysPerInjury:
          missedTimeInjuries.length > 0
            ? totalDaysMissed / missedTimeInjuries.length
            : 0,
      });
    });
  });

  return stats;
}

export const MISSED_TIME_STATS = generateMissedTimeStats();

// Helper functions for benchmark calculations
export function getTeamMissedTimeStats(
  teamId: number,
  season: number
): MissedTimeStats | undefined {
  return MISSED_TIME_STATS.find(
    (stat) => stat.teamId === teamId && stat.season === season
  );
}

export function getTeam1YearAvg(teamId: number, currentSeason: number): number {
  const prevSeason = currentSeason - 1;
  const stats = MISSED_TIME_STATS.find(
    (stat) => stat.teamId === teamId && stat.season === prevSeason
  );
  return stats ? stats.missedTimeInjuries : 0;
}

export function getTeam3YearAvg(teamId: number, currentSeason: number): number {
  const seasons = [currentSeason - 1, currentSeason - 2, currentSeason - 3];
  const teamStats = MISSED_TIME_STATS.filter(
    (stat) => stat.teamId === teamId && seasons.includes(stat.season)
  );

  if (teamStats.length === 0) return 0;

  const totalInjuries = teamStats.reduce(
    (sum, stat) => sum + stat.missedTimeInjuries,
    0
  );
  return totalInjuries / teamStats.length;
}

export function getNFL1YearAvg(season: number): number {
  const allTeamStats = MISSED_TIME_STATS.filter(
    (stat) => stat.season === season
  );

  if (allTeamStats.length === 0) return 0;

  const totalInjuries = allTeamStats.reduce(
    (sum, stat) => sum + stat.missedTimeInjuries,
    0
  );
  return totalInjuries / allTeamStats.length;
}

export function getNFLAvgForSeason(season: number): number {
  return getNFL1YearAvg(season);
}

export function getTeamStandingPosition(
  teamId: number,
  season: number
): { position: number; isTied: boolean } {
  const allTeamsInSeason = MISSED_TIME_STATS.filter(
    (stat) => stat.season === season
  );

  // Sort by missed time injuries (ascending - fewer injuries is better)
  const sorted = [...allTeamsInSeason].sort(
    (a, b) => a.missedTimeInjuries - b.missedTimeInjuries
  );

  const teamStat = sorted.find((stat) => stat.teamId === teamId);
  if (!teamStat) return { position: 32, isTied: false };

  const position = sorted.findIndex((stat) => stat.teamId === teamId) + 1;

  // Check if tied
  const teamsWithSameCount = sorted.filter(
    (stat) => stat.missedTimeInjuries === teamStat.missedTimeInjuries
  );
  const isTied = teamsWithSameCount.length > 1;

  return { position, isTied };
}

// Get benchmark data for horizontal bar chart
export interface BenchmarkData {
  oneYearTeamAvg: number;
  currentSeason: number;
  threeYearAvg: number;
  oneYearNFLAvg: number;
}

export function getBenchmarkData(
  teamId: number,
  season: number
): BenchmarkData {
  const currentSeasonStats = getTeamMissedTimeStats(teamId, season);
  const oneYearTeamAvg = getTeam1YearAvg(teamId, season);
  const threeYearAvg = getTeam3YearAvg(teamId, season);
  const oneYearNFLAvg = getNFL1YearAvg(season - 1);

  return {
    oneYearTeamAvg,
    currentSeason: currentSeasonStats?.missedTimeInjuries || 0,
    threeYearAvg,
    oneYearNFLAvg,
  };
}

// Returns missed-time injuries (>3 days) grouped by player position for a team/season
export function getMissedTimeByPosition(teamId: number, season: number): Array<{ position: string; missedTimeInjuries: number }> {
  // Collect injuries for the team and season
  const teamSeasonInjuries = INJURY_RECORDS.filter(
    (rec) => rec.teamId === teamId && rec.season === season && rec.daysOut > 3
  );

  // Aggregate counts by position
  const positionCounts: Record<string, number> = {};

  teamSeasonInjuries.forEach((inj) => {
    const pos = inj.position || "Unknown";
    positionCounts[pos] = (positionCounts[pos] || 0) + 1;
  });

  // Convert to array and sort by a consistent position order if available
  const result = Object.keys(positionCounts).map((pos) => ({
    position: pos,
    missedTimeInjuries: positionCounts[pos],
  }));

  // Try to preserve POSITIONS ordering if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { POSITIONS } = require("./nflTeams");
    result.sort((a, b) => {
      const ai = POSITIONS.indexOf(a.position as string);
      const bi = POSITIONS.indexOf(b.position as string);
      if (ai === -1 && bi === -1) return a.position.localeCompare(b.position);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  } catch (e) {
    result.sort((a, b) => b.missedTimeInjuries - a.missedTimeInjuries);
  }

  return result;
}
