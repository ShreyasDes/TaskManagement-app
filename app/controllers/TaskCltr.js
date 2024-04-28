const Task = require('../models/Task');

const taskCltr = {};

// Function to get all tasks
taskCltr.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Function to create a new task
taskCltr.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({
            title,
            description,
            user: req.user.id
        });
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Function to update a task
taskCltr.updateTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
            title,
            description
        }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Function to delete a task
taskCltr.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = taskCltr;


