import React, { useEffect, useState, useMemo } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  selectAllPolicies,
  fetchPolicies,
} from "@/features/policy/policySlice";
import type { Policy } from "@payvue/shared/types/policy";

interface PolicySelectProps {
  /** Selected policy title */
  value?: string;
  /** Fired when user picks a policy */
  onChange: (policy: { title: string; description: string }) => void;
  /** Optional label override */
  label?: string;
  /** Optional disabled state */
  disabled?: boolean;
  /** Optional size (small | medium) */
  size?: "small" | "medium";
}

/**
 * 🔽 PolicySelect — Reusable dropdown that fetches and selects sale policies.
 * Automatically loads all policies via Redux.
 */
export default function PolicySelect({
  value = "",
  onChange,
  label = "Sale Policy",
  disabled = false,
  size = "small",
}: PolicySelectProps) {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const policies = useSelector(selectAllPolicies);
  const [selected, setSelected] = useState<string>(value);

  // Fetch policies on mount
  useEffect(() => {
    if (!policies.length) dispatch(fetchPolicies());
  }, [dispatch, policies.length]);

  const activePolicy = useMemo(
    () => policies.find((p: Policy) => p.title === selected),
    [policies, selected]
  );

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedTitle = event.target.value;
    setSelected(selectedTitle);

    const policy = policies.find((p: Policy) => p.title === selectedTitle);
    if (policy) {
      onChange({
        title: policy.title,
        description: policy.description,
      });
    }
  };

  return (
    <FormControl fullWidth size={size} disabled={disabled || !policies.length}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={selected}
        label={label}
        onChange={handleChange}
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
  );
}
