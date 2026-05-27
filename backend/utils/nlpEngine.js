const stringSimilarity = require('string-similarity');

// A generic list of common IT/Software skills
const commonSkills = [
  'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin', 'typescript',
  'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt.js', 'express', 'django', 'flask', 'spring boot',
  'node.js', 'react native', 'flutter', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'material ui',
  'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'sqlite', 'oracle',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions', 'terraform', 'ansible',
  'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'trello', 'agile', 'scrum', 'kanban',
  'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science', 'data engineering', 'big data',
  'hadoop', 'spark', 'kafka', 'airflow', 'tableau', 'power bi', 'excel', 'sql', 'nosql', 'graphql', 'rest api',
  'grpc', 'soap', 'microservices', 'serverless', 'lambda', 's3', 'ec2', 'rds', 'vpc', 'iam', 'cloudfront',
  'ci/cd', 'devops', 'sysadmin', 'linux', 'unix', 'windows', 'macos', 'bash', 'powershell', 'shell scripting',
  'tdd', 'bdd', 'jest', 'mocha', 'chai', 'cypress', 'selenium', 'puppeteer', 'playwright', 'appium',
  'spacy', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'seaborn',
  'openai', 'hugging face', 'llm', 'generative ai', 'prompt engineering', 'langchain', 'vector database', 'pinecone',
  'weaviate', 'milvus', 'qdrant', 'chroma', 'faiss', 'bert', 'gpt', 'transformer', 'attention'
];

function tokenize(text) {
    return text.toLowerCase().match(/\b(\w+)\b/g) || [];
}

function extractSkills(text) {
    const textLower = text.toLowerCase();
    const tokens = tokenize(textLower);
    
    // Find skills using token match and multi-word matching
    const foundSkills = new Set();
    
    commonSkills.forEach(skill => {
        if (skill.includes(' ')) {
            // multi-word skill
            if (textLower.includes(skill)) {
                foundSkills.add(skill);
            }
        } else {
            // single word skill
            if (tokens.includes(skill)) {
                foundSkills.add(skill);
            }
        }
    });
    
    return Array.from(foundSkills);
}

function calculateMatchScore(resumeText, jobDescription) {
    // 1. Text similarity
    const textSimilarity = stringSimilarity.compareTwoStrings(resumeText.toLowerCase(), jobDescription.toLowerCase());
    
    // 2. Skill extraction
    const resumeSkills = extractSkills(resumeText);
    const jobSkills = extractSkills(jobDescription);
    
    // 3. Match skills
    const matchedSkills = [];
    const missingSkills = [];
    
    jobSkills.forEach(skill => {
        if (resumeSkills.includes(skill)) {
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    });
    
    // 4. Score calculation
    let skillScore = 0;
    if (jobSkills.length > 0) {
        skillScore = matchedSkills.length / jobSkills.length;
    } else {
        skillScore = textSimilarity; // Fallback if no specific skills found
    }
    
    // Combine text similarity (30%) and skill match (70%)
    const finalScore = (textSimilarity * 0.3) + (skillScore * 0.7);
    
    // Cap at 100
    const matchPercentage = Math.min(Math.round(finalScore * 100), 100);
    
    return {
        match_score: matchPercentage,
        matched_skills: matchedSkills,
        missing_skills: missingSkills,
        resumeSkills: resumeSkills,
        jobSkills: jobSkills
    };
}

function generateFeedback(matchScore, missingSkills, resumeSkills) {
    let feedback = "";
    let summary = "";
    
    if (matchScore >= 80) {
        summary = "Excellent fit for this role. Your skills closely match the job requirements.";
        feedback = "Your resume is well-tailored. Consider highlighting specific achievements related to the matched skills.";
    } else if (matchScore >= 50) {
        summary = "Good potential fit, but there are some skill gaps.";
        feedback = "Try to incorporate more keywords from the job description if you have experience with them. Focus on demonstrating transferable skills.";
    } else {
        summary = "Significant skill gaps identified for this role.";
        feedback = "Your resume lacks several key skills required for this position. Consider upskilling or tailoring your resume more specifically to the job description.";
    }
    
    if (missingSkills.length > 0) {
        feedback += ` Important skills to learn or add to your resume include: ${missingSkills.slice(0, 5).join(', ')}.`;
    }
    
    feedback += " Ensure your resume uses standard section headings and clear formatting to pass through ATS systems effectively.";
    
    return {
        resume_feedback: feedback,
        job_fit_summary: summary
    };
}

module.exports = {
    extractSkills,
    calculateMatchScore,
    generateFeedback
};
