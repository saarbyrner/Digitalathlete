/**
 * Rehab Session Data Generator
 * 
 * Creates synthetic rehab session data linked to INJURY_RECORDS.
 * This enables filtering of modality/exercise charts by player, injury type, etc.
 */

import { INJURY_RECORDS, InjuryRecord } from "./mockInjuryData";

// ==========================================
// TYPES
// ==========================================

export interface RehabModalities {
  heatPack: number;
  ultrasound: number;
  coldPack: number;
  massage: number;
  acupuncture: number;
}

export interface RehabExercises {
  frontSquat: number;
  pushUps: number;
  ohDumbbellPress: number;
  plank: number;
  romanianDeadlifts: number;
}

export interface RehabSession {
  id: string;
  playerId: string;
  playerName: string;
  injuryId: string;
  injuryType: string;
  bodyPart: string;
  date: Date;
  sessionType: "rehab" | "maintenance";
  season: number;
  modalities: RehabModalities;
  exercises: RehabExercises;
  bodyPartsWorked: string[];
  exerciseMinutes: number;
  status: string; // From injury record
  mechanismOfInjury: string; // From injury record
  week: number; // NFL week (0=preseason, 1-18=regular, 19+=postseason)
  seasonType: string; // "Preseason" | "Regular Season" | "Postseason"
  daysOutSoFar: number; // Days into injury at time of this session
  team: string; // From injury record
}

// ==========================================
// GENERATOR HELPERS
// ==========================================

/**
 * Get modality weights based on body part and injury type
 */
function getModalityWeights(bodyPart: string, injuryType: string): RehabModalities {
  const baseWeights: RehabModalities = {
    heatPack: 0.3,
    ultrasound: 0.2,
    coldPack: 0.25,
    massage: 0.15,
    acupuncture: 0.1,
  };

  // Adjust based on body part
  if (["Ankle", "Knee", "Foot"].includes(bodyPart)) {
    baseWeights.coldPack = 0.4;
    baseWeights.ultrasound = 0.3;
  } else if (["Shoulder", "Back", "Neck"].includes(bodyPart)) {
    baseWeights.heatPack = 0.4;
    baseWeights.massage = 0.3;
  } else if (["Hip", "Groin", "Quad", "Hamstring"].includes(bodyPart)) {
    baseWeights.massage = 0.35;
    baseWeights.heatPack = 0.35;
  }

  // Special adjustments for injury types
  if (injuryType === "Concussion") {
    return { heatPack: 0, ultrasound: 0, coldPack: 0.2, massage: 0.3, acupuncture: 0.5 };
  }

  return baseWeights;
}

/**
 * Get exercise weights based on body part
 */
function getExerciseWeights(bodyPart: string): RehabExercises {
  const baseWeights: RehabExercises = {
    frontSquat: 0.2,
    pushUps: 0.2,
    ohDumbbellPress: 0.2,
    plank: 0.2,
    romanianDeadlifts: 0.2,
  };

  // Lower body focused
  if (["Ankle", "Knee", "Foot", "Hip", "Quad", "Hamstring", "Groin"].includes(bodyPart)) {
    return {
      frontSquat: 0.3,
      pushUps: 0.05,
      ohDumbbellPress: 0.05,
      plank: 0.25,
      romanianDeadlifts: 0.35,
    };
  }

  // Upper body focused
  if (["Shoulder", "Arm", "Elbow", "Wrist", "Hand"].includes(bodyPart)) {
    return {
      frontSquat: 0.05,
      pushUps: 0.35,
      ohDumbbellPress: 0.35,
      plank: 0.2,
      romanianDeadlifts: 0.05,
    };
  }

  // Core/Back focused
  if (["Back", "Neck"].includes(bodyPart)) {
    return {
      frontSquat: 0.1,
      pushUps: 0.15,
      ohDumbbellPress: 0.1,
      plank: 0.5,
      romanianDeadlifts: 0.15,
    };
  }

  return baseWeights;
}

/**
 * Get related body parts for an injury
 */
