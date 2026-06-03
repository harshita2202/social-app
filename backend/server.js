
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes =
  require('./routes/auth');

const postRoutes =
  require('./routes/posts');

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

app.use(
  '/uploads',
  express.static('uploads')
);


// ================= ROUTES =================

app.use('/api/auth', authRoutes);

app.use('/api/posts', postRoutes);


// ================= MONGODB =================

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log('MongoDB connected');

})
.catch(err => {

  console.log(err);
});


// ================= START SERVER =================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});

