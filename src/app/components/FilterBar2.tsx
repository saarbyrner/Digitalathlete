import { Box, Select, MenuItem, FormControl, InputLabel, Chip } from "@/app/components/playbook";
import { useState } from "react";
import { useGlobalFilters } from "@/app/contexts/GlobalFiltersContext";
import { SelectChangeEvent } from "@mui/material";
import { NFL_TEAMS } from "@/app/data/nflTeams";

const SEASONS = ["2024", "2023", "2022", "2021", "2020"];
const BENCHMARK_OPTIONS = ["2-Year Average", "3-Year Average", "5-Year Average"];
const QUICK_DATE_RANGES = ["Preseason to Playoffs", "Week 1 to Week 8", "Week 9 to Week 17", "Playoffs Only"];
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

// NFL teams provided from data file

export function FilterBar2() {
  const { globalFilters, setGlobalFilters } = useGlobalFilters();
  const [_local] = useState(false);

  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    setGlobalFilters({ season: event.target.value });
  };

  const handleBenchmarkChange = (event: SelectChangeEvent<string>) => {
    setGlobalFilters({ benchmarkValue: event.target.value });
  };

  const handleQuickRangeChange = (event: SelectChangeEvent<string>) => {
    setGlobalFilters({ quickDateRange: event.target.value });
  };

  const handleSessionTypesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const types = typeof value === "string" ? value.split(",") : value;
    // If "All types" is toggled on, select all options
    if (types.includes("All types")) {
      setGlobalFilters({ sessionTypes: SESSION_TYPES.filter((s) => s !== "All types") });
  {/* Global: Team (first) */}
  <FormControl variant="filled" size="small" sx={{ minWidth: "220px", maxWidth: "320px" }}>
    <InputLabel>Team</InputLabel>
    <Select value={globalFilters.teamId} onChange={(e) => setGlobalFilters({ teamId: e.target.value })} label="Team">
      <MenuItem value=""><em>None</em></MenuItem>
      {NFL_TEAMS.map((t) => (
        <MenuItem key={t.id} value={String(t.id)}>{t.name}</MenuItem>
      ))}
    </Select>
  </FormControl>
    } else {
      setGlobalFilters({ sessionTypes: types });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "var(--spacing-2)",
        overflowX: "auto",
        mb: "var(--spacing-4)",
      }}
    >
      {/* Global: Team (first) */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: "220px", maxWidth: "320px" }}>
        <InputLabel>Team</InputLabel>
        <Select 
          value={globalFilters.teamId} 
          onChange={(e) => setGlobalFilters({ teamId: e.target.value })} 
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
          <MenuItem value=""><em>None</em></MenuItem>
          {NFL_TEAMS.map((t) => (
            <MenuItem key={t.id} value={String(t.id)}>{t.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Global: Season */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: "180px", maxWidth: "240px" }}>
        <InputLabel>Season</InputLabel>
        <Select 
          value={globalFilters.season} 
          onChange={handleSeasonChange} 
          label="Season"
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-default)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-main)' },
          }}
        >
          {SEASONS.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Global: Benchmark */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: "180px", maxWidth: "240px" }}>
        <InputLabel>Benchmark</InputLabel>
        <Select 
          value={globalFilters.benchmarkValue} 
          onChange={handleBenchmarkChange} 
          label="Benchmark"
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-default)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-main)' },
          }}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {BENCHMARK_OPTIONS.map((b) => (
            <MenuItem key={b} value={b}>{b}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Global: Weeks / Quick Range */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: "220px", maxWidth: "320px" }}>
        <InputLabel>Weeks Range</InputLabel>
        <Select 
          value={globalFilters.quickDateRange} 
          onChange={handleQuickRangeChange} 
          label="Weeks Range"
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-default)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-main)' },
          }}
        >
          <MenuItem value=""><em>Custom</em></MenuItem>
          {QUICK_DATE_RANGES.map((q) => (
            <MenuItem key={q} value={q}>{q}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Global: Session Types */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: "220px", maxWidth: "320px" }}>
        <InputLabel>Session Types</InputLabel>
        <Select
          multiple
          value={globalFilters.sessionTypes}
          onChange={handleSessionTypesChange}
          label="Session Types"
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-default)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-main)' },
          }}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {selected.map((s) => (
                <Chip key={s} label={s} size="small" />
              ))}
            </Box>
          )}
        >
          {SESSION_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}