const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const userAuth = require('./middleware/userAuth');
const PORT = process.env.PORT || 3000;
require('dotenv').config();


app.use(express.json());
// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable not set');
}
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

const userRoutes = require('./routes/userRoutes');
const passRoutes = require('./routes/passRoutes');

app.use('/user', userRoutes);
app.use('/pass', passRoutes);