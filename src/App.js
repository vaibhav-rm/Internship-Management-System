import Login from './auth/Login';
import AuthContextProvider from './auth/AuthContextProvider';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Add from './student/Add';
import StudentContextProvider from './student/StudentContextProvider';
import List from './student/List';
import ReportList from './student/ReportList';
import StudentDetails from './student/StudentDetail';
import FinalReportCard from './student/FinalReportCard'; //

function App() {
    return (
        <AuthContextProvider>
            <Routes>
            <Route path="/report" element={<FinalReportCard />} />
                <Route path='/login' element={<Login />} />
                <Route path="/" element={<StudentContextProvider><Dashboard /></StudentContextProvider>}>
                    <Route index element={<List />} />
                    <Route path="/add" element={<Add />} />
                    <Route path="/update/:id" element={<Add />} />
                    <Route path='/reports' element={<ReportList />} />
                    <Route path='/reports/:id' element={<StudentDetails />} />
                </Route>
            </Routes>
        </AuthContextProvider>
    );
}

export default App;
