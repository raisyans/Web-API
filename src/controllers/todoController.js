const Todo = require('../models/Todo');

exports.getAllTodos = async (req, res) => {
  try {
    // Dapatkan userId dari req.user yang telah diatur oleh middleware verifyToken
    const userId = req.user.userId;

    // Dapatkan semua todos yang terkait dengan userId
    const todos = await Todo.find({ userId });

    res.status(200).json(todos);
  } catch (error) {
    console.error('Error getting all todos:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createTodo = async (req, res) => {
  try {
    // Dapatkan data dari body request
    const { title, description } = req.body;

    // Dapatkan userId dari req.user yang telah diatur oleh middleware verifyToken
    const userId = req.user.userId;

    // Buat todo baru
    const newTodo = new Todo({
      title: title,
      description: description,
      userId: userId,
    });

    // Simpan todo ke database
    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    // Dapatkan todoId dari parameter URL
    const todoId = req.params.id;

    // Dapatkan todo berdasarkan todoId
    const todo = await Todo.findById(todoId);

    // Periksa apakah todo ditemukan
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error('Error getting todo by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    // Dapatkan todoId dari parameter URL
    const todoId = req.params.id;

    // Dapatkan data update dari body request
    const { title, description } = req.body;

    // Dapatkan todo berdasarkan todoId
    const todo = await Todo.findById(todoId);

    // Periksa apakah todo ditemukan
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Update data todo
    todo.title = title || todo.title;
    todo.description = description || todo.description;

    // Simpan todo yang telah diupdate ke database
    const updatedTodo = await todo.save();

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    // Dapatkan todoId dari parameter URL
    const todoId = req.params.id;

    // Hapus todo berdasarkan todoId
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    // Periksa apakah todo ditemukan
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
