# Looker-Style Filters Assessment

## Status: IMPLEMENTED ✅

The Looker-style filter system has been built using shadcn/Radix components.

---

## Components Created

| Component | Location | Description |
|-----------|----------|-------------|
| `LookerFilterLabel` | `/src/app/components/looker/filters/` | Label above filters |
| `LookerSelect` | `/src/app/components/looker/filters/` | Single-select dropdown |
| `LookerMultiSelect` | `/src/app/components/looker/filters/` | Multi-select with checkboxes |
| `LookerBooleanToggle` | `/src/app/components/looker/filters/` | True/False toggle buttons |
| `LookerFilterBar` | `/src/app/components/looker/filters/` | Dynamic filter container |

### Supporting Files
- `/src/app/types/filters.ts` - TypeScript definitions
- `/src/app/config/dashboardFilters.ts` - Per-dashboard filter configurations
- `/src/styles/global.css` - Looker CSS variables added

---

## Usage Example

```tsx
import { LookerFilterBar, useLookerFilters } from "@/app/components/looker/filters";
import { missedTimeFilters } from "@/app/config/dashboardFilters";

function DashboardPage() {
  const { values, handleChange, handleReset } = useLookerFilters(missedTimeFilters);
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <div>
      {/* Toggle button */}
      <button onClick={() => setFiltersOpen(!filtersOpen)}>
        <FilterListIcon />
      </button>

      {/* Filter bar with animation */}
      <LookerFilterBar
        config={missedTimeFilters}
        values={values}
        onChange={handleChange}
        onReset={handleReset}
        isExpanded={filtersOpen}
      />
    </div>
  );
}
```

---

## Individual Components

### LookerSelect
```tsx
<LookerSelect
  id="season"
  label="Season"
  value={filters.season}
  options={[
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
  ]}
  placeholder="Is any value"
  onChange={(val) => setFilters({ season: val })}
/>
```

### LookerBooleanToggle
```tsx
<LookerBooleanToggle
  id="missedTime"
  label="Missed time injury"
  value={filters.missedTimeInjury} // true | false | null
  onChange={(val) => setFilters({ missedTimeInjury: val })}
/>
```

### LookerMultiSelect
```tsx
<LookerMultiSelect
  id="gameweeks"
  label="Gameweek(s)"
  value={filters.gameweeks}
  options={gameweekOptions}
  onChange={(val) => setFilters({ gameweeks: val })}
/>
```

---

## Data Requirements

### Additional Fields Needed in Mock Data

To support the full range of Looker filters, add these fields to `mockInjuryData.ts`:

```typescript
interface EnhancedInjuryRecord {
  // Existing fields...
  
  // New fields for Looker-style filtering:
  gameweek: string;              // e.g., "2025 Off-season week1"
  weekTypeName: string;          // e.g., "Regular Season", "Playoffs"
  game: string;                  // e.g., "vs. Cowboys", "@ Eagles"
  mechanismOfInjury: string;     // e.g., "Contact", "Non-contact"
  contactTypeCategory: string;   // e.g., "Player contact"
  seasonType: string;            // e.g., "Regular", "Pre-season"
  teamActivity: string;          // e.g., "Game", "Practice"
  missedTimeInjury: boolean;     
  missedGameInjury: boolean;     
  missedPracticeInjury: boolean;
  bodyPart: string;              
  positionAtTimeOfInjury: string;
  participationReason: string;   
  isPastPlayer: boolean;         
}
```

---

## Configuration System

Filter configs are defined in `/src/app/config/dashboardFilters.ts`:

```typescript
// Example: Missed Time Dashboard
export const missedTimeFilters: FilterConfig[] = [
  {
    id: "gameweeks",
    label: "Gameweek(s)",
    type: "multi-select",
    dataKey: "gameweeks",
    optionsFromData: "gameweek", // Generate from data
    row: 1,
  },
  {
    id: "missedTimeInjury",
    label: "Missed time injury",
    type: "boolean",
    dataKey: "missedTimeInjury",
    row: 2,
  },
  // ... more filters
];
```

Filters are grouped by row number for multi-line layout.

---

## Collapsible Behavior (Built-in)

The `LookerFilterBar` has built-in expand/collapse animation:

```tsx
<LookerFilterBar
  config={filterConfig}
  values={values}
  onChange={handleChange}
  isExpanded={filtersOpen} // Controls visibility with animation
/>
```

---

## Next Steps

1. **Integrate into DashboardPage** - Replace existing `DashboardFilters` with `LookerFilterBar`
2. **Add mock data fields** - Extend injury records with Looker-compatible fields
3. **Wire up filtering logic** - Apply filter values to data queries
4. **Test per-dashboard configs** - Verify each dashboard shows appropriate filters

