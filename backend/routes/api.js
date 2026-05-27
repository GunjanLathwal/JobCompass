const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume } = require('../controllers/resumeController');

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Resume analysis route
router.post('/analyze', upload.single('resume'), analyzeResume);

// LaTeX update route
const { updateLatex } = require('../controllers/resumeController');
router.post('/latex-update', express.json(), updateLatex);

// Auth routes
const { registerUser, loginUser } = require('../controllers/authController');
router.post('/auth/register', express.json(), registerUser);
router.post('/auth/login', express.json(), loginUser);

// Application routes
const { protect } = require('../middleware/authMiddleware');
const { getApplications, createApplication, updateApplication, deleteApplication } = require('../controllers/applicationController');
router.route('/applications')
  .get(protect, getApplications)
  .post(protect, express.json(), createApplication);
router.route('/applications/:id')
  .put(protect, express.json(), updateApplication)
  .delete(protect, deleteApplication);

const { scrapeJobUrl } = require('../controllers/applicationController');
router.post('/scrape-job', express.json(), scrapeJobUrl);

module.exports = router;
