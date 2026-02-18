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
  { value: "2026", label: "2026" },
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
  { value: "Regular", label: "Regular" },
  { value: "Pre-season", label: "Pre-season" },
  { value: "Post-season", label: "Post-season" },
  { value: "Off-season", label: "Off-season" },
];

const TEAM_ACTIVITY_OPTIONS = [
  { value: "Game", label: "Game" },
  { value: "Practice", label: "Practice" },
  { value: "Conditioning", label: "Conditioning" },
  { value: "Training", label: "Training" },
  { value: "Walkthrough", label: "Walkthrough" },
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
  { value: "Head", label: "Head" },
  { value: "Neck", label: "Neck" },
  { value: "Shoulder", label: "Shoulder" },
  { value: "Arm", label: "Arm" },
  { value: "Elbow", label: "Elbow" },
  { value: "Wrist", label: "Wrist" },
  { value: "Hand", label: "Hand" },
  { value: "Back", label: "Back" },
  { value: "Hip", label: "Hip" },
  { value: "Groin", label: "Groin" },
  { value: "Quad", label: "Quad" },
  { value: "Hamstring", label: "Hamstring" },
  { value: "Knee", label: "Knee" },
  { value: "Ankle", label: "Ankle" },
  { value: "Foot", label: "Foot" },
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

const ROSTER_STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Injured Reserve", label: "Injured Reserve" },
  { value: "Practice Squad", label: "Practice Squad" },
  { value: "Physically Unable to Perform", label: "Physically Unable to Perform" },
  { value: "Non-Football Injury", label: "Non-Football Injury" },
  { value: "Released", label: "Released" },
];

const WEEK_OPTIONS = Array.from({ length: 18 }, (_, i) => ({
  value: String(i + 1),
  label: `Week ${i + 1}`,
}));


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

// Rehab status options - maps to InjuryStatus in data
const REHAB_STATUS_OPTIONS = [
  { value: "active", label: "Active (Out/Limited)" },
  { value: "recovered", label: "Recovered" },
];

// Rehab session type options
const REHAB_SESSION_TYPE_OPTIONS = [
  { value: "rehab", label: "Rehab" },
  { value: "maintenance", label: "Maintenance" },
];

// Date range preset options
const DATE_RANGE_OPTIONS = [
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
  { value: "last90", label: "Last 90 days" },
  { value: "thisYear", label: "This year" },
];

export const rehabFilters: FilterConfig[] = [
  // Row 1
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
    id: "player",
    label: "Player",
    type: "select",
    dataKey: "playerName",
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
    options: REHAB_STATUS_OPTIONS,
    row: 1,
  },

  // Row 2
  {
    id: "dateRange",
    label: "Date range",
    type: "select",
    dataKey: "dateRange",
    options: DATE_RANGE_OPTIONS,
    row: 2,
  },
  {
    id: "sessionType",
    label: "Session type",
    type: "multi-select",
    dataKey: "sessionTypes",
    options: REHAB_SESSION_TYPE_OPTIONS,
    row: 2,
  },
];

// ==========================================
// TAB-SPECIFIC REHAB FILTERS
// ==========================================

// Player tab - needs player selector, injury context
export const rehabPlayerTabFilters: FilterConfig[] = [
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
    id: "player",
    label: "Player",
    type: "select",
    dataKey: "playerName",
    optionsFromData: "playerName",
    row: 1,
    width: "200px",
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
    id: "dateRange",
    label: "Date range",
    type: "select",
    dataKey: "dateRange",
    options: DATE_RANGE_OPTIONS,
    row: 1,
  },
];

// Sessions tab - session type focused
export const rehabSessionsTabFilters: FilterConfig[] = [
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
    id: "player",
    label: "Player",
    type: "select",
    dataKey: "playerName",
    optionsFromData: "playerName",
    row: 1,
    width: "200px",
  },
  {
    id: "sessionType",
    label: "Session type",
    type: "multi-select",
    dataKey: "sessionTypes",
    options: REHAB_SESSION_TYPE_OPTIONS,
    row: 1,
  },
  {
    id: "dateRange",
    label: "Date range",
    type: "select",
    dataKey: "dateRange",
    options: DATE_RANGE_OPTIONS,
    row: 1,
  },
];

