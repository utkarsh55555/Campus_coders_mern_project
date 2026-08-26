const Group = require("../models/Group");

exports.createGroup = async (req, res) => {
    try {
        const group = await Group.create({
            name: req.body.name,
            description: req.body.description,
            members: [req.user._id],    
        });
        res.status(201).json({ message: "Group created successfully", data: group });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user._id }).populate("members", "name email");
        res.json({ message: "Groups fetched successfully", data: groups });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.addMember = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        group.members.push(req.body.memberId);
        await group.save();
        const updatedGroup = await Group.findById(req.params.id).populate("members", "name email");
        res.status(200).json({ message: "Member added successfully", data: updatedGroup });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}