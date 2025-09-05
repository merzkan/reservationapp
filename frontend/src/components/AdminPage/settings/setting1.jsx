import React, { useEffect, useState } from "react";
import {Box,Typography,Paper,FormControlLabel,Checkbox,TextField,Button,Grid,Card,CardContent,Alert,Snackbar,Chip,Divider,alpha,useTheme} from "@mui/material";
import { Save, Schedule, LockClock, AccessTime } from "@mui/icons-material";
import { fetchSettingsAPI, saveSettingsAPI } from "../../../api/apiSetting";

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const theme = useTheme();

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchSettingsAPI();
      setSettings(data);
    };
    loadSettings();
  }, []);

  const toggleDay = (index) => {
    const copy = [...settings];
    copy[index].isOpen = !copy[index].isOpen;
    setSettings(copy);
  };

  const handleChange = (index, field, value) => {
    const copy = [...settings];
    copy[index][field] = value;
    setSettings(copy);
  };

  const saveSettings = async () => {
    try {
      const res = await saveSettingsAPI(settings);
      setSnackbar({ open: true, message: res.message, severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Kaydetme hatası", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ mt: -2, mr: 1, ml: 0}}>
      <Paper elevation={0} sx={{ p: 3, mb: 2, background: alpha(theme.palette.primary.main, 0.05) }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: -1}}>
          <Schedule sx={{ mr: 1, color: "primary.main", fontSize: 32 }} />
          <Typography variant="h4" component="h1" fontWeight="500">
            Çalışma Saatleri Ayarları
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          İşletmenizin çalışma günlerini ve saatlerini buradan yapılandırabilirsiniz.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {settings.map((day, index) => (
          <Grid
            key={day.dayOfWeek}
            xs={12}
            sm={6}
            md={3}
          >
            <Card
              elevation={2}
              sx={{
                borderRadius: 5,
                height: "100%",
                transition: "all 0.2s ease",
                border: day.isOpen ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
                "&:hover": { boxShadow: 4, transform: "translateY(-2px)" }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={day.isOpen}
                        onChange={() => toggleDay(index)}
                        color="primary"
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      />
                    }
                    label={<Typography variant="h6">{day.dayOfWeek}</Typography>}
                  />
                  <Chip
                    label={day.isOpen ? "Açık" : "Kapalı"}
                    color={day.isOpen ? "success" : "default"}
                    variant={day.isOpen ? "filled" : "outlined"}
                    size="small"
                  />
                </Box>

                {day.isOpen ? (
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AccessTime sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">Çalışma Saatleri</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2, mb: 3, flexDirection: { xs: "column", sm: "row" } }}>
                      <TextField
                        label="Açılış"
                        type="time"
                        value={day.openTime || "09:00"}
                        onChange={(e) => handleChange(index, "openTime", e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                      <TextField
                        label="Kapanış"
                        type="time"
                        value={day.closeTime || "18:00"}
                        onChange={(e) => handleChange(index, "closeTime", e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LockClock sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">Randevu Ayarları</Typography>
                    </Box>
                    <TextField
                      label="Randevu Süresi (dakika)"
                      type="number"
                      value={day.slotDuration || 60}
                      onChange={(e) => handleChange(index, "slotDuration", parseInt(e.target.value))}
                      fullWidth
                      inputProps={{ min: 10, max: 180, step: 5 }}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">Müşteri başına ayrılacak süre</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      Bu gün için çalışma saati ayarlanmamış
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={saveSettings}
          startIcon={<Save />}
          size="large"
          sx={{ px: 4, py: 1.2, fontSize: "1.1rem" }}
        >
          Ayarları Kaydet
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
