require('dotenv').config();

const express = require("express");
const mongoose  = require("mongoose");
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const cors = require('cors');

const {HoldingsModel} = require('./model/HoldingsModel');
const {OrdersModel} = require('./model/OrdersModel');
const {PositionsModel} = require('./model/PositionsModel');

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

// MongoDB Connection and Server Start
mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

// ======= API Routes =======

app.get('/allHoldings', async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get('/allPositions', async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post('/newOrder', async (req, res) => {
  let newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  await newOrder.save();
  res.send("Order saved!");
});