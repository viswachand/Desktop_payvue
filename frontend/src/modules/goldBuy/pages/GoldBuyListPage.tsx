import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Snackbar, useTheme } from "@/components/common";
import type { AppDispatch } from "@/app/store";
import {
  fetchGoldBuys,
  selectGoldBuyRecords,
  selectGoldBuyLoading,
  selectGoldBuyError,
  clearGoldBuyError,
} from "@/features/goldBuy/goldSlice";
import type { GoldBuy } from "@payvue/shared/types/goldBuy";
import GoldBuyOverviewCards from "../components/GoldBuyOverviewCards";
import GoldBuyTable from "../components/GoldBuyTable";
import GoldBuyDetailDrawer from "../components/GoldBuyDetailDrawer";
import { useNavigate } from "react-router-dom";

export default function GoldBuyListPage() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const records = useSelector(selectGoldBuyRecords);
  const loading = useSelector(selectGoldBuyLoading);
  const error = useSelector(selectGoldBuyError);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<GoldBuy | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGoldBuys());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackOpen(true);
    }
  }, [error]);

  const handleCloseSnack = () => {
    setSnackOpen(false);
    dispatch(clearGoldBuyError());
  };

  const sortedRecords = useMemo(
    () =>
      [...records].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }),
    [records]
  );

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 3 },
        maxWidth: "100%",
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={2}>
        Gold Buy Tickets
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Track every intake, monitor payout exposure, and open new gold buy tickets in one place.
      </Typography>

      <GoldBuyOverviewCards records={sortedRecords} />

      <Box
        mt={4}
        p={{ xs: 2, md: 3 }}
        borderRadius={3}
        border={`1px solid ${theme.palette.divider}`}
        bgcolor={theme.palette.background.paper}
        boxShadow={theme.customShadows?.card}
      >
        <GoldBuyTable
          records={sortedRecords}
          loading={loading}
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onNew={() => navigate("/goldbuy/new")}
          onRowClick={(ticket) => setSelectedTicket(ticket)}
        />
      </Box>

      <GoldBuyDetailDrawer
        open={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
      />

      <Snackbar
        open={snackOpen}
        onClose={handleCloseSnack}
        message={error ?? ""}
        severity="error"
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}
