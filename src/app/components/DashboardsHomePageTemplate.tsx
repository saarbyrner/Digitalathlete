import { useState } from "react";
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
}

const mockDashboards: Dashboard[] = [
  { id: 1, folderName: "My folder", date: "4 Feb 2026", title: "Individual player report" },
  { id: 2, folderName: "My folder", date: "3 Feb 2026", title: "Team performance overview" },
  { id: 3, folderName: "My folder", date: "2 Feb 2026", title: "Training load analysis" },
  { id: 4, folderName: "My folder", date: "1 Feb 2026", title: "Injury tracking dashboard" },
  { id: 5, folderName: "My folder", date: "31 Jan 2026", title: "Match statistics breakdown" },
  { id: 6, folderName: "My folder", date: "30 Jan 2026", title: "Squad rotation metrics" },
  { id: 7, folderName: "My folder", date: "29 Jan 2026", title: "Physical benchmarks" },
  { id: 8, folderName: "My folder", date: "28 Jan 2026", title: "Tactical analysis report" },
];

export function DashboardsHomePageTemplate() {
  const [selectedTab, setSelectedTab] = useState(1);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const themeChartColors = getChartColors();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
                        backgroundColor: "var(--background-hover)",
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
                        backgroundColor: "var(--background-hover)",
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
                      borderColor: "var(--border-hover)",
                      backgroundColor: "var(--background-hover)",
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
              <Tab label="IP dashboards" />
            </Tabs>
          </Box>

          {/* Dashboard Cards Grid */}
          <Box
            sx={{
              flexGrow: 1,
              p: "var(--spacing-4)",
              overflow: "auto",
            }}
          >
            <Grid container spacing={3}>
              {mockDashboards.map((dashboard, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dashboard.id}>
                  <DashboardCard
                    folderName={dashboard.folderName}
                    date={dashboard.date}
                    title={dashboard.title}
                    thumbnailColor={dashboard.thumbnailColor ?? themeChartColors[idx % themeChartColors.length]}
                    onClick={() => console.log(`Clicked dashboard: ${dashboard.title}`)}
                    onMove={() => console.log(`Move: ${dashboard.title}`)}
                    onCopy={() => console.log(`Copy: ${dashboard.title}`)}
                    onRename={() => console.log(`Rename: ${dashboard.title}`)}
                    onDelete={() => console.log(`Delete: ${dashboard.title}`)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Pagination Footer */}
          <Box
            sx={{
              p: "var(--spacing-4)",
              borderTop: "var(--border-width-thin) solid var(--border-default)",
              backgroundColor: "var(--white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Rows per page */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-2)",
              }}
            >
              <Box
                component="span"
                sx={{
                  fontFamily: "var(--font-family-base)",
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                }}
              >
                Rows per page:
              </Box>
              <Select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(e.target.value as number)}
                sx={{
                  fontFamily: "var(--font-family-base)",
                  fontSize: "14px",
                  "& .MuiSelect-select": {
                    py: "var(--spacing-1)",
                    px: "var(--spacing-2)",
                  },
                }}
              >
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={48}>48</MenuItem>
              </Select>
            </Box>

            {/* Pagination */}
            <Pagination
              count={3}
              page={page}
              onChange={handlePageChange}
              sx={{
                "& .MuiPaginationItem-root": {
                  fontFamily: "var(--font-family-base)",
                  color: "var(--text-primary)",
                  "&.Mui-selected": {
                    backgroundColor: "var(--primary-main)",
                    color: "var(--white)",
                    "&:hover": {
                      backgroundColor: "var(--primary-dark)",
                    },
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}