require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(authRoutes);
app.use(photoRoutes);
app.use(commentRoutes);

app.use('/api', notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

/** Connects to MongoDB, then starts listening. */
async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set. Copy .env.example to .env first.');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Alzikrayat API listening on http://localhost:${PORT}`));
}

if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
}

module.exports = app;
