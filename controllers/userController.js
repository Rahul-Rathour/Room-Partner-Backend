// const User = require('../models/User');
const RoomPartner = require('../models/RoomPartner');

// @desc Get user profile
// exports.getUserProfile = async (req, res) => { 
//   try {
//     const user = await User.findById(req.params.userId).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json(user); 
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// @desc Update user profile
exports.updateListing = async (req, res) => {
  const { name, location,phone,price, imageUrl,email } = req.body;

  try {
    const profile = await RoomPartner.findOne({ userId: req.params.userId });

    if (!profile) return res.status(404).json({ message: 'User/Listing not found' });

    profile.name = name || profile.name;
    profile.location = location || profile.location;
    profile.imageUrl = imageUrl || profile.imageUrl;
    profile.phone = phone || profile.phone;
    profile.price = price || profile.price;
    profile.email = email || profile.email;

    // You can also store imageUrl in a separate profileImage field if needed

    await profile.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get all listings by user
exports.getUserListings = async (req, res) => { 
  try {
    const listings = await RoomPartner.find({ userId: req.params.userId });
    res.json(listings);
  } catch (err) { 
    res.status(500).json({ message: 'Error fetching listings' });
  }
};
