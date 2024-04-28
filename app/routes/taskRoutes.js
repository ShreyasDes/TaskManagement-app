const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const taskCltr = require('../controllers/TaskCltr');

router.get('/tasks', authMiddleware.authenticateUser, taskCltr.getAllTasks);
router.post('/tasks', (req, res) => {
    // Placeholder function
    res.send('Create a new task');
});
router.get('/tasks/:id', (req, res) => {
    // Placeholder function
    res.send(`Get task with ID ${req.params.id}`);
});
router.put('/tasks/:id', authMiddleware.authenticateUser, taskCltr.updateTask);
router.delete('/tasks/:id', authMiddleware.authenticateUser, taskCltr.deleteTask);

module.exports = router;



