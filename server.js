import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Pakistani ISPs ke liye DNS fix
dns.setDefaultResultOrder('ipv4first');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
    });
    console.log("✅ MongoDB Atlas Connected!");
  } catch (err) {
    console.error("❌ Connection Error:", err.message);
    console.log("🔄 10 second baad retry karega...");
    setTimeout(connectDB, 10000); // auto retry
  }
};

connectDB();

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new Todo({ text: req.body.text });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send("Not found");
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));