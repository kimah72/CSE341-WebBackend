const express = require('express');
const router = express.Router();
const { getTasks, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// #swagger.tags = ['Tasks']
// #swagger.summary = 'Get all tasks'
router.get('/tasks', getTasks);

// #swagger.tags = ['Tasks']
// #swagger.summary = 'Get a task by ID'
router.get('/tasks/:id', getTaskById);

// #swagger.tags = ['Tasks']
// #swagger.summary = 'Create a new task'
// #swagger.parameters['body'] = {
//   in: 'body',
//   description: 'Task data',
//   required: true,
//   schema: { $ref: '#/definitions/Task' }
// }
router.post('/tasks', createTask);

// #swagger.tags = ['Tasks']
// #swagger.summary = 'Update a task'
router.put('/tasks/:id', updateTask);

// #swagger.tags = ['Tasks']
// #swagger.summary = 'Delete a task'
router.delete('/tasks/:id', deleteTask);

module.exports = router;