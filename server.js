const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

// const bodyParser = require('body-parser');

const hospitalRoutes = require('./routes/hospitals');
const doctorRoutes = require('./routes/doctors');
const adminRoutes = require('./routes/admin');
const { error } = require('console');

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET ||'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(express.json());


//DB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/hospitalDB');
        console.log('MongoDB connected');
    
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

//Auth
function requireLogin(req, res, next) {
    if(req.session && req.session.loggedIn) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

//Login Route
app.get('/admin/login', (req, res) => {
    res.render('login' ,{error: null});
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'password123';
    if(username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.loggedIn = true;
        res.redirect('/admin');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});
//Logout Route
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});


//Routes
app.use('/hospitals', hospitalRoutes);
app.use('/doctors', doctorRoutes);
app.use('/admin', requireLogin, adminRoutes);

//start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};

startServer();