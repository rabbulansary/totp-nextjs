'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Typography, Box } from "@mui/material";
import { generateTOTP } from '@/utils';


export default function Home() {
  const [otp, setOtp] = useState("");
  const [totp, setTotp] = useState("------");

  useEffect(() => {
    if (!totp) return;

    const updateOtp = async () => await generateTOTP(otp);
    updateOtp();
    const interval = setInterval(updateOtp, 30 * 1000);
    return () => clearInterval(interval);
  }, [totp]);

  function generateOtp() {
    if (!otp) {
      alert("Please enter a secret key.");
      return;
    }
    generateTOTP(otp).then(setTotp);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        TOTP Generator
      </Typography>
      <Input
        placeholder="Enter secret key"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        sx={{ mb: 2, width: 300 }}
      />
      <Button
        variant="contained"
        color="success"
        sx={{ mb: 2 }}
        onClick={() => generateOtp()}
      >
        Generate TOTP
      </Button>
      <Typography variant="h6" sx={{ mt: 2, color: 'success.main' }}>
        Generated TOTP: {totp}
      </Typography>
    </Box>
  );
}
