// server/models/Expense.js
const mongoose = require('mongoose');

const EditSchema = new mongoose.Schema({
  field: { type: String, required: true },   // e.g., 'amount', 'category', 'notes'
  from: { type: mongoose.Schema.Types.Mixed }, // previous value
  to: { type: mongoose.Schema.Types.Mixed },   // new value
  at: { type: Date, default: Date.now },
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // who edited
});

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  edits: { type: [EditSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
