const GroupExpense = require("../models/GroupExpense");
const Group = require("../models/Group");

exports.calculateSettlement = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("members", "name email");
    if (!group) return res.status(404).json({ msg: "Group not found" });

    const expenses = await GroupExpense.find({ groupId: group._id });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const share = total / group.members.length;

    const balances = {};
    group.members.forEach(m => balances[m._id] = -share);

    expenses.forEach(e => {
      balances[e.paidBy] += e.amount;
    });

    const result = group.members.map(m => ({
      user: m.name,
      email: m.email,
      balance: balances[m._id]
    }));

    res.json({ total, share, result });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
