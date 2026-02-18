import { NFL_TEAMS, POSITIONS, POSITION_GROUPS } from "./nflTeams";

export type InjuryType = 
  | "Concussion" 
  | "Shoulder" 
  | "LEX Sprain" 
  | "LEX Strain" 
  | "ACL" 
  | "Hamstring" 
  | "Ankle"
  | "High Ankle Sprain"
  | "Lateral Ankle Sprain"
  | "Knee"
  | "Back"
  | "Foot"
  | "Hand"
  | "Quad"
  | "Hip"
  | "Groin";

export type InjuryStatus = "Out" | "Limited" | "Recovered";
export type SessionType = "Games" | "Practice" | "Conditioning" | "Recovery" | "Strength Training" | "Film Study";
export type RosterStatus = "Active" | "Injured Reserve" | "Practice Squad" | "Physically Unable to Perform" | "Non-Football Injury" | "Released";

export interface InjuryRecord {
  id: string;
  playerId: string;
  playerName: string;
  teamId: number;
  teamName: string;
  teamAbbr: string;
  position: string;
  positionGroup: string;
  injuryType: InjuryType;
  // New fields for Looker-style filtering
  gameweek: string;
  weekTypeName: string;
  game: string;
  selectGame?: string; // Alias for game (for PHS dashboard)
  mechanismOfInjury: string;
  contactTypeCategory: string;
  seasonType: string;
  teamActivity: string;
  injuryDate: Date;
  returnDate: Date | null;
  expectedReturnDate: Date | null;
  daysOut: number;
  status: InjuryStatus;
  severity: "Minor" | "Moderate" | "Severe";
  sessionTypeAtInjury: SessionType;
  season: number;
  week: number;
  description: string;
  isRecurring: boolean;
  previousInjuryId?: string;
  rosterPosition?: string;
  currentRosterStatus?: RosterStatus;
  missedTimeInjury?: boolean;
  missedGameInjury?: boolean;
  missedPracticeInjury?: boolean;
  bodyPart?: string;
  positionAtTimeOfInjury?: string;
  participationReason?: string;
  isPastPlayer?: boolean;
  side?: "Left" | "Right" | "Midline" | "Head";
  clinicalImpression?: string;
  missedGames?: number;
}

// Helper to generate random dates within a season
function getRandomDate(season: number, weekStart: number, weekEnd: number): Date {
  const year = season;
  // NFL season typically starts early September
  const seasonStart = new Date(year, 8, 1); // September 1st
  const weekInMs = 7 * 24 * 60 * 60 * 1000;
  const startMs = seasonStart.getTime() + (weekStart * weekInMs);
  const endMs = seasonStart.getTime() + (weekEnd * weekInMs);
  const randomMs = startMs + Math.random() * (endMs - startMs);
  return new Date(randomMs);
}

// Injury severity and recovery time mappings
const injuryRecoveryProfiles: Record<InjuryType, { minDays: number; maxDays: number; severityWeight: Record<string, number> }> = {
  "Concussion": { minDays: 7, maxDays: 28, severityWeight: { Minor: 7, Moderate: 14, Severe: 21 } },
  "Shoulder": { minDays: 14, maxDays: 180, severityWeight: { Minor: 21, Moderate: 60, Severe: 150 } },
  "LEX Sprain": { minDays: 7, maxDays: 42, severityWeight: { Minor: 10, Moderate: 21, Severe: 35 } },
  "LEX Strain": { minDays: 10, maxDays: 56, severityWeight: { Minor: 14, Moderate: 28, Severe: 45 } },
  "ACL": { minDays: 180, maxDays: 365, severityWeight: { Minor: 200, Moderate: 270, Severe: 330 } },
  "Hamstring": { minDays: 14, maxDays: 90, severityWeight: { Minor: 21, Moderate: 42, Severe: 70 } },
  "Ankle": { minDays: 7, maxDays: 60, severityWeight: { Minor: 14, Moderate: 28, Severe: 50 } },
  "High Ankle Sprain": { minDays: 21, maxDays: 84, severityWeight: { Minor: 28, Moderate: 42, Severe: 70 } },
  "Lateral Ankle Sprain": { minDays: 7, maxDays: 42, severityWeight: { Minor: 14, Moderate: 21, Severe: 35 } },
  "Knee": { minDays: 14, maxDays: 120, severityWeight: { Minor: 21, Moderate: 45, Severe: 90 } },
  "Back": { minDays: 7, maxDays: 90, severityWeight: { Minor: 14, Moderate: 35, Severe: 70 } },
  "Foot": { minDays: 14, maxDays: 90, severityWeight: { Minor: 21, Moderate: 42, Severe: 75 } },
  "Hand": { minDays: 7, maxDays: 42, severityWeight: { Minor: 10, Moderate: 21, Severe: 35 } },
  "Quad": { minDays: 14, maxDays: 60, severityWeight: { Minor: 21, Moderate: 35, Severe: 50 } },
  "Hip": { minDays: 21, maxDays: 120, severityWeight: { Minor: 30, Moderate: 60, Severe: 100 } },
  "Groin": { minDays: 14, maxDays: 60, severityWeight: { Minor: 21, Moderate: 35, Severe: 50 } },
};

