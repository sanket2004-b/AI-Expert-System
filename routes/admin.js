// routes/admin.js
// Admin Dashboard Routes: View, Search, Delete Tickets

const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// ─────────────────────────────────────────
// GET: Admin Dashboard - View All Tickets
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    let query = {};

    // If search query exists, search by name, email, ticketId, or category
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { ticketId: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Fetch tickets from MongoDB, newest first
    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    const totalCount = await Ticket.countDocuments();

    res.render('admin', {
      title: 'Admin Dashboard',
      tickets,
      totalCount,
      search,
      messages: req.flash()
    });

  } catch (err) {
    console.error('Admin Error:', err);
    req.flash('error', 'Failed to load tickets.');
    res.redirect('/');
  }
});

// ─────────────────────────────────────────
// DELETE: Remove a Ticket by ID
// Uses method-override for DELETE from form
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    req.flash('success', 'Ticket deleted successfully.');
    res.redirect('/admin');

  } catch (err) {
    console.error('Delete Error:', err);
    req.flash('error', 'Failed to delete ticket.');
    res.redirect('/admin');
  }
});

// ─────────────────────────────────────────
// POST: Update Ticket Status
// ─────────────────────────────────────────
router.post('/update-status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await Ticket.findByIdAndUpdate(req.params.id, { status });
    req.flash('success', 'Ticket status updated.');
    res.redirect('/admin');
  } catch (err) {
    console.error('Update Error:', err);
    req.flash('error', 'Failed to update status.');
    res.redirect('/admin');
  }
});

module.exports = router;
