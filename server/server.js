// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// --- Helpful checks for missing environment variables ---
const requiredEnvs = ['MONGO_URI', 'JWT_SECRET'];
requiredEnvs.forEach((k) => {
  if (!process.env[k]) {
    console.warn(`⚠️  Environment variable ${k} is NOT set.`);
  }
});

if (!process.env.CLIENT_ORIGIN) {
  console.warn('⚠️  CLIENT_ORIGIN is not set. Set it to your frontend URL (comma-separated if multiple).');
}

// --- CORS setup ---
// Accept CLIENT_ORIGIN as a comma-separated list, e.g. "http://localhost:3000,https://your-site.netlify.app"
const rawOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim()).filter(Boolean);

// always allow requests with no origin (curl / server-to-server / some dev tools)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser (Postman/curl)
    if (rawOrigins.indexOf(origin) !== -1) return callback(null, true);
    // optionally allow wildcard by setting CLIENT_ORIGIN='*' (not recommended for prod)
    if (rawOrigins.includes('*')) return callback(null, true);

    console.warn('Blocked by CORS. Origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// --- DB connect ---
mongoose
  .connect(process.env.MONGO_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err && err.message ? err.message : err);
    // don't crash process; server will show db error but keep running for diagnostics
  });

// --- simple health route to verify server is up from browser / curl ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// --- routes (keep your existing routes files) ---
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// --- generic error handler (sends JSON, avoids HTML error pages) ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.message ? err.message : err);
  // If CORS blocked, the browser will still block request; this helps server-side logs
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
