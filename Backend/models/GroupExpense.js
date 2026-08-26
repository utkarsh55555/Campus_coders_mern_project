const mongoose = require("mongoose");

const groupExpenseSchema = new mongoose.Schema({
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    paidBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date:{
        type: Date,
        required: true,
        default: Date.now,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("GroupExpense", groupExpenseSchema);