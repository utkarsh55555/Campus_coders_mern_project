
const Transaction = require("../models/Transaction");

exports.getAllTransactions = async (req, res) => {
  try {
    console.log(`[DEBUG] Fetching transactions for user: ${req.user._id}`);
    console.log(`[DEBUG] Database name: ${Transaction.db.name}`);
    console.log(`[DEBUG] Collection name: ${Transaction.collection.name}`);
    
    const transactions = await Transaction.find({ userId: req.user._id });
    console.log(`[DEBUG] Found ${transactions.length} transactions`);
    res.status(200).json(transactions);
  } catch (error) {
    console.log(`[DEBUG] Error fetching transactions: ${error.message}`);
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
}

exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, description, category, date, notes } = req.body;
    
    console.log(`[DEBUG] Creating transaction for user: ${req.user._id}`);
    console.log(`[DEBUG] Database name: ${Transaction.db.name}`);
    console.log(`[DEBUG] Collection name: ${Transaction.collection.name}`);
    console.log(`[DEBUG] Transaction data:`, { type, amount, description, category });
    
    const transaction = await Transaction.create({ userId: req.user._id, type, amount, description, category, date, notes });
    
    console.log(`[DEBUG] Transaction created successfully with ID: ${transaction._id}`);
    console.log(`[DEBUG] Transaction saved to collection: ${Transaction.collection.name}`);
    
    res.status(201).json({ message: "Transaction created successfully" ,data: transaction});
  } catch (error) {
    console.log(`[DEBUG] Error creating transaction: ${error.message}`);
    res.status(500).json({ message: "Error creating transaction", error: error.message });
  }
}

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, category, date, notes } = req.body;
    
    console.log(`[DEBUG] Updating transaction ID: ${id}`);
    console.log(`[DEBUG] Database name: ${Transaction.db.name}`);
    console.log(`[DEBUG] Collection name: ${Transaction.collection.name}`);
    
    const transaction = await Transaction.findByIdAndUpdate(id, { type, amount, description, category, date, notes }, { new: true });
    
    console.log(`[DEBUG] Transaction updated successfully`);
    res.status(200).json({ message: "Transaction updated successfully" ,data: transaction});
  } catch (error) {
    console.log(`[DEBUG] Error updating transaction: ${error.message}`);
    res.status(500).json({ message: "Error updating transaction", error: error.message });
  }
}

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`[DEBUG] Deleting transaction ID: ${id}`);
    console.log(`[DEBUG] Database name: ${Transaction.db.name}`);
    console.log(`[DEBUG] Collection name: ${Transaction.collection.name}`);
    
    await Transaction.findByIdAndDelete(id);
    
    console.log(`[DEBUG] Transaction deleted successfully`);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log(`[DEBUG] Error deleting transaction: ${error.message}`);
    res.status(500).json({ message: "Error deleting transaction", error: error.message });
  }
}