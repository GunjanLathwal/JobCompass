const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  platform: { type: String }, // e.g., LinkedIn, Indeed, Company Site
  status: { 
    type: String, 
    enum: ['Saved', 'Applied', 'Interviewing', 'Rejected', 'Offer'],
    default: 'Applied'
  },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String },
  link: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
