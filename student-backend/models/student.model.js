const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assessmentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    obtainableMarks: {
        type: Number,
        required: true
    },
    obtainedMarks: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const studentSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    assessments: [assessmentSchema] // Embed assessmentSchema as subdocuments
});

module.exports = mongoose.model('Student', studentSchema);
