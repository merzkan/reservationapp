import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, CircularProgress, TablePagination, Chip, Avatar, Alert, Menu, MenuItem, Tooltip, TextField, Button} from "@mui/material";
import { CalendarMonthRounded, AccessTimeRounded, PersonRounded, SearchOffRounded, FilterListRounded, ClearRounded, ExpandMore, ExpandLess} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { fetchAllReservations, updateReservationStatus } from "../../api/apiAdmin";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import tr from "date-fns/locale/tr";

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
}));

export default function ReservationsByDatePaginated() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(31);
  const [stats, setStats] = useState({ totalReservations: 0, totalDates: 0 });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedResvId, setSelectedResvId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [range, setRange] = useState("daily");
  const [skipPast, setSkipPast] = useState(false);
  const [searchDate, setSearchDate] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false); 

  useEffect(() => {
    const loadReservations = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await fetchAllReservations();
        setReservations(data);
        setFilteredReservations(data);

        const totalReservations = data.length;
        const totalDates = new Set(data.map(r => new Date(r.date).toLocaleDateString("tr-TR"))).size;
        setStats({ totalReservations, totalDates });
      } catch (err) {
        setErrorMsg("Rezervasyonlar alınamadı. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };
    loadReservations();
  }, []);

  useEffect(() => {
    let filtered = [...reservations];
    const today = new Date();
    today.setHours(0,0,0,0);

    if (searchDate) {
      filtered = filtered.filter(r => new Date(r.date).toDateString() === searchDate.toDateString());
    } else {
      if (startDate || endDate) {
        filtered = filtered.filter(r => {
          const rDate = new Date(r.date);
          if (startDate && endDate) return rDate >= startDate && rDate <= endDate;
          if (startDate) return rDate >= startDate;
          if (endDate) return rDate <= endDate;
          return true;
        });
      }

      if (range !== "all") {
        filtered = filtered.filter(r => {
          const rDate = new Date(r.date);
          switch (range) {
            case "daily":
              return rDate.toDateString() === today.toDateString();
            case "weekly":
              const startOfWeek = new Date(today);
              startOfWeek.setDate(today.getDate() - today.getDay());
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              return rDate >= startOfWeek && rDate <= endOfWeek;
            case "monthly":
              return rDate.getMonth() === today.getMonth() && rDate.getFullYear() === today.getFullYear();
            default:
              return true;
          }
        });
      }

      if (skipPast) {
        filtered = filtered.filter(r => new Date(r.date) >= today);
      }
    }

    setFilteredReservations(filtered);
    setPage(0);
  }, [startDate, endDate, range, skipPast, searchDate, reservations]);

  const toggleFilters = () => setFiltersOpen(prev => !prev);

  const getStatusText = (resv) => {
    if (!resv.status) return "aktif";
    const status = resv.status.toLowerCase();
    if (status === "iptal" || status === "cancelled" || status === "canceled") return "iptal";

    const [hour, minute] = (resv.time || "00:00").split(":").map(Number);
    const resDateTime = new Date(resv.date);
    resDateTime.setHours(hour, minute, 0, 0);

    const now = new Date();

    if (resDateTime < now) return "tamamlandı"; 
    return "aktif"; 
  };


  const getStatusColor = (resv) => {
    const status = getStatusText(resv);
    switch (status) {
      case "aktif": return "primary";
      case "iptal": return "error";
      case "tamamlandı": return "default";
      default: return "default";
    }
  };

  const handleMenuOpen = (event, resvId) => {
    setAnchorEl(event.currentTarget);
    setSelectedResvId(resvId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedResvId(null);
  };

  const handleChangeStatus = async (newStatus) => {
    if (!selectedResvId) return;
    try {
      const updatedResv = await updateReservationStatus(selectedResvId, newStatus);
      setReservations(prev => prev.map(r => r._id === selectedResvId ? updatedResv : r));
    } catch (err) {
      console.error(err);
    } finally {
      handleMenuClose();
    }
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setRange("all");
    setSkipPast(false);
    setSearchDate(null);
  };

  const clearRangeAndStatusFilters = () => {
    setRange("daily");
    setSkipPast("daily");
  };

  const groupedReservations = filteredReservations.reduce((acc, r) => {
    const dateKey = new Date(r.date).toLocaleDateString("tr-TR");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(r);
    return acc;
  }, {});

  const dates = Object.keys(groupedReservations).sort(
    (b, a) => new Date(b.split(".").reverse().join("-")) - new Date(a.split(".").reverse().join("-"))
  );

  const paginatedDates = dates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 10 }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>Rezervasyonlar yükleniyor...</Typography>
    </Box>
  );

  if (errorMsg) return <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>{errorMsg}</Alert>;

  return (
    <Box sx={{ mt: 0, p: 0, mr: -2, ml: 2 }}>
      <Box sx={{ position: "relative", mb: 4 }}>
        <Box sx={{
          position: { xs: "static", md: "absolute" },
          top: { md: 0 },
          left: { md: 0 },
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
          mb: { xs: 2, md: 0 },
          width: { xs: "100%", md: "auto" }
        }}>
          <Box sx={{ p: 2, minWidth: 120, border: "1px solid #ddd", borderRadius: 3 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">{stats.totalReservations}</Typography>
            <Typography variant="body2">Toplam Rezervasyon</Typography>
          </Box>
          <Box sx={{ p: 2, minWidth: 120, border: "1px solid #ddd", borderRadius: 3 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">{stats.totalDates}</Typography>
            <Typography variant="body2">Toplam Gün</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: { md: 0 } }}>
          <Typography variant="h4" color="primary">Tüm Rezervasyonlar</Typography>
          <Button 
            variant="outlined" 
            startIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />} 
            onClick={toggleFilters} 
            sx={{ mt: 1 }}
          >
            Filtrele
          </Button>
        </Box>
      </Box>
      {filtersOpen && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3, mt:-2}}>
          <Paper sx={{ p: 2, borderRadius: 3, minWidth: 250, maxWidth: 510 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <FilterListRounded color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Tarihe Göre Filtrele</Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <DatePicker
                  label="Başlangıç Tarihi"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
                <DatePicker
                  label="Bitiş Tarihi"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
                {(startDate || endDate) && (
                  <Chip 
                    icon={<ClearRounded />} 
                    label="Temizle" 
                    onClick={clearFilters} 
                    color="default" 
                    variant="outlined" 
                    clickable 
                  />
                )}
              </Box>
            </LocalizationProvider>
          </Paper>
          <Paper sx={{ p: 2, borderRadius: 3, minWidth: 250, maxWidth: 520 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <FilterListRounded color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Aralık ve Durum Filtreleri</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              <TextField
                select
                label="Aralık"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="all">Hepsi</option>
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </TextField>

              <Chip
                label="Geçmiş Günleri Atla"
                color={skipPast ? "primary" : "default"}
                variant="outlined"
                clickable
                onClick={() => setSkipPast(prev => !prev)}
              />

              <Chip 
                icon={<ClearRounded />} 
                label="Sıfırla"
                onClick={clearRangeAndStatusFilters} 
                color="default" 
                variant="outlined" 
                clickable 
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 3, minWidth: 10, maxWidth: 160 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CalendarMonthRounded color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Günü Ara</Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
              <DatePicker
                label="Özel Gün"
                value={searchDate}
                onChange={(newValue) => setSearchDate(newValue)}
                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              />
              {searchDate && (
                <Chip 
                  icon={<ClearRounded />} 
                  label="Temizle" 
                  onClick={() => setSearchDate(null)} 
                  color="default" 
                  variant="outlined" 
                  clickable 
                  sx={{ mt: 1 }}
                />
              )}
            </LocalizationProvider>
          </Paper>
        </Box>
      )}
      {dates.length > 0 ? paginatedDates.map(date => (
        <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 3, overflow: { xs: "auto", md: "hidden" } }} key={date}>
          <Box sx={{ p: 2, backgroundColor: alpha("#1976d2", 0.1), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold"><CalendarMonthRounded sx={{ mr: 1 }} />{date}</Typography>
            <Chip label={`${groupedReservations[date].length} rezervasyon`} />
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kullanıcı</TableCell>
                <TableCell>Saat</TableCell>
                <TableCell>Not</TableCell>
                <TableCell align="center">Durum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedReservations[date].map(resv => (
                <StyledTableRow key={resv._id || resv.id}>
                  <TableCell sx={{ width: 180 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ mr: 1 }}><PersonRounded fontSize="small" /></Avatar>
                      <Box >
                        <Typography variant="subtitle2">{resv.userId ? `${resv.userId.name} ${resv.userId.surname}` : "Bilinmeyen Kullanıcı"}</Typography>
                        <Typography variant="body2" color="text.secondary">{resv.userId?.email || ""}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: 60 }}><Chip icon={<AccessTimeRounded />} label={resv.time || "-"} size="small" /></TableCell>

                  <TableCell sx={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <Tooltip title={resv.note || "-"} arrow placement="top">
                      <Typography variant="body2" noWrap>
                        {resv.note || "-"}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center" sx={{ width: 75 }}>
                    <Chip label={getStatusText(resv)} color={getStatusColor(resv)} size="Medium" onClick={(e) => handleMenuOpen(e, resv._id)} clickable />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )) : (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <SearchOffRounded sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {startDate || endDate || searchDate ? "Filtreye uygun rezervasyon bulunamadı" : "Henüz rezervasyon bulunmuyor"}
          </Typography>
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleChangeStatus("aktif")}>Aktif</MenuItem>
        <MenuItem onClick={() => handleChangeStatus("iptal")}>İptal</MenuItem>
        <MenuItem onClick={() => handleChangeStatus("tamamlandı")}>Tamamlandı</MenuItem>
      </Menu>

      {dates.length > 0 && (
        <TablePagination
          component="div"
          count={dates.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[1,7,14,31]}
          labelRowsPerPage="Sayfa başına gün:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count} gün`}
        />
      )}
    </Box>
  );
}
