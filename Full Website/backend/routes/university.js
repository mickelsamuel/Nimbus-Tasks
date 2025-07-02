const express = require('express');
const router = express.Router();

// University data endpoints
router.get('/hackathons', (req, res) => {
  const hackathons = [
    {
      id: 1,
      title: "AI Banking Innovation Challenge",
      status: "live",
      participants: 125,
      maxParticipants: 150,
      prize: "$25,000",
      startDate: "Dec 15, 2024",
      endDate: "Dec 22, 2024",
      technologies: ["Python", "TensorFlow", "React", "Node.js"],
      description: "Build innovative AI solutions for modern banking challenges",
      sponsors: ["National Bank", "Tech Corp", "AI Labs"]
    },
    {
      id: 2,
      title: "Blockchain Security Hackathon",
      status: "upcoming",
      participants: 0,
      maxParticipants: 100,
      prize: "$15,000",
      startDate: "Jan 5, 2025",
      endDate: "Jan 12, 2025",
      technologies: ["Solidity", "Web3.js", "Ethereum", "Smart Contracts"],
      description: "Create secure blockchain solutions for financial services",
      sponsors: ["CryptoBank", "BlockSec"]
    },
    {
      id: 3,
      title: "Mobile Banking UX Challenge",
      status: "completed",
      participants: 200,
      maxParticipants: 200,
      prize: "$20,000",
      startDate: "Nov 1, 2024",
      endDate: "Nov 8, 2024",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
      description: "Redesign the future of mobile banking experiences",
      winners: ["Team Alpha", "Team Beta", "Team Gamma"]
    }
  ];

  res.json({ 
    success: true, 
    data: hackathons
  });
});

router.get('/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: "AI-Powered Financial Advisor",
      team: ["Alice Chen", "Bob Smith", "Carol Davis"],
      award: "1st Place - AI Banking Challenge",
      technologies: ["Python", "TensorFlow", "React", "AWS"],
      description: "An intelligent system that provides personalized financial advice using machine learning",
      github: "https://github.com/example/ai-advisor",
      demo: "https://demo.ai-advisor.com",
      impact: "50,000+ users assisted"
    },
    {
      id: 2,
      title: "Secure Payment Gateway",
      team: ["David Lee", "Emma Wilson", "Frank Brown"],
      award: "Best Security Implementation",
      technologies: ["Node.js", "Blockchain", "React", "Docker"],
      description: "A blockchain-based payment gateway ensuring maximum security for transactions",
      github: "https://github.com/example/secure-pay",
      demo: "https://demo.secure-pay.com",
      impact: "$2M+ processed securely"
    },
    {
      id: 3,
      title: "Banking Chatbot Assistant",
      team: ["Grace Taylor", "Henry Martin", "Iris Johnson"],
      award: "Most Innovative Solution",
      technologies: ["NLP", "Python", "React", "MongoDB"],
      description: "Natural language processing chatbot for customer service automation",
      github: "https://github.com/example/bank-bot",
      demo: "https://demo.bank-bot.com",
      impact: "90% query resolution rate"
    }
  ];

  res.json({ 
    success: true, 
    data: projects
  });
});

router.get('/opportunities', (req, res) => {
  const opportunities = [
    {
      id: 1,
      title: "Software Engineer - FinTech Division",
      company: "National Bank",
      location: "Toronto, ON",
      type: "Full-time",
      salary: "$80,000 - $120,000",
      deadline: "Dec 31, 2024",
      requirements: ["React", "Node.js", "AWS", "Banking experience"],
      benefits: ["Health insurance", "401k matching", "Remote work", "Learning budget"],
      applicationStatus: "accepting"
    },
    {
      id: 2,
      title: "Data Scientist - Risk Analysis",
      company: "Global Finance Corp",
      location: "Montreal, QC",
      type: "Internship",
      salary: "$35/hour",
      deadline: "Jan 15, 2025",
      requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
      benefits: ["Mentorship program", "Flexible hours", "Career development"],
      applicationStatus: "closing-soon"
    },
    {
      id: 3,
      title: "UX Designer - Digital Banking",
      company: "InnoBank",
      location: "Vancouver, BC",
      type: "Contract",
      salary: "$60/hour",
      deadline: "Jan 30, 2025",
      requirements: ["Figma", "User Research", "Prototyping", "Mobile Design"],
      benefits: ["Remote work", "Creative freedom", "Industry exposure"],
      applicationStatus: "accepting"
    }
  ];

  res.json({ 
    success: true, 
    data: opportunities
  });
});

router.get('/events', (req, res) => {
  const events = [
    {
      id: 1,
      title: "Banking Technology Summit 2025",
      type: "conference",
      date: "Jan 20, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Virtual Event",
      speakers: ["Dr. Sarah Johnson - AI Expert", "Mike Chen - Blockchain Pioneer", "Lisa Park - UX Leader"],
      capacity: 500,
      registered: 423,
      description: "Annual summit on emerging technologies in banking"
    },
    {
      id: 2,
      title: "Career Development Workshop",
      type: "workshop",
      date: "Dec 28, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Room 301, Training Center",
      speakers: ["HR Team", "Senior Engineers"],
      capacity: 50,
      registered: 38,
      description: "Resume building and interview preparation for banking roles"
    },
    {
      id: 3,
      title: "Innovation Forum: Future of Finance",
      type: "forum",
      date: "Feb 5, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Main Auditorium",
      speakers: ["Industry Leaders Panel"],
      capacity: 200,
      registered: 156,
      description: "Panel discussion on transformative technologies in finance"
    }
  ];

  res.json({ 
    success: true, 
    data: events
  });
});

// Default endpoint
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'University API endpoints available at /hackathons, /projects, /opportunities, /events'
  });
});

// Legacy endpoints (keep at bottom to avoid conflicts)
router.get('/:id', (req, res) => {
  res.json({ 
    success: true, 
    message: 'university by ID endpoint working',
    id: req.params.id 
  });
});

router.post('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'university created successfully',
    data: req.body 
  });
});

module.exports = router;
