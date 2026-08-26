const express = require("express");
const { createBudget, getBudgets, checkBudget } = require("../controllers/budgetController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createBudget);
router.get("/", protect, getBudgets);
router.get("/:id/check", protect, checkBudget);

module.exports = router;
