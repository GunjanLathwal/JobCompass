const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const mongoose = require('mongoose');
const { calculateMatchScore, generateFeedback } = require('../utils/nlpEngine');
const Analysis = require('../models/Analysis');

exports.analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a resume file' });
        }
        
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }
        
        const fileBuffer = req.file.buffer;
        const mimeType = req.file.mimetype;
        const originalName = req.file.originalname;
        
        let resumeText = '';
        
        // Extract text based on file type
        if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
            const pdfData = await pdfParse(fileBuffer);
            resumeText = pdfData.text;
        } else if (
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            originalName.endsWith('.docx')
        ) {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            resumeText = result.value;
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or DOCX file.' });
        }
        
        // Clean text (basic whitespace removal)
        resumeText = resumeText.replace(/\s+/g, ' ').trim();
        const cleanJobDesc = jobDescription.replace(/\s+/g, ' ').trim();
        
        // Analyze
        const matchData = calculateMatchScore(resumeText, cleanJobDesc);
        const feedbackData = generateFeedback(matchData.match_score, matchData.missing_skills, matchData.resumeSkills);
        
        // Output Format matches user requirement exactly
        const responseData = {
            match_score: matchData.match_score,
            matched_skills: matchData.matched_skills,
            missing_skills: matchData.missing_skills,
            resume_feedback: feedbackData.resume_feedback,
            job_fit_summary: feedbackData.job_fit_summary
        };
        
        // Try saving to Database if connected
        if (mongoose.connection.readyState === 1) {
            try {
                const analysisRecord = new Analysis({
                    match_score: responseData.match_score,
                    matched_skills: responseData.matched_skills,
                    missing_skills: responseData.missing_skills,
                    resume_feedback: responseData.resume_feedback,
                    job_fit_summary: responseData.job_fit_summary
                });
                await analysisRecord.save();
            } catch (dbError) {
                console.log('Skipping DB insert (error saving to MongoDB):', dbError.message);
            }
        } else {
            console.log('Skipping DB insert (MongoDB not connected).');
        }
        
        res.json(responseData);
        
    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ error: 'An error occurred while processing the resume.' });
    }
};

exports.updateLatex = async (req, res) => {
    try {
        const { latexContent, jobDescription } = req.body;
        if (!latexContent || !jobDescription) {
            return res.status(400).json({ error: 'LaTeX content and Job description are required' });
        }
        
        const cleanLatex = latexContent.replace(/\s+/g, ' ').trim();
        const cleanJobDesc = jobDescription.replace(/\s+/g, ' ').trim();
        
        // Analyze to get missing skills
        const matchData = calculateMatchScore(cleanLatex, cleanJobDesc);
        const missingSkills = matchData.missing_skills;
        
        // Find the placeholder and replace
        let updatedLatex = latexContent;
        if (missingSkills.length > 0) {
            const placeholderRegex = /% TARGET_SKILLS_HERE %/gi;
            if (placeholderRegex.test(updatedLatex)) {
                // Formatting missing skills into LaTeX friendly string (e.g. capitalized and comma separated)
                const skillsString = missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
                updatedLatex = updatedLatex.replace(placeholderRegex, skillsString);
            }
        }
        
        res.json({
            updatedLatex,
            missing_skills: missingSkills,
            match_score: matchData.match_score
        });
        
    } catch (error) {
        console.error('Error updating LaTeX:', error);
        res.status(500).json({ error: 'An error occurred while processing the LaTeX template.' });
    }
};