// Club tab - aggregate view, status/injury focused
export const rehabClubTabFilters: FilterConfig[] = [
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
    options: REHAB_STATUS_OPTIONS,
    row: 1,
  },
  {
    id: "dateRange",
    label: "Date range",
    type: "select",
    dataKey: "dateRange",
    options: DATE_RANGE_OPTIONS,
    row: 1,
  },
];

// Injury tab - injury analysis focused
export const rehabInjuryTabFilters: FilterConfig[] = [
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
    id: "mechanismOfInjury",
    label: "Mechanism",
    type: "select",
    dataKey: "mechanismOfInjury",
    options: MECHANISM_OF_INJURY_OPTIONS,
    row: 1,
  },
  {
    id: "sessionType",
    label: "Session type",
    type: "multi-select",
    dataKey: "sessionTypes",
    options: REHAB_SESSION_TYPE_OPTIONS,
    row: 1,
  },
];

// League tab - broader view with season context
export const rehabLeagueTabFilters: FilterConfig[] = [
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
    id: "seasonType",
    label: "Season type",
    type: "select",
    dataKey: "seasonType",
    options: SEASON_TYPE_OPTIONS,
    row: 1,
  },
  {
    id: "week",
    label: "Week",
    type: "select",
    dataKey: "week",
    optionsFromData: "week",
    row: 1,
  },
  {
    id: "injuryType",
    label: "Injury type",
    type: "select",
    dataKey: "injuryType",
    options: INJURY_TYPE_OPTIONS,
    row: 1,
  },
];

/**
 * Get filter configuration for a specific rehab dashboard tab
 * @param tabIndex - 0: Player, 1: Sessions, 2: Club, 3: Injury, 4: League
 */
export function getRehabFiltersForTab(tabIndex: number): FilterConfig[] {
  switch (tabIndex) {
    case 0:
      return rehabPlayerTabFilters;
    case 1:
      return rehabSessionsTabFilters;
    case 2:
      return rehabClubTabFilters;
    case 3:
      return rehabInjuryTabFilters;
    case 4:
      return rehabLeagueTabFilters;
    default:
      return rehabFilters;
  }
};

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
    defaultValue: "2025",
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
// PHS INJURY REPORT DASHBOARD FILTERS
// ==========================================

