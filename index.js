require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Root endpoint for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API. Information of tasks and users is available.');
});

// Test the database connection before starting the server
async function startServer() {
  try {
    // Execute a simple query to test the connection
    await pool.query('SELECT 1');
    console.log('Database connection successful!');

    // Start the server if the connection is successful
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1); // Exit the process with an error code
  }
}

startServer();