// First names pool
const firstNames = [
  "Marcus", "Jamal", "Tyler", "Brandon", "Cameron", "Derek", "Justin", "Kyle", "Ryan", "Aaron",
  "Josh", "Matt", "Tom", "Drew", "Patrick", "Russell", "Dak", "Jalen", "Lamar", "Joe",
  "Trevor", "Tua", "Mac", "Zach", "Davis", "Christian", "Nick", "Cooper", "Davante", "Stefon",
  "DeAndre", "Tyreek", "Mike", "Chris", "DK", "Terry", "CeeDee", "Jaylen", "AJ", "Deebo",
  "Travis", "George", "Mark", "Darren", "TJ", "Micah", "Myles", "Maxx", "Nick", "Quinnen",
  "Dexter", "Javon", "Rashan", "Montez", "Roquan", "Fred", "Tremaine", "Bobby", "CJ", "Shaquille",
  "Patrick", "Jaire", "Sauce", "Jalen", "Trevon", "Marshon", "Carlton", "Denzel", "Jaycee", "Tre'Davious",
  "Derwin", "Jessie", "Minkah", "Antoine", "Justin", "Jamal", "Kevin", "Harrison", "Quentin", "Jordan",
];

// Last names pool
const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Thompson", "White", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Allen",
  "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson",
  "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Turner", "Phillips", "Parker",
  "Evans", "Edwards", "Collins", "Stewart", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell",
  "Murphy", "Bailey", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Peterson", "Gray", "Ramirez",
  "James", "Watson", "Brooks", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson",
];

function generatePlayerName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getWeightedSeverity(): "Minor" | "Moderate" | "Severe" {
  const rand = Math.random();
  if (rand < 0.5) return "Minor";
  if (rand < 0.85) return "Moderate";
  return "Severe";
}

