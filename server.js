// backend/server.js or backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/roomPartner', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const roomPartnerRoutes = require('./routes/roomPartnerRoutes');
app.use('/api/partner', roomPartnerRoutes);

app.use('/api', require("./routes/userRoutes"));
app.use('/api/listings', require("./routes/DisplayListingsRoutes"));


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
