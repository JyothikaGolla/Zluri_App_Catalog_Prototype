const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const appsRoutes = require('./backend/routes/apps');
const requestsRoutes = require('./backend/routes/requests');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/apps', appsRoutes);
app.use('/api/requests', requestsRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'));

app.listen(5000, () => console.log('Server running on port 5000'));