export const phsInjuryTabFilters: FilterConfig[] = [
  // Row 1
  {
    id: "selectGame",
    label: "Select Game",
    type: "select",
    dataKey: "selectGame",
    optionsFromData: "game",
    placeholder: "All",
    row: 1,
    width: "200px",
  },
  {
    id: "mechanismOfInjury",
    label: "Mechanism of Injury",
    type: "select",
    dataKey: "mechanismOfInjury",
    options: MECHANISM_OF_INJURY_OPTIONS,
    placeholder: "All",
    row: 1,
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
    id: "contactTypeCategory",
    label: "Contact Type Category",
    type: "select",
    dataKey: "contactTypeCategory",
    options: CONTACT_TYPE_OPTIONS,
    placeholder: "All",
    row: 1,
  },
  {
    id: "seasonType",
    label: "Season Type",
    type: "select",
    dataKey: "seasonType",
    options: SEASON_TYPE_OPTIONS,
    placeholder: "All",
    row: 1,
  },
  {
    id: "week",
    label: "Week",
    type: "select",
    dataKey: "week",
    options: WEEK_OPTIONS,
    placeholder: "All",
    row: 1,
  },
  // Row 2
  {
    id: "club",
    label: "Club",
    type: "select",
    dataKey: "teamAbbr",
    optionsFromData: "teamAbbr",
    placeholder: "All",
    row: 2,
    width: "180px",
  },
  {
    id: "player",
    label: "Player",
    type: "select",
    dataKey: "playerName",
    optionsFromData: "playerName",
    placeholder: "All",
    row: 2,
    width: "200px",
  },
  {
    id: "injuryType",
    label: "Injury Type",
    type: "select",
    dataKey: "injuryType",
    optionsFromData: "injuryType",
    placeholder: "All",
    row: 2,
  },
  {
    id: "bodyPart",
    label: "Body Part",
    type: "select",
    dataKey: "bodyPart",
    options: BODY_PART_OPTIONS,
    placeholder: "All",
    row: 2,
  },
  {
    id: "positionAtTimeOfInjury",
    label: "Position at Time of Injury",
    type: "select",
    dataKey: "positionAtTimeOfInjury",
    options: POSITION_OPTIONS,
    placeholder: "All",
    row: 2,
  },
  // Row 3
  {
    id: "rosterPosition",
    label: "Roster Position",
    type: "select",
    dataKey: "rosterPosition",
    options: POSITION_OPTIONS,
    placeholder: "All",
    row: 3,
  },
  {
    id: "currentRosterStatus",
    label: "Current Roster Status",
    type: "select",
    dataKey: "currentRosterStatus",
    options: ROSTER_STATUS_OPTIONS,
    placeholder: "All",
    row: 3,
  },
  {
    id: "teamActivity",
    label: "Team Activity",
    type: "select",
    dataKey: "teamActivity",
    options: TEAM_ACTIVITY_OPTIONS,
    placeholder: "All",
    row: 3,
  },
  {
    id: "missedTimeInjury",
    label: "Missed Time Injury",
    type: "boolean",
    dataKey: "missedTimeInjury",
    defaultValue: true,
    row: 3,
  },
  {
    id: "missedGameInjury",
    label: "Missed Game Injury",
    type: "boolean",
    dataKey: "missedGameInjury",
    row: 3,
  },
  {
    id: "missedPracticeInjury",
    label: "Missed Practice Injury",
    type: "boolean",
    dataKey: "missedPracticeInjury",
    row: 3,
  },
];

// Activity Report tab filters (same as Injury tab)
export const phsActivityReportTabFilters: FilterConfig[] = [
  // Row 1
  {
    id: "selectGame",
    label: "Select Game",
    type: "select",
    dataKey: "selectGame",
    optionsFromData: "game",
    placeholder: "All",
    row: 1,
    width: "200px",
  },
  {
    id: "mechanismOfInjury",
    label: "Mechanism of Injury",
    type: "select",
    dataKey: "mechanismOfInjury",
    options: MECHANISM_OF_INJURY_OPTIONS,
    placeholder: "All",
    row: 1,
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
    id: "contactTypeCategory",
    label: "Contact Type Category",
    type: "select",
    dataKey: "contactTypeCategory",
    options: CONTACT_TYPE_OPTIONS,
    placeholder: "All",
    row: 1,
  },
  {
    id: "seasonType",
    label: "Season Type",
    type: "select",
    dataKey: "seasonType",
    options: SEASON_TYPE_OPTIONS,
    placeholder: "All",
    row: 1,
  },
  {
    id: "week",
    label: "Week",
    type: "select",
    dataKey: "week",
    options: WEEK_OPTIONS,
    placeholder: "All",
    row: 1,
  },
  // Row 2
  {
    id: "club",
    label: "Club",
    type: "select",
    dataKey: "teamAbbr",
    optionsFromData: "teamAbbr",
    placeholder: "All",
    row: 2,
    width: "180px",
  },
  {
    id: "player",
    label: "Player",
    type: "select",
    dataKey: "playerName",
    optionsFromData: "playerName",
    placeholder: "All",
    row: 2,
    width: "200px",
  },
  {
    id: "injuryType",
    label: "Injury Type",
    type: "select",
    dataKey: "injuryType",
    optionsFromData: "injuryType",
    placeholder: "All",
    row: 2,
  },
  {
    id: "bodyPart",
    label: "Body Part",
    type: "select",
    dataKey: "bodyPart",
    options: BODY_PART_OPTIONS,
    placeholder: "All",
    row: 2,
  },
  {
    id: "positionAtTimeOfInjury",
    label: "Position at Time of Injury",
    type: "select",
    dataKey: "positionAtTimeOfInjury",
    options: POSITION_OPTIONS,
    placeholder: "All",
    row: 2,
  },
  // Row 3
  {
    id: "rosterPosition",
    label: "Roster Position",
    type: "select",
    dataKey: "rosterPosition",
    options: POSITION_OPTIONS,
    placeholder: "All",
    row: 3,
  },
  {
    id: "currentRosterStatus",
    label: "Current Roster Status",
    type: "select",
    dataKey: "currentRosterStatus",
    options: ROSTER_STATUS_OPTIONS,
    placeholder: "All",
    row: 3,
  },
  {
    id: "teamActivity",
    label: "Team Activity",
    type: "select",
    dataKey: "teamActivity",
    options: TEAM_ACTIVITY_OPTIONS,
    placeholder: "All",
    row: 3,
  },
  {
    id: "missedTimeInjury",
    label: "Missed Time Injury",
    type: "boolean",
    dataKey: "missedTimeInjury",
    defaultValue: true,
    row: 3,
  },
  {
    id: "missedGameInjury",
    label: "Missed Game Injury",
    type: "boolean",
    dataKey: "missedGameInjury",
    row: 3,
  },
  {
    id: "missedPracticeInjury",
    label: "Missed Practice Injury",
    type: "boolean",
    dataKey: "missedPracticeInjury",
    row: 3,
  },
];

