/**
 * Project Request Routes
 * 
 * Handles all project build request endpoints
 */

const express = require('express');
const router = express.Router();
const {
  createProjectOrder,
  submitProjectRequest,
  getMyRequests,
  getAllRequests,
  updateProjectStatus,
  submitWork,
  getWorkSubmissions,
} = require('../controllers/projectRequestController');

// Public routes
router.post('/create-order', createProjectOrder);
router.post('/submit', submitProjectRequest);
router.get('/my-requests', getMyRequests);

// Admin routes (TODO: Add authentication middleware)
router.get('/all', getAllRequests);
router.put('/update-status/:id', updateProjectStatus);

// Work submission routes
router.post('/submit-work', submitWork);
router.get('/work-submissions/:projectId', getWorkSubmissions);

module.exports = router;