// Generate injury records
function generateInjuryRecords(): InjuryRecord[] {
  const records: InjuryRecord[] = [];
  let recordId = 1;
  const seasons = [2022, 2023, 2024, 2025, 2026];

  // Generate players for each team (roughly 53 per team, but we'll track injuries for about 25-30 per team per season)
  const playersPerTeamPerSeason = 28;
  const injuryRatePerPlayer = 0.35; // 35% chance a player has an injury in a season

  // Auxiliary mock pools for new fields (use normalized tokens for consistent filtering)
  const mechanisms = ["contact", "non-contact", "overuse", "unknown"];
  const contactTypes = ["player-contact", "ground-contact", "equipment-contact", "no-contact"];
  const seasonTypes = ["Regular", "Pre-season", "Post-season", "Off-season"];
  const bodyParts = ["Head","Neck","Shoulder","Arm","Elbow","Wrist","Hand","Back","Hip","Groin","Quad","Hamstring","Knee","Ankle","Foot"];
  const participationReasons = ["In-game contact","Training incident","Non-contact strain","Overuse","Illness","Other"];
  const rosterStatuses: RosterStatus[] = ["Active", "Injured Reserve", "Practice Squad", "Physically Unable to Perform", "Non-Football Injury", "Released"];
  const sides = ["Left", "Right", "Midline", "Head"];
  const clinicalImpressions = [
    "Ear Staph Infection - MRSA",
    "Elbow Abrasion",
    "Elbow Fracture/Humerus/Epiphyseal",
    "Knee Concussion",
    "Shoulder Strain",
    "Ankle Sprain",
    "Hamstring Strain",
    "ACL Tear Anterior",
    "Concussion",
    "Lower Back Strain",
    "Hip Flexor Strain",
    "Quad Contusion",
    "MCL Sprain",
    "Other Injuries"
  ];
  seasons.forEach(season => {
    NFL_TEAMS.forEach(team => {
      const numInjuries = Math.floor(playersPerTeamPerSeason * injuryRatePerPlayer) + Math.floor(Math.random() * 5);
      
      for (let i = 0; i < numInjuries; i++) {
        const position = getRandomItem(POSITIONS);
        const positionGroup = POSITION_GROUPS[position as keyof typeof POSITION_GROUPS];
        const playerName = generatePlayerName();
        const playerId = `${team.abbreviation}-${season}-P${i}`;
        
        // Determine injury type with weighted distribution
        const injuryTypes: InjuryType[] = ["Concussion", "Shoulder", "LEX Sprain", "LEX Strain", "ACL", "Hamstring", "Ankle", "High Ankle Sprain", "Lateral Ankle Sprain", "Knee", "Back", "Foot", "Hand", "Quad", "Hip", "Groin"];
        const injuryWeights = [0.15, 0.12, 0.08, 0.08, 0.05, 0.15, 0.06, 0.03, 0.03, 0.08, 0.06, 0.04, 0.03, 0.02, 0.01, 0.01];
        
        let rand = Math.random();
        let injuryType: InjuryType = "Ankle";
        let cumulativeWeight = 0;
        
        for (let j = 0; j < injuryTypes.length; j++) {
          cumulativeWeight += injuryWeights[j];
          if (rand <= cumulativeWeight) {
            injuryType = injuryTypes[j];
            break;
          }
        }
        
        const severity = getWeightedSeverity();
        const week = Math.floor(Math.random() * 18) + 1; // Weeks 1-18
        const injuryDate = getRandomDate(season, week - 1, week);
        
        // Calculate recovery time based on injury type and severity
        const profile = injuryRecoveryProfiles[injuryType];
        const baseDays = profile.severityWeight[severity];
        const variation = Math.floor(Math.random() * 14) - 7; // +/- 7 days variation
        const daysOut = Math.max(profile.minDays, Math.min(profile.maxDays, baseDays + variation));
        
        // Determine if player has returned
        const today = new Date();
        const expectedReturnDate = new Date(injuryDate.getTime() + daysOut * 24 * 60 * 60 * 1000);
        const hasReturned = expectedReturnDate < today && Math.random() > 0.15; // 85% actually return on time
        
        let returnDate: Date | null = null;
        let status: InjuryStatus = "Out";
        
        if (hasReturned) {
          // Add some variation to actual return date
          const returnVariation = Math.floor(Math.random() * 7) - 3; // +/- 3 days
          returnDate = new Date(expectedReturnDate.getTime() + returnVariation * 24 * 60 * 60 * 1000);
          status = "Recovered";
        } else if (expectedReturnDate < today) {
          // Injury is overdue, might be limited
          status = Math.random() > 0.5 ? "Limited" : "Out";
        } else {
          status = "Out";
        }
        
        // Session type distribution (most injuries in games and practice)
        const sessionTypes: SessionType[] = ["Games", "Practice", "Conditioning", "Recovery", "Strength Training", "Film Study"];
        const sessionWeights = [0.45, 0.35, 0.10, 0.03, 0.05, 0.02];
        
        rand = Math.random();
        cumulativeWeight = 0;
        let sessionTypeAtInjury: SessionType = "Practice";
        
        for (let j = 0; j < sessionTypes.length; j++) {
          cumulativeWeight += sessionWeights[j];
          if (rand <= cumulativeWeight) {
            sessionTypeAtInjury = sessionTypes[j];
            break;
          }
        }
        
        const isRecurring = Math.random() < 0.15; // 15% are recurring injuries
        // Derive additional fields
        const weekTypeName = week >= 18 ? "Playoffs" : "Regular Season";
        const gameweek = `${season} Week ${week}`;
        const opponent = NFL_TEAMS.filter(t => t.id !== team.id)[Math.floor(Math.random() * (NFL_TEAMS.length - 1))];
        const gameName = `Week ${week} vs ${opponent.abbreviation}`;
        const mechanismOfInjury = getRandomItem(mechanisms);
        const contactTypeCategory = mechanismOfInjury === "contact" ? getRandomItem(contactTypes) : "no-contact";
        const seasonType = getRandomItem(seasonTypes);
        const teamActivity = sessionTypeAtInjury === "Games" ? "Game" : sessionTypeAtInjury === "Practice" ? "Practice" : (sessionTypeAtInjury === "Conditioning" ? "Conditioning" : "Training");
        const missedTimeInjury = daysOut > 3;
        const missedGameInjury = sessionTypeAtInjury === "Games" && daysOut > 0;
        const missedPracticeInjury = sessionTypeAtInjury === "Practice" && daysOut > 0;
        const bodyPart = getRandomItem(bodyParts);
        const positionAtTimeOfInjury = getRandomItem(POSITIONS);
        const participationReason = getRandomItem(participationReasons);
        const isPastPlayer = Math.random() < 0.12; // ~12% are past players
        const currentRosterStatus = status === "Recovered" ? (Math.random() < 0.9 ? "Active" : "Practice Squad") : 
                                     (status === "Out" && daysOut > 21 ? "Injured Reserve" : "Active");
        const side = getRandomItem(sides);
        const clinicalImpression = getRandomItem(clinicalImpressions);
        const missedGames = Math.floor(daysOut / 7); // Roughly 1 game per week

        records.push({
          id: `INJ-${recordId++}`,
          playerId,
          playerName,
          teamId: team.id,
          teamName: team.name,
          teamAbbr: team.abbreviation,
          position,
          positionGroup,
          rosterPosition: position,
          injuryType,
          gameweek,
          weekTypeName,
          game: gameName,
          selectGame: gameName, // Alias for PHS dashboard
          mechanismOfInjury,
          contactTypeCategory,
          seasonType,
          teamActivity,
          injuryDate,
          returnDate,
          expectedReturnDate,
          daysOut,
          status,
          severity,
          sessionTypeAtInjury,
          season,
          week,
          description: `${severity} ${injuryType} injury`,
          isRecurring,
          missedTimeInjury,
          missedGameInjury,
          missedPracticeInjury,
          bodyPart,
          positionAtTimeOfInjury,
          participationReason,
          isPastPlayer,
          currentRosterStatus,
          side,
          clinicalImpression,
          missedGames,
        });
      }
    });
  });

  return records;
}

