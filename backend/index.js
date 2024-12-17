const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const tripRoutes = require('./routes/trips');
const wishRoutes = require('./routes/wishes');
const pool = require('./config/db');

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/wishes", wishRoutes);
app.use("/api/openAI", openAiRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to FlyAway!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});