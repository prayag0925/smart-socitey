const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const residentRoutes = require('./routes/residents');
const { visitorRouter, complaintRouter, billingRouter, facilityRouter, noticeRouter, pollRouter, notifRouter, dashRouter } = require('./routes/index');

app.use('/api/auth', authRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/visitors', visitorRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/billing', billingRouter);
app.use('/api/facilities', facilityRouter);
app.use('/api/notices', noticeRouter);
app.use('/api/polls', pollRouter);
app.use('/api/notifications', notifRouter);
app.use('/api/dashboard', dashRouter);

app.get('/', (req, res) => res.json({ message: 'Smart Society Management API Running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
