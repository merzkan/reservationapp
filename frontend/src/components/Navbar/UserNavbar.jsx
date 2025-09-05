import { AppBar, Toolbar, Button, Typography, Box, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeRounded, CalendarMonthRounded, ListAltRounded, ExitToAppRounded, AccountCircleRounded, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";

export default function UserNavbar({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMobileMenuOpen = (e) => setMobileMenuAnchor(e.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

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
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/home")}>
          REZERVASYON
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <Button {...buttonStyle("/home")} onClick={() => navigate("/home")} startIcon={<HomeRounded />}>Ana Sayfa</Button>
          <Button {...buttonStyle("/reservation")} onClick={() => navigate("/reservation")} startIcon={<CalendarMonthRounded />}>Rezervasyon</Button>
          <Button {...buttonStyle("/reservationed")} onClick={() => navigate("/reservationed")} startIcon={<ListAltRounded />}>Rezervasyonlarım</Button>
          <IconButton onClick={handleMenuOpen} color="inherit"><AccountCircleRounded /></IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>{JSON.parse(localStorage.getItem("user") || "{}").email || "Kullanıcı"}</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}><ExitToAppRounded sx={{ mr: 1 }} /> Çıkış Yap</MenuItem>
          </Menu>
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="inherit" onClick={handleMobileMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            PaperProps={{ sx: { mt: 1.5, minWidth: 200, borderRadius: 2 } }}
          >
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate("/home"); }}>
              <HomeRounded sx={{ mr: 1 }} /> Ana Sayfa
            </MenuItem>
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate("/reservation"); }}>
              <CalendarMonthRounded sx={{ mr: 1 }} /> Rezervasyon
            </MenuItem>
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate("/reservationed"); }}>
              <ListAltRounded sx={{ mr: 1 }} /> Rezervasyonlarım
            </MenuItem>
            <Divider />
            <MenuItem disabled>{JSON.parse(localStorage.getItem("user") || "{}").email || "Kullanıcı"}</MenuItem>
            <MenuItem onClick={() => { handleMobileMenuClose(); handleLogout(); }}>
              <ExitToAppRounded sx={{ mr: 1 }} /> Çıkış Yap
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
