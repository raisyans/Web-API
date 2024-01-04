const express = require('express');
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.use(authMiddleware.verifyToken); // Middleware untuk verifikasi token JWT

router.get('/todos', todoController.getAllTodos);
router.post('/todos', uploadMiddleware.upload.single('file'), todoController.createTodo);
router.get('/todos/:id', todoController.getTodoById);
router.put('/todos/:id', uploadMiddleware.upload.single('file'), todoController.updateTodo);
router.delete('/todos/:id', todoController.deleteTodo);

module.exports = router;