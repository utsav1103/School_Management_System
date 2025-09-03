import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 1,
          background: `url(/images/dark-wood.jpg)`, // reuse your wooden texture
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          padding: "20px 10px",
          color: "white",
          textAlign: "center",
          borderTop: "2px solid rgba(255, 255, 255, 0.2)", // soft border for separation
          boxShadow: "0 -4px 12px rgba(0,0,0,0.6)", // slight shadow at top
        }}
        component={"footer"}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            letterSpacing: 1,
            color: "#f5f5f5",
            textShadow: "0 0 6px rgba(255,255,255,0.4)", // glowing white effect
          }}
        >
          School Management System
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: "0.9rem",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          All rights reserved &copy; Copyright 2025
        </Typography>
      </Box>
    </>
  );
}
