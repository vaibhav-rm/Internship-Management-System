import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const StudentDetail = () => {
  const location = useLocation();
  const studentId = location.state.studentId;

  const [studentData, setStudentData] = useState(null); // State to hold student data
  const [loading, setLoading] = useState(true); // Loading state

  const [assessmentType, setAssessmentType] = useState('');
  const [assessmentObtainableMarks, setAssessmentObtainableMarks] = useState('');
  const [assessmentObtainedMarks, setAssessmentObtainedMarks] = useState('');
  const [assessmentDate, setAssessmentDate] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students/${studentId}`);
        setStudentData(response.data); // Update studentData state
        setLoading(false); // Update loading state
      } catch (error) {
        console.error('Error fetching student data:', error);
        setLoading(false); // Update loading state in case of error
      }
    };

    fetchStudentData();
  }, [studentId]); // Fetch data when studentId changes

  const handleAddAssessment = async (e) => {
    e.preventDefault();
  
    const newAssessment = {
      type: assessmentType,
      obtainableMarks: parseInt(assessmentObtainableMarks),
      obtainedMarks: parseInt(assessmentObtainedMarks),
      date: assessmentDate
    };
  
    try {
      const response = await axios.post(`http://localhost:5000/api/students/${studentId}/assessments`, newAssessment);
      console.log('Assessment added successfully:', response.data);
  
      // Update studentData with the new assessment
      setStudentData((prevStudentData) => {
        console.log('prevStudentData:', prevStudentData);
        const updatedAssessments = [...prevStudentData.assessments, response.data];
        console.log('updatedAssessments:', updatedAssessments);
        return {...prevStudentData, assessments: updatedAssessments };
      });
  
      // Clear form inputs after successful submission
      setAssessmentType('');
      setAssessmentObtainableMarks('');
      setAssessmentObtainedMarks('');
      setAssessmentDate('');
    } catch (error) {
      console.error('Error adding assessment:', error);
      // Handle error (e.g., show error message)
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  return (
    <div className="student-detail">
      <h2>{studentData.first_name} {studentData.last_name}</h2>
      <p>Email: {studentData.email}</p>
      <p>Phone: {studentData.phone}</p>

      {/* Assessment Form */}
      <form onSubmit={handleAddAssessment}>
        <h3>Add Assessment</h3>
        <label>
          Type:
          <input type="text" value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)} />
        </label>
        <br />
        <label>
          Obtainable Marks:
          <input type="number" value={assessmentObtainableMarks} onChange={(e) => setAssessmentObtainableMarks(e.target.value)} />
        </label>
        <br />
        <label>
          Obtained Marks:
          <input type="number" value={assessmentObtainedMarks} onChange={(e) => setAssessmentObtainedMarks(e.target.value)} />
        </label>
        <br />
        <label>
          Date:
          <input type="date" value={assessmentDate} onChange={(e) => setAssessmentDate(e.target.value)} />
        </label>
        <br />
        <button type="submit">Add Assessment</button>
      </form>

      {/* Display Assessments */}
      <div>
        <h3>Assessments</h3>
        <ul>
          {studentData.assessments.length === 0? (
            <li>No assessments available</li>
          ) : (
            studentData.assessments.map((assessment, index) => (
              <li key={index}>
                Type: {assessment.type}, Score: {assessment.obtainedMarks} / {assessment.obtainableMarks}, Date: {assessment.date}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentDetail;