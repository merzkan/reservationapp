import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { AccountCircleRounded, ExitToAppRounded } from "@mui/icons-material";
import SearchField from "./search";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar({ query, setQuery, setIsLoggedIn }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "rgba(25, 118, 210, 0.98)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/dashboard/users")}>
          ADMIN PANEL
        </Typography>
        <Box sx={{ display: "flex", gap: 1, overflowX: { xs: "auto", md: "visible" }, maxWidth: { xs: "70%", sm: "80%", md: "none" }, "&::-webkit-scrollbar": { display: "none" } }}>
          <SearchField value={query} onChange={(e) => setQuery(e.target.value)} />
          <IconButton onClick={handleMenuOpen} color="inherit"><AccountCircleRounded /></IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>{JSON.parse(localStorage.getItem("user") || "{}").email || "Admin"}</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}><ExitToAppRounded sx={{ mr: 1 }} /> Çıkış Yap</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
