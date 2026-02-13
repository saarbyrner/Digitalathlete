import { Box } from "@/app/components/playbook";
import { FoldersSidebar, defaultFoldersData } from "@/app/components/FoldersSidebar";
import { useNavigate } from "react-router";

interface DashboardDrawerProps {
  open: boolean;
}

export function DashboardDrawer({ open }: DashboardDrawerProps) {
  const navigate = useNavigate();
  
  if (!open) return null;

  const handleDashboardSelect = (dashboardId: string, folderId: string) => {
    console.log("Dashboard selected:", dashboardId, "from folder:", folderId);
    navigate(`/dashboards/${dashboardId}`);
  };

  const handleFolderSelect = (folderId: string) => {
    console.log("Folder selected:", folderId);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: "64px", // Height of AppBarHeader
        bottom: 0,
        display: "flex",
        zIndex: 999,
        transition: "transform 0.3s ease",
      }}
    >
      <FoldersSidebar
        folders={defaultFoldersData}
        width={240}
        onDashboardSelect={handleDashboardSelect}
        onFolderSelect={handleFolderSelect}
        foldersTitle="Folders"
        showSearch={true}
        showDashboardMenu={true}
        showBottomToolbar={true}
      />
    </Box>
  );
}
