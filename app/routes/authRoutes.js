
const express = require('express');
const router = express.Router();
const authCltr = require('../controllers/authCltr');

router.post('/register', authCltr.register);
router.post('/login', authCltr.login);
router.get('/logout', (req, res) => {
    // Placeholder function
    res.send('Logout route');
});

module.exports = router;
