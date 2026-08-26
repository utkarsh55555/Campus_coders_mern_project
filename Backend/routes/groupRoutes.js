const express = require("express");
const { createGroup, getGroups, addMember } = require("../controllers/groupController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createGroup", protect, createGroup);
router.get("/getGroups", protect, getGroups);
router.post("/addMember/:id", protect, addMember);

module.exports = router;