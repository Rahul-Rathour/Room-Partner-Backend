const mongoose = require('mongoose');

const roomPartnerSchema = new mongoose.Schema({
  name: String,
  location: String,  
  phone: Number,
  price: Number,
  emial: String,
  imageUrl: String,  
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('RoomPartner', roomPartnerSchema);
