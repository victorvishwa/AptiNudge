require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));

app.use('/api/auth', authRoutes);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve static files from the root directory (for CSS, JS files)
app.use(express.static(path.join(__dirname, '..')));

// Serve welcome.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/welcome.html'));
});

// Serve welcome.html for /welcome.html
app.get('/welcome.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/welcome.html'));
});

// Serve index.html for the quiz app
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Return 404 for deleted login and register pages
app.get(['/login.html', '/register.html'], (req, res) => {
    res.status(404).send('Not found');
});

// Catch all other routes and serve welcome.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/welcome.html'));
});

app.listen(5000, () => console.log('Server running on port 5000')); 