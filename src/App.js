import Login from './auth/Login';
import Register from './auth/Register';
import AuthContextProvider from './auth/AuthContextProvider';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Add from './student/Add';
import StudentContextProvider from './student/StudentContextProvider';
import List from './student/List';
import ReportList from './student/ReportList';
import StudentDetails from './student/StudentDetail';
import FinalReportCard from './student/FinalReportCard'; 
import Settings from './Settings';

function App() {
  const [darkMode, setDarkMode] = useState(false); // State to manage dark mode

  const toggleDarkMode = (isEnabled) => {
    setDarkMode(isEnabled);
  };

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      <AuthContextProvider>
        <StudentContextProvider>
          <Routes>
            <Route path="/report" element={<FinalReportCard />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path="/" element={<Dashboard />}>
              <Route index element={<List />} />
              <Route path="/add" element={<Add />} />
              <Route path="/update/:id" element={<Add />} />
              <Route path='/reports' element={<ReportList />} />
              <Route path='/reports/:id' element={<StudentDetails />} />
              <Route path='/settings' element={<Settings toggleDarkMode={toggleDarkMode} />} />
            </Route>
          </Routes>
        </StudentContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
