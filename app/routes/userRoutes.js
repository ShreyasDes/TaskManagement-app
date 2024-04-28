// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userCltr = require('../controllers/userCltr');

// Route to register a new user
router.post('/register', [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userCltr.register);

// Route to login
router.post('/login', [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required')
], userCltr.login);

// Route to get user account details
router.get('/account', userCltr.account);

// Route to check if an email is registered
router.get('/check-email', [
    check('email').isEmail().withMessage('Invalid email')
], userCltr.checkEmail);

module.exports = router;


