import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { PlaybookThemeProvider } from "./theme/PlaybookThemeProvider";
import { router } from "./routes";
import { GlobalFiltersProvider } from "@/app/contexts/GlobalFiltersContext";
import { applyTeamTheme } from "./theme/teamThemes";

export default function App() {
  useEffect(() => {
    // Apply a default team theme on app load if desired. Change the key to apply different team palettes.
    // This is intentionally lightweight — later we can wire this to user/team selection.
    try {
      const defaultTeam = (localStorage.getItem("teamTheme") as string) || "nfl";
      applyTeamTheme(defaultTeam);
    } catch (e) {
      // noop
    }
  }, []);

  return (
    <PlaybookThemeProvider>
      <GlobalFiltersProvider>
        <RouterProvider router={router} />
      </GlobalFiltersProvider>
    </PlaybookThemeProvider>
  );
}