// Generate the dataset
export const INJURY_RECORDS = generateInjuryRecords();

// ==========================================
// ACTIVITY LOG TYPES & GENERATION
// ==========================================

export interface ActivityLogEntry {
  id: string;
  playerId: string;
  playerName: string;
  position: string;
  reason: string; // Derived from injury type
  bodyPart: string;
  injuryType: InjuryType;
  injuryCategory: string; // Same as injuryType for display
  clinicalImpression: string;
  activityDate: Date;
  event: "Game" | "Practice";
  season: number;
  teamId: number;
  teamName: string;
  teamAbbr: string;
  // Include filter fields from parent injury
  game?: string;
  selectGame?: string;
  mechanismOfInjury?: string;
  contactTypeCategory?: string;
  seasonType?: string;
  week?: number;
  positionAtTimeOfInjury?: string;
  rosterPosition?: string;
  currentRosterStatus?: string;
  teamActivity?: string;
  missedTimeInjury?: boolean;
  missedGameInjury?: boolean;
  missedPracticeInjury?: boolean;
}

// Generate activity log entries from injury records (with performance limits)
function generateActivityLogFromInjuries(): ActivityLogEntry[] {
  const activityLog: ActivityLogEntry[] = [];
  let entryId = 1;
  
  INJURY_RECORDS.forEach(injury => {
    if (injury.daysOut <= 0) return; // Skip injuries with no missed time
    
    const missedGames = Math.min(injury.missedGames || 0, 17); // Cap at 17 games (full season)
    const practicesPerWeek = 5;
    const daysPerWeek = 7;
    const weeksOut = injury.daysOut / daysPerWeek;
    const estimatedMissedPractices = Math.min(Math.floor(weeksOut * practicesPerWeek), 50); // Cap at 50 practices
    
    // Determine the reason based on injury type
    const reason = `${injury.injuryType}${injury.bodyPart ? ' - ' + injury.bodyPart : ''}`;
    
    let currentDate = new Date(injury.injuryDate);
    const dayInMs = 24 * 60 * 60 * 1000;
    
    // Generate missed games entries
    for (let i = 0; i < missedGames; i++) {
      // Games typically happen weekly (increment by 7 days)
      const gameDate = new Date(currentDate.getTime() + (i * 7 * dayInMs));
      
      activityLog.push({
        id: `AL-${entryId++}`,
        playerId: injury.playerId,
        playerName: injury.playerName,
        position: injury.position,
        reason: reason,
        bodyPart: injury.bodyPart || "Unknown",
        injuryType: injury.injuryType,
        injuryCategory: injury.injuryType,
        clinicalImpression: injury.clinicalImpression || "N/A",
        activityDate: gameDate,
        event: "Game",
        season: injury.season,
        teamId: injury.teamId,
        teamName: injury.teamName,
        teamAbbr: injury.teamAbbr,
        // Include filter fields
        game: injury.game,
        selectGame: injury.selectGame,
        mechanismOfInjury: injury.mechanismOfInjury,
        contactTypeCategory: injury.contactTypeCategory,
        seasonType: injury.seasonType,
        week: injury.week,
        positionAtTimeOfInjury: injury.positionAtTimeOfInjury,
        rosterPosition: injury.rosterPosition,
        currentRosterStatus: injury.currentRosterStatus,
        teamActivity: injury.teamActivity,
        missedTimeInjury: injury.missedTimeInjury,
        missedGameInjury: injury.missedGameInjury,
        missedPracticeInjury: injury.missedPracticeInjury,
      });
    }
    
    // Generate missed practices entries
    // Distribute practices between games (practice days: Mon-Fri typically)
    let practiceCount = 0;
    let dayOffset = 1; // Start day after injury
    
    while (practiceCount < estimatedMissedPractices && dayOffset <= injury.daysOut) {
      const practiceDate = new Date(currentDate.getTime() + (dayOffset * dayInMs));
      const dayOfWeek = practiceDate.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Skip weekends (assume no practices on Sun=0, Sat=6)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        activityLog.push({
          id: `AL-${entryId++}`,
          playerId: injury.playerId,
          playerName: injury.playerName,
          position: injury.position,
          reason: reason,
          bodyPart: injury.bodyPart || "Unknown",
          injuryType: injury.injuryType,
          injuryCategory: injury.injuryType,
          clinicalImpression: injury.clinicalImpression || "N/A",
          activityDate: practiceDate,
          event: "Practice",
          season: injury.season,
          teamId: injury.teamId,
          teamName: injury.teamName,
          teamAbbr: injury.teamAbbr,
          // Include filter fields
          game: injury.game,
          selectGame: injury.selectGame,
          mechanismOfInjury: injury.mechanismOfInjury,
          contactTypeCategory: injury.contactTypeCategory,
          seasonType: injury.seasonType,
          week: injury.week,
          positionAtTimeOfInjury: injury.positionAtTimeOfInjury,
          rosterPosition: injury.rosterPosition,
          currentRosterStatus: injury.currentRosterStatus,
          teamActivity: injury.teamActivity,
          missedTimeInjury: injury.missedTimeInjury,
          missedGameInjury: injury.missedGameInjury,
          missedPracticeInjury: injury.missedPracticeInjury,
        });
        practiceCount++;
      }
      dayOffset++;
    }
  });
  
  return activityLog;
}

