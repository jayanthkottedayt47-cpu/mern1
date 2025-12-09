const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');


// Create expense
router.post('/', auth, async (req, res) => {
const { amount, category, date, notes } = req.body;
try {
const exp = new Expense({ user: req.user._id, amount, category, date, notes });
await exp.save();
res.json(exp);
} catch (err) { res.status(500).json({ message: 'Server error' }); }
});


// Get all expenses for user
router.get('/', auth, async (req, res) => {
try {
const exps = await Expense.find({ user: req.user._id }).sort({ date: -1 });
res.json(exps);
} catch (err) { res.status(500).json({ message: 'Server error' }); }
});


// server/routes/expenses.js (update route)
router.put('/:id', auth, async (req, res) => {
  try {
    const allowed = ['amount', 'category', 'date', 'notes'];
    const updates = {};
    const edits = [];

    // find the current document
    const existing = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!existing) return res.status(404).json({ message: 'Not found' });

    for (let key of allowed) {
      if (req.body[key] !== undefined) {
        // compare values (dates require special handling)
        const oldVal = (key === 'date') ? existing.date.toISOString().slice(0,10) : existing[key];
        const newVal = (key === 'date') ? new Date(req.body[key]).toISOString().slice(0,10) : req.body[key];

        // if different, record edit and update
        if (String(oldVal) !== String(newVal)) {
          edits.push({ field: key, from: existing[key], to: req.body[key], by: req.user._id });
          updates[key] = req.body[key];
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.json(existing); // nothing changed
    }

    // perform update and push edits
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updates, $push: { edits: { $each: edits } } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete
router.delete('/:id', auth, async (req, res) => {
try {
const exp = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
if (!exp) return res.status(404).json({ message: 'Not found' });
res.json({ message: 'Deleted' });
} catch (err) { res.status(500).json({ message: 'Server error' }); }
});


module.exports = router;