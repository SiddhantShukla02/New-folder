const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();


// const { error } = require('console');


const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.SESSION_SECRET ||'your_secret_key',
    resave: false,
    saveUninitialized: true
}));



//DB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB connected');
    
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

//Routes
const hospitalRoutes = require('./routes/hospitalRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/hospitals', hospitalRoutes);
app.use('/doctors', doctorRoutes);
app.use('/admin', requireLogin, adminRoutes);

//Auth
function requireLogin(req, res, next) {
    if(req.session && req.session.loggedIn) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

//Login Route
app.get('/login', (req, res) => {
    res.render('admin-login' ,{error: null});
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'password123';
    if(username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.loggedIn = true;
        res.redirect('/admin.html');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});
//Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});



//start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};

startServer();