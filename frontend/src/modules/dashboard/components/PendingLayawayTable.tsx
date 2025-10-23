import { memo } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import type { Sale } from "@payvue/shared/types/sale";

interface PendingLayawayTableProps {
  layaways: Sale[];
}

function PendingLayawayTableComponent({ layaways }: PendingLayawayTableProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.customShadows?.card,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Pending Layaways
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Invoice</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {layaways.map((entry) => {
            const balance = entry.balanceAmount ?? 0;
            const created = entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "";
            return (
              <TableRow key={entry.id ?? entry.invoiceNumber ?? created} hover>
                <TableCell>
                  {`${entry.customerInformation.firstName} ${entry.customerInformation.lastName ?? ""}`.trim()}
                </TableCell>
                <TableCell>{entry.invoiceNumber ?? "—"}</TableCell>
                <TableCell align="right">
                  {balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </TableCell>
                <TableCell align="right">{created}</TableCell>
              </TableRow>
            );
          })}
          {!layaways.length && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="body2" color="text.secondary">
                  No pending layaways.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}

const PendingLayawayTable = memo(PendingLayawayTableComponent);
export default PendingLayawayTable;
