// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const ambulanceRoutes = require('./routes/ambulance');
const hospitalRoutes = require('./routes/hospital');
const Ambulance = require('./models/ambulance');
const Hospital = require('./models/hospital');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes (Keep auth for login, but remove protection for testing)
app.use('/auth', authRoutes);
app.use('/ambulances', ambulanceRoutes); // Removed authenticateToken
app.use('/hospitals', hospitalRoutes);   // Removed authenticateToken

// No authentication on this route now
app.get('/dashboard-data', async (req, res) => {
  try {
    const ambulanceCount = await Ambulance.getCount();
    const hospitalCount = await Hospital.getCount();
    res.json({
      activeAmbulances: ambulanceCount,
      hospitalsOnline: hospitalCount
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
