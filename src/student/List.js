import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from "@mui/material";
import StudentContext from "./students-context";

function List() {
    const navigate = useNavigate();
    const stdCtx = useContext(StudentContext);
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/students');
            setStudents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
            // Handle error or set default data
            setStudents([
                { _id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', phone: '1234567890' },
                { _id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', phone: '9876543210' }
            ]);
        }
    };

    const deleteStudent = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/students/${id}`);
            stdCtx.delete(id); // Assuming stdCtx.delete is updating context state

            // Update local state after delete
            setStudents(students.filter(student => student._id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const goToUpdate = (id) => {
        navigate(`/update/${id}`);
    };

    const filterByStr = (search, value) => {
        if (typeof value === "string" || typeof value === "number") {
            return value.toString().toLowerCase().includes(search.toLowerCase());
        } else {
            return Object.values(value).some(val => filterByStr(search, val));
        }
    };

    const searchStd = (list) => {
        return list.filter(value => {
            if (search.trim().length > 0) {
                return filterByStr(search, value) ? value : null;
            } else {
                return value;
            }
        });
    };

    return (
        <Box sx={{ width: '100%', mt: 4, px: 4 }}>
            <Paper elevation={3} sx={{ p: 2, width: '100%', }}>
                <Typography variant="h4" component="div" gutterBottom>
                    Student List
                    <Link to="/add" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="success" sx={{ ml: 2 }}>
                            <i className="fa fa-plus" style={{ marginRight: '5px' }}></i> Add New Student
                        </Button>
                    </Link>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, width: '100%' }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={search}
                        onChange={handleSearch}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <IconButton size="small">
                                    <i className="fa fa-search"></i>
                                </IconButton>
                            ),
                            endAdornment: search && (
                                <IconButton size="small" onClick={() => setSearch('')}>
                                    <i className="fa fa-close"></i>
                                </IconButton>
                            )
                        }}
                    />
                </Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 3, width: '100%', maxWidth: '100%' }}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell><i className="fa fa-refresh custom-icon"></i> Sr. No.</TableCell>
                                    <TableCell><i className="fa fa-user custom-icon"></i> First Name</TableCell>
                                    <TableCell><i className="fa fa-user custom-icon"></i> Last Name</TableCell>
                                    <TableCell><i className="fa fa-envelope-o custom-icon"></i> Email</TableCell>
                                    <TableCell><i className="fa fa-phone custom-icon"></i> Phone</TableCell>
                                    <TableCell><i className="fa fa-pencil custom-icon"></i> Update</TableCell>
                                    <TableCell><i className="fa fa-trash custom-icon"></i> Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchStd(students).length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Typography variant="subtitle1" color="error">
                                                No students found with search "{search}"
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    searchStd(students).map((student, i) => (
                                        <TableRow key={student._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell className="pointer" onClick={() => goToUpdate(student._id)}>{student.first_name}</TableCell>
                                            <TableCell className="pointer" onClick={() => goToUpdate(student._id)}>{student.last_name}</TableCell>
                                            <TableCell className="pointer" onClick={() => goToUpdate(student._id)}>{student.email}</TableCell>
                                            <TableCell className="pointer" onClick={() => goToUpdate(student._id)}>{student.phone}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" onClick={() => goToUpdate(student._id)}>Update</Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="error" onClick={() => deleteStudent(student._id)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
}

export default List;
