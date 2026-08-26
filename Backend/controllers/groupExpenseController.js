const GroupExpense = require("../models/GroupExpense");

exports.addExpense = async (req, res) => {
    try{
        const groupExpense = await GroupExpense.create({
            groupId: req.params.groupId,
            amount: req.body.amount,
            description: req.body.description,
            paidBy: req.user._id,
            date: req.body.date,
        });
        res.status(201).json({ message: "Expense added successfully", data: groupExpense });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.getExpenses = async (req, res) => {
    try{
        const expenses = await GroupExpense.find({ groupId: req.params.groupId }).populate("paidBy", "name email").sort({ date: -1 }).exec();
        if (!expenses) {
            return res.status(404).json({ message: "No expenses found" });
        }
        res.status(200).json({ message: "Expenses fetched successfully", data: expenses });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}