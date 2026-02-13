/**
 * Dashboard filter configurations
 * 
 * These configs define which filters appear on each dashboard.
 * Filters can use static options or generate options dynamically from data.
 */

import type { FilterConfig, DashboardFilterConfig } from "@/app/types/filters";

// ==========================================
// SHARED FILTER OPTIONS
// ==========================================

const SEASON_OPTIONS = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
];

const WEEK_TYPE_OPTIONS = [
  { value: "regular", label: "Regular Season" },
  { value: "preseason", label: "Pre-season" },
  { value: "postseason", label: "Post-season" },
  { value: "offseason", label: "Off-season" },
];

const SEASON_TYPE_OPTIONS = [
  { value: "regular", label: "Regular" },
  { value: "preseason", label: "Pre-season" },
  { value: "postseason", label: "Post-season" },
];

const TEAM_ACTIVITY_OPTIONS = [
  { value: "game", label: "Game" },
  { value: "practice", label: "Practice" },
  { value: "conditioning", label: "Conditioning" },
  { value: "training", label: "Training" },
  { value: "walkthrough", label: "Walkthrough" },
];

const MECHANISM_OF_INJURY_OPTIONS = [
  { value: "contact", label: "Contact" },
  { value: "non-contact", label: "Non-contact" },
  { value: "overuse", label: "Overuse" },
  { value: "unknown", label: "Unknown" },
];

const CONTACT_TYPE_OPTIONS = [
  { value: "player-contact", label: "Player contact" },
  { value: "ground-contact", label: "Ground contact" },
  { value: "equipment-contact", label: "Equipment contact" },
  { value: "no-contact", label: "No contact" },
];

const BODY_PART_OPTIONS = [
  { value: "head", label: "Head" },
  { value: "neck", label: "Neck" },
  { value: "shoulder", label: "Shoulder" },
  { value: "arm", label: "Arm" },
  { value: "elbow", label: "Elbow" },
  { value: "wrist", label: "Wrist" },
  { value: "hand", label: "Hand" },
  { value: "back", label: "Back" },
  { value: "hip", label: "Hip" },
  { value: "groin", label: "Groin" },
  { value: "quad", label: "Quad" },
  { value: "hamstring", label: "Hamstring" },
  { value: "knee", label: "Knee" },
  { value: "ankle", label: "Ankle" },
  { value: "foot", label: "Foot" },
];

const POSITION_OPTIONS = [
  { value: "QB", label: "QB" },
  { value: "RB", label: "RB" },
  { value: "WR", label: "WR" },
  { value: "TE", label: "TE" },
  { value: "OL", label: "OL" },
  { value: "DL", label: "DL" },
  { value: "LB", label: "LB" },
  { value: "CB", label: "CB" },
  { value: "S", label: "S" },
  { value: "K", label: "K" },
  { value: "P", label: "P" },
];

const INJURY_TYPE_OPTIONS = [
  { value: "concussion", label: "Concussion" },
  { value: "acl", label: "ACL" },
  { value: "hamstring", label: "Hamstring" },
  { value: "ankle", label: "Ankle" },
  { value: "shoulder", label: "Shoulder" },
  { value: "knee", label: "Knee" },
  { value: "back", label: "Back" },
  { value: "quad", label: "Quad" },
  { value: "groin", label: "Groin" },
  { value: "other", label: "Other" },
];

// ==========================================
// MISSED TIME DASHBOARD FILTERS
// ==========================================

