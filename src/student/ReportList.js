import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentContext from "./students-context"; // Assuming you have a context named StudentContext

const ReportList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const stdCtx = useContext(StudentContext); // Using context to manage student data

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleStudentClick = (id) => {
    navigate(`/reports/${id}`, { state: { studentId: id } });
  };

    return (
        <div className="w3-container">
            <h2 className="w3-text-teal">Student List</h2>
            <div className="w3-panel w3-light-grey w3-card-2 w3-padding">
                <h3>Students</h3>
                <ul className="w3-ul w3-hoverable">
                    {students.map((student) => (
                        <li key={student._id} className="w3-padding" onClick={() => handleStudentClick(student._id)}>
                            {student.first_name} {student.last_name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ReportList;