// Generate activity log entries (lazy loaded)
let _activityLogCache: ActivityLogEntry[] | null = null;
export function getActivityLogEntries(): ActivityLogEntry[] {
  if (!_activityLogCache) {
    _activityLogCache = generateActivityLogFromInjuries();
  }
  return _activityLogCache;
}

// Export for backwards compatibility
export const ACTIVITY_LOG_ENTRIES = getActivityLogEntries();

// ==========================================
// PLAYER DEMOGRAPHICS
// ==========================================

export interface PlayerDemographics {
  playerName: string;
  dateOfBirth: Date;
  age: number;
  height: string; // Format: "6-2" (feet-inches)
  weight: number; // in pounds
  college: string;
  yearsInLeague: number;
  teamAbbr: string;
  position: string;
}

// Generate demographics for unique players
function generatePlayerDemographics(): Map<string, PlayerDemographics> {
  const demographicsMap = new Map<string, PlayerDemographics>();
  const colleges = [
    "Alabama", "Ohio State", "Georgia", "LSU", "Clemson", "Michigan", "Oklahoma", "Texas", "USC", "Florida",
    "Florida State", "Penn State", "Notre Dame", "Oregon", "Auburn", "Texas A&M", "Miami", "Tennessee",
    "Wisconsin", "Stanford", "Washington", "Iowa", "Nebraska", "UCLA", "North Carolina", "Virginia Tech"
  ];

  // Get unique players from injury records
  const uniquePlayers = new Map<string, { teamAbbr: string; position: string }>();
  INJURY_RECORDS.forEach(record => {
    if (!uniquePlayers.has(record.playerName)) {
      uniquePlayers.set(record.playerName, {
        teamAbbr: record.teamAbbr,
        position: record.position
      });
    }
  });

  // Generate demographics for each unique player
  uniquePlayers.forEach((info, playerName) => {
    // Age between 22-35 years old (typical NFL range)
    const age = 22 + Math.floor(Math.random() * 14);
    const birthYear = new Date().getFullYear() - age;
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const dateOfBirth = new Date(birthYear, birthMonth, birthDay);

    // Height between 5'8" and 6'7" (typical NFL range)
    const heightInInches = 68 + Math.floor(Math.random() * 15); // 68-82 inches
    const feet = Math.floor(heightInInches / 12);
    const inches = heightInInches % 12;
    const height = `${feet}-${inches}`;

    // Weight based on position (approximate ranges)
    let weightRange = { min: 180, max: 220 }; // Default for skill positions
    const positionGroup = info.position;
    if (["QB"].includes(positionGroup)) weightRange = { min: 210, max: 245 };
    else if (["RB", "DB", "CB", "S"].includes(positionGroup)) weightRange = { min: 180, max: 220 };
    else if (["WR", "TE"].includes(positionGroup)) weightRange = { min: 190, max: 250 };
    else if (["LB"].includes(positionGroup)) weightRange = { min: 230, max: 260 };
    else if (["DL", "OL"].includes(positionGroup)) weightRange = { min: 280, max: 330 };
    
    const weight = weightRange.min + Math.floor(Math.random() * (weightRange.max - weightRange.min));

    // Years in league (1-15 years, weighted toward fewer years)
    const yearsInLeague = Math.min(15, Math.floor(Math.random() * Math.random() * 20) + 1);

    const college = colleges[Math.floor(Math.random() * colleges.length)];

    demographicsMap.set(playerName, {
      playerName,
      dateOfBirth,
      age,
      height,
      weight,
      college,
      yearsInLeague,
      teamAbbr: info.teamAbbr,
      position: info.position
    });
  });

  return demographicsMap;
}

