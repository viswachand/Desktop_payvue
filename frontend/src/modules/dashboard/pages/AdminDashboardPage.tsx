import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Snackbar } from "@/components/common";
import type { AppDispatch } from "@/app/store";
import {
  fetchSales,
  selectSales,
  selectSaleError,
  clearSaleError,
} from "@/features/sales/saleSlice";
import {
  fetchLayaways,
  selectLayaways,
  selectLayawayError,
  clearLayawayError,
} from "@/features/layaway/layawaySlice";
import {
  fetchGoldBuys,
  selectGoldBuyRecords,
  selectGoldBuyError,
  clearGoldBuyError,
} from "@/features/goldBuy/goldSlice";
import SummaryCards from "../components/SummaryCards";
import SalesTrendChart from "../components/SalesTrendChart";
import TodaySalesDonutChart from "../components/TodaySalesDonutChart";

type SaleTypeKey = "inventory" | "service" | "custom" | "layaway" | "gold_buy";

const saleTypeLabels: Record<SaleTypeKey, string> = {
  inventory: "Inventory",
  service: "Service",
  custom: "Custom",
  layaway: "Layaway",
  gold_buy: "Gold Buy",
};

const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

export default function AdminDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();

  const sales = useSelector(selectSales);
  const layaways = useSelector(selectLayaways);
  const goldBuys = useSelector(selectGoldBuyRecords);

  const salesError = useSelector(selectSaleError);
  const layawayError = useSelector(selectLayawayError);
  const goldError = useSelector(selectGoldBuyError);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    if (!sales.length) dispatch(fetchSales());
    if (!layaways.length) dispatch(fetchLayaways());
    if (!goldBuys.length) dispatch(fetchGoldBuys());
  }, [dispatch, sales.length, layaways.length, goldBuys.length]);

  useEffect(() => {
    const message = salesError || layawayError || goldError;
    if (message) {
      setSnackMessage(message);
      setSnackOpen(true);
    }
  }, [salesError, layawayError, goldError]);

  const handleSnackClose = () => {
    setSnackOpen(false);
    dispatch(clearSaleError());
    dispatch(clearLayawayError());
    dispatch(clearGoldBuyError());
  };

  const aggregated = useMemo(() => {
    const saleTypes: SaleTypeKey[] = ["inventory", "service", "custom", "layaway", "gold_buy"];

    const startOfDay = (input: Date) => {
      const date = new Date(input);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const createDateKey = (date: Date) => startOfDay(date).toISOString().split("T")[0];

    const createRange = (days: number) => {
      const today = startOfDay(new Date());
      const range: Date[] = [];
      for (let offset = days - 1; offset >= 0; offset -= 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        range.push(date);
      }
      return range;
    };

    const initializeMap = (range: Date[]) => {
      const map = new Map<string, { label: string } & Record<SaleTypeKey, number>>();
      range.forEach((date) => {
        const key = createDateKey(date);
        const label = range.length > 14
          ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : date.toLocaleDateString("en-US", { weekday: "short" });
        const base: Record<SaleTypeKey, number> = {
          inventory: 0,
          service: 0,
          custom: 0,
          layaway: 0,
          gold_buy: 0,
        };
        map.set(key, { label, ...base });
      });
      return map;
    };

    const weekRange = createRange(7);
    const monthRange = createRange(30);
    const weekMap = initializeMap(weekRange);
    const monthMap = initializeMap(monthRange);
    const todayKey = createDateKey(new Date());
    const todayTotals: Record<SaleTypeKey, number> = {
      inventory: 0,
      service: 0,
      custom: 0,
      layaway: 0,
      gold_buy: 0,
    };

    const resolveSaleType = (saleTypeValue: string | undefined, isLayaway: boolean): SaleTypeKey => {
      if (isLayaway) return "layaway";
      switch ((saleTypeValue ?? "inventory").toLowerCase()) {
        case "service":
        case "repair":
          return "service";
        case "custom":
          return "custom";
        case "layaway":
          return "layaway";
        case "gold_buy":
          return "gold_buy";
        default:
          return "inventory";
      }
    };

    const applyValue = (dateKey: string, type: SaleTypeKey, amount: number) => {
      const apply = (map: Map<string, { label: string } & Record<SaleTypeKey, number>>) => {
        const entry = map.get(dateKey);
        if (entry) {
          entry[type] += amount;
        }
      };
      apply(weekMap);
      apply(monthMap);
      if (dateKey === todayKey) {
        todayTotals[type] += amount;
      }
    };

    sales.forEach((sale) => {
      const created = sale.createdAt ? new Date(sale.createdAt) : null;
      if (!created) return;
      const dateKey = createDateKey(created);
      const amount = sale.total ?? 0;
      const type = resolveSaleType(sale.saleType, sale.isLayaway ?? false);
      applyValue(dateKey, type, amount);
    });

    goldBuys.forEach((ticket) => {
      const created = ticket.createdAt ? new Date(ticket.createdAt) : null;
      if (!created) return;
      const dateKey = createDateKey(created);
      const amount = ticket.totals?.payout ?? 0;
      applyValue(dateKey, "gold_buy", amount);
    });

    const weekDataset = Array.from(weekMap.values());
    const monthDataset = Array.from(monthMap.values());
    const weekLabels = weekDataset.map((item) => item.label);
    const weekTotals = weekDataset.map((item) =>
      saleTypes.reduce((sum, type) => sum + item[type], 0)
    );

    const aggregateFor = (dataset: Array<{ label: string } & Record<SaleTypeKey, number>>) =>
      saleTypes.map((type) => ({
        label: saleTypeLabels[type],
        value: dataset.reduce((sum, item) => sum + item[type], 0),
      }));

    const donutData = saleTypes.map((type, index) => ({
      id: index,
      label: saleTypeLabels[type],
      value: Number(todayTotals[type].toFixed(2)),
    }));

    return {
      trend: { week: weekDataset, month: monthDataset },
      breakdown: { week: aggregateFor(weekDataset), month: aggregateFor(monthDataset) },
      today: {
        segments: donutData,
        total: donutData.reduce((sum, item) => sum + item.value, 0),
      },
      weekSeries: {
        labels: weekLabels,
        totals: weekTotals,
        layaway: weekDataset.map((item) => item.layaway),
        gold: weekDataset.map((item) => item.gold_buy),
      },
    };
  }, [sales, goldBuys]);

  const dashboardMetrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total ?? 0), 0);
    const paidSales = sales.filter((sale) => sale.status === "paid" || sale.balanceAmount === 0);
    const pendingLayaways = layaways.filter(
      (entry) => entry.status !== "paid" && (entry.balanceAmount ?? 0) > 0
    );
    const totalLayawayBalance = pendingLayaways.reduce(
      (sum, entry) => sum + (entry.balanceAmount ?? 0),
      0
    );
    const goldPayout = goldBuys.reduce((sum, ticket) => sum + (ticket.totals?.payout ?? 0), 0);
    const sevenDayAverage = aggregated.weekSeries.totals.length
      ? aggregated.weekSeries.totals.reduce((sum, value) => sum + value, 0) /
        aggregated.weekSeries.totals.length
      : 0;
    const goldAverage = aggregated.weekSeries.gold.length
      ? aggregated.weekSeries.gold.reduce((sum, value) => sum + value, 0) /
        aggregated.weekSeries.gold.length
      : 0;

    return [
      {
        label: "Total Today Sales",
        value: currency(aggregated.today.total),
        helper: `7-day avg ${currency(sevenDayAverage)}`,
        tone: "primary" as const,
        sparkline: {
          data: aggregated.weekSeries.totals,
          labels: aggregated.weekSeries.labels,
        },
      },
      {
        label: "Total Revenue",
        value: currency(totalRevenue),
        helper: `${paidSales.length} fulfilled sales`,
        tone: "success" as const,
        sparkline: {
          data: aggregated.weekSeries.totals,
          labels: aggregated.weekSeries.labels,
        },
      },
      {
        label: "Total Layaway Balance",
        value: currency(totalLayawayBalance),
        helper: `${pendingLayaways.length} open layaways`,
        tone: "warning" as const,
        sparkline: {
          data: aggregated.weekSeries.layaway,
          labels: aggregated.weekSeries.labels,
        },
      },
      {
        label: "Gold Buy Exposure",
        value: currency(goldPayout),
        helper: `${goldBuys.length} tickets`,
        tone: "secondary" as const,
        sparkline: {
          data: aggregated.weekSeries.gold,
          labels: aggregated.weekSeries.labels,
        },
        emptyFallback: goldAverage === 0 ? "No activity in the past week." : undefined,
      },
    ];
  }, [aggregated, sales, layaways, goldBuys]);

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <SummaryCards metrics={dashboardMetrics} />

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", lg: "2fr 1fr" }} gap={3}>
        <SalesTrendChart datasets={aggregated.trend} />
        <Box display="grid" gap={3}>
          <TodaySalesDonutChart data={aggregated.today.segments} />
        </Box>
      </Box>

      <Snackbar
        open={snackOpen}
        onClose={handleSnackClose}
        message={snackMessage}
        severity="error"
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}
