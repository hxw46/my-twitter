const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const posts = require('./apis/posts');
const users = require('./apis/users');

const app = express();
const MongoEndpoint = 'mongodb+srv://edwin:edwin123@twitter-clone-cluster.38wbxty.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MongoEndpoint, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/posts/', posts);
app.use('/api/users/', users);

const frontendDir = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDir));

app.get('*', (req, res) => {
    console.log("Received request for:", req.path);
    res.sendFile(path.join(frontendDir, "index.html"));
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
