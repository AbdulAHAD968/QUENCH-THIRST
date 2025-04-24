const express = require('express');
const router = express.Router();
const { 
  submitFeedback,
  getUserFeedback,
  getAllFeedback,
  addAdminResponse,
  deleteFeedback
} = require('../controllers/feedbackController');

// User routes
router.post('/', submitFeedback);
router.get('/my-feedback', getUserFeedback);

// Admin routes (no middleware protection)
router.get('/admin/all', getAllFeedback);
router.put('/admin/respond/:feedbackId', addAdminResponse);
router.delete('/admin/:feedbackId', deleteFeedback);

module.exports = router;