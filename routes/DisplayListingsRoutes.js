const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const RoomPartner = require('../models/RoomPartner')

router.post('/', async (req, res) => {
  try {
    const roomPartnerCollection = mongoose.connection.db.collection("roompartners");

    const roomPartnerData = await roomPartnerCollection.find({}).toArray();

    res.status(200).json(roomPartnerData);
  } catch (error) {
    console.error("Error fetching room listings:", error.message);
    res.status(500).send("Server Error...");
  }
});

// GET /api/roompartners?search=locationOrName
router.get('/location', async (req, res) => {
  const search = req.query.search; // this is taking seach from req query search

  try {
    let results;

    if (search) {
      const regex = new RegExp(search, 'i'); // 'i' = case-insensitive
      results = await RoomPartner.find({
        $or: [
          { name: regex },
          { location: regex }
        ]
      });
    } else {
      results = []; // or you can return all with: results = await RoomPartner.find();
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching RoomPartners:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
