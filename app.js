// app.js
const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(express.json());

const donasiRoutes = require('./routes/donasiRoutes');
app.use('/api/donasi', donasiRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
