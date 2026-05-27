const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  match_score: {
    type: Number,
    required: true
  },
  matched_skills: {
    type: [String],
    default: []
  },
  missing_skills: {
    type: [String],
    default: []
  },
  resume_feedback: {
    type: String,
    required: true
  },
  job_fit_summary: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
