// backend/server.js or backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true

});


const roomPartnerRoutes = require('./routes/roomPartnerRoutes');
app.use('/api/partner', roomPartnerRoutes);

app.use('/api', require("./routes/userRoutes"));
app.use('/api/listings', require("./routes/DisplayListingsRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
//  console.log("Server running on port 5000");
});
