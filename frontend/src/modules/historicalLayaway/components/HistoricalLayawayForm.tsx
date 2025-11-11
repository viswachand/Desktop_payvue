import React, { useState, useMemo } from "react";
import { Grid, TextField, Typography, Button, Card, useTheme, Select, Stack } from "@/components/common";
import { CardContent, CardHeader, Divider } from "@mui/material";
import HistoricalItemsTable from "./HistoricalItemsTable";
import HistoricalPaymentsTable from "./HistoricalPaymentsTable";
import SummaryCard from "./SummaryCard";
import PolicySelect from "@/components/common/PolicySelect";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { createHistoricalLayaway } from "@/features/layaway/layawaySlice";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

interface HistoricalLayawayFormProps {
  onCancel?: () => void;
}

export default function HistoricalLayawayForm({ onCancel }: HistoricalLayawayFormProps) {
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

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const normalizeDateForSubmit = (value?: string) => {
    if (!value) return undefined;
    const parsed = value.includes("T")
      ? new Date(value)
      : new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return undefined;
    return parsed.toISOString();
  };

  const handleSubmit = async () => {
    if (totalPaid > total) {
      alert("Total payments cannot exceed total sale amount.");
      return;
    }

    const normalizedInstallments =
      form.installments?.map((installment: any) => ({
        ...installment,
        paidAt: normalizeDateForSubmit(installment.paidAt),
      })) ?? [];

    const payload = {
      ...form,
      subtotal,
      tax,
      discountTotal,
      total,
      paidAmount: totalPaid,
      balance,
      saleDate: normalizeDateForSubmit(form.saleDate),
      installments: normalizedInstallments,
    };

    await dispatch(createHistoricalLayaway(payload));
  };

  const cardStyle = {
    borderRadius: 3,
    boxShadow: "none",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  };

  const customerFields = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "address1", label: "Address 1" },
    { key: "address2", label: "Address 2" },
  ];

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Stack spacing={3}>
          <Card sx={cardStyle}>
            <CardHeader
              titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
              title="Customer Information"
            />
            <Divider />
            <CardContent sx={{ pt: 3 }}>
              <Grid container spacing={2.5}>
                {customerFields.map((field) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={field.key}>
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

          <Card sx={cardStyle}>
            <CardHeader
              titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
              title="Sale Details"
            />
            <Divider />
            <CardContent sx={{ pt: 3 }}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
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

                <Grid size={{ xs: 12, sm: 6 }}>
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

                <Grid size={{ xs: 12 }}>
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

                <Grid size={{ xs: 12 }}>
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

          <Card sx={cardStyle}>
            <CardHeader
              titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
              title="Items"
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <HistoricalItemsTable
                items={form.items}
                onChange={(items) => handleChange("items", items)}
              />
            </CardContent>
          </Card>

          <Card sx={cardStyle}>
            <CardHeader
              titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
              title="Payments"
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <HistoricalPaymentsTable
                installments={form.installments}
                onChange={(installments) => handleChange("installments", installments)}
                totalAmount={total}
              />
            </CardContent>
          </Card>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack spacing={3} sx={{ position: { lg: "sticky" }, top: { lg: 32 } }}>
          <SummaryCard
            totals={{
              subtotal,
              tax,
              discountTotal,
              total,
              paidAmount: totalPaid,
              balance,
            }}
          />
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>
                Policy Details
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1.5}>
                {form.policyDescription || "Select a policy to view the linked terms."}
              </Typography>
            </CardContent>
          </Card>
          <Stack direction="column" spacing={1.5}>
            <Button variant="outlined" color="inherit" onClick={onCancel} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ textTransform: "none" }}
            >
              Save Historical Layaway
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