export const missedTimeFilters: FilterConfig[] = [
  // Row 1 - Time & Game context
  {
    id: "gameweeks",
    label: "Gameweek(s)",
    type: "multi-select",
    dataKey: "gameweeks",
    optionsFromData: "gameweek", // Generate from data
    placeholder: "Is any value",
    row: 1,
    width: "220px",
  },
  {
    id: "season",
    label: "Season",
    type: "select",
    dataKey: "season",
    options: SEASON_OPTIONS,
    defaultValue: "2025",
    row: 1,
  },
  {
    id: "weekTypeName",
    label: "Week type & name",
    type: "select",
    dataKey: "weekTypeName",
    options: WEEK_TYPE_OPTIONS,
    row: 1,
  },
  {
    id: "game",
    label: "Game",
    type: "select",
    dataKey: "game",
    optionsFromData: "game", // Generate from data
    row: 1,
  },
  {
    id: "mechanismOfInjury",
    label: "Mechanism of injury",
    type: "select",
    dataKey: "mechanismOfInjury",
    options: MECHANISM_OF_INJURY_OPTIONS,
    row: 1,
  },
  {
    id: "contactTypeCategory",
    label: "Contact type category",
    type: "select",
    dataKey: "contactTypeCategory",
    options: CONTACT_TYPE_OPTIONS,
    row: 1,
  },
  {
    id: "seasonType",
    label: "Season type",
    type: "select",
    dataKey: "seasonType",
    options: SEASON_TYPE_OPTIONS,
    row: 1,
  },

  // Row 2 - Position & Activity
  {
    id: "rosterPosition",
    label: "Roster position",
    type: "select",
    dataKey: "rosterPosition",
    options: POSITION_OPTIONS,
    row: 2,
  },
  {
    id: "week",
    label: "Week",
    type: "select",
    dataKey: "week",
    optionsFromData: "week", // Generate from data (1-18)
    row: 2,
  },
  {
    id: "teamActivity",
    label: "Team activity",
    type: "select",
    dataKey: "teamActivity",
    options: TEAM_ACTIVITY_OPTIONS,
    row: 2,
  },
  {
    id: "club",
    label: "Club",
    type: "select",
    dataKey: "club",
    optionsFromData: "teamName", // Generate from data
    row: 2,
  },
  {
    id: "missedTimeInjury",
    label: "Missed time injury",
    type: "boolean",
    dataKey: "missedTimeInjury",
    defaultValue: null,
    row: 2,
  },
  {
    id: "injuryType",
    label: "Injury type",
    type: "select",
    dataKey: "injuryType",
    options: INJURY_TYPE_OPTIONS,
    row: 2,
  },
  {
    id: "missedGameInjury",
    label: "Missed game injury",
    type: "boolean",
    dataKey: "missedGameInjury",
    defaultValue: null,
    row: 2,
  },
  {
    id: "bodyPart",
    label: "Body part",
    type: "select",
    dataKey: "bodyPart",
    options: BODY_PART_OPTIONS,
    row: 2,
  },

  // Row 3 - Additional filters
  {
    id: "missedPracticeInjury",
    label: "Missed practice injury",
    type: "boolean",
    dataKey: "missedPracticeInjury",
    defaultValue: null,
    row: 3,
  },
  {
    id: "positionAtTimeOfInjury",
    label: "Position at time of injury",
    type: "select",
    dataKey: "positionAtTimeOfInjury",
    options: POSITION_OPTIONS,
    row: 3,
  },
  {
    id: "participationReason",
    label: "Participation reason",
    type: "select",
    dataKey: "participationReason",
    optionsFromData: "participationReason", // Generate from data
    row: 3,
  },
  {
    id: "pastPlayers",
    label: "Past Players",
    type: "boolean",
    dataKey: "includePastPlayers",
    defaultValue: false,
    row: 3,
  },
];

// ==========================================
// REHAB DASHBOARD FILTERS
// ==========================================

