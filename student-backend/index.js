const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Student = require('./models/student.model');
const User = require('./models/user.model'); // Assuming you have this model for user authentication

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/student_management_system';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

// Protected route example (requires authentication)
app.get('/api/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed successfully', user: req.user });
});


// Routes for users

// Register a new user
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        user = new User({ 
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            'secret_key', // Replace with a secure secret key for production
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Routes for students

// Get all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// Get 1 student
app.get('/api/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error('Error fetching student:', err);
        res.status(500).json({ error: 'Failed to fetch student' });
    }
});

// Add a new student
app.post('/api/students', async (req, res) => {
    try {
        const { first_name, last_name, email, phone } = req.body;
        const newStudent = new Student({ first_name, last_name, email, phone });
        await newStudent.save();
        res.status(201).json({ id: newStudent._id }); // Send back the ID of the newly created student
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).json({ error: 'Failed to add student' });
    }
});

// Delete a student
app.delete('/api/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Student.findByIdAndDelete(id);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ error: 'Failed to delete student' });
    }
});

// Update a student
app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone } = req.body;

        await Student.findByIdAndUpdate(id, { first_name, last_name, email, phone });

        res.json({ message: 'Student updated successfully' });
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).json({ error: 'Failed to update student' });
    }
});

// CRUD operations for assessments

// Example implementation in Express.js with Mongoose

// Search for students by name
// Example backend route to search students by name
// Example route for searching students by name
app.get('/api/students/search', async (req, res) => {
    try {
        const { name } = req.query;
        const regex = new RegExp(name, 'i'); // Case-insensitive regex pattern

        const students = await Student.find({
            $or: [
                { first_name: { $regex: regex } },
                { last_name: { $regex: regex } }
            ]
        });

        res.json(students);
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).json({ error: 'Failed to search students' });
    }
});


// Add assessment for a student
// Add assessment for a student
app.post('/api/students/:id/assessments', async (req, res) => {
    const studentId = req.params.id;
    const { title, obtainableMarks, obtainedMarks, date } = req.body;

    try {
        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Construct new assessment
        const newAssessment = {
            title,
            obtainableMarks,
            obtainedMarks,
            date
        };

        // Add assessment to student's assessments array
        student.assessments.push(newAssessment);

        // Save updated student document
        await student.save();

        // Respond with the newly added assessment
        res.status(201).json(newAssessment);
    } catch (error) {
        console.error('Error adding assessment:', error);
        res.status(500).json({ error: 'Failed to add assessment' });
    }
});




// Get all assessments for a student
app.get('/api/students/:id/assessments', async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student.assessments);
    } catch (err) {
        console.error('Error fetching assessments:', err);
        res.status(500).json({ error: 'Failed to fetch assessments' });
    }
});


// Get a specific assessment for a student
app.get('/api/students/:id/assessments/:assessmentId', async (req, res) => {
    try {
        const { id, assessmentId } = req.params;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const assessment = student.assessments.id(assessmentId);
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        res.json(assessment);
    } catch (err) {
        console.error('Error fetching assessment:', err);
        res.status(500).json({ error: 'Failed to fetch assessment' });
    }
});

// Update assessment for a student
app.put('/api/students/:studentId/assessments/:assessmentId', async (req, res) => {
    try {
        const { studentId, assessmentId } = req.params;
        const { title, obtainableMarks, obtainedMarks, date } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const assessment = student.assessments.id(assessmentId);
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        assessment.title = title;
        assessment.obtainableMarks = obtainableMarks;
        assessment.obtainedMarks = obtainedMarks;
        assessment.date = date;

        await student.save();

        res.json({ message: 'Assessment updated successfully' });
    } catch (err) {
        console.error('Error updating assessment:', err);
        res.status(500).json({ error: 'Failed to update assessment' });
    }
});

// Delete assessment for a student
app.delete('/api/students/:studentId/assessments/:assessmentId', async (req, res) => {
    try {
        const { studentId, assessmentId } = req.params;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        student.assessments.pull(assessmentId);
        await student.save();

        res.json({ message: 'Assessment deleted successfully' });
    } catch (err) {
        console.error('Error deleting assessment:', err);
        res.status(500).json({ error: 'Failed to delete assessment' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
