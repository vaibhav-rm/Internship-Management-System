import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";

function FinalReportCard() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/${id}`);
                setStudent(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching student:', error);
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!student) {
        return (
            <Typography variant="h6" color="error">
                Student not found
            </Typography>
        );
    }

    return (
        <Box sx={{ width: '100%', mt: 4, px: 4 }}>
            <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
                <Typography variant="h4" component="div" gutterBottom>
                    Final Report Card - {student.first_name} {student.last_name}
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 3, width: '100%', maxWidth: '100%' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Assessment Title</TableCell>
                                <TableCell>Obtainable Marks</TableCell>
                                <TableCell>Obtained Marks</TableCell>
                                <TableCell>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {student.assessments.map((assessment, index) => (
                                <TableRow key={index}>
                                    <TableCell>{assessment.title}</TableCell>
                                    <TableCell>{assessment.obtainableMarks}</TableCell>
                                    <TableCell>{assessment.obtainedMarks}</TableCell>
                                    <TableCell>{new Date(assessment.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default FinalReportCard;
