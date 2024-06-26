const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import CORS middleware

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS for all origins during development

const url = 'mongodb://localhost:27017'; // MongoDB connection string
const dbName = 'registrarmanagement';
const collectionName = 'collections';

let db;

// Connect to MongoDB and start the server
MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    return db.listCollections({ name: collectionName }).toArray();
  })
  .then(collections => {
    if (collections.length > 0) {
      console.log(`Collection ${collectionName} already exists`);
      return;
    }

    return db.createCollection(collectionName);
  })
  .then(result => {
    if (result) {
      console.log(`Collection ${collectionName} created`);
    }

    // Start the server after handling the collection creation
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Middleware to check if the database is connected
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).send('Database connection not initialized');
  }
  next();
});

// Define a GET endpoint
app.get('/data', async (req, res) => {
  try {
    const collection = db.collection(collectionName);
    const data = await collection.find({}).toArray();
    res.json({ message: 'You are connected', data });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Define a POST endpoint
app.post('/data', async (req, res) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);

    // Log the result for debugging purposes
    console.log('Insert result:', result);

    if (result && result.insertedId) {
      const insertedDocument = await collection.findOne({ _id: result.insertedId });
      res.status(201).json(insertedDocument);
    } else {
      throw new Error('Insert operation did not return expected result');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
