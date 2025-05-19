const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const DATA_FILE = 'data.json';

app.use(express.json());
app.use(express.static(__dirname));

let tasks = [];

// Load from file
if (fs.existsSync(DATA_FILE)) {
  const data = fs.readFileSync(DATA_FILE);
  tasks = JSON.parse(data);
}

// Save to file
function saveTasks() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { task, time, date, ampm } = req.body;
  if (task && time && date && ampm) {
    tasks.push({ task, time, date, ampm, completed: false });
    saveTasks();
    res.json({ message: 'Task added' });
  } else {
    res.status(400).json({ error: 'Missing fields' });
  }
});

app.patch('/tasks/complete/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (!isNaN(index) && tasks[index]) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    res.json({ message: 'Task completion toggled' });
  } else {
    res.status(400).json({ error: 'Invalid index' });
  }
});

app.delete('/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (!isNaN(index)) {
    tasks.splice(index, 1);
    saveTasks();
    res.json({ message: 'Task deleted' });
  } else {
    res.status(400).json({ error: 'Invalid index' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
