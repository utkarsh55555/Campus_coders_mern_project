const express = require("express");
const { getAllTransactions, createTransaction, updateTransaction, deleteTransaction } = require("../controllers/transactionController");
const { protect } = require("../middlewares/authMiddleware");   

const router = express.Router();

router.get("/getAllTransactions", protect, (req, res) => {
  /*
  #swagger.tags = ['Transactions']
  #swagger.summary = 'Get all transactions for the logged-in user'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.responses[200] = {
        description: "List of transactions",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: { $ref: "#/components/schemas/Transaction" }
            }
          }
        }
     }
  */
  return getAllTransactions(req, res);
});

router.post("/createTransaction", protect, (req, res) => {
  /*
  #swagger.tags = ['Transactions']
  #swagger.summary = 'Create a new transaction'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["type", "amount", "description", "category"],
              properties: {
                type: { type: "string", enum: ["income", "expense"], example: "expense" },
                amount: { type: "number", example: 150.5 },
                description: { type: "string", example: "Groceries" },
                category: { type: "string", example: "Food" },
                date: { type: "string", format: "date-time" },
                notes: { type: "string", example: "Weekly shopping" }
              }
            }
          }
        }
     }
  #swagger.responses[201] = { description: "Transaction created successfully" }
  */
  return createTransaction(req, res);
});

router.put("/updateTransaction/:id", protect, (req, res) => {
  /*
  #swagger.tags = ['Transactions']
  #swagger.summary = 'Update an existing transaction'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id'] = { in: 'path', description: 'Transaction ID', required: true, type: 'string' }
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["income", "expense"] },
                amount: { type: "number" },
                description: { type: "string" },
                category: { type: "string" },
                date: { type: "string", format: "date-time" },
                notes: { type: "string" }
              }
            }
          }
        }
     }
  #swagger.responses[200] = { description: "Transaction updated successfully" }
  */
  return updateTransaction(req, res);
});

router.delete("/deleteTransaction/:id", protect, (req, res) => {
  /*
  #swagger.tags = ['Transactions']
  #swagger.summary = 'Delete a transaction'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id'] = { in: 'path', description: 'Transaction ID', required: true, type: 'string' }
  #swagger.responses[200] = { description: "Transaction deleted successfully" }
  */
  return deleteTransaction(req, res);
});

module.exports = router;