// Player Summary tab filters - comprehensive filtering for individual player analysis
export const phsPlayerSummaryTabFilters: FilterConfig[] = [
  // Row 1 - Player selection is primary
  {
    id: "player",
    label: "Player",
    type: "select",
    dataKey: "playerName",
    optionsFromData: "playerName",
    placeholder: "Select a player...",
    row: 1,
    width: "250px",
  },
  {
    id: "season",
    label: "Season",
    type: "select",
    dataKey: "season",
    options: SEASON_OPTIONS,
    placeholder: "All",
    row: 1,
  },
  {
    id: "club",
    label: "Club",
    type: "select",
    dataKey: "teamAbbr",
    optionsFromData: "teamAbbr",
    placeholder: "All",
    row: 1,
    width: "180px",
  },
  {
    id: "injuryType",
    label: "Injury Type",
    type: "select",
    dataKey: "injuryType",
    optionsFromData: "injuryType",
    placeholder: "All",
    row: 1,
  },
  {
    id: "bodyPart",
    label: "Body Part",
    type: "select",
    dataKey: "bodyPart",
    options: BODY_PART_OPTIONS,
    placeholder: "All",
    row: 1,
  },
  // Row 2
  {
    id: "teamActivity",
    label: "Team Activity",
    type: "select",
    dataKey: "teamActivity",
    options: TEAM_ACTIVITY_OPTIONS,
    placeholder: "All",
    row: 2,
  },
  {
    id: "rosterPosition",
    label: "Roster Position",
    type: "select",
    dataKey: "rosterPosition",
    options: POSITION_OPTIONS,
    placeholder: "All",
    row: 2,
  },
  {
    id: "mechanismOfInjury",
    label: "Mechanism of Injury",
    type: "select",
    dataKey: "mechanismOfInjury",
    options: MECHANISM_OF_INJURY_OPTIONS,
    placeholder: "All",
    row: 2,
  },
  {
    id: "missedTimeInjury",
    label: "Missed Time Injury",
    type: "boolean",
    dataKey: "missedTimeInjury",
    row: 2,
  },
  {
    id: "missedGameInjury",
    label: "Missed Game Injury",
    type: "boolean",
    dataKey: "missedGameInjury",
    row: 2,
  },
];

export function getPhsFiltersForTab(tabIndex: number): FilterConfig[] {
  switch (tabIndex) {
    case 0:
      return phsInjuryTabFilters;
    case 1:
      return phsActivityReportTabFilters;
    case 2:
      return phsPlayerSummaryTabFilters;
    default:
      return phsInjuryTabFilters;
  }
}

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
  "phs-injury-report": {
    dashboardId: "phs-injury-report",
    filters: phsInjuryTabFilters,
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
