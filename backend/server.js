const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Graceful fallback if no DB is available
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/job_tracker';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB database');
  })
  .catch(err => {
    console.warn('Warning: Could not connect to MongoDB. Running in memory mode without persistence.', err.message);
  });

// We can just check mongoose.connection.readyState in controllers

// Upload middleware (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
