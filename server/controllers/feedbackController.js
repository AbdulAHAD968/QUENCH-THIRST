const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback');

// Submit Feedback
const submitFeedback = asyncHandler(async (req, res) => {
  const { rating, comment, feedbackType, userId } = req.body;

  // Validation
  if (!rating || !comment || !userId) {
    res.status(400);
    throw new Error('Please provide rating, comment, and userId');
  }

  // Create Feedback
  const feedback = await Feedback.create({
    user: userId,
    rating,
    comment,
    feedbackType: feedbackType || 'general'
  });

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully',
    data: feedback
  });
});

// Get All Feedback by User
const getUserFeedback = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  const feedback = await Feedback.find({ user: userId })
    .sort('-createdAt')
    .populate('user', 'username email')
    .select('-__v');

  res.json({
    success: true,
    count: feedback.length,
    data: feedback
  });
});

// Get all feedback (for admin)
const getAllFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find()
    .sort('-createdAt')
    .populate('user', '_id'); // Only get user ID for integrity

  res.json({
    success: true,
    count: feedback.length,
    data: feedback
  });
});

// Admin response to feedback
const addAdminResponse = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { response } = req.body;

  const feedback = await Feedback.findByIdAndUpdate(
    feedbackId,
    { adminResponse: response, respondedAt: Date.now() },
    { new: true }
  );

  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  res.json({
    success: true,
    message: 'Response added successfully',
    data: feedback
  });
});

// Delete feedback (admin only)
const deleteFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  const feedback = await Feedback.findByIdAndDelete(feedbackId);

  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  res.json({
    success: true,
    message: 'Feedback deleted successfully'
  });
});

module.exports = {
  submitFeedback,
  getUserFeedback,
  getAllFeedback,
  addAdminResponse,
  deleteFeedback
};
