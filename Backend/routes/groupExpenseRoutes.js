const express = require("express");
const { addExpense, getExpenses } = require("../controllers/groupExpenseController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/addExpense/:groupId", protect, addExpense);
router.get("/getExpenses/:groupId", protect, getExpenses);

module.exports = router;