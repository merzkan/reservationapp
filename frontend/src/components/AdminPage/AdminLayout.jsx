import { Box, Drawer } from "@mui/material";
import SlideBar from "./slidebar";
import AdminNavbar from "../Navbar/AdminNavbar"; 
import { Outlet } from "react-router-dom";

const drawerWidth = 240;
const navbarHeight = 64;

export default function AdminLayout({ query, setQuery, setIsLoggedIn }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#232629ff",
            color: "white",
          },
        }}
      >
        <SlideBar />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          mt: `${navbarHeight}px`,  
        }}
      >
        <Box sx={{ position: "fixed", width: `calc(100% - ${drawerWidth}px)`, top: 0, zIndex: 1100 }}>
          <AdminNavbar query={query} setQuery={setQuery} setIsLoggedIn={setIsLoggedIn} />
        </Box>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
