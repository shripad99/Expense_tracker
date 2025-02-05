const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    expense_name: {type: String, required: true},
    amount: {type: Number, required: true},
    date: { type: Date, required: true},
    description: {type: String, required: true},
    createdOn: {type: String, default: new Date().getTime()},
})

module.exports = mongoose.model("Expense", expenseSchema);