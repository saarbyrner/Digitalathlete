import { Box } from "@/app/components/playbook";
import { useState } from "react";
import { MainNavigation } from "@/app/components/MainNavigation";
import { AppBarHeader } from "@/app/components/AppBarHeader";

export function BasicPageTemplate() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

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
          pageTitle="Page Title"
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
              px: "var(--spacing-6)",
              py: "var(--spacing-4)",
              flexGrow: 1,
              backgroundColor: "var(--background)",
            }}
        >
          {/* Empty content area - ready for your content */}
        </Box>
      </Box>
    </Box>
  );
}