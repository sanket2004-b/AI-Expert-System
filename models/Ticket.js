// models/Ticket.js
// Mongoose Schema for Support Tickets saved in MongoDB

const mongoose = require('mongoose');

// Define the Ticket Schema
const ticketSchema = new mongoose.Schema({
  // Auto-generated unique Ticket ID (e.g. TKT-1234)
  ticketId: {
    type: String,
    unique: true,
    required: true
  },

  // User's full name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  // User's email address
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },

  // Problem category (e.g. Internet Problem, Printer Issue)
  category: {
    type: String,
    required: [true, 'Category is required']
  },

  // Detailed problem description
  problem: {
    type: String,
    required: [true, 'Problem description is required'],
    trim: true
  },

  // Status of the ticket
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },

  // Date ticket was created (auto-set)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to auto-generate Ticket ID before saving
ticketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    // Generate random 4-digit number for ticket ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.ticketId = `TKT-${randomNum}`;
  }
  next();
});

// Export the Ticket model
module.exports = mongoose.model('Ticket', ticketSchema);
