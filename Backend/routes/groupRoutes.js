const express = require("express");
const { createGroup, getGroups, addMember } = require("../controllers/groupController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createGroup", protect, (req, res) => {
  /*
  #swagger.tags = ['Groups']
  #swagger.summary = 'Create a new group'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "description"],
              properties: {
                name: { type: "string", example: "Roommates" },
                description: { type: "string", example: "Shared apartment expenses" }
              }
            }
          }
        }
     }
  #swagger.responses[201] = { description: "Group created successfully" }
  */
  return createGroup(req, res);
});

router.get("/getGroups", protect, (req, res) => {
  /*
  #swagger.tags = ['Groups']
  #swagger.summary = 'Get all groups for the logged-in user'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.responses[200] = {
        description: "Groups fetched successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string" },
                data: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Group" }
                }
              }
            }
          }
        }
     }
  */
  return getGroups(req, res);
});

router.post("/addMember/:id", protect, (req, res) => {
  /*
  #swagger.tags = ['Groups']
  #swagger.summary = 'Add a member to a group'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id'] = { in: 'path', description: 'Group ID', required: true, type: 'string' }
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["memberId"],
              properties: {
                memberId: { type: "string", example: "507f1f77bcf86cd799439011" }
              }
            }
          }
        }
     }
  #swagger.responses[200] = { description: "Member added successfully" }
  #swagger.responses[404] = { description: "Group not found" }
  */
  return addMember(req, res);
});

module.exports = router;
