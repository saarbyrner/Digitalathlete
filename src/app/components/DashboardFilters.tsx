import { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel, Chip, Box, Checkbox, ListItemText } from "@/app/components/playbook";
import { NFL_TEAMS } from "@/app/data/nflTeams";
import { SelectChangeEvent } from "@mui/material";
import { useGlobalFilters } from "@/app/contexts/GlobalFiltersContext";

interface DashboardFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  showTeamFilter?: boolean;
}

export interface FilterState {
  season: string;
  benchmarkValue: string;
  startDate: Date | null;
  endDate: Date | null;
  quickDateRange: string;
  sessionTypes: string[];
  injuryStatus: string;
  teamId: string; // Changed from number | null to string
}

const SEASONS = ["2024", "2023", "2022", "2021", "2020"];
const BENCHMARK_OPTIONS = ["2-Year Average", "3-Year Average", "5-Year Average"];
const QUICK_DATE_RANGES = [
  "Off preseason - Preseason EX",
  "Preseason to Playoffs",
  "Week 1 to Week 8",
  "Week 9 to Week 17",
  "Playoffs Only",
];
const SESSION_TYPES = [
  "All types",
  "Game",
  "Practice",
  "Pregame",
  "Conditioning",
  "Other",
  "Unknown",
  "No data",
];
// const INJURY_STATUS_OPTIONS = ["Out", "Limited"]; (removed - not used)

export function DashboardFilters({ onFilterChange, showTeamFilter }: DashboardFiltersProps) {
  const { globalFilters, setGlobalFilters } = useGlobalFilters();

  const [filters, setFilters] = useState<FilterState>({
    season: globalFilters.season || "2024",
    benchmarkValue: globalFilters.benchmarkValue || "",
    startDate: null,
    endDate: null,
    quickDateRange: globalFilters.quickDateRange || "",
    sessionTypes: globalFilters.sessionTypes || [],
    injuryStatus: "",
    teamId: "",
  });

  // sync when global filters change elsewhere
  useEffect(() => {
    setFilters((prev) => ({ ...prev, ...globalFilters } as FilterState));
  }, [globalFilters]);

  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    // Update global filter
    setGlobalFilters({ season: value, benchmarkValue: "" });
    const newFilters = { ...filters, season: value, benchmarkValue: "" };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleBenchmarkChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setGlobalFilters({ benchmarkValue: value, season: "" });
    const newFilters = { ...filters, benchmarkValue: value, season: "" };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // (date pickers removed — weeks range replaces custom date inputs)

  const handleQuickDateRangeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setGlobalFilters({ quickDateRange: value });
    const newFilters = { ...filters, quickDateRange: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSessionTypesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const types = typeof value === "string" ? value.split(",") : value;
    setGlobalFilters({ sessionTypes: types });
    const newFilters = { ...filters, sessionTypes: types };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSessionTypeDelete = (typeToDelete: string) => {
    const newSessionTypes = filters.sessionTypes.filter(
      (type) => type !== typeToDelete
    );
    const newFilters = { ...filters, sessionTypes: newSessionTypes };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleTeamChange = (event: SelectChangeEvent<string>) => {
    const newFilters = { ...filters, teamId: event.target.value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          overflowX: "auto",
          pb: 1,
        }}
      >
        {/* Team Filter (global) - placed first in layout */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel variant="outlined">Team</InputLabel>
          <Select
            variant="outlined"
            value={filters.teamId || globalFilters.teamId}
            onChange={(e: SelectChangeEvent<string>) => {
              const value = e.target.value;
              setGlobalFilters({ teamId: value });
              const newFilters = { ...filters, teamId: value };
              setFilters(newFilters);
              onFilterChange?.(newFilters);
            }}
            label="Team"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--border-default)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary-main)',
              },
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {NFL_TEAMS.map((team) => (
              <MenuItem key={team.id} value={String(team.id)}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Season Filter */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel variant="outlined">Season</InputLabel>
          <Select
            variant="outlined"
            value={filters.season}
            onChange={handleSeasonChange}
            label="Season"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-default)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-main)' },
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {SEASONS.map((season) => (
              <MenuItem key={season} value={season}>
                {season}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Benchmark Filter */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel variant="outlined">Benchmark</InputLabel>
          <Select
            variant="outlined"
            value={filters.benchmarkValue}
            onChange={handleBenchmarkChange}
            label="Benchmark"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-default)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-main)' },
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {BENCHMARK_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* NOTE: start/end date inputs removed — Weeks Range handles period selection */}

        {/* Weeks Range Filter */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel variant="outlined">Weeks Range</InputLabel>
          <Select
            variant="outlined"
            value={filters.quickDateRange}
            onChange={handleQuickDateRangeChange}
            label="Weeks Range"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-default)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-main)' },
            }}
          >
            <MenuItem value="">
              <em>Custom</em>
            </MenuItem>
            {QUICK_DATE_RANGES.map((range) => (
              <MenuItem key={range} value={range}>
                {range}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Session Types Filter */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel variant="outlined">Session Types</InputLabel>
          <Select
            variant="outlined"
            multiple
            value={filters.sessionTypes}
            onChange={handleSessionTypesChange}
            label="Session Types"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-default)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-main)' },
            }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleSessionTypeDelete(value);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                  />
                ))}
              </Box>
            )}
          >
            {SESSION_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={filters.sessionTypes.indexOf(type) > -1} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Removed local-only filters — only the 4 global filters are shown here */}
      </Box>
  );
}