function getRelatedBodyParts(bodyPart: string): string[] {
  const relatedParts: Record<string, string[]> = {
    Ankle: ["Ankle", "Foot", "Knee"],
    Knee: ["Knee", "Quad", "Hamstring"],
    Hip: ["Hip", "Groin", "Back"],
    Shoulder: ["Shoulder", "Neck", "Back"],
    Back: ["Back", "Hip", "Neck"],
    Hamstring: ["Hamstring", "Knee", "Hip"],
    Quad: ["Quad", "Knee", "Hip"],
    Groin: ["Groin", "Hip", "Quad"],
    Foot: ["Foot", "Ankle"],
    Hand: ["Hand", "Wrist", "Elbow"],
    Elbow: ["Elbow", "Shoulder", "Wrist"],
    Wrist: ["Wrist", "Hand", "Elbow"],
    Neck: ["Neck", "Shoulder", "Back"],
    Head: ["Head", "Neck"],
  };

  return relatedParts[bodyPart] || [bodyPart];
}

/**
 * Generate random value using weight as probability multiplier
 */
function generateWeightedValue(weight: number, maxValue: number = 5): number {
  // Reduced skip probability from 1.5 to 0.8 for denser data
  if (Math.random() > weight * 0.8) return 0; // Skip based on weight
  return Math.floor(Math.random() * maxValue * weight) + (weight > 0.2 ? 1 : 0);
}

/**
 * Calculate NFL week from date and season
 * Returns: 0 for preseason, 1-18 for regular season, 19+ for postseason
 */
function calculateWeek(date: Date, season: number): number {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  
  // Preseason: August
  if (month === 7) return 0;
  
  // Regular season: Sept (week 1) through early Jan (week 18)
  // Approximate: Sept 1 = week 1, each ~7 days = 1 week
  if (month >= 8 && month <= 11) {
    const dayOfMonth = date.getDate();
    if (month === 8) return Math.min(Math.floor((dayOfMonth - 1) / 7) + 1, 4); // Sept: weeks 1-4
    if (month === 9) return Math.min(Math.floor((dayOfMonth - 1) / 7) + 5, 8); // Oct: weeks 5-8
    if (month === 10) return Math.min(Math.floor((dayOfMonth - 1) / 7) + 9, 13); // Nov: weeks 9-13
    if (month === 11) return Math.min(Math.floor((dayOfMonth - 1) / 7) + 14, 18); // Dec: weeks 14-18
  }
  
  // Postseason: January onward
  if (month >= 0 && month <= 1) {
    return 19 + Math.floor(date.getDate() / 7); // Weeks 19-22
  }
  
  // Off-season
  return 0;
}

/**
 * Calculate season type from date
 */
function calculateSeasonType(date: Date): string {
  const month = date.getMonth(); // 0-11
  
  if (month === 7) return "Preseason";
  if (month >= 8 && month <= 11) return "Regular Season";
  if (month >= 0 && month <= 1) return "Postseason";
  
  return "Off-Season";
}

/**
 * Generate a single rehab session for an injury
 */
function generateSession(
  injury: InjuryRecord,
  sessionIndex: number,
  totalSessions: number,
  sessionDate: Date
): RehabSession {
  const bodyPart = injury.bodyPart || injury.injuryType;
  const modalityWeights = getModalityWeights(bodyPart, injury.injuryType);
  const exerciseWeights = getExerciseWeights(bodyPart);

  // Earlier sessions are more rehab-focused, later sessions more maintenance
  const rehabProbability = 1 - (sessionIndex / totalSessions) * 0.7;
  const sessionType: "rehab" | "maintenance" = Math.random() < rehabProbability ? "rehab" : "maintenance";

  // Generate modality values
  const modalities: RehabModalities = {
    heatPack: generateWeightedValue(modalityWeights.heatPack, 5),
    ultrasound: generateWeightedValue(modalityWeights.ultrasound, 4),
    coldPack: generateWeightedValue(modalityWeights.coldPack, 4),
    massage: generateWeightedValue(modalityWeights.massage, 4),
    acupuncture: generateWeightedValue(modalityWeights.acupuncture, 5),
  };

  // Generate exercise values - more exercises in maintenance phase
  const exerciseMultiplier = sessionType === "maintenance" ? 1.5 : 1;
  const exercises: RehabExercises = {
    frontSquat: generateWeightedValue(exerciseWeights.frontSquat * exerciseMultiplier, 6),
    pushUps: generateWeightedValue(exerciseWeights.pushUps * exerciseMultiplier, 6),
    ohDumbbellPress: generateWeightedValue(exerciseWeights.ohDumbbellPress * exerciseMultiplier, 6),
    plank: generateWeightedValue(exerciseWeights.plank * exerciseMultiplier, 6),
    romanianDeadlifts: generateWeightedValue(exerciseWeights.romanianDeadlifts * exerciseMultiplier, 6),
  };

  // Calculate exercise minutes based on total exercise count
  const totalExercises = Object.values(exercises).reduce((sum, val) => sum + val, 0);
  const exerciseMinutes = totalExercises * (5 + Math.floor(Math.random() * 10));

  // Get body parts worked in this session
  const relatedParts = getRelatedBodyParts(bodyPart);
  const bodyPartsWorked = relatedParts.filter(() => Math.random() > 0.3);
  if (bodyPartsWorked.length === 0) bodyPartsWorked.push(bodyPart);

  // Calculate days into injury at time of this session
  const daysSinceInjury = Math.floor((sessionDate.getTime() - injury.injuryDate.getTime()) / (24 * 60 * 60 * 1000));

  return {
    id: `RS-${injury.id}-${sessionIndex}`,
    playerId: injury.playerId,
    playerName: injury.playerName,
    injuryId: injury.id,
    injuryType: injury.injuryType,
    bodyPart,
    date: sessionDate,
    sessionType,
    season: injury.season,
    modalities,
    exercises,
    bodyPartsWorked,
    exerciseMinutes,
    status: injury.status,
    mechanismOfInjury: injury.mechanismOfInjury || "Unknown",
    week: calculateWeek(sessionDate, injury.season),
    seasonType: calculateSeasonType(sessionDate),
    daysOutSoFar: daysSinceInjury,
    team: injury.teamName,
  };
}

