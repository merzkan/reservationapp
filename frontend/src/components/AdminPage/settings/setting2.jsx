import { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Chip, Divider, Snackbar, Alert, alpha, useTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker, TimePicker } from "@mui/x-date-pickers"; 
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchExceptionsAPI, addExceptionAPI, deleteExceptionAPI } from "../../../api/apiSetting";

export default function AdminSettings2() {
  const theme = useTheme();
  const [exceptions, setExceptions] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [rangeStart, setRangeStart] = useState(dayjs());
  const [rangeEnd, setRangeEnd] = useState(dayjs());
  const [rangeStartTime, setRangeStartTime] = useState(null);
  const [rangeEndTime, setRangeEndTime] = useState(null);

  const [fullRangeStart, setFullRangeStart] = useState(dayjs());
  const [fullRangeEnd, setFullRangeEnd] = useState(dayjs());

  const [singleDay, setSingleDay] = useState(dayjs());
  const [singleStartTime, setSingleStartTime] = useState(null);
  const [singleEndTime, setSingleEndTime] = useState(null);

  const [singleFullDay, setSingleFullDay] = useState(dayjs());

  const loadExceptions = async () => {
    try {
      const data = await fetchExceptionsAPI();
      setExceptions(data);
    } catch (err) {
      console.error("İstisnalar alınamadı", err);
    }
  };

  useEffect(() => { loadExceptions(); }, []);

  const addExceptionHandler = async ({ sDate, eDate, sTime, eTime }) => {
    try {
      if ((sTime === undefined || eTime === undefined) && !(sTime === null && eTime === null)) {
        setSnackbar({ open: true, message: "Lütfen saatleri seçin", severity: "error" });
        return;
      }

      const payload = {
        startDate: sDate,
        endDate: eDate,
        startTime: sTime || null,
        endTime: eTime || null,
      };

      await addExceptionAPI(payload);
      await loadExceptions();
      setSnackbar({ open: true, message: "İstisna eklendi", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "İstisna eklenemedi", severity: "error" });
    }
  };

  const deleteException = async (id) => {
    try {
      await deleteExceptionAPI(id);
      await loadExceptions();
      setSnackbar({ open: true, message: "İstisna silindi", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "İstisna silinemedi", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: -2, mr: 1, ml: 0 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 2, background: alpha(theme.palette.primary.main, 0.05) }}>
          <Typography variant="h4" fontWeight="500">📌 Özel Gün/Saat Kapatma</Typography>
          <Typography variant="body1" color="text.secondary">
            Aşağıdan istediğiniz kapatma modunu seçip ekleyebilirsiniz.
          </Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6" mb={2}>Tarih Aralığında Saatli Kapatma</Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <DatePicker label="Başlangıç Tarihi" value={rangeStart} onChange={setRangeStart} format="DD/MM/YYYY" minDate={dayjs()} />
            <DatePicker label="Bitiş Tarihi" value={rangeEnd} onChange={setRangeEnd} format="DD/MM/YYYY" minDate={rangeStart} />
            <TimePicker label="Başlangıç Saati" value={rangeStartTime} onChange={setRangeStartTime} ampm={false} sx={{ width: { xs: 130, sm: 165 } }} />
            <TimePicker label="Bitiş Saati" value={rangeEndTime} onChange={setRangeEndTime} ampm={false} sx={{ width: { xs: 130, sm: 165 } }} />
            <Button variant="contained" color="primary" onClick={() => addExceptionHandler({
              sDate: rangeStart.startOf("day").toDate(),
              eDate: rangeEnd.endOf("day").toDate(),
              sTime: rangeStartTime ? rangeStartTime.format("HH:mm") : undefined,
              eTime: rangeEndTime ? rangeEndTime.format("HH:mm") : undefined
            })}>Kaydet</Button>
          </Box>
        </Paper>
        <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6" mb={2}>Tarih Aralığında Tüm Günleri Kapatma</Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <DatePicker label="Başlangıç Tarihi" value={fullRangeStart} onChange={setFullRangeStart} format="DD/MM/YYYY" minDate={dayjs()} />
            <DatePicker label="Bitiş Tarihi" value={fullRangeEnd} onChange={setFullRangeEnd} format="DD/MM/YYYY" minDate={fullRangeStart} />
            <Button variant="contained" color="primary" onClick={() => addExceptionHandler({
              sDate: fullRangeStart.startOf("day").toDate(),
              eDate: fullRangeEnd.endOf("day").toDate(),
              sTime: "00:00",
              eTime: "23:59"
            })}>Kaydet</Button>
          </Box>
        </Paper>
        <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6" mb={2}>Tek Gün Saatli Kapatma</Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <DatePicker label="Tarih" value={singleDay} onChange={setSingleDay} format="DD/MM/YYYY" minDate={dayjs()} />
            <TimePicker label="Başlangıç Saati" value={singleStartTime} onChange={setSingleStartTime} ampm={false} sx={{ width: { xs: 130, sm: 165 } }} />
            <TimePicker label="Bitiş Saati" value={singleEndTime} onChange={setSingleEndTime} ampm={false} sx={{ width: { xs: 130, sm: 165 } }} />
            <Button variant="contained" color="primary" onClick={() => addExceptionHandler({
              sDate: singleDay.startOf("day").toDate(),
              eDate: singleDay.endOf("day").toDate(),
              sTime: singleStartTime ? singleStartTime.format("HH:mm") : undefined,
              eTime: singleEndTime ? singleEndTime.format("HH:mm") : undefined
            })}>Kaydet</Button>
          </Box>
        </Paper>
        <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6" mb={2}>Tek Gün Tüm Gün Kapatma</Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <DatePicker label="Tarih" value={singleFullDay} onChange={setSingleFullDay} format="DD/MM/YYYY" minDate={dayjs()} />
            <Button variant="contained" color="primary" onClick={() => addExceptionHandler({
              sDate: singleFullDay.startOf("day").toDate(),
              eDate: singleFullDay.endOf("day").toDate(),
              sTime: "00:00",
              eTime: "23:59"
            })}>Kaydet</Button>
          </Box>
        </Paper>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Eklenmiş İstisnalar</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {exceptions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Henüz istisna eklenmedi</Typography>
            ) : (
              exceptions.map((ex) => (
                <Chip
                  key={ex._id}
                  label={`${dayjs(ex.startDate).format("DD/MM/YYYY")} - ${dayjs(ex.endDate).format("DD/MM/YYYY")} ${ex.startTime || ""}-${ex.endTime || ""}`}
                  color="error"
                  variant="outlined"
                  onDelete={() => deleteException(ex._id)}
                />
              ))
            )}
          </Box>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
