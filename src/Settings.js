import React, { useState } from 'react';
import { Paper, Typography, Button, Switch, FormControlLabel } from '@mui/material';

const Settings = ({ toggleDarkMode }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleSaveSettings = () => {
    console.log('Settings saved:', { notificationsEnabled, darkModeEnabled });
    // Implement saving logic here
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
    toggleDarkMode(!darkModeEnabled); // Notify parent component (App.js) about dark mode toggle
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Paper elevation={3} className="p-6">
        <Typography variant="h4" component="h2" className="mb-4">
          Settings
        </Typography>

        <div className="mb-6">
          <Typography variant="h5" className="mb-2">
            Notifications
          </Typography>
          <FormControlLabel
            control={<Switch checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />}
            label="Enable notifications"
          />
        </div>

        <div className="mb-6">
          <Typography variant="h5" className="mb-2">
            Dark Mode
          </Typography>
          <FormControlLabel
            control={<Switch checked={darkModeEnabled} onChange={handleDarkModeToggle} />}
            label="Enable dark mode"
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </Paper>
    </div>
  );
};

export default Settings;
