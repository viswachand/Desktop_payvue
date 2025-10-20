import React, { useState, useMemo } from "react";
import {
  Grid,
  TextField,
  Typography,
  Divider,
  Button,
  Card,
  useTheme,
  Select,
} from "@/components/common";
import { CardContent } from "@mui/material";
import HistoricalItemsTable from "./HistoricalItemsTable";
import HistoricalPaymentsTable from "./HistoricalPaymentsTable";
import SummaryCard from "./SummaryCard";
import PolicySelect from "@/components/common/PolicySelect";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { createHistoricalLayaway } from "@/features/layaway/layawaySlice";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

export default function HistoricalLayawayForm() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [form, setForm] = useState({
    customerInformation: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      address1: "",
      address2: "",
    },
    saleType: "",
    saleDate: "",
    policyTitle: "",
    policyDescription: "",
    comment: "",
    items: [],
    installments: [],
  });

  // 🧮 Compute totals
  const subtotal = useMemo(() => {
    return (
      form.items?.reduce(
        (acc: number, i: any) =>
          acc + (i.costPrice ?? 0) * (i.quantity ?? 1) - (i.discount ?? 0),
        0
      ) ?? 0
    );
  }, [form.items]);

  const discountTotal = useMemo(() => {
    return (
      form.items?.reduce(
        (acc: number, i: any) => acc + (i.discount ?? 0),
        0
      ) ?? 0
    );
  }, [form.items]);

  const totalPaid = useMemo(() => {
    return (
      form.installments?.reduce(
        (acc: number, i: any) => acc + (i.amount ?? 0),
        0
      ) ?? 0
    );
  }, [form.installments]);

  const tax = 0;
  const total = subtotal + tax - discountTotal;
  const balance = Math.max(total - totalPaid, 0);

  // 🔄 Handle state change
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 💾 Submit with computed fields
  const handleSubmit = async () => {
    if (totalPaid > total) {
      alert("Total payments cannot exceed total sale amount.");
      return;
    }

    const payload = {
      ...form,
      subtotal,
      tax,
      discountTotal,
      total,
      paidAmount: totalPaid,
      balance,
    };

    await dispatch(createHistoricalLayaway(payload));
  };

  // 🎨 Card style (light/dark mode)
  const cardStyle = {
    bgcolor:
      theme.palette.mode === "light"
        ? theme.palette.grey[50]
        : theme.palette.background.paper,
    borderRadius: 2,
    boxShadow: "none",
    border: `1px solid ${theme.palette.divider}`,
  };

  return (
    <Grid container spacing={3}>
      {/* 🧍 Customer Information */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Customer Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              {[
                { key: "firstName", label: "First Name" },
                { key: "lastName", label: "Last Name" },
                { key: "phone", label: "Phone" },
                { key: "email", label: "Email" },
                { key: "city", label: "City" },
                { key: "state", label: "State" },
                { key: "address1", label: "Address 1" },
                { key: "address2", label: "Address 2" },
              ].map((field) => (
                <Grid size={6} key={field.key}>
                  <TextField
                    label={field.label}
                    value={(form.customerInformation as any)[field.key] || ""}
                    onChange={(e) => {
                      const value =
                        field.key === "phone"
                          ? formatPhoneNumber(e.target.value)
                          : e.target.value;
                      handleChange("customerInformation", {
                        ...form.customerInformation,
                        [field.key]: value,
                      });
                    }}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* 🧾 Sale Details */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Sale Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={6}>
                <Select
                  label="Sale Type"
                  value={form.saleType}
                  onChange={(e) => handleChange("saleType", e.target.value)}
                  options={[
                    { value: "", label: "Select Sale Type" },
                    { value: "inventory", label: "Inventory" },
                    { value: "custom", label: "Custom" },
                    { value: "service", label: "Service" },
                    { value: "repair", label: "Repair" },
                  ]}
                  fullWidth
                />
              </Grid>

              <Grid size={6}>
                <TextField
                  label="Sale Date"
                  type="date"
                  value={form.saleDate}
                  onChange={(e) => handleChange("saleDate", e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  fullWidth
                />
              </Grid>

              {/* ✅ Policy select now returns description too */}
              <Grid size={12}>
                <PolicySelect
                  value={form.policyTitle}
                  onChange={(policy) =>
                    setForm((prev) => ({
                      ...prev,
                      policyTitle: policy.title,
                      policyDescription: policy.description,
                    }))
                  }
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Comment"
                  multiline
                  rows={3}
                  value={form.comment}
                  onChange={(e) => handleChange("comment", e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* 📦 Items + 💰 Payments */}
      <Grid size={{ xs: 12, md: 6 }} mt={2}>
        <Divider sx={{ mb: 1 }} />
        <HistoricalItemsTable
          items={form.items}
          onChange={(items) => handleChange("items", items)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} mt={2}>
        <Divider sx={{ mb: 1 }} />
        <HistoricalPaymentsTable
          installments={form.installments}
          onChange={(installments) =>
            handleChange("installments", installments)
          }
          totalAmount={total}
        />
      </Grid>

      {/* 💰 Summary */}
      <Grid size={12} mt={3}>
        <SummaryCard
          form={{
            ...form,
            subtotal,
            tax,
            discountTotal,
            total,
            paidAmount: totalPaid,
            balance,
          }}
        />
      </Grid>

      {/* Footer Buttons */}
      <Grid size={12} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Historical Layaway
        </Button>
      </Grid>
    </Grid>
  );
}
