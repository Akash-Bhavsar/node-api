const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API.');
});

module.exports = app;
