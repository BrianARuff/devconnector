const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// api express routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profiles');
const post = require('./routes/api/posts');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB config, pulls monoURI object property from config/keys.js files
const db = require('./config/keys').mongoURI;

// connect to mongodb via mongoose
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(Error(err)));

app.get('/', (req, res) => res.send('Hello, World!!'));

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/post', post);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

