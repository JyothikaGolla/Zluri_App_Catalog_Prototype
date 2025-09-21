const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const appsRoutes = require('./backend/routes/apps');
const requestsRoutes = require('./backend/routes/requests');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static('.'));

app.use('/api/apps', appsRoutes);
app.use('/api/requests', requestsRoutes);

// Serve the frontend HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