/**
 * Generate all rehab sessions from injury records
 */
function generateRehabSessions(): RehabSession[] {
  const sessions: RehabSession[] = [];
  const today = new Date();

  // Generate sessions for ALL injuries to ensure rich data across all filters
  // This provides better user experience with meaningful data in all tabs
  const relevantInjuries = INJURY_RECORDS;

  relevantInjuries.forEach((injury) => {
    // Calculate number of sessions based on days out - increased for richer data
    const minSessions = 10;
    const maxSessions = Math.min(40, Math.floor(injury.daysOut / 2) + 10);
    const numSessions = minSessions + Math.floor(Math.random() * (maxSessions - minSessions));

    // Generate session dates spread across recovery period
    const startDate = injury.injuryDate;
    const endDate = injury.returnDate || injury.expectedReturnDate || new Date(
      startDate.getTime() + injury.daysOut * 24 * 60 * 60 * 1000
    );

    const dateRange = endDate.getTime() - startDate.getTime();
    const sessionInterval = dateRange / (numSessions + 1);

    for (let i = 0; i < numSessions; i++) {
      // Add some randomness to session timing
      const baseTime = startDate.getTime() + sessionInterval * (i + 1);
      const jitter = (Math.random() - 0.5) * sessionInterval * 0.5;
      const sessionDate = new Date(baseTime + jitter);

      // Don't generate future sessions
      if (sessionDate > today) continue;

      sessions.push(generateSession(injury, i, numSessions, sessionDate));
    }
  });

  return sessions;
}

// ==========================================
// AGGREGATION FUNCTIONS
// ==========================================

export interface DonutDataPoint {
  name: string;
  value: number;
}

export interface DaysLostByInjuryPoint {
  injury: string;
  days: number;
}

export interface DaysLostByPlayerPoint {
  player: string;
  "Rehab sessions": number;
  "Maintenance sessions": number;
  total: number;
}

export interface ModalityVsExercisePoint {
  date?: string;
  player?: string;
  "Heat pack": number;
  Ultrasound: number;
  "Cold Pack": number;
  Massage: number;
  Acupuncture: number;
  "Exercise minutes": number;
}

export interface ExerciseDataPoint {
  date?: string;
  player?: string;
  "Front squat": number;
  "Push-ups": number;
  "OH dumbbell press": number;
  Plank: number;
  "Romanian deadlifts": number;
}

export interface BodyPartDataPoint {
  date?: string;
  player?: string;
  [bodyPart: string]: string | number | undefined;
}

export interface SessionTypeDataPoint {
  player: string;
  "Rehab sessions": number;
  "Maintenance sessions": number;
  total?: number;
}

export interface InjurySessionTypePoint {
  "Injury category": string;
  "Rehab sessions": number;
  "Maintenance sessions": number;
}

/**
 * Aggregate sessions into donut chart data
 */
