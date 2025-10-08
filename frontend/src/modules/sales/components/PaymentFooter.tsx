import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  useTheme,
} from "@/components/common";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  selectAllPolicies,
  fetchPolicies,
} from "@/features/policy/policySlice";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Policy } from "@payvue/shared/types/policy";

interface PaymentFooterProps {
  onSelectLayaway: (isLayaway: boolean) => void;
  onSelectPolicy: (policy: { title: string; description: string }) => void;
}

export default function PaymentFooter({
  onSelectLayaway,
  onSelectPolicy,
}: PaymentFooterProps) {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const policies = useSelector(selectAllPolicies);

  const [selectedPolicy, setSelectedPolicy] = useState<string>("");
  const [isLayaway, setIsLayaway] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchPolicies());
  }, [dispatch]);

  const activePolicy = useMemo(
    () => policies.find((p: Policy) => p.title === selectedPolicy),
    [policies, selectedPolicy]
  );

  const handlePolicyChange = (event: SelectChangeEvent<string>) => {
    const selectedTitle = event.target.value;
    setSelectedPolicy(selectedTitle);

    const policy = policies.find((p: Policy) => p.title === selectedTitle);
    if (policy) {
      onSelectPolicy({
        title: policy.title,
        description: policy.description,
      });
    }
  };

  const handleLayawayToggle = () => {
    const newValue = !isLayaway;
    setIsLayaway(newValue);
    onSelectLayaway(newValue);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container alignItems="center" spacing={2}>
        {/* 🔽 Sale Policy */}
        <Grid size={{xs : 7}}>
          <FormControl fullWidth size="small">
            <InputLabel>Sale Policy</InputLabel>
            <Select
              value={selectedPolicy}
              label="Sale Policy"
              onChange={handlePolicyChange}
              disabled={!policies.length}
              sx={{
                borderRadius: 1.5,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              {policies.map((p: Policy) => (
                <MenuItem key={p.id} value={p.title}>
                  {p.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 💼 Layaway Button */}
        <Grid size={{xs : 5}}>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              mt: { xs: 1, md: 0 },
            }}
          >
            <Button
              variant={isLayaway ? "contained" : "outlined"}
              color="primary"
              onClick={handleLayawayToggle}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1.5,
                px: 3,
                py: 1,
              }}
            >
              Layaway
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
