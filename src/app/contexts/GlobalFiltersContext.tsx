import React, { createContext, useState, useContext } from "react";
import type { FilterState } from "@/app/components/DashboardFilters";

type GlobalKeys = Pick<FilterState, "season" | "benchmarkValue" | "quickDateRange" | "sessionTypes" | "teamId">;

interface GlobalFiltersContextValue {
  globalFilters: GlobalKeys;
  setGlobalFilters: (updater: Partial<GlobalKeys> | ((prev: GlobalKeys) => GlobalKeys)) => void;
}

const defaultGlobal: GlobalKeys = {
  season: "2024",
  benchmarkValue: "",
  quickDateRange: "",
  sessionTypes: [],
  teamId: "",
};

const GlobalFiltersContext = createContext<GlobalFiltersContextValue | undefined>(undefined);

export const GlobalFiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalFilters, setGlobalFiltersState] = useState<GlobalKeys>(defaultGlobal);

  const setGlobalFilters = (updater: Partial<GlobalKeys> | ((prev: GlobalKeys) => GlobalKeys)) => {
    setGlobalFiltersState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  };

  return (
    <GlobalFiltersContext.Provider value={{ globalFilters, setGlobalFilters }}>
      {children}
    </GlobalFiltersContext.Provider>
  );
};

export const useGlobalFilters = () => {
  const ctx = useContext(GlobalFiltersContext);
  if (!ctx) throw new Error("useGlobalFilters must be used within a GlobalFiltersProvider");
  return ctx;
};

export default GlobalFiltersContext;
