const Application = require('../models/Application');
const axios = require('axios');
const cheerio = require('cheerio');

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const { company, role, platform, status, appliedDate, notes, link } = req.body;
    
    const application = new Application({
      user: req.user._id,
      company,
      role,
      platform,
      status,
      appliedDate,
      notes,
      link
    });
    
    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to update this application' });
    }
    
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to delete this application' });
    }
    
    await application.deleteOne();
    res.json({ message: 'Application removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.scrapeJobUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    let company = '';
    let role = '';
    let platform = '';

    if (url.includes('linkedin.com')) platform = 'LinkedIn';
    else if (url.includes('indeed.com')) platform = 'Indeed';
    else if (url.includes('glassdoor.com')) platform = 'Glassdoor';
    else platform = new URL(url).hostname.replace('www.', '');

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const titleText = $('title').text() || '';

    // Simple heuristic: Usually page titles are like "Software Engineer at Google | LinkedIn"
    const parts = titleText.split(/[-|]/);
    if (parts.length > 0) {
      const mainPart = parts[0].trim();
      const atSplit = mainPart.split(/ at /i);
      if (atSplit.length === 2) {
        role = atSplit[0].trim();
        company = atSplit[1].trim();
      } else {
        role = mainPart;
      }
    }

    res.json({ company, role, platform });
  } catch (error) {
    console.error('Error scraping URL:', error.message);
    res.status(500).json({ error: 'Failed to scrape URL' });
  }
};