export const PLAYER_DEMOGRAPHICS = generatePlayerDemographics();

// Helper to get player demographics
export function getPlayerDemographics(playerName: string): PlayerDemographics | undefined {
  return PLAYER_DEMOGRAPHICS.get(playerName);
}

// Helper functions to query the data
export function getInjuriesByTeam(teamId: number): InjuryRecord[] {
  return INJURY_RECORDS.filter(record => record.teamId === teamId);
}

export function getInjuriesBySeason(season: number): InjuryRecord[] {
  return INJURY_RECORDS.filter(record => record.season === season);
}

export function getInjuriesByType(injuryType: InjuryType): InjuryRecord[] {
  return INJURY_RECORDS.filter(record => record.injuryType === injuryType);
}

export function getInjuriesByStatus(status: InjuryStatus): InjuryRecord[] {
  return INJURY_RECORDS.filter(record => record.status === status);
}

export function getInjuriesByDateRange(startDate: Date, endDate: Date): InjuryRecord[] {
  return INJURY_RECORDS.filter(record => 
    record.injuryDate >= startDate && record.injuryDate <= endDate
  );
}

export function getInjuriesBySessionType(sessionType: SessionType): InjuryRecord[] {
  return INJURY_RECORDS.filter(record => record.sessionTypeAtInjury === sessionType);
}

export function getInjuriesByPosition(position: string): InjuryRecord[] {
  return INJURY_RECORDS.filter(record => record.position === position);
}

export function getInjuriesByPositionGroup(positionGroup: string): InjuryRecord[] {
  return INJURY_RECORDS.filter(record => record.positionGroup === positionGroup);
}

// PHS Dashboard-specific helper functions

export interface InjuryCountByType {
  injuryType: string;
  count: number;
  currentPeriod?: number;
  previousPeriod?: number;
}

export function getInjuryCountsByType(records: InjuryRecord[]): InjuryCountByType[] {
  const counts = new Map<string, number>();
  
  records.forEach(record => {
    const type = record.injuryType;
    counts.set(type, (counts.get(type) || 0) + 1);
  });
  
  return Array.from(counts.entries()).map(([injuryType, count]) => ({
    injuryType,
    count,
  }));
}

