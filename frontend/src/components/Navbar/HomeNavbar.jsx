import { AppBar, Toolbar, Button, Typography, Box, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeRounded, LoginRounded, HowToRegRounded, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";

export default function HomeNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const buttonStyle = (path) => ({
    sx: {
      color: location.pathname === path ? "primary.contrastText" : "white",
      backgroundColor: location.pathname === path ? "rgba(255,255,255,0.3)" : "transparent",
      borderRadius: 2,
      px: 2,
      py: 1,
      "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
      display: "flex",
      alignItems: "center",
      gap: 1,
    },
  });

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "rgba(25, 118, 210, 0.98)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: { xs: 1, sm: 2 } }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/home")}>
          REZERVASYON
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
          <Button {...buttonStyle("/home")} onClick={() => navigate("/home")} startIcon={<HomeRounded />}>Ana Sayfa</Button>
          <Button {...buttonStyle("/login")} onClick={() => navigate("/login")} startIcon={<LoginRounded />}>Giriş Yap</Button>
          <Button {...buttonStyle("/register")} onClick={() => navigate("/register")} startIcon={<HowToRegRounded />}>Kayıt Ol</Button>
        </Box>
        <Box sx={{ display: { xs: "flex", sm: "none" } }}>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { mt: 1.5, minWidth: 200, borderRadius: 2 } }}
          >
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/home'); }}>
              <HomeRounded sx={{ mr: 1 }} /> Ana Sayfa
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/login'); }}>
              <LoginRounded sx={{ mr: 1 }} /> Giriş Yap
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/register'); }}>
              <HowToRegRounded sx={{ mr: 1 }} /> Kayıt Ol
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
