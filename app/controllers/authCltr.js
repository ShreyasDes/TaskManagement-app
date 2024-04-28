// backend/controllers/authCltr.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const { validationResult } = require('express-validator');

const authCltr = {};

authCltr.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const body = req.body;
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(body.password, salt);
        const user = new User(body);
        user.password = hashPassword;
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

authCltr.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const body = req.body;
    try {
        const user = await User.findOne({ email: body.email });
        if (user) {
            const isAuth = await bcrypt.compare(body.password, user.password);
            if (isAuth) {
                const tokenData = {
                    id: user._id,
                    role: user.role
                };
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });
                return res.json({ token: token, user: user });
            }
            return res.status(401).json({ error: 'Invalid email/password' });
        }
        res.status(404).json({ error: 'Invalid email/password' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = authCltr;