export interface YoYComparisonData {
  category: string;
  currentPeriod: number;
  previousPeriod: number;
}

export function aggregateInjuriesByBodyPartYoY(
  currentSeasonRecords: InjuryRecord[],
  previousSeasonRecords: InjuryRecord[]
): YoYComparisonData[] {
  const currentCounts = new Map<string, number>();
  const previousCounts = new Map<string, number>();
  
  currentSeasonRecords.forEach(record => {
    if (record.bodyPart) {
      currentCounts.set(record.bodyPart, (currentCounts.get(record.bodyPart) || 0) + 1);
    }
  });
  
  previousSeasonRecords.forEach(record => {
    if (record.bodyPart) {
      previousCounts.set(record.bodyPart, (previousCounts.get(record.bodyPart) || 0) + 1);
    }
  });
  
  // Get all unique body parts
  const allBodyParts = new Set([...currentCounts.keys(), ...previousCounts.keys()]);
  
  return Array.from(allBodyParts).map(bodyPart => ({
    category: bodyPart,
    currentPeriod: currentCounts.get(bodyPart) || 0,
    previousPeriod: previousCounts.get(bodyPart) || 0,
  })).sort((a, b) => (b.currentPeriod + b.previousPeriod) - (a.currentPeriod + a.previousPeriod));
}

export function aggregateDaysMissedByBodyPartYoY(
  currentSeasonRecords: InjuryRecord[],
  previousSeasonRecords: InjuryRecord[]
): YoYComparisonData[] {
  const currentDays = new Map<string, number>();
  const previousDays = new Map<string, number>();
  
  currentSeasonRecords.forEach(record => {
    if (record.bodyPart) {
      currentDays.set(record.bodyPart, (currentDays.get(record.bodyPart) || 0) + record.daysOut);
    }
  });
  
  previousSeasonRecords.forEach(record => {
    if (record.bodyPart) {
      previousDays.set(record.bodyPart, (previousDays.get(record.bodyPart) || 0) + record.daysOut);
    }
  });
  
  const allBodyParts = new Set([...currentDays.keys(), ...previousDays.keys()]);
  
  return Array.from(allBodyParts).map(bodyPart => ({
    category: bodyPart,
    currentPeriod: currentDays.get(bodyPart) || 0,
    previousPeriod: previousDays.get(bodyPart) || 0,
  })).sort((a, b) => (b.currentPeriod + b.previousPeriod) - (a.currentPeriod + a.previousPeriod));
}

export interface InjuryClassificationRow {
  teamActivity: string;
  [bodyPart: string]: string | number;
  Total: number;
}

export function aggregateInjuryClassificationMatrix(records: InjuryRecord[]): InjuryClassificationRow[] {
  // Get unique team activities and body parts
  const teamActivities = new Set<string>();
  const bodyParts = new Set<string>();
  
  records.forEach(record => {
    if (record.teamActivity) teamActivities.add(record.teamActivity);
    if (record.bodyPart) bodyParts.add(record.bodyPart);
  });
  
  // Create matrix
  const matrix: InjuryClassificationRow[] = [];
  const bodyPartArray = Array.from(bodyParts).sort();
  
  teamActivities.forEach(activity => {
    const row: InjuryClassificationRow = {
      teamActivity: activity,
      Total: 0,
    };
    
    bodyPartArray.forEach(bodyPart => {
      const count = records.filter(
        r => r.teamActivity === activity && r.bodyPart === bodyPart
      ).length;
      row[bodyPart] = count;
      row.Total += count;
    });
    
    matrix.push(row);
  });
  
  // Add total row
  const totalRow: InjuryClassificationRow = {
    teamActivity: "Total",
    Total: records.length,
  };
  
  bodyPartArray.forEach(bodyPart => {
    const count = records.filter(r => r.bodyPart === bodyPart).length;
    totalRow[bodyPart] = count;
  });
  
  matrix.push(totalRow);
  
  return matrix;
}
// ==========================================
// PLAYER-SPECIFIC AGGREGATION FUNCTIONS
// ==========================================

