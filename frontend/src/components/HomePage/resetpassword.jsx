import { useState } from "react";
import axios from "axios";
import { Container, Paper, Typography, Box, TextField, Button, Alert, InputAdornment, IconButton, Fade, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff, LockRounded } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors.backend) setErrors({});
    if (status) setStatus(null);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ backend: "Şifreler eşleşmiyor" });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setErrors({ backend: "Şifre en az 8 karakter olmalı" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/reset-password/${token}`,
        { newPassword: formData.newPassword }
      );


      if (res.status === 200) {
        setStatus("Şifre başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => navigate("/login"), 2000);
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
              <LockRounded sx={{ color: "white", fontSize: 30 }} />
            </Box>
            <Typography variant="h4" component="h1" align="center" gutterBottom color="#1976d2" fontWeight="bold">
              Şifreyi Sıfırla
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
              Yeni şifrenizi belirleyin
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Yeni Şifre"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Yeni şifre"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockRounded color="primary" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, transition: "all 0.3s ease" } }}
            />
            <TextField
              label="Yeni Şifre (Tekrar)"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Yeni şifre tekrar"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockRounded color="primary" /></InputAdornment>,
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
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockRounded />}
            >
              {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
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
