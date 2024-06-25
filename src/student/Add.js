import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import StudentContext from "./students-context";
import { TextField, Button } from "@mui/material";

function Add() {
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id; // Assuming id is string based on URL parameter

    const [student, setStudent] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    });

    const [error, setError] = useState({
        first_name: false,
        last_name: false,
        email: false,
        phone: false,
    });

    const stdCtx = useContext(StudentContext);

    useEffect(() => {
        if (id) {
            fetchStudentData(id);
        }
    }, [id]);

    const fetchStudentData = async (studentId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/students/${studentId}`);
            const fetchedStudent = response.data;
            setStudent(fetchedStudent);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const doSubmit = async (event) => {
        event.preventDefault();
        try {
            if (validateForm()) {
                if (id) {
                    await updateStudent(id, student);
                } else {
                    await addStudent(student);
                }
                navigate('/'); // Redirect to student list after successful operation
            }
        } catch (error) {
            console.error('Error submitting student:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const validateForm = () => {
        let isValid = true;

        // Validate first_name
        if (student.first_name.length < 3) {
            setError(prevState => ({ ...prevState, first_name: true }));
            isValid = false;
        } else {
            setError(prevState => ({ ...prevState, first_name: false }));
        }

        // Validate last_name
        if (student.last_name.length < 3) {
            setError(prevState => ({ ...prevState, last_name: true }));
            isValid = false;
        } else {
            setError(prevState => ({ ...prevState, last_name: false }));
        }

        // Validate email
        const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailPattern.test(student.email)) {
            setError(prevState => ({ ...prevState, email: true }));
            isValid = false;
        } else {
            setError(prevState => ({ ...prevState, email: false }));
        }

        // Validate phone
        const phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phonePattern.test(student.phone)) {
            setError(prevState => ({ ...prevState, phone: true }));
            isValid = false;
        } else {
            setError(prevState => ({ ...prevState, phone: false }));
        }

        return isValid;
    };

    const handleInput = (event) => {
        const { id, value } = event.target;
        setStudent(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    const addStudent = async (newStudent) => {
        try {
            const response = await axios.post('http://localhost:5000/api/students', newStudent);
            stdCtx.add(response.data); // Assuming stdCtx.add is updating context state with new student
        } catch (error) {
            console.error('Error adding student:', error);
            throw error; // Rethrow the error to be caught in doSubmit
        }
    };

    const updateStudent = async (studentId, updatedStudent) => {
        try {
            await axios.put(`http://localhost:5000/api/students/${studentId}`, updatedStudent);
            stdCtx.update(studentId, updatedStudent); // Assuming stdCtx.update is updating context state with updated student
        } catch (error) {
            console.error('Error updating student:', error);
            throw error; // Rethrow the error to be caught in doSubmit
        }
    };

    return (
        <form className="w3-container mx-auto mt-8" onSubmit={doSubmit} style={{ maxWidth: '1000px' }}>
            <div className="bg-teal-500 rounded-md p-4 mb-4">
                <h3 className="text-white">
                    {id ? 'Update Student' : 'Register Student'}
                    <Link to="/" className="btn btn-green ml-4">
                        <i className="fa fa-chevron-left"></i>
                        Back
                    </Link>
                </h3>
            </div>

            <TextField
                className="mb-4"
                style={{marginBottom: 20}}
                label="First Name"
                id="first_name"
                required
                fullWidth
                value={student.first_name}
                onChange={handleInput}
                error={error.first_name}
                helperText={error.first_name && "Please enter minimum 3 characters"}
            />

            <TextField
                className="mb-4"
                label="Last Name"
                style={{marginBottom: 20}}
                id="last_name"
                required
                fullWidth
                value={student.last_name}
                onChange={handleInput}
                error={error.last_name}
                helperText={error.last_name && "Please enter minimum 3 characters"}
            />

            <TextField
                className="mb-4"
                label="Email Address"
                id="email"
                type="email"
                required
                style={{marginBottom: 20}}
                fullWidth
                value={student.email}
                onChange={handleInput}
                error={error.email}
                helperText={error.email && "Please enter a valid email address"}
            />

            <TextField
                className="mb-4"
                label="Phone"
                id="phone"
                type="tel"
                required
                fullWidth
                style={{marginBottom: 20}}
                value={student.phone}
                onChange={handleInput}
                error={error.phone}
                helperText={error.phone && "Please enter a valid phone number"}
            />

            <Button variant="contained" color="primary" type="submit">
                {id ? 'Update' : 'Register'}
            </Button>
        </form>
    );
}

export default Add;
