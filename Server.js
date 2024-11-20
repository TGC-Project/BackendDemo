const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');


// Enable CORS for your frontend URL
const frontendURL = 'https://itinstitutepune.in/'; // Replace with your frontend URL

app.use(cors({
  origin: frontendURL, // Allow only your frontend to make requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
}));

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a schema and model for the form data
const EnrollmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    course: String
});

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Contact = mongoose.model('Contact', contactSchema);


// API endpoint to handle form submission
app.post('/api/enroll', async (req, res) => {
    try {
        const enrollment = new Enrollment(req.body);
        await enrollment.save();
        res.status(201).send({ message: 'Enrollment saved successfully!' });
    } catch (err) {
        res.status(500).send({ message: 'Error saving enrollment', error: err });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).send({ message: 'Contact saved successfully!' });
        }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
