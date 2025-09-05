import React from "react";
import AdminSettings from "./settings/setting1";
import AdminSettings2 from "./settings/setting2"; 
import {Box,Tabs,Tab,Typography,} from "@mui/material";

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && (
        <Box mt={2} sx={{ width: "100%" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ ml: { xs: 0, md: 0}, mt: { xs: 0, md: -5 }, width: "100%", px: { xs: 1, sm: 2 } }}>

      <Tabs
        value={tab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: "divider", ml: { xs: 0, md: -5 } }}
      >
        <Tab label="Çalışma Saatleri Ayarları" />
        <Tab label="Özel Gün/Saat Kapatma" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <AdminSettings />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <AdminSettings2 />
      </TabPanel>

    </Box>
  );
}
