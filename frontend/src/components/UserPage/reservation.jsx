import { useState, useEffect } from "react";
import { Container, Box, Paper, Grid, TextField, Button, Typography, Card, CardContent, Stepper, Step, StepLabel, Fade, Chip } from "@mui/material";
import { Today as TodayIcon, Schedule as ScheduleIcon, Notes as NotesIcon, CheckCircle as CheckCircleIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon, EventAvailable as EventAvailableIcon } from "@mui/icons-material";
import { format, addDays, isSameDay, parseISO, isToday, isTomorrow } from "date-fns";
import { tr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { fetchBookedTimesAPI, createReservationAPI, fetchUserReservationsAPI } from "../../api/apiUser.js";
import { fetchSettingsAPI, fetchExceptionsAPI } from "../../api/apiSetting.js";
import dayjs from "dayjs";

const generateTimeSlots = (openTime, closeTime, slotDuration = 30) => {
  const slots = [];
  let [openHour, openMin] = openTime.split(":").map(Number);
  let [closeHour, closeMin] = closeTime.split(":").map(Number);

  let current = new Date();
  current.setHours(openHour, openMin, 0, 0);
  const end = new Date();
  end.setHours(closeHour, closeMin, 0, 0);

  while (current < end) {
    slots.push(format(current, "HH:mm"));
    current.setMinutes(current.getMinutes() + slotDuration);
  }
  return slots;
};

export default function Reservation() {
  const [exceptions, setExceptions] = useState([]);
  const [settings, setSettings] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [hasActiveReservation, setHasActiveReservation] = useState(false);
  const [activeReservation, setActiveReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReservationCheck, setLoadingReservationCheck] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, exceptionsData, reservations] = await Promise.all([
          fetchSettingsAPI(),
          fetchExceptionsAPI(),
          fetchUserReservationsAPI()
        ]);
        setSettings(settingsData);
        setExceptions(exceptionsData);

        const now = new Date();
        const active = reservations.find(r => {
          if (r.status.toLowerCase() === "iptal") return false;
          const [hour, minute] = (r.time || "00:00").split(":").map(Number);
          const resDateTime = new Date(r.date);
          resDateTime.setHours(hour, minute, 0, 0);
          return resDateTime > now;
        });

        setHasActiveReservation(!!active);
        setActiveReservation(active || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReservationCheck(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!date) return;
    const fetchBookedTimes = async () => {
      const data = await fetchBookedTimesAPI(date);
      setBookedTimes(data);
    };
    fetchBookedTimes();
  }, [date]);

  const handleDateSelect = (day) => {
    setSelectedDate(day);
    const formatted = format(day, "yyyy-MM-dd");
    setDate(formatted);
    setTime("");
    handleNext();
  };

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const generateWeekDays = () => Array.from({ length: 17 }, (_, i) => addDays(new Date(), i));

const getDaySettings = (day) => {
  if (!day) return null;

  const dayName = format(day, "EEEE", { locale: tr });
  const setting = settings.find(
    (s) => s.dayOfWeek.toLowerCase() === dayName.toLowerCase()
  );

  if (!setting || !setting.isOpen) {
    return {
      ...setting,
      isOpen: false,
      exceptionClosed: false
    };
  }

  for (let ex of exceptions) {
    const exStart = dayjs(ex.startDate).startOf("day");
    const exEnd = dayjs(ex.endDate).endOf("day");

    if (dayjs(day).isBetween(exStart, exEnd, "day", "[]")) {
      if (
        (!ex.startTime || ex.startTime === "00:00") &&
        (!ex.endTime || ex.endTime === "23:59")
      ) {
        return {
          ...setting,
          isOpen: false,
          exceptionClosed: true,
        };
      }
    }
  }

  return setting;
};

