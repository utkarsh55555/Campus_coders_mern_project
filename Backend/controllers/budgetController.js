const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

exports.createBudget = async (req, res) => {
    try{
     const budget = await Budget.create({
        userId: req.user._id,
        limit: req.body.limit,
        category: req.body.category,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
     });
     res.status(201).json({ message: "Budget created successfully", data: budget });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.getBudgets = async (req, res) => {
    try{
     const budgets = await Budget.find({userId: req.user._id});
     res.status(200).json({ message: "Budgets fetched successfully", data: budgets });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.checkBudget = async (req, res) => {
  try{
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });
    if(!budget){
        return res.status(404).json({ message: "Budget not found" });
    }
    //calculate spent from transactions
    const transactions = await Transaction.find({
        userId: req.user._id, 
        category: budget.category,
        date: {$gte: budget.startDate, $lte: budget.endDate}
    });
    const spent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    budget.spent = spent;
    budget.remaining = budget.limit - spent;
    await budget.save();
    res.status(200).json({ message: "Budget checked successfully", data: budget });
  }
  catch(error) {
    res.status(500).json({message:error.message});
  }
}

