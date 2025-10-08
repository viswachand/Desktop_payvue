import { Box, Typography, Button } from "@/components/common";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" fontWeight={700} color="error" gutterBottom>
        Access Denied
      </Typography>
      <Typography color="text.secondary" mb={3}>
        You don’t have permission to view this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized;
