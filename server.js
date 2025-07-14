require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// ✅ CORS options for production
const corsOptions = {
  origin: "https://room-partner-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));
// app.use(cors()) 
// Middleware
app.use(express.json());
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const roomPartnerRoutes = require('./routes/roomPartnerRoutes');
app.use('/api/partner', roomPartnerRoutes);

const userRoutes = require("./routes/userRoutes");
app.use('/api', userRoutes);

const displayListingRoutes = require("./routes/DisplayListingsRoutes");
app.use('/api/listings', displayListingRoutes);

// Start server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
 