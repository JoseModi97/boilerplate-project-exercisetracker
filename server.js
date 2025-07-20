const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './.env' });
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
