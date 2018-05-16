const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// DB config, pulls monoURI object property from config/keys.js files
const db = require('./config/keys').mongoURI;

// connect to mongodb via mongoose
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(Error(err)));

app.get('/', (req, res) => res.send('Hello, World!!'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));