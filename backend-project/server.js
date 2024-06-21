const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define todo schema and model
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

app.use(express.json());
app.use(cors());

// Define API endpoints for CRUD operations

// Create a new todo
app.post("/api/todos", (req, res) => {
  const { title, description, completed } = req.body;
  const newTodo = new Todo({ title, description, completed });
  newTodo.save((err, todo) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    } else {
      res.status(201).json(todo);
    }
  });
});

// Get all todos
app.get("/api/todos", (req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    } else {
      res.json(todos);
    }
  });
});

// Get a single todo by ID
app.get("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  Todo.findById(id, (err, todo) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    } else if (!todo) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.json(todo);
    }
  });
});

// Update a todo by ID
app.put("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const { title, description, completed } = req.body;
  Todo.findByIdAndUpdate(
    id,
    { title, description, completed },
    { new: true },
    (err, todo) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
      } else if (!todo) {
        res.status(404).json({ error: "Todo not found" });
      } else {
        res.json(todo);
      }
    }
  );
});

// Delete a todo by ID
app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  Todo.findByIdAndRemove(id, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    } else {
      res.status(204).send();
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
