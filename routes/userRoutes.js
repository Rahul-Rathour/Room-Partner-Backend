const express = require('express');
const router = express.Router();
const user = require('../models/User')
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const jwtSecret = "Mynameisrahulfrombareillyup25" //.env banani h

// ✅ User Registration Route
router.post("/signup",
    [
        // express validator
        body('password', 'invalid password').isLength({ min: 2 }),
        body('name').isLength({ min: 1 }),
        body('email').isEmail()
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let sec_password = await bcrypt.hash(req.body.password, salt);
        try {

            const existingUser = await user.findOne({ email: req.body.email });
            if (existingUser) return res.status(400).json({ message: 'User already exists' });

            await user.create({
                name: req.body.name,// name: "Rahul",
                password: sec_password,// password: "123456",
                email: req.body.email,// email: "abc@gmail.com",
                
            })
            res.json({ success: true })

        } catch (error) {
            console.log("---error", error);
            res.json({ success: false })
        }
    })


// ✅ Login Route
router.post("/loginuser",
    [
        body('password', 'invalid password').isLength({ min: 2 }),
        body('email').isEmail()
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        // let email = req.body.email;
        try {
            let userData = await user.findOne({ email: req.body.email });
            if (!userData) {
                return res.status(400).json({ errors: "Try login with correct credentials..." })
            }

            const pass_compare = await bcrypt.compare(req.body.password, userData.password); // compare the stored and input password
            if (!pass_compare) {
                return res.status(400).json({ errors: "Try login with correct credentials..." })
            }

            const data = {          // signature for jwt auth token
                user: {
                    id: userData._id
                }
            }

            const authToken = jwt.sign(data, jwtSecret)          // yaha comma deke ek parameter or pass kar sakte hain expiry of token 
            return res.json({ success: true, authToken: authToken, userId: userData._id })    // kya kya bhejna hai login ke saath server pe 

        } catch (error) {
            console.log("---error", error);
            res.json({ success: false })
        }
    })

const { 
    getUserListings,
    
    updateListing
} = require('../controllers/userController');

// No middleware, so userId will be sent manually from frontend

// router.get('/profile/:userId', getUserProfile);
router.get('/my-listing/:userId', getUserListings);  // /api/my-listings/:userId
router.put('/update-listing/:userId', updateListing); // /api/update-listing/:userId


 
module.exports = router;  