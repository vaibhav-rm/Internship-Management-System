import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Viewer, SpecialZoomLevel, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';

const StudentDetail = () => {
  const location = useLocation();
  const studentId = location.state.studentId;

  const [studentData, setStudentData] = useState(null); // State to hold student data
  const [loading, setLoading] = useState(true); // Loading state

  const [assessmentTitle, setAssessmentTitle] = useState('');
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

    // Check if assessmentDate is empty, use today's date if true
    let today = new Date();
    let formattedToday = today.toISOString().split('T')[0];
    const dateToUse = assessmentDate ? assessmentDate : formattedToday;

    const newAssessment = {
      title: assessmentTitle,
      obtainableMarks: parseInt(assessmentObtainableMarks),
      obtainedMarks: parseInt(assessmentObtainedMarks),
      date: dateToUse,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/students/${studentId}/assessments`,
        newAssessment
      );
      console.log('Assessment added successfully:', response.data);

      // Update studentData with the new assessment
      setStudentData((prevStudentData) => {
        const updatedAssessments = [...prevStudentData.assessments, response.data];
        return { ...prevStudentData, assessments: updatedAssessments };
      });

      // Clear form inputs after successful submission
      setAssessmentTitle('');
      setAssessmentObtainableMarks('');
      setAssessmentObtainedMarks('');
      setAssessmentDate('');

      // Optionally, show a success message to the user
    } catch (error) {
      console.error('Error adding assessment:', error);
      // Handle errors here
    }
  };

  const generateCertificatePDF = async () => {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    // Add content to the PDF
    const { width, height } = page.getSize();
    const fontSize = 15;
    const text = `
      Certificate of Assessments
      Student: ${studentData.first_name} ${studentData.last_name}

      Assessments:
      ${studentData.assessments.map((assessment, index) => `
        ${index + 1}. Title: ${assessment.title}, Score: ${assessment.obtainedMarks} / ${assessment.obtainableMarks}, Date: ${new Date(assessment.date).toLocaleDateString()}
      `).join('')}
    `;

    page.drawText(text, {
      x: 50,
      y: height - 100,
      size: fontSize,
      font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      color: rgb(0, 0, 0),
    });

    // Save the PDF as a blob
    const pdfBytes = await pdfDoc.save();

    // Create a blob URL for the PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    // Open the PDF in a new tab
    window.open(blobUrl, '_blank');
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  // Render student details and assessment form
  return (
    <div className="student-detail p-4">
      {studentData && (
        <>
          <h2 className="text-2xl font-bold mb-2">{studentData.first_name} {studentData.last_name}</h2>
          <p className="mb-1">Email: {studentData.email}</p>
          <p className="mb-4">Phone: {studentData.phone}</p>

          {/* Assessment Form */}
          <form onSubmit={handleAddAssessment} className="mb-4">
            <h3 className="text-xl font-bold mb-2">Add Assessment</h3>
            <div className="space-y-2">
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={assessmentTitle}
                onChange={(e) => setAssessmentTitle(e.target.value)}
              />
              <TextField
                label="Obtainable Marks"
                variant="outlined"
                fullWidth
                type="number"
                value={assessmentObtainableMarks}
                onChange={(e) => setAssessmentObtainableMarks(e.target.value)}
              />
              <TextField
                label="Obtained Marks"
                variant="outlined"
                fullWidth
                type="number"
                value={assessmentObtainedMarks}
                onChange={(e) => setAssessmentObtainedMarks(e.target.value)}
              />
              <TextField
                label="Date"
                variant="outlined"
                fullWidth
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <Button type="submit" variant="contained" color="primary" className="mt-4">
              Add Assessment
            </Button>
          </form>

          {/* Display Assessments */}
          <div>
            <h3 className="text-xl font-bold mb-2">Assessments</h3>
            <ul>
              {studentData.assessments.length === 0 ? (
                <li>No assessments available</li>
              ) : (
                studentData.assessments.map((assessment, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold">{assessment.title}</span> - Score: {assessment.obtainedMarks} / {assessment.obtainableMarks}, Date: {new Date(assessment.date).toLocaleDateString()}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Button to Generate Certificate PDF */}
          <Button
            variant="contained"
            color="secondary"
            onClick={generateCertificatePDF}
            className="mt-4"
          >
            Generate Certificate PDF
          </Button>
        </>
      )}
    </div>
  );
};

export default StudentDetail;
