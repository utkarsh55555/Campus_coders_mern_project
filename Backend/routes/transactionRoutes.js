const express = require("express");
const { getAllTransactions, createTransaction, updateTransaction, deleteTransaction } = require("../controllers/transactionController");
const { protect } = require("../middlewares/authMiddleware");   

const router = express.Router();
router.get("/getAllTransactions", protect, getAllTransactions);
router.post("/createTransaction", protect, createTransaction);
router.put("/updateTransaction/:id", protect, updateTransaction);
router.delete("/deleteTransaction/:id", protect, deleteTransaction);

module.exports = router;
