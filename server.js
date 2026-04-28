// server.js
// Main Entry Point - AI Based Help Desk Expert System
// SPPU TE Artificial Intelligence Project

// ─── Load Environment Variables ───────────────────────
require('dotenv').config();

// ─── Import Dependencies ───────────────────────────────
const express    = require('express');
const mongoose   = require('mongoose');
const session    = require('express-session');
const flash      = require('connect-flash');
const methodOverride = require('method-override');
const path       = require('path');

// ─── Import Routes ─────────────────────────────────────
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

// ─── Initialize Express App ────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Connect to MongoDB ────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1); // Stop server if DB fails
  });

// ─── View Engine Setup (EJS) ───────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Middleware Setup ──────────────────────────────────

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Parse JSON data
app.use(express.json());

// Allow PUT/DELETE from HTML forms via ?_method=DELETE
app.use(methodOverride('_method'));

// Session configuration (required for flash messages)
app.use(session({
  secret: process.env.SESSION_SECRET || 'helpdeskSecret2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Flash messages middleware
app.use(flash());

// Make flash messages available to ALL views globally
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error   = req.flash('error');
  next();
});

// ─── Register Routes ───────────────────────────────────
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);

// ─── 404 Handler ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// ─── Global Error Handler ──────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).render('404', { title: 'Server Error' });
});

// ─── Start Server ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard:   http://localhost:${PORT}/admin`);
});
