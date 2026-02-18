import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  IconButton,
  Grid,
  Tabs,
  Tab,
  Pagination,
  Select,
  MenuItem,
} from "@/app/components/playbook";
import { MainNavigation } from "@/app/components/MainNavigation";
import { AppBarHeader } from "@/app/components/AppBarHeader";
import { SearchField } from "@/app/components/inputs/SearchField";
import { DashboardCard } from "@/app/components/DashboardCard";
import {
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { getChartColors } from "@/app/components/looker/chartConfig";

interface Dashboard {
  id: number;
  folderName: string;
  date: string;
  title: string;
  thumbnailColor?: string;
  type: string;
  category: "favourites" | "my" | "shared";
}

const dashboardTypes: Dashboard[] = [
  {
    id: 1,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "Dashboard",
    type: "dashboard",
    category: "shared",
  },
  {
    id: 2,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "Missed Time",
    type: "missed-time",
    category: "shared",
  },
  {
    id: 3,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "Concussion",
    type: "concussion",
    category: "shared",
  },
  {
    id: 4,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "Shoulder",
    type: "shoulder",
    category: "shared",
  },
  {
    id: 5,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "LEX Sprain",
    type: "lex-sprain",
    category: "shared",
  },
  {
    id: 6,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "LEX Strain",
    type: "lex-strain",
    category: "shared",
  },
  {
    id: 7,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "ACL",
    type: "acl",
    category: "shared",
  },
  {
    id: 8,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "Hamstring",
    type: "hamstring",
    category: "shared",
  },
  {
    id: 9,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "Other Injuries",
    type: "other-injuries",
    category: "shared",
  },
  {
    id: 10,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "Recovery Time",
    type: "recovery-time",
    category: "shared",
  },
  {
    id: 11,
    folderName: "Analysis",
    date: "11 Feb 2026",
    title: "Team View",
    type: "team-view",
    category: "shared",
  },
  {
    id: 12,
    folderName: "Analysis",
    date: "13 Feb 2026",
    title: "Rehab",
    type: "rehab",
    category: "my",
  },
  {
    id: 13,
    folderName: "Analysis",
    date: "18 Feb 2026",
    title: "PHS Injury Report",
    type: "phs-injury-report",
    category: "favourites",
  },
];

  function mapDashboardTypeToPreviewVariant(type: string) {
    switch (type) {
      case "missed-time":
      case "team-view":
        return "horizontal" as const;
      case "rehab":
        return "donut" as const;
      case "dashboard":
      case "concussion":
      case "shoulder":
      case "acl":
      case "lex-sprain":
      case "lex-strain":
      case "hamstring":
      case "other-injuries":
      case "recovery-time":
      default:
        return "bar" as const;
    }
  }

export function DashboardsHome() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const tabCategory = selectedTab === 0 ? "favourites" : selectedTab === 1 ? "my" : "shared";

  const filteredDashboards = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return dashboardTypes.filter((dashboard) => {
      const matchesCategory = dashboard.category === tabCategory;
      if (!matchesCategory) return false;

      if (!normalizedQuery) return true;

      return (
        dashboard.title.toLowerCase().includes(normalizedQuery) ||
        dashboard.folderName.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery, tabCategory]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // Runtime-computed chart colors for thumbnails (falls back to static thumbnailColor)
  const themeChartColors = typeof window !== 'undefined' ? getChartColors(12) : [];

  const handleDashboardClick = (type: string) => {
    navigate(`/dashboards/${type}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        backgroundColor: "var(--background)",
      }}
    >
      {/* Main Navigation */}
      <MainNavigation isExpanded={isNavExpanded} onToggle={setIsNavExpanded} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          marginLeft: isNavExpanded ? "240px" : "72px",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* AppBar Header */}
        <AppBarHeader
          pageTitle="Dashboards"
          selectedSquad="Primary Squad"
          squads={["Primary Squad", "Reserve Squad", "Youth Squad"]}
          userName="JSM"
          onSquadChange={(squad) => console.log("Squad changed:", squad)}
          onAvatarClick={() => console.log("Avatar clicked")}
        />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "var(--background)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search and Actions Bar */}
          <Box
            sx={{
              p: "var(--spacing-4)",
              pb: "var(--spacing-3)",
              borderBottom: "var(--border-width-thin) solid var(--border-default)",
              backgroundColor: "var(--white)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--spacing-3)",
              }}
            >
              {/* Search Field */}
              <Box sx={{ flexGrow: 1, maxWidth: "400px" }}>
                <SearchField
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dashboards..."
                />
              </Box>

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-2)",
                }}
              >
                {/* View Toggle */}
                <Box
                  sx={{
                    display: "flex",
                    border: "var(--border-width-thin) solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setViewMode("grid")}
                    sx={{
                      borderRadius: 0,
                      backgroundColor:
                        viewMode === "grid" ? "var(--background-default)" : "transparent",
                      "&:hover": {
                        backgroundColor: "var(--input-hover)",
                      },
                    }}
                  >
                    <ViewModuleIcon
                      sx={{
                        fontSize: "20px",
                        color: viewMode === "grid" ? "var(--primary-main)" : "var(--text-secondary)",
                      }}
                    />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setViewMode("list")}
                    sx={{
                      borderRadius: 0,
                      borderLeft: "var(--border-width-thin) solid var(--border-default)",
                      backgroundColor:
                        viewMode === "list" ? "var(--background-default)" : "transparent",
                      "&:hover": {
                        backgroundColor: "var(--input-hover)",
                      },
                    }}
                  >
                    <ViewListIcon
                      sx={{
                        fontSize: "20px",
                        color: viewMode === "list" ? "var(--primary-main)" : "var(--text-secondary)",
                      }}
                    />
                  </IconButton>
                </Box>

                {/* New Folder Button */}
                <Button
                  variant="outlined"
                  startIcon={<CreateNewFolderIcon />}
                  sx={{
                    fontFamily: "var(--font-family-base)",
                    textTransform: "none",
                    borderColor: "var(--border-default)",
                    color: "var(--text-primary)",
                    "&:hover": {
                      borderColor: "var(--border-light)",
                      backgroundColor: "var(--input-hover)",
                    },
                  }}
                >
                  New folder
                </Button>

                {/* New Dashboard Button */}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    fontFamily: "var(--font-family-base)",
                    textTransform: "none",
                    backgroundColor: "var(--primary-main)",
                    "&:hover": {
                      backgroundColor: "var(--primary-dark)",
                    },
                  }}
                >
                  New dashboard
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Tabs Navigation */}
          <Box
            sx={{
              borderBottom: "var(--border-width-thin) solid var(--border-default)",
              backgroundColor: "var(--white)",
              px: "var(--spacing-4)",
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--primary-main)",
                },
                "& .MuiTab-root": {
                  fontFamily: "var(--font-family-base)",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-secondary)",
                  "&.Mui-selected": {
                    color: "var(--primary-main)",
                  },
                },
              }}
            >
              <Tab label="Favourites" />
              <Tab label="My folder" />
              <Tab label="Shared folder" />
            </Tabs>
          </Box>

          {/* Dashboard Cards Grid */}
          <Box
            sx={{
              flexGrow: 1,
              p: "var(--spacing-4)",
              overflow: "auto",
              backgroundColor: "var(--background)",
            }}
          >
            <Grid container spacing={3}>
              {filteredDashboards.map((dashboard) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dashboard.id}>
                  <DashboardCard
                    folderName={dashboard.folderName}
                    date={dashboard.date}
                    title={dashboard.title}
                    thumbnailColor={
                      themeChartColors.length
                        ? themeChartColors[(dashboard.id - 1) % themeChartColors.length]
                        : dashboard.thumbnailColor
                    }
                    previewVariant={mapDashboardTypeToPreviewVariant(dashboard.type)}
                    onClick={() => handleDashboardClick(dashboard.type)}
                    onMove={() => console.log(`Move: ${dashboard.title}`)}
                    onCopy={() => console.log(`Copy: ${dashboard.title}`)}
                    onRename={() => console.log(`Rename: ${dashboard.title}`)}
                    onDelete={() => console.log(`Delete: ${dashboard.title}`)}
                  />
                </Grid>
              ))}

              {filteredDashboards.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: "var(--spacing-6)",
                      border: "var(--border-width-thin) solid var(--border-default)",
                      borderRadius: "var(--radius-lg)",
                      backgroundColor: "var(--white)",
                      textAlign: "center",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-family-base)",
                    }}
                  >
                    No dashboards match this tab.
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}