// Aggregate injuries by player by season
export function aggregateInjuriesByPlayerBySeason(playerName: string, filteredRecords?: InjuryRecord[]): Array<{ season: number; count: number }> {
  const records = filteredRecords || INJURY_RECORDS;
  const playerRecords = records.filter(r => r.playerName === playerName);
  
  const seasonMap = new Map<number, number>();
  playerRecords.forEach(record => {
    seasonMap.set(record.season, (seasonMap.get(record.season) || 0) + 1);
  });
  
  const result = Array.from(seasonMap.entries())
    .map(([season, count]) => ({ season, count }))
    .sort((a, b) => a.season - b.season);
  
  return result;
}

// Aggregate missed days by player over time (for trend chart)
export function aggregateMissedDaysByPlayerOverTime(playerName: string, filteredRecords?: InjuryRecord[]): Array<{ date: Date; days: number; season: number }> {
  const records = filteredRecords || INJURY_RECORDS;
  const playerRecords = records.filter(r => r.playerName === playerName);
  
  const result = playerRecords
    .map(record => ({
      date: record.injuryDate,
      days: record.daysOut,
      season: record.season
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return result;
}

// Aggregate missed games by player over time (for trend chart)
export function aggregateMissedGamesByPlayerOverTime(playerName: string, filteredRecords?: InjuryRecord[]): Array<{ date: Date; games: number; season: number }> {
  const records = filteredRecords || INJURY_RECORDS;
  const playerRecords = records.filter(r => r.playerName === playerName);
  
  const result = playerRecords
    .map(record => ({
      date: record.injuryDate,
      games: record.missedGames || 0,
      season: record.season
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return result;
}

// Aggregate missed practices by player over time (for trend chart)
export function aggregateMissedPracticesByPlayerOverTime(playerName: string, filteredRecords?: InjuryRecord[]): Array<{ date: Date; practices: number; season: number }> {
  const records = filteredRecords || INJURY_RECORDS;
  const playerRecords = records.filter(r => r.playerName === playerName);
  
  // Estimate missed practices based on days out (approximately 5 practices per week)
  const result = playerRecords
    .map(record => {
      const weeksOut = record.daysOut / 7;
      const practices = Math.floor(weeksOut * 5);
      return {
        date: record.injuryDate,
        practices,
        season: record.season
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return result;
}

// Get player major stats (injury type counts)
export function getPlayerMajorStats(playerName: string, filteredRecords?: InjuryRecord[]): {
  totalInjuries: number;
  missedGames: number;
  missedPractices: number;
  lexStrains: number;
  acl: number;
  concussions: number;
  lateralAnkleSprain: number;
  highAnkleSprain: number;
  shoulderAndClavicle: number;
} {
  const records = filteredRecords || INJURY_RECORDS;
  const playerRecords = records.filter(r => r.playerName === playerName);
  
  const stats = {
    totalInjuries: playerRecords.length,
    missedGames: playerRecords.reduce((sum, r) => sum + (r.missedGames || 0), 0),
    missedPractices: playerRecords.reduce((sum, r) => {
      const weeksOut = r.daysOut / 7;
      return sum + Math.floor(weeksOut * 5);
    }, 0),
    lexStrains: playerRecords.filter(r => r.injuryType === "LEX Strain").length,
    acl: playerRecords.filter(r => r.injuryType === "ACL").length,
    concussions: playerRecords.filter(r => r.injuryType === "Concussion").length,
    lateralAnkleSprain: playerRecords.filter(r => r.injuryType === "Lateral Ankle Sprain").length,
    highAnkleSprain: playerRecords.filter(r => r.injuryType === "High Ankle Sprain").length,
    shoulderAndClavicle: playerRecords.filter(r => r.injuryType === "Shoulder").length,
  };
  
  return stats;
}

// Get player injury records (for table display)
export function getPlayerInjuryRecords(playerName: string, filteredRecords?: InjuryRecord[]): InjuryRecord[] {
  const records = filteredRecords || INJURY_RECORDS;
  return records
    .filter(r => r.playerName === playerName)
    .sort((a, b) => b.injuryDate.getTime() - a.injuryDate.getTime()); // Most recent first
}

// Get player activity log (for Missed Activity Log table)
export function getPlayerActivityLog(playerName: string, filteredEntries?: ActivityLogEntry[]): ActivityLogEntry[] {
  const entries = filteredEntries || ACTIVITY_LOG_ENTRIES;
  return entries
    .filter(e => e.playerName === playerName)
    .sort((a, b) => b.activityDate.getTime() - a.activityDate.getTime()); // Most recent first
}