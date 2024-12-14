const express = require("express");
const router = express.Router();
const tripController = require("../controllers/openAiController");

// Ask openAI for a trip planning
router.post("/planTrip", openAiController.askOpenAi);


module.exports = router;
