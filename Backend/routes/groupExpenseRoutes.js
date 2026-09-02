const express = require("express");
const { addExpense, getExpenses } = require("../controllers/groupExpenseController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/addExpense/:groupId", protect, (req, res) => {
  /*
  #swagger.tags = ['Group Expenses']
  #swagger.summary = 'Add an expense to a group'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['groupId'] = { in: 'path', description: 'Group ID', required: true, type: 'string' }
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["amount", "description"],
              properties: {
                amount: { type: "number", example: 75 },
                description: { type: "string", example: "Dinner" },
                date: { type: "string", format: "date-time" }
              }
            }
          }
        }
     }
  #swagger.responses[201] = { description: "Expense added successfully" }
  */
  return addExpense(req, res);
});

router.get("/getExpenses/:groupId", protect, (req, res) => {
  /*
  #swagger.tags = ['Group Expenses']
  #swagger.summary = 'Get all expenses for a group'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['groupId'] = { in: 'path', description: 'Group ID', required: true, type: 'string' }
  #swagger.responses[200] = {
        description: "Expenses fetched successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string" },
                data: {
                  type: "array",
                  items: { $ref: "#/components/schemas/GroupExpense" }
                }
              }
            }
          }
        }
     }
  */
  return getExpenses(req, res);
});

module.exports = router;
