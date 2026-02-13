import {
  Box,
  IconButton,
  Typography,
  Chip,
  Switch,
  FormControlLabel,
  Button,
} from "@/app/components/playbook";
import {
  ArrowBackIos,
  ReportGmailerrorredOutlined,
  WarningAmber,
  InfoOutlined,
  ExpandMore,
  MoreVert,
} from "@mui/icons-material";

export interface ChipData {
  label: string;
  color: "error" | "warning" | "info" | "default";
  icon?: React.ReactNode;
}

export interface MetadataItem {
  label: string;
  value?: string;
  showExpandIcon?: boolean;
}

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  showChips?: boolean;
  chips?: ChipData[];
  showMetadata?: boolean;
  metadata?: MetadataItem[];
  showSwitch?: boolean;
  switchLabel?: string;
  switchChecked?: boolean;
  onSwitchChange?: (checked: boolean) => void;
  showButton?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
  showMoreMenu?: boolean;
  onMoreMenuClick?: () => void;
  actions?: React.ReactNode;
  sx?: any;
}

export function Header({
  title,
  onBack,
  showChips = false,
  chips = [],
  showMetadata = false,
  metadata = [],
  showSwitch = false,
  switchLabel = "Label",
  switchChecked = false,
  onSwitchChange,
  showButton = false,
  buttonLabel = "Label",
  onButtonClick,
  showMoreMenu = false,
  onMoreMenuClick,
  actions,
  sx,
}: HeaderProps) {
  const getChipStyles = (color: ChipData["color"]) => {
    const styles = {
      error: {
        backgroundColor: "var(--destructive)",
        color: "var(--destructive-foreground)",
      },
      warning: {
        backgroundColor: "var(--orange-400)",
        color: "var(--white)",
      },
      info: {
        backgroundColor: "var(--yellow-100)",
        color: "var(--text-primary)",
      },
      default: {
        backgroundColor: "var(--muted)",
        color: "var(--text-primary)",
      },
    };
    return styles[color] || styles.default;
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "flex-start" },
        gap: "var(--spacing-3)",
        ...sx,
      }}
    >
      {/* Left side - Title and content */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-4)",
        }}
      >
        {/* Title row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-2)",
          }}
        >
          {onBack && (
            <IconButton
              onClick={onBack}
              sx={{
                color: "var(--color-text-primary)",
                p: "var(--spacing-1)",
              }}
            >
              <ArrowBackIos sx={{ fontSize: "20px" }} />
            </IconButton>
          )}
          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--font-size-h6)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-chart-metric-label)",
              lineHeight: 1.334,
            }} className="text-[rgb(166,166,166)]"
          >
            {title}
          </Typography>
        </Box>

        {/* Chips section - Optional */}
        {showChips && chips.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--spacing-2)",
            }}
          >
            {chips.map((chip, index) => (
              <Chip
                key={index}
                label={chip.label}
                icon={chip.icon}
                sx={{
                  ...getChipStyles(chip.color),
                  height: "24px",
                  borderRadius: "100px",
                  fontFamily: "var(--font-family-base)",
                  fontWeight: "var(--font-weight-regular)",
                  "& .MuiChip-icon": {
                    color: "inherit",
                    fontSize: "14px",
                  },
                  "& .MuiChip-label": {
                    px: "12px",
                    fontSize: "14px",
                    fontFamily: "var(--font-family-base)",
                    fontWeight: "var(--font-weight-regular)",
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Metadata section - Optional */}
        {showMetadata && metadata.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--spacing-1)",
              alignItems: "center",
            }}
          >
            {metadata.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "var(--font-family-base)",
                    fontSize: "var(--font-size-body2)",
                    fontWeight: "var(--font-weight-regular)",
                    color: "var(--color-text-primary)",
                    lineHeight: 1.43,
                  }}
                >
                  {item.label}
                  {item.value && ":"}
                </Typography>
                {item.value && (
                  <Typography
                    sx={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--font-size-body2)",
                      fontWeight: "var(--font-weight-regular)",
                      color: "var(--color-text-primary)",
                      lineHeight: 1.43,
                    }}
                  >
                    {item.value}
                  </Typography>
                )}
                {index < metadata.length - 1 && (
                  <Box
                    sx={{
                      width: "1px",
                      height: "16px",
                      backgroundColor:
                        "var(--border-color-default)",
                      mx: "var(--spacing-2)",
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Right side - Controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-1)",
          flexShrink: 0,
          alignSelf: { xs: "flex-start", md: "flex-start" },
        }}
      >
        {showButton && (
          <Button
            variant="contained"
            onClick={onButtonClick}
            sx={{
              backgroundColor: "var(--muted)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--font-size-body2)",
              fontWeight: "var(--font-weight-semibold)",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "var(--border)",
                boxShadow: "none",
              },
            }}
          >
            {buttonLabel}
          </Button>
        )}

        {showMoreMenu && (
          <IconButton
            onClick={onMoreMenuClick}
            sx={{
              backgroundColor: "var(--muted)",
              color: "var(--color-text-primary)",
              borderRadius: "var(--radius-sm)",
              p: "var(--spacing-2)",
              "&:hover": {
                backgroundColor: "var(--border)",
              },
            }}
          >
            <MoreVert sx={{ fontSize: "20px" }} />
          </IconButton>
        )}

        {actions}
      </Box>
    </Box>
  );
}