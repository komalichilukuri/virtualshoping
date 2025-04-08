const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://localhost:27017/virtual-assistant', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

const aiRoutes = require('./routes/ai');
const productRoutes = require('./routes/products');

app.use('/api/ai', aiRoutes);
app.use('/api/products', productRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));