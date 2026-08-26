const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    limit: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    spent: {
        type: Number,
        default: 0,
    },
    remaining: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

const Budget = mongoose.model("Budget", budgetSchema);
module.exports = Budget;