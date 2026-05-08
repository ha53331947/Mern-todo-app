import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Local DNS fix (Only for local ISP issues)
if (process.env.NODE_ENV !== 'production') {
    dns.setDefaultResultOrder('ipv4first');
}

const app = express();

app.use(cors());
app.use(express.json());

// Root route (Taki Vercel par 404 na aaye)
app.get("/", (req, res) => res.send("Todo API is running..."));

// MongoDB Connection
const connectDB = async () => {
  try {
    // Vercel deployment ke liye options ko simple rakha hai
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas Connected!");
  } catch (err) {
    console.error("❌ Connection Error:", err.message);
    if (process.env.NODE_ENV !== 'production') {
        setTimeout(connectDB, 10000);
    }
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

// Vercel deployment fix:
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app; // Ye line Vercel ke liye zaroori hai