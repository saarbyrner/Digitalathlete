import { Box, Chip } from "@/app/components/playbook";
import { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { MainNavigation } from "@/app/components/MainNavigation";
import { AppBarHeader } from "@/app/components/AppBarHeader";

interface Athlete {
  id: number;
  name: string;
  position: string;
  positionGroup: string;
  squad: string;
  status: "Available" | "Injured" | "Unavailable";
  performance: string;
  fitness: string;
  injuryStatus: string;
  training: string;
}

const athleteData: Athlete[] = [
  {
    id: 1,
    name: "Marcus Johnson",
    position: "Forward",
    positionGroup: "Attack",
    squad: "First Team",
    status: "Available",
    performance: "85%",
    fitness: "Excellent",
    injuryStatus: "Healthy",
    training: "Full",
  },
  {
    id: 2,
    name: "Elena Rodriguez",
    position: "Midfielder",
    positionGroup: "Midfield",
    squad: "First Team",
    status: "Injured",
    performance: "92%",
    fitness: "Good",
    injuryStatus: "Knee strain - 2 weeks",
    training: "Modified",
  },
  {
    id: 3,
    name: "David Chen",
    position: "Defender",
    positionGroup: "Defence",
    squad: "First Team",
    status: "Available",
    performance: "78%",
    fitness: "Very Good",
    injuryStatus: "Healthy",
    training: "Full",
  },
  {
    id: 4,
    name: "Sarah Williams",
    position: "Goalkeeper",
    positionGroup: "Goalkeeper",
    squad: "First Team",
    status: "Available",
    performance: "88%",
    fitness: "Excellent",
    injuryStatus: "Healthy",
    training: "Full",
  },
  {
    id: 5,
    name: "Alex Thompson",
    position: "Forward",
    positionGroup: "Attack",
    squad: "Reserve Team",
    status: "Available",
    performance: "73%",
    fitness: "Good",
    injuryStatus: "Healthy",
    training: "Full",
  },
  {
    id: 6,
    name: "Emma Davis",
    position: "Midfielder",
    positionGroup: "Midfield",
    squad: "First Team",
    status: "Available",
    performance: "81%",
    fitness: "Very Good",
    injuryStatus: "Healthy",
    training: "Full",
  },
  {
    id: 7,
    name: "James Wilson",
    position: "Defender",
    positionGroup: "Defence",
    squad: "First Team",
    status: "Available",
    performance: "79%",
    fitness: "Good",
    injuryStatus: "Healthy",
    training: "Full",
  },
  {
    id: 8,
    name: "Maria Santos",
    position: "Forward",
    positionGroup: "Attack",
    squad: "Reserve Team",
    status: "Available",
    performance: "69%",
    fitness: "Very Good",
    injuryStatus: "Healthy",
    training: "Full",
  },
];

const getStatusColor = (
  status: string
): "success" | "error" | "warning" | "default" => {
  switch (status) {
    case "Available":
      return "success";
    case "Injured":
      return "error";
    case "Unavailable":
      return "warning";
    default:
      return "default";
  }
};

export function AthletesPageTemplate() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "position",
      headerName: "Position",
      width: 120,
    },
    {
      field: "positionGroup",
      headerName: "Position Group",
      width: 130,
    },
    {
      field: "squad",
      headerName: "Squad",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          sx={{
            fontFamily: "var(--font-family-base)",
            fontWeight: "var(--font-weight-medium)",
          }}
        />
      ),
    },
    {
      field: "performance",
      headerName: "Performance",
      width: 120,
    },
    {
      field: "fitness",
      headerName: "Fitness",
      width: 110,
    },
    {
      field: "injuryStatus",
      headerName: "Injury Status",
      width: 150,
    },
    {
      field: "training",
      headerName: "Training",
      width: 100,
    },
  ];

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
          pageTitle="Athletes"
          selectedSquad="First Team"
          squads={[
            "First Team",
            "Second Team",
            "Under 18s",
            "Under 16s",
          ]}
          userName="JSM"
          onSquadChange={(squad) =>
            console.log("Squad changed:", squad)
          }
          onAvatarClick={() => console.log("Avatar clicked")}
        />

        {/* Page Content */}
        <Box
          sx={{
              p: "var(--spacing-4)",
              flexGrow: 1,
              backgroundColor: "var(--background)",
          }}
        >
          {/* DataGrid Card */}
          <Box
            sx={{
              backgroundColor: "var(--white)",
              borderRadius: "var(--radius-lg)",
              border:
                "var(--border-width-thin) solid var(--border-default)",
              overflow: "hidden",
              height: "calc(100vh - 120px)",
            }}
          >
            <DataGrid
              rows={athleteData}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                border: "none",
                fontFamily: "var(--font-family-base)",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "var(--background)",
                  borderBottom:
                    "var(--border-width-thin) solid var(--border-default)",
                  fontFamily: "var(--font-family-base)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--text-primary)",
                },
                "& .MuiDataGrid-cell": {
                  fontFamily: "var(--font-family-base)",
                  color: "var(--text-primary)",
                  borderBottom:
                    "var(--border-width-thin) solid var(--border-default)",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop:
                    "var(--border-width-thin) solid var(--border-default)",
                  fontFamily: "var(--font-family-base)",
                },
                "& .MuiTablePagination-root": {
                  fontFamily: "var(--font-family-base)",
                },
                "& .MuiDataGrid-toolbarContainer": {
                  padding: "var(--spacing-4)",
                  borderBottom:
                    "var(--border-width-thin) solid var(--border-default)",
                  "& .MuiButton-root": {
                    fontFamily: "var(--font-family-base)",
                    textTransform: "none",
                    color: "var(--text-primary)",
                  },
                },
              }}
              slots={{
                toolbar: GridToolbar,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}