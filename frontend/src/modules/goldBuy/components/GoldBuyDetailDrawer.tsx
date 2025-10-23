import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { GoldBuy } from "@payvue/shared/types/goldBuy";

interface GoldBuyDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  ticket: GoldBuy | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function GoldBuyDetailDrawer({
  open,
  onClose,
  ticket,
}: GoldBuyDetailDrawerProps) {
  if (!ticket) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 360, sm: 420 }, p: 3, pb: 5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            {ticket.ticketNumber}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Chip
          label={ticket.status.toUpperCase()}
          color={
            ticket.status === "cancelled"
              ? "default"
              : ticket.status === "paid" || ticket.status === "posted"
              ? "success"
              : "primary"
          }
          size="small"
          sx={{ mt: 2 }}
        />

        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          Created {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" color="text.secondary">
          Customer
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {ticket.customerInformation.firstName} {ticket.customerInformation.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ticket.customerInformation.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ticket.customerInformation.email}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Items
        </Typography>
        <List dense disablePadding>
          {ticket.items.map((item) => (
            <ListItem
              key={item.id ?? `${item.type}-${item.fineGoldGrams}`}
              disablePadding
              sx={{ py: 1 }}
            >
              <ListItemText
                primary={`${item.type} • ${item.metal.toUpperCase()} • ${item.karat}K`}
                secondary={`Fine: ${item.fineGoldGrams.toFixed(3)} g • Payout ${formatCurrency(
                  item.linePayout
                )}`}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Totals
        </Typography>
        <Box display="grid" gridTemplateColumns="1fr auto" rowGap={1}>
          <Typography variant="body2" color="text.secondary">
            Fine Gold
          </Typography>
          <Typography variant="body2" textAlign="right">
            {ticket.totals?.fineGoldGrams.toFixed(3)} g
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Gross Offer
          </Typography>
          <Typography variant="body2" textAlign="right">
            {formatCurrency(ticket.totals?.gross ?? 0)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Fees
          </Typography>
          <Typography variant="body2" textAlign="right">
            -{formatCurrency(ticket.totals?.fees ?? 0)}
          </Typography>

          <Typography variant="body1" fontWeight={600}>
            Net Payout
          </Typography>
          <Typography variant="body1" textAlign="right" fontWeight={700}>
            {formatCurrency(ticket.totals?.payout ?? 0)}
          </Typography>
        </Box>

        {ticket.comment && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Comment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ticket.comment}
            </Typography>
          </>
        )}
      </Box>
    </Drawer>
  );
}
