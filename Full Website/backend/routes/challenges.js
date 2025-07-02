const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Challenge = require('../models/Challenge');
const ChallengeSubmission = require('../models/ChallengeSubmission');
const { protect: auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/challenges/')
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip|txt|mp4|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all public challenges (no auth required)
router.get('/public', async (req, res) => {
  try {
    const {
      category,
      difficulty,
      status = 'active',
      search,
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    const query = {
      isPublic: true,
      status: status
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'deadline':
        sort = { deadline: 1 };
        break;
      case 'popular':
        sort = { submissionCount: -1 };
        break;
      case 'prize':
        sort = { prizePool: -1 };
        break;
      default:
        sort = { featured: -1, createdAt: -1 };
    }

    // Execute query with pagination
    const challenges = await Challenge.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('creator', 'name avatar')
      .lean();

    const total = await Challenge.countDocuments(query);

    // Add computed fields
    const enrichedChallenges = challenges.map(challenge => ({
      ...challenge,
      daysRemaining: Math.max(0, Math.ceil((new Date(challenge.deadline) - new Date()) / (1000 * 60 * 60 * 24))),
      isExpired: new Date(challenge.deadline) < new Date()
    }));

    res.json({
      challenges: enrichedChallenges,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// Get single public challenge details
router.get('/public/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('creator', 'name avatar title')
      .populate('participants.user', 'name avatar')
      .populate('participants.team', 'name');

    if (!challenge || !challenge.isPublic) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Increment view count
    await challenge.incrementViewCount();

    // Get submission count
    const submissionCount = await ChallengeSubmission.countDocuments({
      challenge: challenge._id
    });

    // Get top submissions if challenge is closed
    let topSubmissions = [];
    if (challenge.status === 'closed' || challenge.isExpired) {
      topSubmissions = await ChallengeSubmission.find({
        challenge: challenge._id,
        status: { $in: ['accepted', 'winner'] }
      })
        .sort({ score: -1, 'votes.count': -1 })
        .limit(3)
        .populate('submitter', 'name avatar')
        .populate('team', 'name');
    }

    res.json({
      ...challenge.toObject(),
      submissionCount,
      topSubmissions,
      canSubmit: challenge.status === 'active' && !challenge.isExpired
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// Submit solution to a challenge (public or authenticated)
router.post('/public/:id/submit', upload.array('attachments', 5), async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge || !challenge.isPublic) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (challenge.status !== 'active' || challenge.isExpired) {
      return res.status(400).json({ error: 'Challenge is not accepting submissions' });
    }

    const {
      title,
      description,
      submissionDetails,
      publicName,
      publicEmail,
      organization,
      githubRepo,
      demoUrl,
      videoUrl,
      technologies,
      implementationPlan,
      estimatedImpact,
      resourcesNeeded
    } = req.body;

    // Check if user is authenticated
    let submitterId = null;
    let publicSubmitter = null;

    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        submitterId = decoded.userId;
      } catch {
        // Not authenticated, continue as public
      }
    }

    if (!submitterId) {
      if (!publicName || !publicEmail) {
        return res.status(400).json({ 
          error: 'Name and email are required for public submissions' 
        });
      }
      publicSubmitter = { name: publicName, email: publicEmail, organization };
    }

    // Process uploaded files
    const attachments = req.files ? req.files.map(file => ({
      filename: file.originalname,
      url: `/uploads/challenges/${file.filename}`,
      size: file.size,
      type: file.mimetype
    })) : [];

    // Create submission
    const submission = new ChallengeSubmission({
      challenge: challenge._id,
      submitter: submitterId,
      publicSubmitter,
      title,
      description,
      submissionDetails,
      attachments,
      githubRepo,
      demoUrl,
      videoUrl,
      technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
      implementationPlan,
      estimatedImpact,
      resourcesNeeded
    });

    await submission.save();

    // Update challenge submission count
    challenge.submissionCount += 1;
    
    // Add participant if authenticated
    if (submitterId) {
      const isParticipant = challenge.participants.some(p => 
        p.user && p.user.toString() === submitterId
      );
      
      if (!isParticipant) {
        challenge.participants.push({ user: submitterId });
      }
    }
    
    await challenge.save();

    res.status(201).json({
      message: 'Submission received successfully',
      submissionId: submission._id
    });
  } catch (error) {
    console.error('Error submitting to challenge:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

// Get submissions for a public challenge
router.get('/public/:id/submissions', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'newest' } = req.query;
    
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || !challenge.isPublic) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'votes':
        sort = { 'votes.count': -1 };
        break;
      case 'score':
        sort = { score: -1 };
        break;
    }

    const submissions = await ChallengeSubmission.find({
      challenge: req.params.id,
      status: { $ne: 'pending' } // Only show reviewed submissions
    })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('submitter', 'name avatar')
      .populate('team', 'name')
      .select('-feedback.scores'); // Hide detailed scores

    const total = await ChallengeSubmission.countDocuments({
      challenge: req.params.id,
      status: { $ne: 'pending' }
    });

    res.json({
      submissions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Vote on a submission
router.post('/submissions/:id/vote', async (req, res) => {
  try {
    const submission = await ChallengeSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Get user ID if authenticated
    let userId = null;
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch {
        // Not authenticated
      }
    }

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to vote' });
    }

    const { action } = req.body;
    let result;

    if (action === 'add') {
      result = await submission.addVote(userId);
      if (!result) {
        return res.status(400).json({ error: 'Already voted' });
      }
    } else if (action === 'remove') {
      result = await submission.removeVote(userId);
      if (!result) {
        return res.status(400).json({ error: 'Vote not found' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    res.json({ 
      message: 'Vote updated successfully',
      voteCount: submission.votes.count 
    });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ error: 'Failed to update vote' });
  }
});

// AUTHENTICATED ROUTES FOR EMPLOYEES

// Create a new challenge (employees only)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      detailedDescription,
      category,
      difficulty,
      deadline,
      maxTeamSize,
      rewards,
      prizePool,
      successCriteria,
      tags,
      isPublic,
      resources,
      requirements,
      evaluationCriteria
    } = req.body;

    const challenge = new Challenge({
      title,
      description,
      detailedDescription,
      category,
      difficulty,
      deadline: new Date(deadline),
      maxTeamSize,
      rewards,
      prizePool,
      successCriteria,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      isPublic: isPublic || false,
      creator: req.user._id,
      company: req.user.company,
      resources,
      requirements,
      evaluationCriteria,
      status: 'active' // Auto-activate for now
    });

    await challenge.save();

    res.status(201).json({
      message: 'Challenge created successfully',
      challengeId: challenge._id
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// Get challenges created by the user
router.get('/my-challenges', auth, async (req, res) => {
  try {
    const challenges = await Challenge.find({ creator: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Get submission counts for each challenge
    const challengeIds = challenges.map(c => c._id);
    const submissionCounts = await ChallengeSubmission.aggregate([
      { $match: { challenge: { $in: challengeIds } } },
      { $group: { _id: '$challenge', count: { $sum: 1 } } }
    ]);

    const countsMap = {};
    submissionCounts.forEach(sc => {
      countsMap[sc._id.toString()] = sc.count;
    });

    const enrichedChallenges = challenges.map(challenge => ({
      ...challenge,
      actualSubmissionCount: countsMap[challenge._id.toString()] || 0
    }));

    res.json(enrichedChallenges);
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// Get submissions for a challenge created by the user
router.get('/my-challenges/:id/submissions', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findOne({
      _id: req.params.id,
      creator: req.user._id
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const submissions = await ChallengeSubmission.find({
      challenge: req.params.id
    })
      .sort({ createdAt: -1 })
      .populate('submitter', 'name email avatar')
      .populate('team', 'name');

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Review a submission
router.put('/submissions/:id/review', auth, async (req, res) => {
  try {
    const submission = await ChallengeSubmission.findById(req.params.id)
      .populate('challenge');

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user is the challenge creator
    if (submission.challenge.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { status, score, comments, scores } = req.body;

    submission.status = status;
    submission.score = score;
    submission.feedback = {
      reviewer: req.user._id,
      comments,
      reviewedAt: new Date(),
      scores
    };

    if (status === 'winner') {
      submission.isWinner = true;
    }

    await submission.save();

    res.json({ message: 'Submission reviewed successfully' });
  } catch (error) {
    console.error('Error reviewing submission:', error);
    res.status(500).json({ error: 'Failed to review submission' });
  }
});

module.exports = router;