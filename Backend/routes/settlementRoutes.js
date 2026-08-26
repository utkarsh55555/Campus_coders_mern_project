const express = require("express");

const router = express.Router();
const { calculateSettlement } = require("../controllers/settlementController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/calculateSettlement/:groupId", protect, calculateSettlement);

module.exports = router;