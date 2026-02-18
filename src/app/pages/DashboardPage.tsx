import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router";
import { Box, Grid, IconButton, Tabs, Tab, Typography, Avatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@/app/components/playbook";
import { MainNavigation } from "@/app/components/MainNavigation";
import { AppBarHeader } from "@/app/components/AppBarHeader";
import { Header } from "@/app/components/Header";
import { DashboardFilters, FilterState } from "@/app/components/DashboardFilters";
import { LookerFilterBar, useLookerFilters } from "@/app/components/looker/filters";
import { getFilterConfig, getRehabFiltersForTab, getPhsFiltersForTab } from "@/app/config/dashboardFilters";
import { 
  INJURY_RECORDS, 
  ACTIVITY_LOG_ENTRIES, 
  ActivityLogEntry, 
  aggregateInjuriesByBodyPartYoY, 
  aggregateDaysMissedByBodyPartYoY, 
  aggregateInjuryClassificationMatrix, 
  getInjuryCountsByType,
  PLAYER_DEMOGRAPHICS,
  getPlayerDemographics,
  aggregateInjuriesByPlayerBySeason,
  aggregateMissedDaysByPlayerOverTime,
  aggregateMissedGamesByPlayerOverTime,
  aggregateMissedPracticesByPlayerOverTime,
  getPlayerMajorStats,
  getPlayerInjuryRecords,
  getPlayerActivityLog,
} from "@/app/data/mockInjuryData";
import { getImageForPlayer } from "@/app/utils/playerImages";
import { MetricCard } from "@/app/components/looker/MetricCard";
import { getChartColors, getChartColorValues } from "@/app/components/looker/chartConfig";
import { GaugeCard } from "@/app/components/looker/GaugeCard";
import { BarChartCard } from "@/app/components/looker/BarChartCard";
import { GroupedBarChartCard } from "@/app/components/looker/GroupedBarChartCard";
import { HorizontalBarChartCard } from "@/app/components/looker/HorizontalBarChartCard";
import { GroupedHorizontalBarChartCard } from "@/app/components/looker/GroupedHorizontalBarChartCard";
import { MissedTimeStatsCard } from "@/app/components/looker/MissedTimeStatsCard";
import { DonutChartCard } from "@/app/components/looker/DonutChartCard";
import { LineChartCard } from "@/app/components/looker/LineChartCard";
import { SeasonTrendChart } from "@/app/components/looker/SeasonTrendChart";
import { ComposedBarLineChartCard } from "@/app/components/looker/ComposedBarLineChartCard";
import { StackedBarChartCard } from "@/app/components/looker/StackedBarChartCard";
import { DashboardDrawer } from "@/app/components/DashboardDrawer";
import { getFilteredData, getBenchmarkComparison, getInjuryTypeData, applyRehabFilters, filterRehabSessions } from "@/app/utils/dataFilters";
import { InjuryType } from "@/app/data/mockInjuryData";
import { getBenchmarkData, getTeamStandingPosition, getNFLAvgForSeason, getTeamMissedTimeStats, getNFL1YearAvg, getTeam3YearAvg } from "@/app/data/missedTimeData";
import { getMissedTimeByPosition } from "@/app/data/missedTimeData";
import { NFL_TEAMS } from "@/app/data/nflTeams";
import { POSITIONS } from "@/app/data/nflTeams";
import { mockPlayerProfile } from "@/app/data/athleteData";
// Import rehab session data and aggregation functions
import {
  REHAB_SESSIONS,
  aggregateDonutData,
  aggregateDaysLostByInjury,
  aggregateDaysLostByPlayer,
  aggregateModalityVsExercise,
  aggregateExercises,
  aggregateBodyParts,
  aggregatePlayersBySessionType,
  aggregateInjuriesBySessionType,
  aggregateSessionsByTeam,
  aggregateInjuriesByTeam,
  getUniquePlayers,
  getPlayerProfile,
} from "@/app/data/rehabSessionData";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Map dashboard types to display names
const dashboardTitles: Record<string, string> = {
  "dashboard": "Dashboard",
  "missed-time": "Missed Time",
  "concussion": "Concussion",
  "shoulder": "Shoulder",
  "lex-sprain": "LEX Sprain",
  "lex-strain": "LEX Strain",
  "acl": "ACL",
  "hamstring": "Hamstring",
  "other-injuries": "Other Injuries",
  "recovery-time": "Recovery Time",
  "team-view": "Team View",
  "rehab": "Rehab",
  "phs-injury-report": "PHS Injury Report",
};

// Map dashboard types to injury types for specific dashboards
const dashboardToInjuryType: Record<string, InjuryType | undefined> = {
  "concussion": "Concussion",
  "shoulder": "Shoulder",
  "lex-sprain": "LEX Sprain",
  "lex-strain": "LEX Strain",
  "acl": "ACL",
  "hamstring": "Hamstring",
};

export function DashboardPage() {
  const { dashboardType } = useParams<{ dashboardType: string }>();
  const [filtersOpen, setFiltersOpen] = useState(true); // Open by default
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterState, setFilterState] = useState<FilterState>({
    season: "2025",
    benchmarkValue: "",
    startDate: null,
    endDate: null,
    quickDateRange: "",
    sessionTypes: [],
    injuryStatus: "",
    teamId: "18", // Default to New York Giants - Changed to string
  }); // Default to 2025 season

  // Looker-style filters - get config for current dashboard (tab-aware for rehab and PHS)
  const lookerFilterConfig = useMemo(() => {
    if (dashboardType === "rehab") {
      return getRehabFiltersForTab(selectedTab);
    }
    if (dashboardType === "phs-injury-report") {
      return getPhsFiltersForTab(selectedTab);
    }
    return getFilterConfig(dashboardType || "missed-time");
  }, [dashboardType, selectedTab]);
  
  const { values: lookerFilterValues, handleChange: handleLookerFilterChange, handleReset: handleLookerReset, setValues: setLookerFilterValues } = useLookerFilters(lookerFilterConfig);

  // Clear incompatible filter values when tab changes
  useEffect(() => {
    if (dashboardType !== "rehab" && dashboardType !== "phs-injury-report") return;
    
    // Get current tab's filter dataKeys
    const currentFilters = dashboardType === "rehab" 
      ? getRehabFiltersForTab(selectedTab)
      : getPhsFiltersForTab(selectedTab);
    const currentFilterKeys = new Set(currentFilters.map(f => f.dataKey));
    
    // Check if any current filter values are incompatible with new tab
    const newFilterValues: Record<string, any> = {};
    let needsUpdate = false;
    
    Object.entries(lookerFilterValues).forEach(([key, value]) => {
      if (currentFilterKeys.has(key)) {
        newFilterValues[key] = value;
      } else if (value !== undefined && value !== null && value !== "") {
        // Found an incompatible filter that would affect data
        needsUpdate = true;
      }
    });
    
    // For PHS Player Summary tab, auto-select first player if none is selected
    if (dashboardType === "phs-injury-report" && selectedTab === 2) {
      if (!newFilterValues.playerName && !lookerFilterValues.playerName) {
        // Get unique players from the data
        const uniquePlayers = Array.from(new Set(INJURY_RECORDS.map(r => r.playerName))).sort();
        if (uniquePlayers.length > 0) {
          newFilterValues.playerName = uniquePlayers[0];
          needsUpdate = true;
        }
      }
    }
    
    // Only update if we actually removed some filters or added default player
    if (needsUpdate) {
      setLookerFilterValues(newFilterValues);
    }
  }, [dashboardType, selectedTab]); // Intentionally omit lookerFilterValues to avoid infinite loop

  // Filtered data for Rehab dashboard
  const filteredInjuryRecords = useMemo(() => {
    if (dashboardType !== "rehab") return INJURY_RECORDS;
    return applyRehabFilters(INJURY_RECORDS, lookerFilterValues);
  }, [dashboardType, lookerFilterValues]);

  const filteredRehabSessions = useMemo(() => {
    if (dashboardType !== "rehab") return REHAB_SESSIONS;
    return filterRehabSessions(REHAB_SESSIONS, lookerFilterValues);
  }, [dashboardType, lookerFilterValues]);

  // Aggregated chart data for Rehab dashboard
  const rehabChartData = useMemo(() => {
    if (dashboardType !== "rehab") return null;
    
    // Get body parts for dynamic chart keys
    const bodyPartsSet = new Set<string>();
    filteredRehabSessions.forEach((s) => s.bodyPartsWorked.forEach((bp) => bodyPartsSet.add(bp)));
    const bodyPartKeys = Array.from(bodyPartsSet).slice(0, 5); // Top 5 body parts

    return {
      // Donut charts
      totalDonut: aggregateDonutData(filteredRehabSessions, "total"),
      rehabDonut: aggregateDonutData(filteredRehabSessions, "rehab"),
      maintenanceDonut: aggregateDonutData(filteredRehabSessions, "maintenance"),
      
      // Bar charts
      daysLostByInjury: aggregateDaysLostByInjury(filteredInjuryRecords, filteredRehabSessions),
      daysLostByPlayer: aggregateDaysLostByPlayer(filteredInjuryRecords, filteredRehabSessions),
      
      // Stacked/Composed charts - by date (for Player tab)
      modalityByDate: aggregateModalityVsExercise(filteredRehabSessions, "date"),
      exercisesByDate: aggregateExercises(filteredRehabSessions, "date"),
      bodyPartsByDate: aggregateBodyParts(filteredRehabSessions, "date"),
      
      // Stacked/Composed charts - by player (for Sessions tab)
      modalityByPlayer: aggregateModalityVsExercise(filteredRehabSessions, "player"),
      exercisesByPlayer: aggregateExercises(filteredRehabSessions, "player"),
      bodyPartsByPlayer: aggregateBodyParts(filteredRehabSessions, "player"),
      
      // Stacked/Composed charts - by injury (for Injury tab)
      modalityByInjury: aggregateModalityVsExercise(filteredRehabSessions, "injury"),
      
      // Session type aggregations
      playersBySessionType: aggregatePlayersBySessionType(filteredRehabSessions),
      injuriesBySessionType: aggregateInjuriesBySessionType(filteredRehabSessions),
      
      // League tab: team comparisons
      sessionsByTeam: aggregateSessionsByTeam(filteredRehabSessions),
      injuriesByTeam: aggregateInjuriesByTeam(filteredRehabSessions),
      
      // Available players for selection
      availablePlayers: getUniquePlayers(filteredRehabSessions),
      
      // Dynamic body part keys for charts
      bodyPartKeys,
    };
  }, [dashboardType, filteredInjuryRecords, filteredRehabSessions]);

  const leagueTeamRows = rehabChartData?.sessionsByTeam
    ? rehabChartData.sessionsByTeam.slice(0, 15)
    : [];

  const leagueTeamMaxValue = leagueTeamRows.length
    ? Math.max(
        ...leagueTeamRows.map((row) =>
          Math.max(row["Rehab sessions"], row["Maintenance sessions"])
        )
      )
    : 0;

  // Selected player profile for Player tab
  const selectedPlayerProfile = useMemo(() => {
    if (dashboardType !== "rehab" || selectedTab !== 2) return null;
    
    const playerName = lookerFilterValues.playerName as string;
    if (playerName) {
      // Find player by name directly from all sessions (not filtered by season)
      // This ensures we find the player even if they don't have data in the selected season
      const playerSession = REHAB_SESSIONS.find((s) => s.playerName === playerName);
      if (playerSession) {
        return getPlayerProfile(REHAB_SESSIONS, playerSession.playerId);
      }
    }
    
    // If no player selected, try to get first available player from filtered sessions
    const players = getUniquePlayers(filteredRehabSessions);
    if (players.length > 0) {
      return getPlayerProfile(filteredRehabSessions, players[0].id);
    }
    
    return null;
  }, [dashboardType, selectedTab, lookerFilterValues.playerName, filteredRehabSessions]);

  // Player-specific sessions for Player tab charts
  const playerSessionData = useMemo(() => {
    if (dashboardType !== "rehab" || selectedTab !== 2) return null;
    
    const playerName = lookerFilterValues.playerName as string;
    
    // If a player is selected, get their sessions directly (applying other filters but not re-filtering by name)
    if (playerName) {
      // Start from all sessions for this player
      let playerSessions = REHAB_SESSIONS.filter((s) => s.playerName === playerName);
      
      // Apply season filter if set
      if (lookerFilterValues.season) {
        const season = parseInt(lookerFilterValues.season as string);
        if (!isNaN(season)) {
          const seasonFiltered = playerSessions.filter((s) => s.season === season);
          // Only apply season filter if it doesn't empty the results
          if (seasonFiltered.length > 0) {
            playerSessions = seasonFiltered;
          }
        }
      }
      
      // Apply other optional filters (dateRange, etc.) if they exist
      if (lookerFilterValues.dateRange) {
        const today = new Date();
        let startDate: Date | null = null;
        switch (lookerFilterValues.dateRange) {
          case "last7":
            startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "last30":
            startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "last90":
            startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case "thisYear":
            startDate = new Date(today.getFullYear(), 0, 1);
            break;
        }
        if (startDate) {
          playerSessions = playerSessions.filter((s) => s.date >= startDate!);
        }
      }
      
      if (playerSessions.length === 0) {
        return null;
      }
      
      // Get body parts for this player
      const bodyPartsSet = new Set<string>();
      playerSessions.forEach((s) => s.bodyPartsWorked.forEach((bp) => bodyPartsSet.add(bp)));
      const bodyPartKeys = Array.from(bodyPartsSet).slice(0, 5);
      
      return {
        modalityByDate: aggregateModalityVsExercise(playerSessions, "date"),
        exercisesByDate: aggregateExercises(playerSessions, "date"),
        bodyPartsByDate: aggregateBodyParts(playerSessions, "date"),
        bodyPartKeys,
        rehabCount: playerSessions.filter((s) => s.sessionType === "rehab").length,
        maintenanceCount: playerSessions.filter((s) => s.sessionType === "maintenance").length,
      };
    }
    
    // No player selected - use first available from filtered sessions
    if (!selectedPlayerProfile) return null;
    
    const playerSessions = filteredRehabSessions.filter(
      (s) => s.playerId === selectedPlayerProfile.playerId
    );
    
    if (playerSessions.length === 0) return null;
    
    // Get body parts for this player
    const bodyPartsSet = new Set<string>();
    playerSessions.forEach((s) => s.bodyPartsWorked.forEach((bp) => bodyPartsSet.add(bp)));
    const bodyPartKeys = Array.from(bodyPartsSet).slice(0, 5);
    
    return {
      modalityByDate: aggregateModalityVsExercise(playerSessions, "date"),
      exercisesByDate: aggregateExercises(playerSessions, "date"),
      bodyPartsByDate: aggregateBodyParts(playerSessions, "date"),
      bodyPartKeys,
      rehabCount: playerSessions.filter((s) => s.sessionType === "rehab").length,
      maintenanceCount: playerSessions.filter((s) => s.sessionType === "maintenance").length,
    };
  }, [dashboardType, selectedTab, lookerFilterValues.playerName, lookerFilterValues.season, lookerFilterValues.dateRange, selectedPlayerProfile, filteredRehabSessions]);

  // Filtered data for PHS Injury Report dashboard
  const filteredPhsData = useMemo(() => {
    if (dashboardType !== "phs-injury-report") return INJURY_RECORDS;
    
    let filtered = [...INJURY_RECORDS];
    
    // Apply each filter
    Object.entries(lookerFilterValues).forEach(([key, value]) => {
      if (!value || value === "" || value === null || value === undefined) return;
      
      switch (key) {
        case "selectGame":
        case "game":
          filtered = filtered.filter(r => r.game?.toLowerCase().includes((value as string).toLowerCase()));
          break;
        case "gameweeks":
          // Multi-select filter: value is an array
          if (Array.isArray(value) && value.length > 0) {
            filtered = filtered.filter(r => value.includes(r.gameweek));
          }
          break;
        case "mechanismOfInjury":
          filtered = filtered.filter(r => r.mechanismOfInjury === value);
          break;
        case "season":
          filtered = filtered.filter(r => r.season === parseInt(value as string));
          break;
        case "contactTypeCategory":
          filtered = filtered.filter(r => r.contactTypeCategory === value);
          break;
        case "seasonType":
          filtered = filtered.filter(r => r.seasonType === value);
          break;
        case "week":
          filtered = filtered.filter(r => r.week === parseInt(value as string));
          break;
        case "teamAbbr":
          filtered = filtered.filter(r => r.teamAbbr === value);
          break;
        case "playerName":
          filtered = filtered.filter(r => r.playerName === value);
          break;
        case "injuryType":
          filtered = filtered.filter(r => r.injuryType === value);
          break;
        case "bodyPart":
          filtered = filtered.filter(r => r.bodyPart === value);
          break;
        case "positionAtTimeOfInjury":
          filtered = filtered.filter(r => r.positionAtTimeOfInjury === value);
          break;
        case "rosterPosition":
          filtered = filtered.filter(r => r.rosterPosition === value);
          break;
        case "currentRosterStatus":
          filtered = filtered.filter(r => r.currentRosterStatus === value);
          break;
        case "teamActivity":
          filtered = filtered.filter(r => r.teamActivity === value);
          break;
        case "missedTimeInjury":
          if (value === true) filtered = filtered.filter(r => r.missedTimeInjury === true);
          else if (value === false) filtered = filtered.filter(r => r.missedTimeInjury === false);
          break;
        case "missedGameInjury":
          if (value === true) filtered = filtered.filter(r => r.missedGameInjury === true);
          else if (value === false) filtered = filtered.filter(r => r.missedGameInjury === false);
          break;
        case "missedPracticeInjury":
          if (value === true) filtered = filtered.filter(r => r.missedPracticeInjury === true);
          else if (value === false) filtered = filtered.filter(r => r.missedPracticeInjury === false);
          break;
      }
    });
    
    return filtered;
  }, [dashboardType, lookerFilterValues]);

  // Filtered data for Activity Log (PHS Activity Report tab)
  // Ensure the Player Summary tab has a default selected player so the UI shows the selection
  useEffect(() => {
    if (dashboardType !== "phs-injury-report" || selectedTab !== 2) return;

    // If a player is already selected, do nothing
    if ((lookerFilterValues as any).playerName) return;

    // Derive first available player from the currently filtered PHS data
    const uniquePlayers = Array.from(new Set(filteredPhsData.map((r) => r.playerName))).sort();
    if (uniquePlayers.length > 0) {
      setLookerFilterValues((prev) => ({ ...prev, playerName: uniquePlayers[0] }));
    }
  }, [dashboardType, selectedTab, filteredPhsData, lookerFilterValues.playerName]);

  const filteredActivityLogData = useMemo(() => {
    if (dashboardType !== "phs-injury-report" || selectedTab !== 1) return [];
    
    let filtered = [...ACTIVITY_LOG_ENTRIES];
    
    // Apply each filter (same logic as injury data)
    Object.entries(lookerFilterValues).forEach(([key, value]) => {
      if (!value || value === "" || value === null || value === undefined) return;
      
      switch (key) {
        case "selectGame":
        case "game":
          filtered = filtered.filter(r => r.game?.toLowerCase().includes((value as string).toLowerCase()));
          break;
        case "gameweeks":
          // Multi-select filter: value is an array
          if (Array.isArray(value) && value.length > 0) {
            filtered = filtered.filter(r => value.includes(r.gameweek));
          }
          break;
        case "mechanismOfInjury":
          filtered = filtered.filter(r => r.mechanismOfInjury === value);
          break;
        case "season":
          filtered = filtered.filter(r => r.season === parseInt(value as string));
          break;
        case "contactTypeCategory":
          filtered = filtered.filter(r => r.contactTypeCategory === value);
          break;
        case "seasonType":
          filtered = filtered.filter(r => r.seasonType === value);
          break;
        case "week":
          filtered = filtered.filter(r => r.week === parseInt(value as string));
          break;
        case "teamAbbr":
          filtered = filtered.filter(r => r.teamAbbr === value);
          break;
        case "playerName":
          filtered = filtered.filter(r => r.playerName === value);
          break;
        case "injuryType":
          filtered = filtered.filter(r => r.injuryType === value);
          break;
        case "bodyPart":
          filtered = filtered.filter(r => r.bodyPart === value);
          break;
        case "positionAtTimeOfInjury":
          filtered = filtered.filter(r => r.positionAtTimeOfInjury === value);
          break;
        case "rosterPosition":
          filtered = filtered.filter(r => r.rosterPosition === value);
          break;
        case "currentRosterStatus":
          filtered = filtered.filter(r => r.currentRosterStatus === value);
          break;
        case "teamActivity":
          filtered = filtered.filter(r => r.teamActivity === value);
          break;
        case "missedTimeInjury":
          if (value === true) filtered = filtered.filter(r => r.missedTimeInjury === true);
          else if (value === false) filtered = filtered.filter(r => r.missedTimeInjury === false);
          break;
        case "missedGameInjury":
          if (value === true) filtered = filtered.filter(r => r.missedGameInjury === true);
          else if (value === false) filtered = filtered.filter(r => r.missedGameInjury === false);
          break;
        case "missedPracticeInjury":
          if (value === true) filtered = filtered.filter(r => r.missedPracticeInjury === true);
          else if (value === false) filtered = filtered.filter(r => r.missedPracticeInjury === false);
          break;
      }
    });
    
    return filtered;
  }, [dashboardType, selectedTab, lookerFilterValues]);

  // Chart data for PHS Injury Report dashboard
  const phsChartData = useMemo(() => {
    if (dashboardType !== "phs-injury-report") return null;
    
    // Get current selected season
    const currentSeason = parseInt((lookerFilterValues.season as string) || "2025");
    const previousSeason = currentSeason - 1;
    
    // Filter data by season for YoY comparison
    const currentSeasonData = filteredPhsData.filter(r => r.season === currentSeason);
    const previousSeasonData = INJURY_RECORDS.filter(r => r.season === previousSeason);
    
    // Get major stats - count injuries by type
    const injuryCounts = new Map<string, number>();
    filteredPhsData.forEach(record => {
      const type = record.injuryType;
      injuryCounts.set(type, (injuryCounts.get(type) || 0) + 1);
    });
    
    return {
      // Major stats
      totalInjuries: filteredPhsData.length,
      lexStrainsCount: injuryCounts.get("LEX Strain") || 0,
      aclCount: injuryCounts.get("ACL") || 0,
      highAnkleSprainCount: injuryCounts.get("High Ankle Sprain") || 0,
      lateralAnkleSprainCount: injuryCounts.get("Lateral Ankle Sprain") || 0,
      concussionsCount: injuryCounts.get("Concussion") || 0,
      shoulderClavicleCount: injuryCounts.get("Shoulder") || 0,
      
      // YoY comparison data
      injuriesYoY: aggregateInjuriesByBodyPartYoY(currentSeasonData, previousSeasonData),
      daysMissedYoY: aggregateDaysMissedByBodyPartYoY(currentSeasonData, previousSeasonData),
      
      // Player detail table data
      playerDetails: filteredPhsData.map(record => ({
        playerName: record.playerName,
        position: record.position,
        injuryDate: record.injuryDate,
        injuryCategory: record.injuryType,
        side: record.side || "N/A",
        clinicalImpression: record.clinicalImpression || "N/A",
        teamActivity: record.teamActivity,
        daysMissed: record.daysOut,
        missedGames: record.missedGames || 0,
        id: record.id,
      })),
      
      // Injury classification matrix
      classificationMatrix: aggregateInjuryClassificationMatrix(filteredPhsData),
    };
  }, [dashboardType, filteredPhsData, lookerFilterValues.season]);

  // Chart data for Activity Report tab
  const activityReportChartData = useMemo(() => {
    if (dashboardType !== "phs-injury-report" || selectedTab !== 1) return null;
    
    const currentSeason = parseInt((lookerFilterValues.season as string) || "2025");
    const previousSeason = currentSeason - 1;
    
    // Calculate major stats
    const missedGames = filteredActivityLogData.filter(entry => entry.event === "Game").length;
    const missedPractices = filteredActivityLogData.filter(entry => entry.event === "Practice").length;
    
    // Aggregate player injuries (group by player)
    const playerMap = new Map<string, {
      playerName: string;
      position: string;
      bodyPart: string;
      injuryCategory: string;
      clinicalImpression: string;
      season: number;
      missedGames: number;
      missedPractices: number;
    }>();
    
    filteredActivityLogData.forEach(entry => {
      const key = `${entry.playerId}-${entry.injuryType}`;
      if (!playerMap.has(key)) {
        playerMap.set(key, {
          playerName: entry.playerName,
          position: entry.position,
          bodyPart: entry.bodyPart,
          injuryCategory: entry.injuryCategory,
          clinicalImpression: entry.clinicalImpression,
          season: entry.season,
          missedGames: 0,
          missedPractices: 0,
        });
      }
      const playerData = playerMap.get(key)!;
      if (entry.event === "Game") {
        playerData.missedGames++;
      } else if (entry.event === "Practice") {
        playerData.missedPractices++;
      }
    });
    
    const playerInjuries = Array.from(playerMap.values());
    
    // Aggregate trend data by season
    const currentSeasonGames = ACTIVITY_LOG_ENTRIES.filter(e => e.season === currentSeason && e.event === "Game").length;
    const previousSeasonGames = ACTIVITY_LOG_ENTRIES.filter(e => e.season === previousSeason && e.event === "Game").length;
    const currentSeasonPractices = ACTIVITY_LOG_ENTRIES.filter(e => e.season === currentSeason && e.event === "Practice").length;
    const previousSeasonPractices = ACTIVITY_LOG_ENTRIES.filter(e => e.season === previousSeason && e.event === "Practice").length;
    
    // Get unique seasons for trends
    const seasons = Array.from(new Set(ACTIVITY_LOG_ENTRIES.map(e => e.season))).sort();
    const missedGamesTrend = seasons.map(season => ({
      season: season.toString(),
      value: ACTIVITY_LOG_ENTRIES.filter(e => e.season === season && e.event === "Game").length,
    }));
    const missedPracticesTrend = seasons.map(season => ({
      season: season.toString(),
      value: ACTIVITY_LOG_ENTRIES.filter(e => e.season === season && e.event === "Practice").length,
    }));
    
    return {
      missedGames,
      missedPractices,
      playerInjuries,
      missedGamesTrend,
      missedPracticesTrend,
      currentSeasonGames,
      previousSeasonGames,
      currentSeasonPractices,
      previousSeasonPractices,
    };
  }, [dashboardType, selectedTab, filteredActivityLogData, lookerFilterValues.season]);

  // Chart data for Player Summary tab
  const playerSummaryChartData = useMemo(() => {
    if (dashboardType !== "phs-injury-report" || selectedTab !== 2) return null;
    
    let selectedPlayer = lookerFilterValues.playerName as string;
    
    // If no player is selected, get the first available player from filtered data
    if (!selectedPlayer && filteredPhsData.length > 0) {
      const uniquePlayers = Array.from(new Set(filteredPhsData.map(r => r.playerName))).sort();
      if (uniquePlayers.length > 0) {
        selectedPlayer = uniquePlayers[0];
      }
    }
    
    // If still no player available, return null
    if (!selectedPlayer) {
      return null;
    }
    
    // Get player demographics
    const demographics = getPlayerDemographics(selectedPlayer);
    
    // Get major stats using the filtered data
    const majorStats = getPlayerMajorStats(selectedPlayer, filteredPhsData);
    
    // Get injuries by season data
    const injuriesBySeason = aggregateInjuriesByPlayerBySeason(selectedPlayer, filteredPhsData);
    
    // Get missed days/games/practices over time
    const missedDaysData = aggregateMissedDaysByPlayerOverTime(selectedPlayer, filteredPhsData);
    const missedGamesData = aggregateMissedGamesByPlayerOverTime(selectedPlayer, filteredPhsData);
    const missedPracticesData = aggregateMissedPracticesByPlayerOverTime(selectedPlayer, filteredPhsData);
    
    // Get injury records for table
    const injuryRecords = getPlayerInjuryRecords(selectedPlayer, filteredPhsData);
    
    // Get activity log for table
    const activityLog = getPlayerActivityLog(selectedPlayer, filteredActivityLogData);
    
    return {
      selectedPlayer,
      demographics,
      majorStats,
      injuriesBySeason,
      missedDaysData,
      missedGamesData,
      missedPracticesData,
      injuryRecords,
      activityLog,
    };
  }, [dashboardType, selectedTab, filteredPhsData, filteredActivityLogData, lookerFilterValues.playerName]);

  const dashboardTitle = dashboardType 
    ? dashboardTitles[dashboardType] || "Dashboard"
    : "Dashboard";

  // Calculate data based on filters
  const dashboardData = useMemo(() => {
    const injuryType = dashboardType ? dashboardToInjuryType[dashboardType] : undefined;
    
    if (injuryType) {
      return getInjuryTypeData(filterState, injuryType);
    }
    
    return getFilteredData(filterState);
  }, [filterState, dashboardType]);

  // Calculate benchmark comparison if we have any filters applied
  const benchmarkData = useMemo(() => {
    // Show benchmark comparison if any filter is applied (all are time-based periods)
    if (filterState && (
      filterState.season || 
      filterState.benchmarkValue || 
      filterState.startDate || 
      filterState.endDate || 
      filterState.quickDateRange ||
      filterState.sessionTypes?.length ||
      filterState.injuryStatus
    )) {
      return getBenchmarkComparison(filterState, 3);
    }
    return null;
  }, [filterState]);

  // Calculate percentage changes for each injury type
  const injuryTypeMetrics = useMemo(() => {
    const types: InjuryType[] = ["Concussion", "Shoulder", "LEX Sprain", "LEX Strain", "ACL", "Hamstring"];
    
    return types.map(type => {
      const typeData = getInjuryTypeData(filterState, type);
      const currentCount = typeData.metrics.totalInjuries;
      
      let percentChange = 0;
      let hasChange = false;
      
      if (benchmarkData) {
        const benchmarkTypeData = getInjuryTypeData({
          ...filterState!,
          season: "",
          benchmarkValue: "3-Year Average"
        }, type);
        const benchmarkCount = benchmarkTypeData.metrics.totalInjuries;
        
        if (benchmarkCount > 0) {
          percentChange = ((currentCount - benchmarkCount) / benchmarkCount) * 100;
          hasChange = true;
        }
      }
      
      return {
        type,
        count: currentCount,
        percentChange,
        hasChange,
      };
    });
  }, [filterState, benchmarkData]);

  const positionDistribution = useMemo(
    () =>
      Object.entries(dashboardData.metrics.injuriesByPosition || {})
        .map(([position, count]) => ({ category: position, value: count }))
        .sort((a, b) => b.value - a.value),
    [dashboardData.metrics.injuriesByPosition]
  );

  const teamDistribution = useMemo(
    () =>
      Object.entries(dashboardData.metrics.injuriesByTeam || {})
        .map(([team, count]) => ({ category: team, value: count }))
        .sort((a, b) => b.value - a.value),
    [dashboardData.metrics.injuriesByTeam]
  );

  const tabChartConfig = useMemo(() => {
    // Default view is by injury type (seasonal lens)
    if (selectedTab === 2) {
      const chartTitle = benchmarkData
        ? `${filterState?.season || "Current"} Season vs 3-Year Average`
        : "Injury Distribution by Type";

      return {
        title: chartTitle,
        data: injuryTypeMetrics.map((metric) => ({
          category: metric.type,
          value: metric.count,
        })),
      };
    }

    // Position view
    if (selectedTab === 1) {
      const data = Object.entries(dashboardData.metrics.injuriesByPosition || {})
        .map(([position, count]) => ({ category: position, value: count }))
        .sort((a, b) => b.value - a.value);

      return {
        title: "Injury Distribution by Position",
        data,
      };
    }

    // Team view
    const data = Object.entries(dashboardData.metrics.injuriesByTeam || {})
      .map(([team, count]) => ({ category: team, value: count }))
      .sort((a, b) => b.value - a.value);

    return {
      title: "Injury Distribution by Team",
      data,
    };
  }, [benchmarkData, dashboardData.metrics.injuriesByPosition, dashboardData.metrics.injuriesByTeam, filterState?.season, injuryTypeMetrics, selectedTab]);

  // Missed Time Dashboard Data
  const missedTimeData = useMemo(() => {
    if (dashboardType !== "missed-time") return null;

    const season = parseInt(filterState.season || "2026");
    const teamId = parseInt(filterState.teamId || "18"); // Convert string to number, default to New York Giants
    const teamInfo = NFL_TEAMS.find(t => t.id === teamId);

    const benchmarkData = getBenchmarkData(teamId, season);
    const standingData = getTeamStandingPosition(teamId, season);
    const currentSeasonStats = getTeamMissedTimeStats(teamId, season);
    const nflAvg = getNFLAvgForSeason(season);

    return {
      teamName: teamInfo?.name || "Team",
      season,
      benchmarkData,
      standingData,
      currentSeasonStats,
      nflAvg,
    };
  }, [dashboardType, filterState]);

  // Runtime-computed chart colors from the design system
  const themeChartColors = typeof window !== 'undefined' ? getChartColors(8) : [];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    // Filter state persists - no reset needed
  };

  const handleFilterChange = (filters: FilterState) => {
    setFilterState(filters);
  };

  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // Reset selected tab when dashboard type changes
  useEffect(() => {
    setSelectedTab(0);
  }, [dashboardType]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        backgroundColor: "var(--background)",
      }}
    >
      {/* Main Navigation */}
      <MainNavigation isExpanded={isNavExpanded} onToggle={setIsNavExpanded} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          marginLeft: isNavExpanded ? "240px" : "72px",
          marginRight: drawerOpen ? "240px" : "0",
          transition: "margin-left 0.3s ease, margin-right 0.3s ease",
        }}
      >
        {/* AppBar Header */}
        <AppBarHeader
          pageTitle={dashboardTitle}
          selectedSquad="First Team"
          squads={[
            "First Team",
            "Second Team",
            "Under 18s",
            "Under 16s",
          ]}
          userName="JSM"
          onSquadChange={(squad) =>
            console.log("Squad changed:", squad)
          }
          onAvatarClick={() => console.log("Avatar clicked")}
        />

        {/* Page Content */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            overflow: "hidden",
          }}
        >
          <Box
              sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "var(--background)",
              overflow: "auto",
            }}
          >
            {/* Tabs Section - Hide for main Dashboard */}
            {dashboardType !== "dashboard" && (
              <Box
                sx={{
                  borderBottom: "var(--border-width-thin) solid var(--border-default)",
                  backgroundColor: "var(--white)",
                  px: "var(--spacing-6)",
                }}
              >
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "var(--primary-main)",
                    },
                    "& .MuiTab-root": {
                      fontFamily: "var(--font-family-base)",
                      textTransform: "none",
                      fontSize: "14px",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-secondary)",
                      "&.Mui-selected": {
                        color: "var(--primary-main)",
                      },
                    },
                  }}
                >
                  {(dashboardType === "rehab"
                    ? ["Club", "Sessions", "Player", "Injury", "League"]
                    : dashboardType === "phs-injury-report"
                    ? ["Injury", "Activity Report", "Player Summary"]
                    : ["Season", "Position", "Team"]
                  ).map((label, index) => (
                    <Tab key={label} label={label} />
                  ))}
                </Tabs>
              </Box>
            )}

            {/* Dashboard Content */}
            <Box
              sx={{
                px: "var(--spacing-6)",
                py: "var(--spacing-4)",
                overflow: "auto",
              }}
            >
              <Header
                title={dashboardTitle}
                actions={
                  <>
                    <IconButton
                      sx={{
                        backgroundColor: "transparent",
                        color: "var(--color-text-primary)",
                        borderRadius: "var(--radius-sm)",
                        p: "var(--spacing-2)",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <RefreshIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                    <IconButton
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      sx={{
                        backgroundColor: "transparent",
                        color: "var(--color-text-primary)",
                        borderRadius: "var(--radius-sm)",
                        p: "var(--spacing-2)",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                    <IconButton
                      onClick={() => setDrawerOpen(!drawerOpen)}
                      sx={{
                        backgroundColor: "transparent",
                        color: "var(--color-text-primary)",
                        borderRadius: "var(--radius-sm)",
                        p: "var(--spacing-2)",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <FolderOutlinedIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                    <IconButton
                      sx={{
                        backgroundColor: "transparent",
                        color: "var(--color-text-primary)",
                        borderRadius: "var(--radius-sm)",
                        p: "var(--spacing-2)",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </>
                }
                sx={{ mb: "var(--spacing-4)" }}
              />
              {/* Looker-style Filter Bar */}
              <LookerFilterBar
                config={lookerFilterConfig}
                data={dashboardType === "rehab" ? REHAB_SESSIONS as Record<string, unknown>[] : INJURY_RECORDS as Record<string, unknown>[]}
                values={lookerFilterValues}
                onChange={handleLookerFilterChange}
                onReset={handleLookerReset}
                isExpanded={filtersOpen}
                singleLine={true}
              />
              
              {/* Conditionally render Rehab Dashboard, Missed Time Dashboard or Default Dashboard */}
              {dashboardType === "rehab" && rehabChartData ? (
                selectedTab === 2 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {/* Player Profile Section with Metric Cards */}
                    <Grid container spacing={3} alignItems="stretch">
                      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <Paper
                          sx={{
                            p: "var(--spacing-4)",
                            borderRadius: "var(--radius-lg)",
                            border: "var(--border-width-thin) solid var(--border-default)",
                            backgroundColor: "var(--white)",
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-4)",
                            height: "100%",
                          }}
                        >
                          <Avatar
                            src={selectedPlayerProfile?.imageUrl || mockPlayerProfile.imageUrl}
                            sx={{
                              width: 64,
                              height: 64,
                              flexShrink: 0,
                            }}
                          >
                            {selectedPlayerProfile?.name?.charAt(0) || "?"}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: "var(--font-family-base)",
                                fontWeight: "var(--font-weight-semibold)",
                                color: "var(--text-primary)",
                                mb: "var(--spacing-1)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {selectedPlayerProfile?.name || "Select a player"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "var(--font-family-base)",
                                color: "var(--text-secondary)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {selectedPlayerProfile?.currentInjury ? `${selectedPlayerProfile.currentInjury} - ${selectedPlayerProfile.bodyPart}` : "No injury selected"}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                        <MetricCard
                          value={playerSessionData?.rehabCount ?? selectedPlayerProfile?.rehabSessions ?? 0}
                          label="Rehab sessions"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                        <MetricCard
                          value={playerSessionData?.maintenanceCount ?? selectedPlayerProfile?.maintenanceSessions ?? 0}
                          label="Maintenance sessions"
                        />
                      </Grid>
                    </Grid>

                    {/* Charts Section */}
                    {playerSessionData && playerSessionData.modalityByDate.length > 0 ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                        {/* Modality vs Exercise Chart */}
                        <ComposedBarLineChartCard
                          title="Modality Usage vs Exercise Count Over Time"
                          data={playerSessionData.modalityByDate}
                          barDataKeys={["Heat pack", "Ultrasound", "Cold Pack", "Massage", "Acupuncture"]}
                          lineDataKeys={["Exercise count"]}
                          xAxisKey="date"
                          height={350}
                          yAxisLabel="Load score"
                          rightYAxisLabel="Exercise count"
                        />

                        {/* Exercises Chart */}
                        <StackedBarChartCard
                          title="Exercise Progression Over Time"
                          data={playerSessionData.exercisesByDate}
                          dataKeys={["Front squat", "Push-ups", "OH dumbbell press", "Plank", "Romanian deadlifts"]}
                          xAxisKey="date"
                          height={350}
                        />

                        {/* Body Part Chart */}
                        <StackedBarChartCard
                          title="Body Parts Treated Over Time"
                          data={playerSessionData.bodyPartsByDate}
                          dataKeys={playerSessionData.bodyPartKeys.length > 0 ? playerSessionData.bodyPartKeys : ["Ankle", "Knee", "Shoulder", "Neck", "Groin"]}
                          xAxisKey="date"
                          height={350}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ p: 4, textAlign: "center", color: "var(--text-secondary)" }}>
                        <Typography>Select a player from the filters above to view their rehab data.</Typography>
                      </Box>
                    )}
                  </Box>
                ) : selectedTab === 1 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {/* Players by session type Table */}
                    <Paper sx={{ padding: "var(--spacing-4)" }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Session Count by Player
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell>Player</TableCell>
                              <TableCell>Rehab sessions</TableCell>
                              <TableCell>Maintenance sessions</TableCell>
                              <TableCell align="right">Total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rehabChartData.playersBySessionType.map((row, index) => {
                              const maxValue = Math.max(...rehabChartData.playersBySessionType.map(r => Math.max(r["Rehab sessions"], r["Maintenance sessions"])));
                              const rehabWidth = maxValue > 0 ? (row["Rehab sessions"] / maxValue) * 100 : 0;
                              const maintenanceWidth = maxValue > 0 ? (row["Maintenance sessions"] / maxValue) * 100 : 0;
                              
                              return (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{row.player}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: `${rehabWidth}%`,
                                          minWidth: "40px",
                                          height: "24px",
                                          backgroundColor: row["Rehab sessions"] === maxValue ? "var(--chart-blue-dark)" : "var(--chart-1)",
                                          borderRadius: "2px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "flex-end",
                                          paddingRight: "8px",
                                        }}
                                      />
                                      <Typography variant="body2">{row["Rehab sessions"]}</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: `${maintenanceWidth}%`,
                                          minWidth: "40px",
                                          height: "24px",
                                          backgroundColor: row["Maintenance sessions"] === maxValue ? "var(--chart-blue-dark)" : "var(--chart-1)",
                                          borderRadius: "2px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "flex-end",
                                          paddingRight: "8px",
                                        }}
                                      />
                                      <Typography variant="body2">{row["Maintenance sessions"]}</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="right">{row["Rehab sessions"] + row["Maintenance sessions"]}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>

                    {/* Modality vs Exercise Chart */}
                    <ComposedBarLineChartCard
                      title="Modality Usage vs Exercise Count by Player"
                      data={rehabChartData.modalityByPlayer}
                      barDataKeys={["Heat pack", "Ultrasound", "Cold Pack", "Massage", "Acupuncture"]}
                      lineDataKeys={["Exercise count"]}
                      xAxisKey="player"
                      height={350}
                      yAxisLabel="Modality count"
                      rightYAxisLabel="Exercise count"
                    />

                    {/* Exercises Chart */}
                    <StackedBarChartCard
                      title="Exercise Distribution by Player"
                      data={rehabChartData.exercisesByPlayer}
                      dataKeys={["Front squat", "Push-ups", "OH dumbbell press", "Plank", "Romanian deadlifts"]}
                      xAxisKey="player"
                      height={350}
                    />

                    {/* Body Part Chart */}
                    <StackedBarChartCard
                      title="Body Parts Treated by Player"
                      data={rehabChartData.bodyPartsByPlayer}
                      dataKeys={rehabChartData.bodyPartKeys.length > 0 ? rehabChartData.bodyPartKeys : ["Ankle", "Knee", "Shoulder", "Neck", "Groin"]}
                      xAxisKey="player"
                      height={350}
                    />
                  </Box>
                ) : selectedTab === 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {/* Three Donut Charts Row */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="Total"
                          data={rehabChartData.totalDonut}
                          height={300}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="Rehab"
                          data={rehabChartData.rehabDonut}
                          height={300}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="Maintenance"
                          data={rehabChartData.maintenanceDonut}
                          height={300}
                        />
                      </Grid>
                    </Grid>

                    {/* Days lost x Injuries Bar Chart */}
                    <BarChartCard
                      title="Total Days Lost by Injury Type"
                      data={rehabChartData.daysLostByInjury}
                      dataKey="days"
                      xAxisKey="injury"
                      color={getChartColorValues().blueDark}
                      height={400}
                    />

                    {/* Days lost x Maintenance / Rehab x Player Table */}
                    <Paper sx={{ padding: "var(--spacing-4)" }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Session Count Analysis - Rehab vs Maintenance by Player
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell>Player</TableCell>
                              <TableCell>Rehab sessions</TableCell>
                              <TableCell>Maintenance sessions</TableCell>
                              <TableCell align="right">Total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rehabChartData.daysLostByPlayer.map((row, index) => {
                              const maxValue = Math.max(...rehabChartData.daysLostByPlayer.map(r => Math.max(r["Rehab sessions"], r["Maintenance sessions"])));
                              const rehabWidth = maxValue > 0 ? (row["Rehab sessions"] / maxValue) * 100 : 0;
                              const maintenanceWidth = maxValue > 0 ? (row["Maintenance sessions"] / maxValue) * 100 : 0;
                              
                              return (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{row.player}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: `${rehabWidth}%`,
                                          minWidth: "40px",
                                          height: "24px",
                                          backgroundColor: row["Rehab sessions"] === maxValue ? "var(--chart-blue-dark)" : "var(--chart-1)",
                                          borderRadius: "2px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "flex-end",
                                          paddingRight: "8px",
                                        }}
                                      />
                                      <Typography variant="body2">{row["Rehab sessions"]}</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: `${maintenanceWidth}%`,
                                          minWidth: "40px",
                                          height: "24px",
                                          backgroundColor: row["Maintenance sessions"] === maxValue ? "#E31B54" : "#FF5B8C",
                                          borderRadius: "2px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "flex-end",
                                          paddingRight: "8px",
                                        }}
                                      />
                                      <Typography variant="body2">{row["Maintenance sessions"]}</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="right">{row.total}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Box>
                ) : selectedTab === 3 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {/* Injuries by session type Chart */}
                    <GroupedBarChartCard
                      title="Session Type Comparison by Injury Category"
                      data={rehabChartData.injuriesBySessionType}
                      dataKeys={["Rehab sessions", "Maintenance sessions"]}
                      xAxisKey="Injury category"
                      height={400}
                    />

                    {/* Injuries by session type Table */}
                    <Paper sx={{ padding: "var(--spacing-4)" }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Detailed Session Count by Injury Category
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell>Injury category</TableCell>
                              <TableCell>Rehab sessions</TableCell>
                              <TableCell>Maintenance sessions</TableCell>
                              <TableCell align="right">Total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rehabChartData.injuriesBySessionType.map((row, index) => {
                              const maxValue = Math.max(...rehabChartData.injuriesBySessionType.map(r => Math.max(r["Rehab sessions"], r["Maintenance sessions"])));
                              const rehabWidth = maxValue > 0 ? (row["Rehab sessions"] / maxValue) * 100 : 0;
                              const maintenanceWidth = maxValue > 0 ? (row["Maintenance sessions"] / maxValue) * 100 : 0;
                              
                              return (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{row["Injury category"]}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: `${rehabWidth}%`,
                                          minWidth: "40px",
                                          height: "24px",
                                          backgroundColor: row["Rehab sessions"] === maxValue ? "var(--chart-blue-dark)" : "var(--chart-1)",
                                          borderRadius: "2px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "flex-end",
                                          paddingRight: "8px",
                                        }}
                                      />
                                      <Typography variant="body2">{row["Rehab sessions"]}</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: `${maintenanceWidth}%`,
                                          minWidth: "40px",
                                          height: "24px",
                                          backgroundColor: row["Maintenance sessions"] === maxValue ? "var(--chart-blue-dark)" : "var(--chart-1)",
                                          borderRadius: "2px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "flex-end",
                                          paddingRight: "8px",
                                        }}
                                      />
                                      <Typography variant="body2">{row["Maintenance sessions"]}</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="right">{row["Rehab sessions"] + row["Maintenance sessions"]}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>

                    {/* Modality vs Exercise Chart - by injury type */}
                    <ComposedBarLineChartCard
                      title="Modality vs Exercise by Injury Type"
                      data={rehabChartData.modalityByInjury}
                      barDataKeys={["Heat pack", "Ultrasound", "Cold Pack", "Massage", "Acupuncture"]}
                      lineDataKeys={["Exercise count"]}
                      xAxisKey="injury"
                      height={350}
                      yAxisLabel="Modality count"
                      rightYAxisLabel="Exercise count"
                    />
                  </Box>
                ) : selectedTab === 4 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {/* Team Sessions Comparison */}
                    <GroupedBarChartCard
                      title="League-Wide Session Comparison by Team"
                      data={rehabChartData.sessionsByTeam}
                      dataKeys={["Rehab sessions", "Maintenance sessions"]}
                      xAxisKey="team"
                      height={400}
                    />

                    {/* Team Injury Type Distribution */}
                    <Paper sx={{ padding: "var(--spacing-4)" }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Team Performance Metrics
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Team</TableCell>
                              <TableCell align="right">Total Sessions</TableCell>
                                <TableCell>Rehab Sessions</TableCell>
                                <TableCell>Maintenance Sessions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {leagueTeamRows.map((row) => {
                              const rehabWidth = leagueTeamMaxValue > 0 ? (row["Rehab sessions"] / leagueTeamMaxValue) * 100 : 0;
                              const maintenanceWidth = leagueTeamMaxValue > 0 ? (row["Maintenance sessions"] / leagueTeamMaxValue) * 100 : 0;

                              return (
                                <TableRow key={row.team}>
                                  <TableCell>{row.team}</TableCell>
                                  <TableCell align="right">{row.total}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: `${rehabWidth}%`,
                                          minWidth: "40px",
                                          height: "24px",
                                          backgroundColor: row["Rehab sessions"] === leagueTeamMaxValue ? "var(--chart-blue-dark)" : "var(--chart-1)",
                                          borderRadius: "2px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "flex-end",
                                          paddingRight: "8px",
                                        }}
                                      />
                                      <Typography variant="body2">{row["Rehab sessions"]}</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: `${maintenanceWidth}%`,
                                          minWidth: "40px",
                                          height: "24px",
                                          backgroundColor: row["Maintenance sessions"] === leagueTeamMaxValue ? "#E31B54" : "#FF5B8C",
                                          borderRadius: "2px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "flex-end",
                                          paddingRight: "8px",
                                        }}
                                      />
                                      <Typography variant="body2">{row["Maintenance sessions"]}</Typography>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>

                    {/* Three Donut Charts Row (League-wide aggregates) */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="League Total"
                          data={rehabChartData.totalDonut}
                          height={300}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="League Rehab"
                          data={rehabChartData.rehabDonut}
                          height={300}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="League Maintenance"
                          data={rehabChartData.maintenanceDonut}
                          height={300}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ) : null
              ) : dashboardType === "missed-time" && missedTimeData ? (
                // Render different content per selected tab: Season (2), Position (1), Team (0)
                selectedTab === 2 ? (
                  <Grid container spacing={2} sx={{ width: "100%", minWidth: 0 }}>
                    {/* Horizontal Bar Chart */}
                    <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
                      <HorizontalBarChartCard
                        title={`Missed Time Injuries Benchmark - ${missedTimeData.teamName}`}
                        data={[
                          {
                            category: "1-year Team Avg",
                            value: missedTimeData.benchmarkData.oneYearTeamAvg,
                            color: themeChartColors[0],
                          },
                          {
                            category: `${missedTimeData.season}`,
                            value: missedTimeData.benchmarkData.currentSeason,
                            color: themeChartColors[1],
                          },
                          {
                            category: "3-Yr Avg",
                            value: missedTimeData.benchmarkData.threeYearAvg,
                            color: themeChartColors[2],
                          },
                          {
                            category: "1-year NFL Avg",
                            value: missedTimeData.benchmarkData.oneYearNFLAvg,
                            color: themeChartColors[3],
                          },
                        ]}
                        height={300}
                        maxValue={30}
                      />
                    </Grid>

                    {/* Stats Card */}
                    <Grid size={{ xs: 12, md: 4 }} sx={{ minWidth: 0 }}>
                      <MissedTimeStatsCard
                        season={missedTimeData.season}
                        teamAvg={missedTimeData.currentSeasonStats?.missedTimeInjuries || 0}
                        nflAvg={missedTimeData.nflAvg}
                        standingPosition={missedTimeData.standingData.position}
                        isTied={missedTimeData.standingData.isTied}
                        numberOfInjuries={missedTimeData.currentSeasonStats?.totalInjuries || 0}
                      />
                    </Grid>
                    {/* Season trend chart - cumulative lines for multiple seasons and benchmarks */}
                    <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
                      <SeasonTrendChart teamId={parseInt(filterState.teamId || "18")} season={missedTimeData.season} />
                    </Grid>
                  </Grid>
                ) : selectedTab === 1 ? (
                  // Position tab: grouped bar chart comparing 3-year avg vs current season by position
                  <Grid container spacing={2} sx={{ width: "100%", minWidth: 0 }}>
                    <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
                      {
                        (() => {
                          const teamIdNum = parseInt(filterState.teamId || "18");
                          const seasonNum = missedTimeData.season;

                          // Current season counts by position
                          const current = getMissedTimeByPosition(teamIdNum, seasonNum);

                          // 3-year average counts by position (average of previous 3 seasons)
                          const years = [seasonNum - 1, seasonNum - 2, seasonNum - 3];
                          const countsByYear: Record<number, Record<string, number>> = {};
                          years.forEach((y) => {
                            const arr = getMissedTimeByPosition(teamIdNum, y);
                            countsByYear[y] = {};
                            arr.forEach((r) => (countsByYear[y][r.position] = r.missedTimeInjuries));
                          });

                          const positionsSet = new Set<string>();
                          current.forEach((c) => positionsSet.add(c.position));
                          years.forEach((y) => Object.keys(countsByYear[y] || {}).forEach((p) => positionsSet.add(p)));

                          const positions = Array.from(positionsSet);

                          // Order by POSITIONS constant when available
                          if (typeof POSITIONS !== "undefined" && Array.isArray(POSITIONS)) {
                            positions.sort((a, b) => {
                              const ai = POSITIONS.indexOf(a as string);
                              const bi = POSITIONS.indexOf(b as string);
                              if (ai === -1 && bi === -1) return a.localeCompare(b);
                              if (ai === -1) return 1;
                              if (bi === -1) return -1;
                              return ai - bi;
                            });
                          } else {
                            positions.sort();
                          }

                          const data = positions.map((pos) => {
                            // average previous 3 seasons
                            let sum = 0;
                            let count = 0;
                            years.forEach((y) => {
                              const v = countsByYear[y] && countsByYear[y][pos] ? countsByYear[y][pos] : 0;
                              sum += v;
                              count += 1;
                            });
                            const threeYearAvg = count > 0 ? +(sum / count).toFixed(1) : 0;
                            const currentObj = current.find((c) => c.position === pos);
                            const currentSeason = currentObj ? currentObj.missedTimeInjuries : 0;
                            return {
                              position: pos,
                              threeYearAvg,
                              currentSeason,
                            };
                          });

                          return (
                            <GroupedBarChartCard
                              title={`Missed Time Injuries By Position - ${missedTimeData.teamName}`}
                              data={data}
                              dataKeys={["threeYearAvg", "currentSeason"]}
                              xAxisKey="position"
                              colors={[themeChartColors[0], themeChartColors[1]]}
                              height={380}
                            />
                          );
                        })()
                      }
                    </Grid>
                  </Grid>
                ) : (
                  // Team tab - grouped horizontal bars by team (3yr team avg, current season, NFL avg)
                  <Grid container spacing={2} sx={{ width: "100%", minWidth: 0 }}>
                    <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
                      {
                        (() => {
                          const seasonNum = missedTimeData.season;
                          const teams = NFL_TEAMS;

                          // compute NFL averages
                          const nflOneYear = getNFL1YearAvg(seasonNum);
                          const nflThreeYear = Math.round(
                            (getNFL1YearAvg(seasonNum - 1) + getNFL1YearAvg(seasonNum - 2) + getNFL1YearAvg(seasonNum - 3)) / 3
                          );

                          const data = teams.map((t) => {
                            const teamIdNum = t.id;
                            const threeYear = Math.round(getTeam3YearAvg(teamIdNum, seasonNum));
                            const current = getTeamMissedTimeStats(teamIdNum, seasonNum)?.missedTimeInjuries || 0;
                            return {
                              team: t.abbreviation,
                              threeYearAvg: threeYear,
                              currentSeason: current,
                              nflOneYear: Math.round(nflOneYear),
                              nflThreeYear: Math.round(nflThreeYear),
                            };
                          });

                          return (
                            <GroupedHorizontalBarChartCard
                              title={`Missed Time Injuries By Team`}
                              data={data}
                              dataKeys={["threeYearAvg", "currentSeason", "nflOneYear", "nflThreeYear"]}
                              yAxisKey="team"
                              colors={[themeChartColors[0], themeChartColors[1], themeChartColors[2], themeChartColors[3]]}
                              height={900}
                            />
                          );
                        })()
                      }
                    </Grid>
                  </Grid>
                )
              ) : dashboardType === "phs-injury-report" && phsChartData ? (
                // PHS Injury Report Dashboard
                selectedTab === 0 ? (
                  // Injury Tab
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {/* Major Stats Section */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 12/7 }}>
                        <MetricCard
                          value={phsChartData.totalInjuries.toString()}
                          label="Total Injuries"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 12/7 }}>
                        <MetricCard
                          value={phsChartData.lexStrainsCount > 0 ? phsChartData.lexStrainsCount.toString() : "(Blank)"}
                          label="LEX Strains"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 12/7 }}>
                        <MetricCard
                          value={phsChartData.aclCount > 0 ? phsChartData.aclCount.toString() : "(Blank)"}
                          label="ACL"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 12/7 }}>
                        <MetricCard
                          value={phsChartData.highAnkleSprainCount > 0 ? phsChartData.highAnkleSprainCount.toString() : "(Blank)"}
                          label="High Ankle Sprain"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 12/7 }}>
                        <MetricCard
                          value={phsChartData.lateralAnkleSprainCount > 0 ? phsChartData.lateralAnkleSprainCount.toString() : "(Blank)"}
                          label="Lateral Ankle Sprain"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 12/7 }}>
                        <MetricCard
                          value={phsChartData.concussionsCount.toString()}
                          label="Concussions"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 12/7 }}>
                        <MetricCard
                          value={phsChartData.shoulderClavicleCount.toString()}
                          label="Shoulder & Clavicle"
                        />
                      </Grid>
                    </Grid>

                    {/* YoY Comparison Charts */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <GroupedHorizontalBarChartCard
                          title="Injuries & Illnesses YoY"
                          data={phsChartData.injuriesYoY}
                          dataKeys={["currentPeriod", "previousPeriod"]}
                          yAxisKey="category"
                          colors={["#E57373", "#90CAF9"]}
                          height={400}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <GroupedHorizontalBarChartCard
                          title="Total Days Missed YoY"
                          data={phsChartData.daysMissedYoY}
                          dataKeys={["currentPeriod", "previousPeriod"]}
                          yAxisKey="category"
                          colors={["#E57373", "#90CAF9"]}
                          height={400}
                        />
                      </Grid>
                    </Grid>

                    {/* Injury Classification Matrix */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Paper
                          sx={{
                            p: "var(--spacing-4)",
                            borderRadius: "var(--radius-lg)",
                            border: "var(--border-width-thin) solid var(--border-default)",
                            backgroundColor: "var(--white)",
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
                            Injury Classification
                          </Typography>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Team Activity</TableCell>
                                  {phsChartData.classificationMatrix.length > 0 && 
                                    Object.keys(phsChartData.classificationMatrix[0])
                                      .filter(k => k !== "teamActivity" && k !== "Total")
                                      .map(key => (
                                        <TableCell align="center" key={key}>{key}</TableCell>
                                      ))
                                  }
                                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Total</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {phsChartData.classificationMatrix.map((row, idx) => (
                                  <TableRow 
                                    key={row.teamActivity}
                                    sx={{
                                      backgroundColor: row.teamActivity === "Total" 
                                        ? "var(--background-subtle)" 
                                        : "transparent",
                                      fontWeight: row.teamActivity === "Total" ? "bold" : "normal",
                                    }}
                                  >
                                    <TableCell sx={{ fontWeight: row.teamActivity === "Total" ? "bold" : "normal" }}>
                                      {row.teamActivity}
                                    </TableCell>
                                    {Object.keys(row)
                                      .filter(k => k !== "teamActivity" && k !== "Total")
                                      .map(key => (
                                        <TableCell 
                                          align="center" 
                                          key={key}
                                          sx={{
                                            backgroundColor: row[key] as number > 0 
                                              ? `rgba(66, 165, 245, ${Math.min((row[key] as number) / 10, 0.5)})` 
                                              : "transparent",
                                          }}
                                        >
                                          {row[key] as number}
                                        </TableCell>
                                      ))
                                    }
                                    <TableCell 
                                      align="center" 
                                      sx={{ 
                                        fontWeight: "bold",
                                        backgroundColor: row.teamActivity === "Total" 
                                          ? "transparent" 
                                          : `rgba(66, 165, 245, ${Math.min((row.Total) / 15, 0.5)})`,
                                      }}
                                    >
                                      {row.Total}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* Player Detail Table */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Paper
                          sx={{
                            p: "var(--spacing-4)",
                            borderRadius: "var(--radius-lg)",
                            border: "var(--border-width-thin) solid var(--border-default)",
                            backgroundColor: "var(--white)",
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
                            Player Detail
                          </Typography>
                          <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Player Name</TableCell>
                                  <TableCell>Position</TableCell>
                                  <TableCell>Injury Date</TableCell>
                                  <TableCell>Injury Category</TableCell>
                                  <TableCell>Side</TableCell>
                                  <TableCell>Clinical Impression</TableCell>
                                  <TableCell>Team Activity</TableCell>
                                  <TableCell align="right">Days Missed</TableCell>
                                  <TableCell align="right">Missed Games</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {phsChartData.playerDetails.map((row) => (
                                  <TableRow key={row.id} hover>
                                    <TableCell>{row.playerName}</TableCell>
                                    <TableCell>{row.position}</TableCell>
                                    <TableCell>
                                      {new Date(row.injuryDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                      })}
                                    </TableCell>
                                    <TableCell>{row.injuryCategory}</TableCell>
                                    <TableCell>{row.side}</TableCell>
                                    <TableCell>{row.clinicalImpression}</TableCell>
                                    <TableCell>{row.teamActivity}</TableCell>
                                    <TableCell align="right">{row.daysMissed}</TableCell>
                                    <TableCell align="right">{row.missedGames}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                ) : selectedTab === 1 ? (
                  // Activity Report Tab
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {/* Major Stats Section */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <MetricCard
                          value={activityReportChartData?.missedGames !== undefined ? activityReportChartData.missedGames.toString() : "(Blank)"}
                          label="Missed Games"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <MetricCard
                          value={activityReportChartData?.missedPractices !== undefined ? activityReportChartData.missedPractices.toString() : "(Blank)"}
                          label="Missed Practices"
                        />
                      </Grid>
                    </Grid>

                    {/* Player Injuries Table */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Paper
                          sx={{
                            p: "var(--spacing-4)",
                            borderRadius: "var(--radius-lg)",
                            border: "var(--border-width-thin) solid var(--border-default)",
                            backgroundColor: "var(--white)",
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
                            Player Injuries
                          </Typography>
                          <TableContainer sx={{ maxHeight: 500 }}>
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Player</TableCell>
                                  <TableCell>Position</TableCell>
                                  <TableCell>Body Part</TableCell>
                                  <TableCell>Injury Category</TableCell>
                                  <TableCell>Primary Clinical Impression</TableCell>
                                  <TableCell>Season</TableCell>
                                  <TableCell align="right">Missed Games</TableCell>
                                  <TableCell align="right">Missed Practices</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {activityReportChartData?.playerInjuries
                                  .slice(0, 100)
                                  .map((row, idx) => (
                                    <TableRow key={`${row.playerName}-${idx}`} hover>
                                      <TableCell>{row.playerName}</TableCell>
                                      <TableCell>{row.position}</TableCell>
                                      <TableCell>{row.bodyPart}</TableCell>
                                      <TableCell>{row.injuryCategory}</TableCell>
                                      <TableCell>{row.clinicalImpression}</TableCell>
                                      <TableCell>{row.season}</TableCell>
                                      <TableCell align="right">{row.missedGames || 0}</TableCell>
                                      <TableCell align="right">{row.missedPractices}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {(activityReportChartData?.playerInjuries.length || 0) > 100 && (
                            <Typography variant="caption" sx={{ mt: 2, display: "block", color: "var(--text-secondary)" }}>
                              Showing first 100 of {activityReportChartData?.playerInjuries.length} records
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* Trend Charts */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <LineChartCard
                          title="Missed Games"
                          data={activityReportChartData?.missedGamesTrend || []}
                          dataKeys={["value"]}
                          xAxisKey="season"
                          height={350}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <LineChartCard
                          title="Missed Practices"
                          data={activityReportChartData?.missedPracticesTrend || []}
                          dataKeys={["value"]}
                          xAxisKey="season"
                          height={350}
                        />
                      </Grid>
                    </Grid>

                    {/* Missed Activity Log Table */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Paper
                          sx={{
                            p: "var(--spacing-4)",
                            borderRadius: "var(--radius-lg)",
                            border: "var(--border-width-thin) solid var(--border-default)",
                            backgroundColor: "var(--white)",
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
                            Missed Activity Log
                          </Typography>
                          <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Player</TableCell>
                                  <TableCell>Position</TableCell>
                                  <TableCell>Reason</TableCell>
                                  <TableCell>Body Part</TableCell>
                                  <TableCell>Injury Type</TableCell>
                                  <TableCell>Injury Category</TableCell>
                                  <TableCell>Primary Clinical Impression</TableCell>
                                  <TableCell>Activity Date</TableCell>
                                  <TableCell>Event</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {filteredActivityLogData.slice(0, 200).map((entry) => (
                                  <TableRow key={entry.id} hover>
                                    <TableCell>{entry.playerName}</TableCell>
                                    <TableCell>{entry.position}</TableCell>
                                    <TableCell>{entry.reason}</TableCell>
                                    <TableCell>{entry.bodyPart}</TableCell>
                                    <TableCell>{entry.injuryType}</TableCell>
                                    <TableCell>{entry.injuryCategory}</TableCell>
                                    <TableCell>{entry.clinicalImpression}</TableCell>
                                    <TableCell>
                                      {new Date(entry.activityDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                      })}
                                    </TableCell>
                                    <TableCell>{entry.event}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {filteredActivityLogData.length > 200 && (
                            <Typography variant="caption" sx={{ mt: 2, display: "block", color: "var(--text-secondary)" }}>
                              Showing first 200 of {filteredActivityLogData.length} records
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  // Player Summary Tab
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {!playerSummaryChartData ? (
                      // No player selected message
                      <Box sx={{ p: "var(--spacing-8)", textAlign: "center" }}>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                          Select a player to view their injury summary
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Use the Player filter above to choose a player
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        {/* Player Demographics Section */}
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12 }}>
                            <Paper
                              sx={{
                                p: "var(--spacing-4)",
                                borderRadius: "var(--radius-lg)",
                                border: "var(--border-width-thin) solid var(--border-default)",
                                backgroundColor: "var(--white)",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-4)",
                              }}
                            >
                              <Avatar
                                src={getImageForPlayer(playerSummaryChartData.selectedPlayer)}
                                alt={playerSummaryChartData.selectedPlayer}
                                sx={{ width: 64, height: 64, flexShrink: 0 }}
                              >
                                {playerSummaryChartData.selectedPlayer.charAt(0)}
                              </Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontFamily: "var(--font-family-base)",
                                    fontWeight: "var(--font-weight-semibold)",
                                    color: "var(--text-primary)",
                                    mb: "var(--spacing-1)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {playerSummaryChartData.selectedPlayer}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontFamily: "var(--font-family-base)",
                                    color: "var(--text-secondary)",
                                  }}
                                >
                                  {playerSummaryChartData.demographics?.position || "N/A"}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", gap: "var(--spacing-6)", flexShrink: 0 }}>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: "var(--spacing-1)" }}>
                                    Date of Birth
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {playerSummaryChartData.demographics?.dateOfBirth 
                                      ? new Date(playerSummaryChartData.demographics.dateOfBirth).toLocaleDateString('en-GB', { 
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric'
                                        })
                                      : "N/A"}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: "var(--spacing-1)" }}>
                                    Age
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {playerSummaryChartData.demographics?.age || "N/A"}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: "var(--spacing-1)" }}>
                                    Height
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {playerSummaryChartData.demographics?.height ? playerSummaryChartData.demographics.height.replace('-', "'") + '"' : "N/A"}
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                        </Grid>

                        {/* Injuries by Season */}
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12 }}>
                            <BarChartCard
                              title="Injuries by Season"
                              data={(playerSummaryChartData.injuriesBySeason || []).map(d => ({
                                name: d.season.toString(),
                                value: d.count
                              }))}
                              dataKey="value"
                              xAxisKey="name"
                              height={350}
                            />
                          </Grid>
                        </Grid>

                        {/* Missed Days, Games, Practices Charts */}
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, lg: 4 }}>
                            <LineChartCard
                              title="Missed Days"
                              data={(playerSummaryChartData.missedDaysData || []).map(d => ({
                                name: d.date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
                                value: d.days
                              }))}
                              dataKeys={["value"]}
                              xAxisKey="name"
                              height={300}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, lg: 4 }}>
                            <LineChartCard
                              title="Missed Games"
                              data={(playerSummaryChartData.missedGamesData || []).map(d => ({
                                name: d.date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
                                value: d.games
                              }))}
                              dataKeys={["value"]}
                              xAxisKey="name"
                              height={300}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, lg: 4 }}>
                            <LineChartCard
                              title="Missed Practices"
                              data={(playerSummaryChartData.missedPracticesData || []).map(d => ({
                                name: d.date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
                                value: d.practices
                              }))}
                              dataKeys={["value"]}
                              xAxisKey="name"
                              height={300}
                            />
                          </Grid>
                        </Grid>

                        {/* Major Stats */}
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <MetricCard
                              value={playerSummaryChartData.majorStats.totalInjuries.toString()}
                              label="Total Injuries"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <MetricCard
                              value={playerSummaryChartData.majorStats.missedGames.toString()}
                              label="Missed Games"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <MetricCard
                              value={playerSummaryChartData.majorStats.missedPractices.toString()}
                              label="Missed Practices"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <MetricCard
                              value={playerSummaryChartData.majorStats.lexStrains.toString()}
                              label="LEX Strains"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <MetricCard
                              value={playerSummaryChartData.majorStats.acl.toString()}
                              label="ACL"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <MetricCard
                              value={playerSummaryChartData.majorStats.concussions.toString()}
                              label="Concussions"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <MetricCard
                              value={playerSummaryChartData.majorStats.lateralAnkleSprain.toString()}
                              label="Lateral Ankle Sprain"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <MetricCard
                              value={playerSummaryChartData.majorStats.highAnkleSprain.toString()}
                              label="High Ankle Sprain"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <MetricCard
                              value={playerSummaryChartData.majorStats.shoulderAndClavicle.toString()}
                              label="Shoulder & Clavicle"
                            />
                          </Grid>
                        </Grid>

                        {/* Player Injuries Information Table */}
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12 }}>
                            <Paper
                              sx={{
                                p: "var(--spacing-4)",
                                borderRadius: "var(--radius-lg)",
                                border: "var(--border-width-thin) solid var(--border-default)",
                                backgroundColor: "var(--white)",
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
                                Player Injuries Information
                              </Typography>
                              <TableContainer sx={{ maxHeight: 500 }}>
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Player Name</TableCell>
                                      <TableCell>Club</TableCell>
                                      <TableCell>Injury Date</TableCell>
                                      <TableCell>Injury Category</TableCell>
                                      <TableCell>Clinical Impression</TableCell>
                                      <TableCell>Primary Mechanism</TableCell>
                                      <TableCell>Body Part</TableCell>
                                      <TableCell>Team Activity</TableCell>
                                      <TableCell align="right">Missed Days</TableCell>
                                      <TableCell align="right">Missed Games</TableCell>
                                      <TableCell align="right">Missed Practices</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {(playerSummaryChartData.injuryRecords || []).map((record) => (
                                      <TableRow key={record.id} hover>
                                        <TableCell>{record.playerName}</TableCell>
                                        <TableCell>{record.teamAbbr}</TableCell>
                                        <TableCell>
                                          {new Date(record.injuryDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                          })}
                                        </TableCell>
                                        <TableCell>{record.injuryType}</TableCell>
                                        <TableCell>{record.clinicalImpression || "N/A"}</TableCell>
                                        <TableCell>{record.mechanismOfInjury}</TableCell>
                                        <TableCell>{record.bodyPart || "N/A"}</TableCell>
                                        <TableCell>{record.teamActivity}</TableCell>
                                        <TableCell align="right">{record.daysOut}</TableCell>
                                        <TableCell align="right">{record.missedGames || 0}</TableCell>
                                        <TableCell align="right">{Math.floor((record.daysOut / 7) * 5)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              {(playerSummaryChartData.injuryRecords || []).length === 0 && (
                                <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "var(--text-secondary)" }}>
                                  No injury records found for this player with the current filters
                                </Typography>
                              )}
                            </Paper>
                          </Grid>
                        </Grid>

                        {/* Missed Activity Log Table */}
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12 }}>
                            <Paper
                              sx={{
                                p: "var(--spacing-4)",
                                borderRadius: "var(--radius-lg)",
                                border: "var(--border-width-thin) solid var(--border-default)",
                                backgroundColor: "var(--white)",
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
                                Missed Activity Log
                              </Typography>
                              <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Player</TableCell>
                                      <TableCell>Position</TableCell>
                                      <TableCell>Reason</TableCell>
                                      <TableCell>Body Part</TableCell>
                                      <TableCell>Injury Type</TableCell>
                                      <TableCell>Injury Category</TableCell>
                                      <TableCell>Primary Clinical Impression</TableCell>
                                      <TableCell>Activity Date</TableCell>
                                      <TableCell>Event</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {(playerSummaryChartData.activityLog || []).map((entry) => (
                                      <TableRow key={entry.id} hover>
                                        <TableCell>{entry.playerName}</TableCell>
                                        <TableCell>{entry.position}</TableCell>
                                        <TableCell>{entry.reason}</TableCell>
                                        <TableCell>{entry.bodyPart}</TableCell>
                                        <TableCell>{entry.injuryType}</TableCell>
                                        <TableCell>{entry.injuryCategory}</TableCell>
                                        <TableCell>{entry.clinicalImpression}</TableCell>
                                        <TableCell>
                                          {new Date(entry.activityDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                          })}
                                        </TableCell>
                                        <TableCell>{entry.event}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              {(playerSummaryChartData.activityLog || []).length === 0 && (
                                <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "var(--text-secondary)" }}>
                                  No activity log entries found for this player with the current filters
                                </Typography>
                              )}
                            </Paper>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Box>
                )
              ) : (
                <Grid container spacing={2} sx={{ width: "100%", minWidth: 0 }}>
                  {/* Season view (default) */}
                  {selectedTab === 2 && (
                    <>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 12/7 }} sx={{ minWidth: 0 }}>
                        <MetricCard
                          value={`${dashboardData.metrics.totalInjuries}`}
                          label="Total Injuries"
                          trend={benchmarkData ? {
                            value: `${Math.abs(((dashboardData.metrics.totalInjuries - benchmarkData.benchmark.metrics.totalInjuries) / benchmarkData.benchmark.metrics.totalInjuries * 100).toFixed(1))}%`,
                            isPositive: dashboardData.metrics.totalInjuries < benchmarkData.benchmark.metrics.totalInjuries,
                          } : undefined}
                        />
                      </Grid>
                      {injuryTypeMetrics.map((metric) => (
                        <Grid key={metric.type} size={{ xs: 12, sm: 6, md: 4, lg: 12/7 }} sx={{ minWidth: 0 }}>
                          <MetricCard
                            value={`${metric.count}`}
                            label={metric.type}
                            trend={metric.hasChange ? {
                              value: `${Math.abs(metric.percentChange).toFixed(1)}%`,
                              isPositive: metric.percentChange < 0,
                            } : undefined}
                          />
                        </Grid>
                      ))}

                      <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
                        <BarChartCard
                          title={tabChartConfig.title}
                          data={tabChartConfig.data}
                          dataKey="value"
                          xAxisKey="category"
                          height={350}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Position view */}
                  {selectedTab === 1 && (
                    <>
                      <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
                        <BarChartCard
                          title="Injuries by Position"
                          data={positionDistribution}
                          dataKey="value"
                          xAxisKey="category"
                          height={380}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Team view */}
                  {selectedTab === 0 && (
                    <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
                      <GroupedHorizontalBarChartCard
                        title="Injuries by Team"
                        data={teamDistribution}
                        dataKeys={["value"]}
                        yAxisKey="category"
                        height={600}
                      />
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          </Box>
          <DashboardDrawer open={drawerOpen} />
        </Box>
      </Box>
    </Box>
  );
}