const getAvailableSlots = (daySettings) => {
  if (!daySettings || !daySettings.isOpen) return [];

  const allSlots = generateTimeSlots(daySettings.openTime, daySettings.closeTime, daySettings.slotDuration);
  const now = dayjs();

  return allSlots.filter(slot => {
    const slotDateTime = dayjs(`${date}T${slot}`);

    if (dayjs(date).isSame(now, "day") && slotDateTime.isBefore(now)) return false;
    if (bookedTimes.includes(slot)) return false;

    for (let ex of exceptions) {
      const exStartDate = dayjs(ex.startDate);
      const exEndDate = dayjs(ex.endDate);

      if (slotDateTime.isSame(exStartDate, 'day') || slotDateTime.isSame(exEndDate, 'day') || (slotDateTime.isAfter(exStartDate.startOf('day')) && slotDateTime.isBefore(exEndDate.endOf('day')))) {

        const [exStartHour, exStartMin] = (ex.startTime || "00:00").split(":").map(Number);
        const [exEndHour, exEndMin] = (ex.endTime || "23:59").split(":").map(Number);

        const exStart = slotDateTime.hour(exStartHour).minute(exStartMin);
        const exEnd = slotDateTime.hour(exEndHour).minute(exEndMin);

        if (slotDateTime.isSame(exStart) || slotDateTime.isSame(exEnd) || (slotDateTime.isAfter(exStart) && slotDateTime.isBefore(exEnd))) {
          return false;
        }
      }
    }

    return true;
  });
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReservationAPI({ date, time, note });
      setActiveStep(5);
      setDate(""); setTime(""); setNote(""); setBookedTimes([]);
      setHasActiveReservation(true);
    } catch (err) {
      console.error(err);
      alert("Rezervasyon oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: 
        return (
          <Box sx={{ textAlign: "center", py: 3 }}>
            {hasActiveReservation ? (
              <>
                <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                  Zaten aktif bir rezervasyonunuz bulunuyor.
                </Typography>
                {activeReservation && (
                  <Box sx={{ p: 2, backgroundColor: "grey.50", borderRadius: 2, mb: 2 }}>
                    <Typography><strong>Tarih:</strong> {format(parseISO(activeReservation.date), "dd MMMM yyyy", { locale: tr })}</Typography>
                    <Typography><strong>Saat:</strong> {activeReservation.time}</Typography>
                    {activeReservation.note && <Typography sx={{ whiteSpace: "pre-wrap" }}><strong>Not:</strong> {activeReservation.note}</Typography>}
                  </Box>
                )}
              </>
            ) : (
              <>
                <EventAvailableIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>Rezervasyon Yap</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Randevu oluşturmak için başlat butonuna tıklayın.
                </Typography>
                <Button variant="contained" size="large" onClick={handleNext} endIcon={<ArrowForwardIcon />} sx={{ borderRadius: 2, px: 4 }}>
                  Başlat
                </Button>
              </>
            )}
          </Box>
        );

      case 1: 
        const weekDays = generateWeekDays();
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <TodayIcon sx={{ mr: 1 }} /> Tarih Seçin
            </Typography>
            <Grid container spacing={{ xs: 1, md: 2 }}>
              {weekDays.map((day, index) => {
                const daySettings = getDaySettings(day);
                const isClosed = !daySettings || !daySettings.isOpen;
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentDay = isToday(day);
                const isNextDay = isTomorrow(day);

                return (
                  <Grid key={index} sx={{ flex: { xs: "1 0 48%", sm: "1 0 30%", md: "1 0 13%" }, minWidth: { xs: 100, md: 90 } }}>
                    <Card
                      onClick={() => !isClosed && handleDateSelect(day)}
                      elevation={isSelected ? 3 : 1}
                      sx={{
                        cursor: isClosed ? "default" : "pointer",
                        textAlign: "center",
                        py: { xs: 1.25, md: 2 },
                        backgroundColor: isSelected ? "#1976d2" : "background.paper",
                        color: isSelected ? "#fff" : isClosed ? "text.disabled" : "text.primary",
                        border: isSelected ? "2px solid #1976d2"
                          : isCurrentDay ? "2px solid #9c27b0"
                          : "2px solid transparent",
                        "&:hover": { backgroundColor: isClosed ? "background.paper" : isSelected ? "#1976d2" : "#f5f5f5" },
                        borderRadius: 3,
                        position: "relative",
                        overflow: "visible",
                        transition: "all 0.2s ease-in-out",
                        height: { xs: 110, md: 130 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                      }}
                    >
                      {isCurrentDay && <Chip label="Bugün" color="secondary" size="small" sx={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", fontSize: { xs: "0.6rem", md: "0.7rem" }, height: 20 }} />}
                      {isNextDay && !isCurrentDay && <Chip label="Yarın" color="info" size="small" sx={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", fontSize: { xs: "0.6rem", md: "0.7rem" }, height: 20 }} />}
                      <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                        <Typography variant="body2" fontWeight={isSelected ? "bold" : "medium"} color={isSelected ? "#fff" : "inherit"}>
                          {format(day, "EEE", { locale: tr })}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color={isSelected ? "#fff" : "inherit"} sx={{ my: { xs: .5, md: 1 } }}>
                          {format(day, "d")}
                        </Typography>
                        <Typography variant="caption" display="block" color={isSelected ? "#fff" : "text.secondary"}>
                          {format(day, "MMM", { locale: tr })}
                        </Typography>
                        {isClosed ? <Chip label="Kapalı" color="default" size="small" sx={{ mt: 1, fontSize: "0.65rem" }} />
                          : daySettings && <Typography variant="caption" display="block" sx={{ mt: 1 }}>{daySettings.openTime} - {daySettings.closeTime}</Typography>}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );

      case 2: 
        const daySettings2 = getDaySettings(parseISO(date));
        const slots = getAvailableSlots(daySettings2);
        if (!daySettings2 || !daySettings2.isOpen) return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">Bu gün için çalışma saati ayarlanmamış.</Typography>
          </Box>
        );
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <ScheduleIcon sx={{ mr: 1 }} /> Saat Seçin
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Seçilen Tarih: {format(parseISO(date), "dd MMMM yyyy", { locale: tr })}
            </Typography>
            <Grid container spacing={{ xs: 0.5, md: 1 }} sx={{ flexWrap: "wrap" }}>
              {slots.map(t => (
                <Box key={t} sx={{ width: { xs: "49%", sm: "auto" } }}>
                  <Card
                    onClick={() => setTime(t)}
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      py: { xs: .75, md: 1 },
                      backgroundColor: time === t ? "primary.main" : "background.paper",
                      color: time === t ? "primary.contrastText" : "text.primary",
                      "&:hover": { backgroundColor: time === t ? "primary.main" : "action.hover" },
                      borderRadius: 2
                    }}
                  >
                    <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                      <Typography variant="body1" fontWeight="bold">{t}</Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <NotesIcon sx={{ mr: 1 }} /> Not Ekleyin (İsteğe Bağlı)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={note}
              onChange={(e) => { if (e.target.value.length <= 300) setNote(e.target.value); }}
              helperText={`${note.length}/300 karakter`}
              placeholder="Rezervasyonunuzla ilgili eklemek istediğiniz notlar..."
              sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 }, '& .MuiInputBase-input': { fontSize: { xs: '16px', md: '1rem' } } }}
            />
          </Box>
        );

      case 4:
        return (
          <Box sx={{ textAlign: "center" }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>Rezervasyon Özeti</Typography>
            <Box sx={{ p: 2, backgroundColor: "grey.50", borderRadius: 2, mb: 2, maxHeight: 150, overflowY: "auto" }}>
              <Typography><strong>Tarih:</strong> {format(parseISO(date), "dd MMMM yyyy", { locale: tr })}</Typography>
              <Typography><strong>Saat:</strong> {time}</Typography>
              {note && <Typography sx={{ whiteSpace: "pre-wrap" }}><strong>Not:</strong> {note}</Typography>}
            </Box>
            <Typography variant="body2" color="text.secondary">Rezervasyonu tamamlamak için onaylayın.</Typography>
          </Box>
        );

      case 5:
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>Rezervasyon Başarıyla Oluşturuldu!</Typography>
            <Button variant="contained" sx={{ mt: 2, borderRadius: 2 }} onClick={() => navigate("/reservationed")}>Rezervasyonlarımı Görüntüle</Button>
          </Box>
        );

      default: return "Bilinmeyen adım";
    }
  };

  const steps = ["Hoşgeldiniz", "Tarih Seçimi", "Saat Seçimi", "Not Ekleme", "Onay", "Başarılı"];

  if (loadingReservationCheck) {
    return (
      <Container maxWidth="md" sx={{ py: 4, mt: 8, textAlign: "center" }}>
        <Typography>Yükleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, mt: { xs: 6, md: 8 }, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={10} sx={{ width: "100%", p: { xs: 2, sm: 3, md: 4 }, borderRadius: { xs: 2, md: 4 }, overflow: "hidden" }}>
        <Stepper activeStep={activeStep} sx={{ mb: { xs: 2, md: 4 }, '& .MuiStepLabel-label': { fontSize: { xs: '0.8rem', md: '0.875rem' } } }}>
          {steps.map((label) => (
            <Step key={label} completed={activeStep > steps.indexOf(label)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Fade in timeout={500}>
          <Box component="form" onSubmit={handleSubmit}>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 3, gap: 1 }}>
              {activeStep !== 5 && !hasActiveReservation && (
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Geri
                </Button>
              )}
              <Box sx={{ flex: "1 1 auto" }} />
              {activeStep < 4 && !hasActiveReservation && (
                <Button
                  onClick={handleNext}
                  disabled={(activeStep === 1 && !date) || (activeStep === 2 && !time)}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  İleri
                </Button>
              )}
              {activeStep === 4 && !hasActiveReservation && (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  endIcon={<CheckCircleIcon />}
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  {loading ? "İşleniyor..." : "Rezervasyon Yap"}
                </Button>
              )}
            </Box>
          </Box>
        </Fade>
      </Paper>
    </Container>
  );
}