export function aggregateDonutData(
  sessions: RehabSession[],
  type: "total" | "rehab" | "maintenance" = "total"
): DonutDataPoint[] {
  let filtered = sessions;
  if (type === "rehab") {
    filtered = sessions.filter((s) => s.sessionType === "rehab");
  } else if (type === "maintenance") {
    filtered = sessions.filter((s) => s.sessionType === "maintenance");
  }

  // Sum modalities vs exercises
  let totalModalities = 0;
  let totalExercises = 0;

  filtered.forEach((session) => {
    totalModalities +=
      session.modalities.heatPack +
      session.modalities.ultrasound +
      session.modalities.coldPack +
      session.modalities.massage +
      session.modalities.acupuncture;

    totalExercises +=
      session.exercises.frontSquat +
      session.exercises.pushUps +
      session.exercises.ohDumbbellPress +
      session.exercises.plank +
      session.exercises.romanianDeadlifts;
  });

  const total = totalModalities + totalExercises;
  if (total === 0) {
    // Return empty array for "No data" state rather than fake 50/50 split
    return [];
  }

  return [
    { name: "Exercises", value: Math.round((totalExercises / total) * 100) },
    { name: "Modalities", value: Math.round((totalModalities / total) * 100) },
  ];
}

/**
 * Aggregate injury records into days lost by injury type
 */
export function aggregateDaysLostByInjury(
  records: InjuryRecord[],
  sessions?: RehabSession[]
): DaysLostByInjuryPoint[] {
  // If sessions provided, use them to aggregate (ensures filter consistency)
  // Otherwise fall back to injury records
  if (sessions && sessions.length > 0) {
    const byInjury: Record<string, Set<string>> = {};
    
    // Track unique injury IDs per injury type from filtered sessions
    sessions.forEach((session) => {
      const key = session.injuryType;
      if (!byInjury[key]) {
        byInjury[key] = new Set();
      }
      byInjury[key].add(session.injuryId);
    });

    // Get days out for each unique injury
    const result: DaysLostByInjuryPoint[] = [];
    Object.entries(byInjury).forEach(([injuryType, injuryIds]) => {
      let totalDays = 0;
      injuryIds.forEach((injuryId) => {
        const record = records.find((r) => r.id === injuryId);
        if (record) {
          totalDays += record.daysOut;
        }
      });
      result.push({ injury: injuryType, days: totalDays });
    });

    return result.sort((a, b) => b.days - a.days).slice(0, 15);
  }

  // Fallback: aggregate directly from records
  const byInjury: Record<string, number> = {};
  records.forEach((record) => {
    const key = record.injuryType;
    byInjury[key] = (byInjury[key] || 0) + record.daysOut;
  });

  return Object.entries(byInjury)
    .map(([injury, days]) => ({ injury, days }))
    .sort((a, b) => b.days - a.days)
    .slice(0, 15); // Top 15
}

/**
 * Aggregate sessions into days lost by player
 */
