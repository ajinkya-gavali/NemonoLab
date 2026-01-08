require('dotenv').config();
console.log('src/app.js: script starting...');
const express = require('express');
const cors = require('cors');
const libraryRoutes = require('./routes/libraryRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(cors());

// Register Routes
app.use('/api', libraryRoutes);

// Register Error Handler
app.use(errorHandler);

const port = process.env.API_GATEWAY_PORT || 3000;

app.listen(port, () => {
    console.log(`src/app.js: app.listen: API Gateway listening on port ${port}`);
});

module.exports = app;
