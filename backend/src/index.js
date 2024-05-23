const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use the CORS middleware

let usersCollection;
let itemsCollection;

// Connect to MongoDB
const client = new MongoClient('mongodb://localhost:27017', {
  useUnifiedTopology: true,
});
client.connect().then(() => {
  const db = client.db('mydatabase');
  usersCollection = db.collection('users');
  itemsCollection = db.collection('items');
  console.log('Connected to MongoDB');
});

// User routes
app.get('/users', async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    console.log('Fetched users:', users); // Add logging
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    const result = await usersCollection.insertOne(newUser);
    res.json(result.ops[0]); // Correctly return the inserted user
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;
    console.log(`Updating user with id: ${id}`); // Add logging
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedUser },
      { returnDocument: 'after' }
    );
    if (result.value) {
      res.json(result.value);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await usersCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Item routes
app.get('/items', async (req, res) => {
  try {
    const items = await itemsCollection.find().toArray();
    console.log('Fetched items:', items); // Add logging
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const newItem = req.body;
    const result = await itemsCollection.insertOne(newItem);
    res.json(result.ops[0]); // Correctly return the inserted item
  } catch (err) {
    console.error('Error creating item:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = req.body;
    console.log(`Updating item with id: ${id}`); // Add logging
    const result = await itemsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedItem },
      { returnDocument: 'after' }
    );
    if (result.value) {
      res.json(result.value);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    console.error('Error updating item:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await itemsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting item:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
