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
const rawOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// allow anonymous (non-browser) callers (curl/postman) or configured origins for browser
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // No origin -> likely server-to-server or curl/postman — allow
      return callback(null, true);
    }
    if (rawOrigins.includes('*')) return callback(null, true); // wildcard allowed if explicitly configured
    if (rawOrigins.indexOf(origin) !== -1) return callback(null, true);

    console.warn('Blocked by CORS. Origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
// explicitly reply to preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// --- DB connect ---
const MONGO_URI = process.env.MONGO_URI || '';
if (!MONGO_URI) {
  console.warn('⚠️  MONGO_URI is empty. Database will NOT connect until this is set.');
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err && err.message ? err.message : err);
    // keep server alive so we can still inspect logs / return a helpful health response
  });

// --- simple health route (public) ---
// Useful: frontend can call `${REACT_APP_API_URL}/api/health`
app.get('/api/health', (req, res) => {
  const mongoState = mongoose.connection && mongoose.connection.readyState;
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    mongoState,
    env: {
      nodeEnv: process.env.NODE_ENV || 'development',
      clientOriginConfigured: Boolean(process.env.CLIENT_ORIGIN),
    },
  });
});

// --- bring in your routes (unchanged) ---
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// --- generic error handler (JSON output) ---
app.use((err, req, res, next) => {
  // If CORS blocked by our corsOptions, err.message === 'Not allowed by CORS'
  console.error('Unhandled error:', err && err.message ? err.message : err);
  const status = err && err.status ? err.status : 500;
  res.status(status).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

