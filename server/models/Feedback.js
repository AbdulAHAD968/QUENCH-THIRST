const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  feedbackType: {
    type: String,
    enum: ['general', 'order', 'product', 'support'],
    default: 'general'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Feedback', feedbackSchema);