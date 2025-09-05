import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import HomeNavbar from "./Navbar/HomeNavbar";
import UserNavbar from "./Navbar/UserNavbar";
import AdminNavbar from "./Navbar/AdminNavbar";

import Home from "./HomePage/home";
import Login from "./HomePage/login";
import Register from "./HomePage/register";
import ResetPassword from "./HomePage/resetpassword"
import ForgotPassword from "./HomePage/forgotpassword"

import Reservation from "./UserPage/reservation";
import Reservationed from "./UserPage/reservationed";

import Setting from "./AdminPage/setting";
import Users from "./AdminPage/usersTable";
import AdminLayout from "./AdminPage/AdminLayout";

import ReservationAdmin from "./AdminPage/reservationAdmin";

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [query, setQuery] = useState("");

  let routes;
  let navbar;

  if (!isLoggedIn) {
    navbar = <HomeNavbar />;
    routes = (
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  } else if (isAdmin) {
    navbar = <AdminNavbar query={query} setQuery={setQuery} setIsLoggedIn={setIsLoggedIn} />;
    routes = (
      <Routes>
        <Route path="/dashboard/*" element={<AdminLayout query={query} setQuery={setQuery} setIsLoggedIn={setIsLoggedIn} />}>
          <Route path="users" element={<Users query={query} setQuery={setQuery} />} />
          <Route path="reservation" element={<ReservationAdmin />} />
          <Route path="setting" element={<Setting />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );

  } else {
    navbar = <UserNavbar setIsLoggedIn={setIsLoggedIn} />;
    routes = (
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservationed" element={<Reservationed />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  }

  return (
    <BrowserRouter>
      {navbar}
      {routes}
    </BrowserRouter>
  );
}
