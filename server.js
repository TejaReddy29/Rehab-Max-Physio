const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Nodemailer transporter setup (using Gmail SMTP for demo - replace with your credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your.email@gmail.com',       // <-- Replace with your email
    pass: 'your-email-password-or-app-password' // <-- Replace with your password or app password
  }
});

// Helper function to generate 6-digit unique code
function generateUniqueCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

// POST endpoint to receive appointment booking
app.post('/api/book-appointment', (req, res) => {
  const { firstName, lastName, place, date, time, mobile } = req.body;

  if (!firstName || !lastName || !place || !date || !time || !mobile) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Generate unique 6-digit code
  const uniqueCode = generateUniqueCode();

  // Compose SMS message content
  const smsMessage = 
`Appointment Confirmation - REHAB MAX PHYSIO
Patient: ${firstName} ${lastName}
Place: ${place}
Date: ${date}
Time: ${time}
Unique Code: ${uniqueCode}
`;

  // Simulate sending SMS by sending email to patient and doctor
  // In real scenario, integrate with SMS API like Twilio

  // Patient email (simulate SMS)
  const patientMailOptions = {
    from: 'your.email@gmail.com',
    to: `${mobile}@sms.gateway.example.com`, // Placeholder, replace with real SMS gateway or phone carrier email-to-SMS
    subject: 'Appointment Confirmation',
    text: smsMessage
  };

  // Doctor email (simulate SMS)
  const doctorMailOptions = {
    from: 'your.email@gmail.com',
    to: 'doctor.phone@sms.gateway.example.com', // Replace with doctor's SMS gateway or email
    subject: 'New Appointment Booked',
    text: smsMessage + `\nPatient Mobile: ${mobile}  // Patient's mobile number`
  };

  // For demo, we will just log the messages and send a confirmation email to your email
  console.log('Sending SMS to patient:', smsMessage);
  console.log('Sending SMS to doctor:', smsMessage + `\nPatient Mobile: ${mobile}  // Patient's mobile number`);

  // Send email to your own email to simulate notification
  transporter.sendMail({
    from: 'your.email@gmail.com',
    to: 'your.email@gmail.com', // Replace with your email to receive notification
    subject: 'New Appointment Booked',
    text: smsMessage + `\nPatient Mobile: ${mobile}  // Patient's mobile number`
  }, (error, info) => {
    if (error) {
      console.error('Error sending notification email:', error);
      return res.status(500).json({ error: 'Failed to send confirmation.' });
    }
    res.json({ message: 'Appointment booked successfully!', uniqueCode });
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});