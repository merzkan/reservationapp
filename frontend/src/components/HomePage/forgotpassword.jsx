import { useState } from "react";
import axios from "axios";
import { Container, Paper, Typography, Box, TextField, Button, Alert, InputAdornment, Fade, CircularProgress } from "@mui/material";
import { EmailRounded, LockResetRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.backend) setErrors({});
    if (status) setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/forgot-password`, { email });

      if (res.status === 200) {
        setStatus("Şifre sıfırlama linki e-postanıza gönderildi.");
        setEmail("");
      }
    } catch (err) {
      setErrors({ backend: err.response?.data?.message || "Sunucu hatası" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: `calc(100vh - 64px)`, display: "flex", alignItems: "flex-start", justifyContent: "center", pt: 10 }}>
      <Fade in timeout={800}>
        <Paper
          elevation={10}
          sx={{
            p: 3,
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Box sx={{ backgroundColor: "#1976d2", height: 60, width: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <LockResetRounded sx={{ color: "white", fontSize: 30 }} />
            </Box>
            <Typography variant="h4" component="h1" align="center" gutterBottom color="#1976d2" fontWeight="bold">
              Şifremi Unuttum
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
              E-posta adresinizi girin, size sıfırlama linki gönderelim
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="E-posta Adresi"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={handleChange}
              placeholder="ornek@email.com"
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailRounded color="primary" /></InputAdornment>,
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, transition: "all 0.3s ease" } }}
            />

            {errors.backend && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{errors.backend}</Alert>}
            {status && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{status}</Alert>}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #1976d2 0%, #42a5f5 100%)",
                boxShadow: "0 4px 8px rgba(25, 118, 210, 0.3)",
                "&:hover": { boxShadow: "0 6px 12px rgba(25, 118, 210, 0.4)", background: "linear-gradient(45deg, #1565c0 0%, #42a5f5 100%)" },
              }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockResetRounded />}
            >
              {isLoading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button color="primary" size="small" onClick={() => navigate("/login")}>Giriş Sayfasına Dön</Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
}