export const rehabFilters: FilterConfig[] = [
  // Row 1
  {
    id: "season",
    label: "Season",
    type: "select",
    dataKey: "season",
    options: SEASON_OPTIONS,
    defaultValue: "2024",
    row: 1,
  },
  {
    id: "player",
    label: "Player",
    type: "select",
    dataKey: "playerId",
    optionsFromData: "playerName",
    row: 1,
    width: "180px",
  },
  {
    id: "injuryType",
    label: "Injury type",
    type: "select",
    dataKey: "injuryType",
    options: INJURY_TYPE_OPTIONS,
    row: 1,
  },
  {
    id: "bodyPart",
    label: "Body part",
    type: "select",
    dataKey: "bodyPart",
    options: BODY_PART_OPTIONS,
    row: 1,
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    dataKey: "status",
    options: [
      { value: "active", label: "Active" },
      { value: "recovered", label: "Recovered" },
      { value: "chronic", label: "Chronic" },
    ],
    row: 1,
  },

  // Row 2
  {
    id: "dateRange",
    label: "Date range",
    type: "select",
    dataKey: "dateRange",
    options: [
      { value: "last7", label: "Last 7 days" },
      { value: "last30", label: "Last 30 days" },
      { value: "last90", label: "Last 90 days" },
      { value: "thisYear", label: "This year" },
    ],
    row: 2,
  },
  {
    id: "sessionType",
    label: "Session type",
    type: "multi-select",
    dataKey: "sessionTypes",
    options: [
      { value: "rehab", label: "Rehab" },
      { value: "maintenance", label: "Maintenance" },
      { value: "treatment", label: "Treatment" },
      { value: "modality", label: "Modality" },
    ],
    row: 2,
  },
];

// ==========================================
// GENERIC INJURY DASHBOARD FILTERS
// ==========================================

export const injuryDashboardFilters: FilterConfig[] = [
  {
    id: "season",
    label: "Season",
    type: "select",
    dataKey: "season",
    options: SEASON_OPTIONS,
    defaultValue: "2024",
    row: 1,
  },
  {
    id: "club",
    label: "Club",
    type: "select",
    dataKey: "teamId",
    optionsFromData: "teamName",
    row: 1,
    width: "200px",
  },
  {
    id: "position",
    label: "Position",
    type: "multi-select",
    dataKey: "positions",
    options: POSITION_OPTIONS,
    row: 1,
  },
  {
    id: "severity",
    label: "Severity",
    type: "select",
    dataKey: "severity",
    options: [
      { value: "minor", label: "Minor" },
      { value: "moderate", label: "Moderate" },
      { value: "severe", label: "Severe" },
    ],
    row: 1,
  },
  {
    id: "weekRange",
    label: "Week range",
    type: "select",
    dataKey: "weekRange",
    options: [
      { value: "preseason", label: "Preseason" },
      { value: "week1-8", label: "Weeks 1-8" },
      { value: "week9-17", label: "Weeks 9-17" },
      { value: "playoffs", label: "Playoffs" },
    ],
    row: 2,
  },
  {
    id: "isRecurring",
    label: "Recurring injury",
    type: "boolean",
    dataKey: "isRecurring",
    row: 2,
  },
];

// ==========================================
// DASHBOARD CONFIG MAP
// ==========================================

export const dashboardFilterConfigs: Record<string, DashboardFilterConfig> = {
  "missed-time": {
    dashboardId: "missed-time",
    filters: missedTimeFilters,
  },
  "rehab": {
    dashboardId: "rehab",
    filters: rehabFilters,
  },
  "concussion": {
    dashboardId: "concussion",
    filters: injuryDashboardFilters,
  },
  "shoulder": {
    dashboardId: "shoulder",
    filters: injuryDashboardFilters,
  },
  "lex-sprain": {
    dashboardId: "lex-sprain",
    filters: injuryDashboardFilters,
  },
  "lex-strain": {
    dashboardId: "lex-strain",
    filters: injuryDashboardFilters,
  },
  "acl": {
    dashboardId: "acl",
    filters: injuryDashboardFilters,
  },
  "hamstring": {
    dashboardId: "hamstring",
    filters: injuryDashboardFilters,
  },
};

/**
 * Get filter configuration for a specific dashboard
 */
export function getFilterConfig(dashboardId: string): FilterConfig[] {
  const config = dashboardFilterConfigs[dashboardId];
  // If a dashboard doesn't have an explicit config, fallback to the
  // common "missed time" filters so pages always show usable controls.
  return config?.filters || missedTimeFilters;
}
