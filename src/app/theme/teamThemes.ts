// Simple per-team theme registry and runtime CSS variable applier
type ThemeMap = Record<string, string>;

export const TEAM_THEMES: Record<string, ThemeMap> = {
  // Example NFL theme (sample colors that override design tokens)
  nfl: {
    "--primary-main": "#002244",
    "--primary-dark": "#001731",
    "--chart-1": "#005EB8",
    "--chart-2": "#00A3E0",
    "--chart-3": "#7FDBFF",
    "--chart-4": "#FFC20E",
    "--chart-5": "#FF6B35",
    "--chart-6": "#8A2BE2",
  },
};

export function applyTeamTheme(themeKey: string) {
  const theme = TEAM_THEMES[themeKey];
  if (!theme || typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries(theme).forEach(([varName, value]) => root.style.setProperty(varName, value));
}

export function clearTeamTheme(themeKey?: string) {
  const theme = themeKey ? TEAM_THEMES[themeKey] : null;
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme) {
    Object.keys(theme).forEach((varName) => root.style.removeProperty(varName));
  }
}

export function useTeamTheme() {
  return {
    applyTeamTheme,
    clearTeamTheme,
  };
}
