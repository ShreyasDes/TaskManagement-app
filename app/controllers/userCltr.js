// backend/controllers/userController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');

const userCltr = {};

userCltr.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const body = req.body;
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(body.password, salt);
        const user = new User({
            name: body.name,
            email: body.email,
            password: hashPassword
        });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

userCltr.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const isAuth = await bcrypt.compare(password, user.password);
            if (isAuth) {
                const tokenData = {
                    id: user._id,
                    role: user.role
                };
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });
                return res.json({ token, user });
            }
            return res.status(401).json({ error: 'Invalid email/password' });
        }
        res.status(404).json({ error: 'Invalid email/password' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

userCltr.account = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

userCltr.checkEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });
        if (user) {
            res.json({ is_email_registered: true });
        } else {
            res.json({ is_email_registered: false });
        }
    } catch (err) {
        console.error('Error checking email:', err);
        res.status(500).json({ error: 'Something went wrong while checking email' });
    }
};

module.exports = userCltr;


