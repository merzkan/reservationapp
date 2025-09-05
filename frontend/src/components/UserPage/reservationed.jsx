import { useState, useEffect } from "react";
import {Box,Paper,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,CircularProgress,Chip,Button,Fade,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,} from "@mui/material";
import { Refresh, Event, Schedule, Notes } from "@mui/icons-material";
import { fetchUserReservationsAPI, cancelReservationAPI } from "../../api/apiUser";

export default function Reservationed() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedResvId, setSelectedResvId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await fetchUserReservationsAPI();
      if (data.length === 0) setErrorMsg("Henüz bir rezervasyonunuz bulunmuyor.");
      setReservations(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Rezervasyonlar yüklenirken hata oluştu.");
    }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    try {
      const updated = await cancelReservationAPI(id);
      setReservations((prev) => prev.map((r) => (r._id === id ? updated : r)));
    } catch (err) {
      console.error(err);
    } finally {
      handleCloseDialog();
    }
  };

  const openDialog = (id) => {
    setSelectedResvId(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedResvId(null);
    setDialogOpen(false);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

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
    switch (getStatusText(resv)) {
      case "aktif":
        return "primary";
      case "iptal":
        return "error";
      case "tamamlandı":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ mt: 12, display: "flex", justifyContent: "center", mb: 5, px: 2 }}>
      <Fade in timeout={800}>
        <Paper
          sx={{
            width: "100%",
            maxWidth: 1200,
            p: 4,
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            background: "linear-gradient(to bottom, #fff, #f8f9fa)",
            border: "1px solid rgba(25,118,210,0.1)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" color="#1976d2">
              Rezervasyonlarım
            </Typography>
            <Button onClick={fetchReservations} disabled={loading} variant="outlined">
              Yenile
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", py: 8, gap: 2 }}>
              <CircularProgress size={60} />
              <Typography color="text.secondary">Rezervasyonlar yükleniyor...</Typography>
            </Box>
          ) : errorMsg ? (
            <Typography color="error" textAlign="center">{errorMsg}</Typography>
          ) : (
            <TableContainer sx={{ borderRadius: 2, overflow: { xs: "auto", md: "hidden" }, border: "1px solid rgba(0,0,0,0.05)", mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgba(25,118,210,0.08)", "& th": { fontWeight: "bold", py: 2, fontSize: "1rem" } }}>
                    <TableCell><Event fontSize="small" /> Tarih</TableCell>
                    <TableCell><Schedule fontSize="small" /> Saat</TableCell>
                    <TableCell><Notes fontSize="small" /> Not</TableCell>
                    <TableCell align="center">Durum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservations.map((resv) => (
                    <TableRow key={resv._id} sx={{ "&:hover": { backgroundColor: "rgba(25,118,210,0.03)" } }}>
                      <TableCell sx={{ fontWeight: 500, py: 2 }}>{formatDate(resv.date)}</TableCell>
                      <TableCell sx={{ py: 2 }}>{resv.time || "-"}</TableCell>
                      <TableCell sx={{ py: 2, maxWidth: 300 }}>
                      {resv.note ? (
                        <Box
                          sx={{
                            maxHeight: 150,
                            overflowY: "auto",
                            wordBreak: "break-word",
                          }}
                        >
                          {resv.note}
                        </Box>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                      <TableCell align="center">
                        <Chip label={getStatusText(resv)} color={getStatusColor(resv)} sx={{ mr: 1 }} />
                        {getStatusText(resv) === "aktif" && (
                          <Button variant="contained" color="error" size="small" onClick={() => openDialog(resv._id)}>
                            İptal Et
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Rezervasyonu İptal Et</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Bu rezervasyonu iptal etmek istediğinizden emin misiniz?
                (Aynı gün içinde tekrar randevu alamazsınız.)
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>İptal</Button>
              <Button color="error" onClick={() => handleCancel(selectedResvId)}>Onayla</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Fade>
    </Box>
  );
}
