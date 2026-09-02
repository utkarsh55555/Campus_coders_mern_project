const express = require("express");
const { createBudget, getBudgets, checkBudget } = require("../controllers/budgetController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, (req, res) => {
  /*
  #swagger.tags = ['Budgets']
  #swagger.summary = 'Create a new budget'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["limit", "category", "endDate"],
              properties: {
                limit: { type: "number", example: 500 },
                category: { type: "string", example: "Food" },
                startDate: { type: "string", format: "date-time" },
                endDate: { type: "string", format: "date-time" }
              }
            }
          }
        }
     }
  #swagger.responses[201] = { description: "Budget created successfully" }
  */
  return createBudget(req, res);
});

router.get("/", protect, (req, res) => {
  /*
  #swagger.tags = ['Budgets']
  #swagger.summary = 'Get all budgets for the logged-in user'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.responses[200] = {
        description: "Budgets fetched successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string" },
                data: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Budget" }
                }
              }
            }
          }
        }
     }
  */
  return getBudgets(req, res);
});

router.get("/:id/check", protect, (req, res) => {
  /*
  #swagger.tags = ['Budgets']
  #swagger.summary = 'Check budget spending against transactions'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id'] = { in: 'path', description: 'Budget ID', required: true, type: 'string' }
  #swagger.responses[200] = { description: "Budget checked successfully" }
  #swagger.responses[404] = { description: "Budget not found" }
  */
  return checkBudget(req, res);
});

module.exports = router;
