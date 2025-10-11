import { InputAdornment } from "@mui/material";
import { Box, Typography, Button, TextField } from "@/components/common";
import { AddRounded, SearchRounded } from "@mui/icons-material";
import { useState } from "react";

interface Props {
  onCreate: () => void;
}

export default function PoliciesHeader({ onCreate }: Props) {
  const [search, setSearch] = useState("");

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h5" fontWeight={600}>
        Policies
      </Typography>

      <Box display="flex" gap={2}>
        <TextField
          size="small"
          placeholder="Search policies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={onCreate}
          fullWidth
        >
          New Policy
        </Button>
      </Box>
    </Box>
  );
}
