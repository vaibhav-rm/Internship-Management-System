const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    assesments: [
        {
            title: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now()
            },
            obtainableMarks: {
                type: Number,
                required: true
            },
            obtainedMarks: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Student', studentSchema);