export function aggregateDaysLostByPlayer(
  records: InjuryRecord[],
  sessions: RehabSession[]
): DaysLostByPlayerPoint[] {
  const byPlayer: Record<string, { rehab: number; maintenance: number; daysOut: number }> = {};

  // Group sessions by player and count session types
  sessions.forEach((session) => {
    if (!byPlayer[session.playerName]) {
      byPlayer[session.playerName] = { rehab: 0, maintenance: 0, daysOut: 0 };
    }
    if (session.sessionType === "rehab") {
      byPlayer[session.playerName].rehab++;
    } else {
      byPlayer[session.playerName].maintenance++;
    }
  });

  // Get actual days out from injury records for context
  records.forEach((record) => {
    if (byPlayer[record.playerName]) {
      byPlayer[record.playerName].daysOut += record.daysOut;
    }
  });

  return Object.entries(byPlayer)
    .map(([player, data]) => ({
      player,
      "Rehab sessions": data.rehab,
      "Maintenance sessions": data.maintenance,
      total: data.rehab + data.maintenance, // Total sessions
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);
}

/**
 * Aggregate sessions into modality vs exercise data
 */
export function aggregateModalityVsExercise(
  sessions: RehabSession[],
  groupBy: "date" | "player" | "injury"
): ModalityVsExercisePoint[] {
  const grouped: Record<string, ModalityVsExercisePoint> = {};

  sessions.forEach((session) => {
    const key =
      groupBy === "date"
        ? session.date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
        : groupBy === "player"
        ? session.playerName
        : session.injuryType;

    if (!grouped[key]) {
      grouped[key] = {
        [groupBy === "date" ? "date" : groupBy === "player" ? "player" : "injury"]: key,
        "Heat pack": 0,
        Ultrasound: 0,
        "Cold Pack": 0,
        Massage: 0,
        Acupuncture: 0,
        "Exercise minutes": 0,
      } as ModalityVsExercisePoint;
    }

    grouped[key]["Heat pack"] += session.modalities.heatPack;
    grouped[key]["Ultrasound"] += session.modalities.ultrasound;
    grouped[key]["Cold Pack"] += session.modalities.coldPack;
    grouped[key]["Massage"] += session.modalities.massage;
    grouped[key]["Acupuncture"] += session.modalities.acupuncture;
    grouped[key]["Exercise minutes"] += session.exerciseMinutes;
  });

  const result = Object.values(grouped);

  // Sort by date if grouping by date
  if (groupBy === "date") {
    return result.sort((a, b) => {
      const dateA = new Date(a.date || "");
      const dateB = new Date(b.date || "");
      return dateA.getTime() - dateB.getTime();
    }).slice(-14); // Last 14 entries
  }

  return result.slice(0, 15);
}

/**
 * Aggregate sessions into exercise data
 */
export function aggregateExercises(
  sessions: RehabSession[],
  groupBy: "date" | "player"
): ExerciseDataPoint[] {
  const grouped: Record<string, ExerciseDataPoint> = {};

  sessions.forEach((session) => {
    const key =
      groupBy === "date"
        ? session.date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
        : session.playerName;

    if (!grouped[key]) {
      grouped[key] = {
        [groupBy === "date" ? "date" : "player"]: key,
        "Front squat": 0,
        "Push-ups": 0,
        "OH dumbbell press": 0,
        Plank: 0,
        "Romanian deadlifts": 0,
      } as ExerciseDataPoint;
    }

    grouped[key]["Front squat"] += session.exercises.frontSquat;
    grouped[key]["Push-ups"] += session.exercises.pushUps;
    grouped[key]["OH dumbbell press"] += session.exercises.ohDumbbellPress;
    grouped[key]["Plank"] += session.exercises.plank;
    grouped[key]["Romanian deadlifts"] += session.exercises.romanianDeadlifts;
  });

  const result = Object.values(grouped);

  if (groupBy === "date") {
    return result.sort((a, b) => {
      const dateA = new Date(a.date || "");
      const dateB = new Date(b.date || "");
      return dateA.getTime() - dateB.getTime();
    }).slice(-14);
  }

  return result.slice(0, 15);
}

/**
 * Aggregate sessions into body part data
 */
export function aggregateBodyParts(
  sessions: RehabSession[],
  groupBy: "date" | "player"
): BodyPartDataPoint[] {
  const grouped: Record<string, BodyPartDataPoint> = {};
  const allBodyParts = new Set<string>();

  sessions.forEach((session) => {
    session.bodyPartsWorked.forEach((bp) => allBodyParts.add(bp));
  });

  sessions.forEach((session) => {
    const key =
      groupBy === "date"
        ? session.date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
        : session.playerName;

    if (!grouped[key]) {
      grouped[key] = { [groupBy === "date" ? "date" : "player"]: key };
      allBodyParts.forEach((bp) => {
        grouped[key][bp] = 0;
      });
    }

    session.bodyPartsWorked.forEach((bp) => {
      grouped[key][bp] = ((grouped[key][bp] as number) || 0) + 1;
    });
  });

  const result = Object.values(grouped);

  if (groupBy === "date") {
    return result.sort((a, b) => {
      const dateA = new Date((a.date as string) || "");
      const dateB = new Date((b.date as string) || "");
      return dateA.getTime() - dateB.getTime();
    }).slice(-14);
  }

  return result.slice(0, 15);
}

/**
 * Aggregate sessions into players by session type data
 */
export function aggregatePlayersBySessionType(sessions: RehabSession[]): SessionTypeDataPoint[] {
  const byPlayer: Record<string, { rehab: number; maintenance: number }> = {};

  sessions.forEach((session) => {
    if (!byPlayer[session.playerName]) {
      byPlayer[session.playerName] = { rehab: 0, maintenance: 0 };
    }
    if (session.sessionType === "rehab") {
      byPlayer[session.playerName].rehab++;
    } else {
      byPlayer[session.playerName].maintenance++;
    }
  });

  return Object.entries(byPlayer)
    .map(([player, data]) => ({
      player,
      "Rehab sessions": data.rehab,
      "Maintenance sessions": data.maintenance,
      total: data.rehab + data.maintenance,
    }))
    .sort((a, b) => (b.total || 0) - (a.total || 0))
    .slice(0, 15);
}

/**
 * Aggregate sessions into injuries by session type data
 */
export function aggregateInjuriesBySessionType(sessions: RehabSession[]): InjurySessionTypePoint[] {
  const byInjury: Record<string, { rehab: number; maintenance: number }> = {};

  sessions.forEach((session) => {
    const key = session.injuryType;
    if (!byInjury[key]) {
      byInjury[key] = { rehab: 0, maintenance: 0 };
    }
    if (session.sessionType === "rehab") {
      byInjury[key].rehab++;
    } else {
      byInjury[key].maintenance++;
    }
  });

  return Object.entries(byInjury)
    .map(([injury, data]) => ({
      "Injury category": injury,
      "Rehab sessions": data.rehab,
      "Maintenance sessions": data.maintenance,
    }))
    .sort((a, b) => (b["Rehab sessions"] + b["Maintenance sessions"]) - (a["Rehab sessions"] + a["Maintenance sessions"]))
    .slice(0, 15);
}

/**
 * Get unique players from sessions for filter dropdown
 */
export function getUniquePlayers(sessions: RehabSession[]): Array<{ id: string; name: string }> {
  const uniqueMap = new Map<string, string>();
  sessions.forEach((s) => {
    if (!uniqueMap.has(s.playerId)) {
      uniqueMap.set(s.playerId, s.playerName);
    }
  });
  return Array.from(uniqueMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get player profile info
 */
export function getPlayerProfile(sessions: RehabSession[], playerId: string) {
  const playerSessions = sessions.filter((s) => s.playerId === playerId);
  if (playerSessions.length === 0) return null;

  const first = playerSessions[0];
  const rehabCount = playerSessions.filter((s) => s.sessionType === "rehab").length;
  const maintenanceCount = playerSessions.filter((s) => s.sessionType === "maintenance").length;

  return {
    playerId: first.playerId,
    name: first.playerName,
    position: "", // Would need to join with injury record or athlete data
    imageUrl: "", // Placeholder
    rehabSessions: rehabCount,
    maintenanceSessions: maintenanceCount,
    currentInjury: first.injuryType,
    bodyPart: first.bodyPart,
    status: first.status,
  };
}

/**
 * Aggregate sessions by team for League tab
 */
export function aggregateSessionsByTeam(sessions: RehabSession[]): Array<{
  team: string;
  total: number;
  "Rehab sessions": number;
  "Maintenance sessions": number;
}> {
  const byTeam: Record<string, { rehab: number; maintenance: number }> = {};

  sessions.forEach((session) => {
    const team = session.team;
    if (!byTeam[team]) {
      byTeam[team] = { rehab: 0, maintenance: 0 };
    }
    if (session.sessionType === "rehab") {
      byTeam[team].rehab++;
    } else {
      byTeam[team].maintenance++;
    }
  });

  return Object.entries(byTeam)
    .map(([team, data]) => ({
      team,
      total: data.rehab + data.maintenance,
      "Rehab sessions": data.rehab,
      "Maintenance sessions": data.maintenance,
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Aggregate injury types by team for League tab grouped bar chart
 */
export function aggregateInjuriesByTeam(sessions: RehabSession[]): Array<{
  team: string;
  [injuryType: string]: string | number;
}> {
  const byTeam: Record<string, Record<string, number>> = {};
  const allInjuryTypes = new Set<string>();

  // Collect all unique injury types and count per team
  sessions.forEach((session) => {
    const team = session.team;
    const injury = session.injuryType;
    
    allInjuryTypes.add(injury);
    
    if (!byTeam[team]) {
      byTeam[team] = {};
    }
    byTeam[team][injury] = (byTeam[team][injury] || 0) + 1;
  });

  // Build result with all injury types for each team
  return Object.entries(byTeam).map(([team, injuries]) => {
    const result: Record<string, string | number> = { team };
    allInjuryTypes.forEach((injuryType) => {
      result[injuryType] = injuries[injuryType] || 0;
    });
    return result as { team: string; [injuryType: string]: string | number };
  }).sort((a, b) => {
    // Sort by total injury count (sum numeric values, skip team name)
    const aTotal = Object.entries(a).reduce((sum, [key, val]) => 
      key !== "team" && typeof val === "number" ? sum + val : sum, 0 as number);
    const bTotal = Object.entries(b).reduce((sum, [key, val]) => 
      key !== "team" && typeof val === "number" ? sum + val : sum, 0 as number);
    return bTotal - aTotal;
  });
}

// ==========================================
// EXPORTED DATA
// ==========================================

export const REHAB_SESSIONS = generateRehabSessions();

// Re-export for convenience
export { INJURY_RECORDS };
