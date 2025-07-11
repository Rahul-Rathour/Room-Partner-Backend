// backend/routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const RoomPartner = require('../models/RoomPartner'); // Mongoose model


router.post('/create-listing', async (req, res) => {
  try {
    const { name, location, price, phone, imageUrl, userId, email } = req.body;

    const existingListing = await RoomPartner.findOne({ userId }); // check if user already exist or not means there is already one listing is listed by the user

    if (existingListing) {
      return res.status(400).json({ message: "Listing already exists for this user." });
    }

    const newEntry = new RoomPartner({ name, location, price, phone, imageUrl, userId, email });
    await newEntry.save();
    res.status(201).json({ message: "Room partner registered", newEntry });
    
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error });
  }
});


module.exports = router;
