import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router";
import { Box, Grid, IconButton, Tabs, Tab, Typography, Avatar, Paper } from "@/app/components/playbook";
import { MainNavigation } from "@/app/components/MainNavigation";
import { AppBarHeader } from "@/app/components/AppBarHeader";
import { Header } from "@/app/components/Header";
import { DashboardFilters, FilterState } from "@/app/components/DashboardFilters";
import { LookerFilterBar, useLookerFilters } from "@/app/components/looker/filters";
import { getFilterConfig } from "@/app/config/dashboardFilters";
import { INJURY_RECORDS } from "@/app/data/mockInjuryData";
import { MetricCard } from "@/app/components/looker/MetricCard";
import { getChartColors } from "@/app/components/looker/chartConfig";
import { GaugeCard } from "@/app/components/looker/GaugeCard";
import { BarChartCard } from "@/app/components/looker/BarChartCard";
import { GroupedBarChartCard } from "@/app/components/looker/GroupedBarChartCard";
import { HorizontalBarChartCard } from "@/app/components/looker/HorizontalBarChartCard";
import { GroupedHorizontalBarChartCard } from "@/app/components/looker/GroupedHorizontalBarChartCard";
import { MissedTimeStatsCard } from "@/app/components/looker/MissedTimeStatsCard";
import { DonutChartCard } from "@/app/components/looker/DonutChartCard";
import { SeasonTrendChart } from "@/app/components/looker/SeasonTrendChart";
import { ComposedBarLineChartCard } from "@/app/components/looker/ComposedBarLineChartCard";
import { StackedBarChartCard } from "@/app/components/looker/StackedBarChartCard";
import { DashboardDrawer } from "@/app/components/DashboardDrawer";
import { getFilteredData, getBenchmarkComparison, getInjuryTypeData } from "@/app/utils/dataFilters";
import { InjuryType } from "@/app/data/mockInjuryData";
import { getBenchmarkData, getTeamStandingPosition, getNFLAvgForSeason, getTeamMissedTimeStats, getNFL1YearAvg, getTeam3YearAvg } from "@/app/data/missedTimeData";
import { getMissedTimeByPosition } from "@/app/data/missedTimeData";
import { NFL_TEAMS } from "@/app/data/nflTeams";
import { POSITIONS } from "@/app/data/nflTeams";
import { mockPlayerProfile, modalityVsExerciseData, exerciseData, bodyPartData } from "@/app/data/athleteData";
import { totalDonutData, rehabDonutData, maintenanceDonutData, daysLostByInjuryData, daysLostByPlayerData, injuriesBySessionTypeData, injuryModalityVsExerciseData } from "@/app/data/clubRehabData";
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
    season: "2026",
    benchmarkValue: "",
    startDate: null,
    endDate: null,
    quickDateRange: "",
    sessionTypes: [],
    injuryStatus: "",
    teamId: "18", // Default to New York Giants - Changed to string
  }); // Default to 2026 season

  // Looker-style filters - get config for current dashboard
  const lookerFilterConfig = useMemo(() => getFilterConfig(dashboardType || "missed-time"), [dashboardType]);
  const { values: lookerFilterValues, handleChange: handleLookerFilterChange, handleReset: handleLookerReset } = useLookerFilters(lookerFilterConfig);

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
    if (selectedTab === 0) {
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
                    ? ["Player", "Club", "Injury", "League"]
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
                data={INJURY_RECORDS as Record<string, unknown>[]}
                values={lookerFilterValues}
                onChange={handleLookerFilterChange}
                onReset={handleLookerReset}
                isExpanded={filtersOpen}
                singleLine={true}
              />
              
              {/* Conditionally render Rehab Dashboard, Missed Time Dashboard or Default Dashboard */}
              {dashboardType === "rehab" ? (
                selectedTab === 0 ? (
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
                            src={mockPlayerProfile.imageUrl}
                            sx={{
                              width: 64,
                              height: 64,
                              flexShrink: 0,
                            }}
                          />
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
                              {mockPlayerProfile.name}
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
                              {mockPlayerProfile.position}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                        <MetricCard
                          value={mockPlayerProfile.rehabSessions}
                          label="Rehab sessions"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                        <MetricCard
                          value={mockPlayerProfile.maintenanceSessions}
                          label="Maintenance sessions"
                        />
                      </Grid>
                    </Grid>

                    {/* Charts Section */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                      {/* Modality vs Exercise Chart */}
                      <ComposedBarLineChartCard
                        title="Modality vs Exercise"
                        data={modalityVsExerciseData}
                        barDataKeys={["Heat pack", "Ultrasound", "Cold Pack", "Massage", "Acupuncture"]}
                        lineDataKeys={["Exercise minutes"]}
                        xAxisKey="date"
                        height={350}
                        yAxisLabel="Load score"
                        rightYAxisLabel="Exercise mins"
                      />

                      {/* Exercises Chart */}
                      <StackedBarChartCard
                        title="Exercises"
                        data={exerciseData}
                        dataKeys={["Front squat", "Push-ups", "OH dumbbell press", "Plank", "Romanian deadlifts"]}
                        xAxisKey="date"
                        height={350}
                      />

                      {/* Body Part Chart */}
                      <StackedBarChartCard
                        title="Body part"
                        data={bodyPartData}
                        dataKeys={["Ankle", "Knee", "Shoulder", "Neck", "Groin"]}
                        xAxisKey="date"
                        height={350}
                      />
                    </Box>
                  </Box>
                ) : selectedTab === 1 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {/* Three Donut Charts Row */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="Total"
                          data={totalDonutData}
                          height={300}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="Rehab"
                          data={rehabDonutData}
                          height={300}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="Maintenance"
                          data={maintenanceDonutData}
                          height={300}
                        />
                      </Grid>
                    </Grid>

                    {/* Days lost x Injuries Bar Chart */}
                    <BarChartCard
                      title="Days lost x Injuries"
                      data={daysLostByInjuryData}
                      dataKey="days"
                      xAxisKey="injury"
                      height={400}
                    />

                    {/* Days lost x Maintenance / Rehab x Player */}
                    <GroupedHorizontalBarChartCard
                      title="Days lost x Maintenance / Rehab x Player"
                      data={daysLostByPlayerData}
                      dataKeys={["Injury category", "Maintenance days"]}
                      yAxisKey="player"
                      height={450}
                    />
                  </Box>
                ) : selectedTab === 2 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {/* Injuries by session type Chart */}
                    <GroupedBarChartCard
                      title="Injuries by session type"
                      data={injuriesBySessionTypeData}
                      dataKeys={["Rehab sessions", "Maintenance session"]}
                      xAxisKey="Injury category"
                      height={400}
                    />

                    {/* Modality vs Exercise Chart */}
                    <ComposedBarLineChartCard
                      title="Modality vs Exercise"
                      data={injuryModalityVsExerciseData}
                      barDataKeys={["Heat pack", "Ultrasound", "Cold Pack", "Massage", "Acupuncture"]}
                      lineDataKeys={["Exercise minutes"]}
                      xAxisKey="date"
                      height={350}
                      yAxisLabel="Modality count"
                      rightYAxisLabel="Exercise mins"
                    />
                  </Box>
                ) : selectedTab === 3 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                    {/* Three Donut Charts Row (Total / Rehab / Maintenance) */}
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="Total"
                          data={totalDonutData}
                          height={300}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="Rehab"
                          data={rehabDonutData}
                          height={300}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <DonutChartCard
                          title="Maintenance"
                          data={maintenanceDonutData}
                          height={300}
                        />
                      </Grid>
                    </Grid>

                    {/* Days lost x Injuries Bar Chart */}
                    <BarChartCard
                      title="Days lost x Injuries"
                      data={daysLostByInjuryData}
                      dataKey="days"
                      xAxisKey="injury"
                      height={420}
                    />
                  </Box>
                ) : null
              ) : dashboardType === "missed-time" && missedTimeData ? (
                // Render different content per selected tab: Season (0), Position (1), Team (2)
                selectedTab === 0 ? (
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
              ) : (
                <Grid container spacing={2} sx={{ width: "100%", minWidth: 0 }}>
                  {/* Season view (default) */}
                  {selectedTab === 0 && (
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
                  {selectedTab === 2 && (
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