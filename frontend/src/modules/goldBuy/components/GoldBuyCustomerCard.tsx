import { Grid, TextField, Typography, Box } from "@/components/common";

export interface GoldBuyCustomerState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
}

interface GoldBuyCustomerCardProps {
  customer: GoldBuyCustomerState;
  onChange: (next: GoldBuyCustomerState) => void;
}

const fields: Array<{ key: keyof GoldBuyCustomerState; label: string }> = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address1", label: "Address 1" },
  { key: "address2", label: "Address 2" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
];

export default function GoldBuyCustomerCard({ customer, onChange }: GoldBuyCustomerCardProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Customer Information
      </Typography>

      <Grid container spacing={2.5}>
        {fields.map((field) => (
          <Grid key={field.key} size={{ xs: 12, md: 6 }}>
            <TextField
              label={field.label}
              value={customer[field.key]}
              onChange={(e) => onChange({ ...customer, [field.key]: e.target.value })}
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
