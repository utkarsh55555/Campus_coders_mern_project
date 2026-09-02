const express = require("express");

const router = express.Router();
const { calculateSettlement } = require("../controllers/settlementController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/calculateSettlement/:groupId", protect, (req, res) => {
  /*
  #swagger.tags = ['Settlement']
  #swagger.summary = 'Calculate group expense settlement balances'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['groupId'] = { in: 'path', description: 'Group ID', required: true, type: 'string' }
  #swagger.responses[200] = {
        description: "Settlement calculated successfully",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SettlementResult" }
          }
        }
     }
  #swagger.responses[404] = { description: "Group not found" }
  */
  return calculateSettlement(req, res);
});

module.exports = router;
