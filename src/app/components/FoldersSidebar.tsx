import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from "@/app/components/playbook";
import {
  FolderOutlined,
  StarBorderOutlined,
  PeopleOutlineOutlined,
  ArrowBack,
  SearchOutlined,
  DashboardOutlined,
  MoreVert,
  UnfoldMore,
} from "@mui/icons-material";

export interface Dashboard {
  id: string;
  name: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: React.ReactNode;
  dashboards: Dashboard[];
}

export interface FoldersSidebarProps {
  /** Array of folders with their dashboards */
  folders: Folder[];
  /** Width of the sidebar in pixels */
  width?: number;
  /** Callback when a dashboard is selected */
  onDashboardSelect?: (dashboardId: string, folderId: string) => void;
  /** Callback when a folder is selected */
  onFolderSelect?: (folderId: string) => void;
  /** Title for the folders view */
  foldersTitle?: string;
  /** Show search button in dashboard view */
  showSearch?: boolean;
  /** Show more menu button on dashboard items */
  showDashboardMenu?: boolean;
  /** Show bottom toolbar with folder icon */
  showBottomToolbar?: boolean;
}

export function FoldersSidebar({
  folders,
  width = 240,
  onDashboardSelect,
  onFolderSelect,
  foldersTitle = "Folders",
  showSearch = true,
  showDashboardMenu = true,
  showBottomToolbar = true,
}: FoldersSidebarProps) {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const handleFolderClick = (folder: Folder) => {
    setSelectedFolder(folder);
    onFolderSelect?.(folder.id);
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    setSelectedFolder(null);
  };

  const handleDashboardClick = (dashboardId: string) => {
    if (!selectedFolder) return;
    if (onDashboardSelect) {
      onDashboardSelect(dashboardId, selectedFolder.id);
      return;
    }
    // Fallback: navigate directly to the dashboard route when no callback provided
    navigate(`/dashboards/${dashboardId}`);
  };

  return (
    <Box
      sx={{
        width: `${width}px`,
        height: "100%",
        backgroundColor: "var(--background-default)",
        borderLeft: `var(--border-width-thin) solid var(--border-color-default)`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Folders View */}
      {!selectedFolder && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: "var(--spacing-4)",
              py: "var(--spacing-4)",
              borderBottom: `var(--border-width-thin) solid var(--border-color-default)`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--font-size-h6)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--grey-200)",
              }}
            >
              {foldersTitle}
            </Typography>
          </Box>

          {/* Folders List */}
          <List
            sx={{
              px: "var(--spacing-2)",
              py: "var(--spacing-2)",
            }}
          >
            {folders.map((folder) => (
              <ListItemButton
                key={folder.id}
                onClick={() => handleFolderClick(folder)}
                sx={{
                  borderRadius: "var(--radius-md)",
                  mb: "var(--spacing-1)",
                  px: "var(--spacing-3)",
                  py: "var(--spacing-2)",
                  "&:hover": {
                    backgroundColor: "var(--grey-200-12)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "40px",
                    color: "var(--grey-200)",
                  }}
                >
                  {folder.icon}
                </ListItemIcon>
                <ListItemText
                  primary={folder.name}
                  sx={{
                    "& .MuiTypography-root": {
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--font-size-body1)",
                      fontWeight: "var(--font-weight-regular)",
                      color: "var(--grey-200)",
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      )}

      {/* Dashboards View */}
      {selectedFolder && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header with Back Button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: "var(--spacing-2)",
              py: "var(--spacing-2)",
              borderBottom: `var(--border-width-thin) solid var(--border-color-default)`,
            }}
          >
            <IconButton
              onClick={handleBackClick}
              sx={{
                color: "var(--grey-200)",
                p: "var(--spacing-2)",
              }}
            >
              <ArrowBack sx={{ fontSize: "20px" }} />
            </IconButton>
            <Typography
              sx={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--font-size-body1)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--grey-200)",
              }}
            >
              {selectedFolder.name}
            </Typography>
            {showSearch && (
              <IconButton
                sx={{
                  color: "var(--grey-200)",
                  p: "var(--spacing-2)",
                }}
              >
                <SearchOutlined sx={{ fontSize: "20px" }} />
              </IconButton>
            )}
            {!showSearch && <Box sx={{ width: "40px" }} />}
          </Box>

          {/* Dashboards Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: "var(--spacing-4)",
              py: "var(--spacing-2)",
              borderBottom: `var(--border-width-thin) solid var(--border-color-default)`,
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--font-size-caption)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--grey-100)",
                textTransform: "uppercase",
              }}
            >
              Dashboards
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-1)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-family-base)",
                  fontSize: "var(--font-size-caption)",
                  fontWeight: "var(--font-weight-regular)",
                  color: "var(--grey-100)",
                }}
              >
                Name
              </Typography>
              <UnfoldMore sx={{ fontSize: "16px", color: "var(--grey-100)" }} />
            </Box>
          </Box>

          {/* Dashboards List */}
          <List
            sx={{
              flex: 1,
              px: "var(--spacing-2)",
              py: "var(--spacing-2)",
              overflow: "auto",
            }}
          >
            {selectedFolder.dashboards.map((dashboard) => (
              <ListItemButton
                key={dashboard.id}
                onClick={() => handleDashboardClick(dashboard.id)}
                sx={{
                  borderRadius: "var(--radius-md)",
                  mb: "var(--spacing-1)",
                  px: "var(--spacing-3)",
                  py: "var(--spacing-2)",
                  "&:hover": {
                    backgroundColor: "var(--grey-200-12)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "36px",
                    color: "var(--grey-200)",
                  }}
                >
                  <DashboardOutlined sx={{ fontSize: "20px" }} />
                </ListItemIcon>
                <ListItemText
                  primary={dashboard.name}
                  sx={{
                    "& .MuiTypography-root": {
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--font-size-body2)",
                      fontWeight: "var(--font-weight-regular)",
                      color: "var(--grey-200)",
                    },
                  }}
                />
                {showDashboardMenu && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Dashboard menu clicked:", dashboard.id);
                    }}
                    sx={{
                      color: "var(--grey-100)",
                      p: "var(--spacing-1)",
                    }}
                  >
                    <MoreVert sx={{ fontSize: "18px" }} />
                  </IconButton>
                )}
              </ListItemButton>
            ))}
          </List>

          {/* Bottom Toolbar */}
          {showBottomToolbar && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                px: "var(--spacing-2)",
                py: "var(--spacing-2)",
                borderTop: `var(--border-width-thin) solid var(--border-color-default)`,
              }}
            >
              <IconButton
                sx={{
                  color: "var(--grey-200)",
                  p: "var(--spacing-2)",
                }}
              >
                <FolderOutlined sx={{ fontSize: "20px" }} />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

// Default folders data for easy reuse
export const defaultFoldersData: Folder[] = [
  {
    id: "favourites",
    name: "Favourites",
    icon: <StarBorderOutlined />,
    dashboards: [
      { id: "1", name: "Performance Dashboard" },
      { id: "2", name: "Training Overview" },
      { id: "3", name: "Injury Analytics" },
    ],
  },
  {
    id: "my-folder",
    name: "My folder",
    icon: <FolderOutlined />,
    dashboards: [
      { id: "rehab", name: "Rehab" },
    ],
  },
  {
    id: "shared",
    name: "Shared folder",
    icon: <PeopleOutlineOutlined />,
    dashboards: [
      { id: "dashboard", name: "Dashboard" },
      { id: "missed-time", name: "Missed Time" },
      { id: "concussion", name: "Concussion" },
      { id: "shoulder", name: "Shoulder" },
      { id: "lex-sprain", name: "LEX Sprain" },
      { id: "lex-strain", name: "LEX Strain" },
      { id: "acl", name: "ACL" },
      { id: "hamstring", name: "Hamstring" },
      { id: "other-injuries", name: "Other Injuries" },
      { id: "recovery-time", name: "Recovery Time" },
      { id: "team-view", name: "Team View" },
    ],
  },
  
];
