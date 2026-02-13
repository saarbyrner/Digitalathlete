import { Paper, Typography, Box } from "@mui/material";
import { getChartColorValues } from "./chartConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface DataTableCardProps {
  title?: string;
  columns: Array<{ id: string; label: string; showBar?: boolean }>;
  rows: Array<{ [key: string]: string | number }>;
}

export function DataTableCard({ title, columns, rows }: DataTableCardProps) {
  const colors = getChartColorValues();
  const getMaxValue = (columnId: string) => {
    return Math.max(...rows.map((row) => Number(row[columnId]) || 0));
  };

  return (
    <Paper
      sx={{
        borderRadius: "var(--radius-lg)",
        border: "var(--border-width-thin) solid var(--border-default)",
        backgroundColor: "var(--white)",
        overflow: "hidden",
      }}
    >
      {title && (
        <Box sx={{ p: "var(--spacing-6)", borderBottom: "var(--border-width-thin) solid var(--border-default)" }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "var(--font-family-base)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--text-primary)",
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "var(--grey-50)",
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontFamily: "var(--font-family-base)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--text-primary)",
                    borderBottom: "var(--border-width-thin) solid var(--border-default)",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                  },
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      fontFamily: "var(--font-family-base)",
                      color: "var(--text-primary)",
                      borderBottom: "var(--border-width-thin) solid var(--border-default)",
                    }}
                  >
                    {column.showBar ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "var(--font-family-base)",
                            minWidth: 40,
                          }}
                        >
                          {row[column.id]}
                        </Typography>
                        <Box
                          sx={{
                            height: 8,
                            backgroundColor: colors.tableBar1,
                            borderRadius: "var(--radius-sm)",
                            width: `${(Number(row[column.id]) / getMaxValue(column.id)) * 100}%`,
                            minWidth: 4,
                          }}
                        />
                      </Box>
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}