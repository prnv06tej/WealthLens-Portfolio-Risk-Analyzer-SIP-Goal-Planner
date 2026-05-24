const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECTRET,{expireIn:'30d'});
}

//@routes : POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                firstName: user.firstName,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user.id,
                firstName: user.firstName,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};