import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, XCircle, ChevronRight, Download, Star, Copy, Code, FileCode2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsDashboard = ({ results }) => {
  const { match_score, matched_skills, missing_skills, resume_feedback, job_fit_summary, updatedLatex } = results;
  const { user } = useContext(AuthContext);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveToDashboard = async (e) => {
    e.preventDefault();
    if (!company || !role) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/applications', {
        company,
        role,
        status: 'Saved',
        notes: `AI Match Score: ${match_score}%\n\nSummary:\n${job_fit_summary}`,
        platform: 'AI Matcher'
      }, config);
      setSaveSuccess(true);
      setShowSaveForm(false);
    } catch (error) {
      console.error('Error saving application', error);
    }
  };

  const handleDownload = () => {
    const reportContent = `
Resume Analysis Report
----------------------
Match Score: ${match_score}%

AI Summary:
${job_fit_summary}

Feedback:
${resume_feedback}

Matched Skills:
${matched_skills.length > 0 ? matched_skills.join(', ') : 'None'}

Missing Skills:
${missing_skills.length > 0 ? missing_skills.join(', ') : 'None'}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Resume_Analysis_Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const data = [
    { name: 'Match', value: match_score, color: '#10b981' }, // Emerald-500
    { name: 'Gap', value: 100 - match_score, color: '#e2e8f0' } // Slate-200
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Top Row: Score & Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Match Score Card */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star size={100} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Match Score</h3>
          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`text-5xl font-black ${getScoreColor(match_score)}`}>
                {match_score}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* AI Summary Card */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl md:col-span-2 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <span className="bg-primary/20 p-2 rounded-lg text-primary mr-3">✨</span> 
            AI Analysis Summary
          </h3>
          <p className="text-lg text-slate-700 dark:text-slate-300 font-medium mb-4">
            {job_fit_summary}
          </p>
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4">
            <p className="text-slate-700 dark:text-slate-400 italic">
              {resume_feedback}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Skills Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl">
          <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center">
            <CheckCircle2 className="mr-2" /> Matched Skills ({matched_skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {matched_skills.length > 0 ? (
              matched_skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-sm font-medium border border-emerald-200 dark:border-emerald-800/50 flex items-center">
                  <CheckCircle2 size={14} className="mr-1.5" />
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-500 italic">No exact skill matches found.</p>
            )}
          </div>
        </motion.div>

        {/* Missing Skills */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl">
          <h3 className="text-xl font-bold text-red-500 dark:text-red-400 mb-4 flex items-center">
            <XCircle className="mr-2" /> Missing Skills ({missing_skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {missing_skills.length > 0 ? (
              missing_skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800/50 flex items-center">
                  <XCircle size={14} className="mr-1.5" />
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-500 italic">Great! You have all the core skills mentioned.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Suggestions and Recheck for Low Scores */}
      {match_score < 80 && missing_skills.length > 0 && !updatedLatex && (
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 flex items-center mb-1">
              Want to boost your score?
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              We strongly suggest adding the missing skills listed above to your resume. Once you've updated your document, recheck your score!
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="whitespace-nowrap px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors shadow-md"
          >
            Recheck Resume
          </button>
        </motion.div>
      )}

      {/* Updated LaTeX Code Block (From Smart Template Route) */}
      {updatedLatex && (
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl col-span-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
              <Code className="mr-2 text-primary" size={24} />
              Updated LaTeX Source
            </h3>
            <button 
              onClick={() => navigator.clipboard.writeText(updatedLatex)}
              className="flex items-center text-sm text-primary hover:text-blue-500 transition-colors bg-primary/10 px-3 py-1.5 rounded-full"
            >
              <Copy size={16} className="mr-1.5" /> Copy Code
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            We've injected the missing skills into your LaTeX template. Copy the code below to use in Overleaf or your favorite editor.
          </p>
          <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto custom-scrollbar">
            <pre className="text-sm text-emerald-400 font-mono whitespace-pre-wrap">
              {updatedLatex}
            </pre>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
        
        {user && !showSaveForm && !saveSuccess && (
          <button 
            onClick={() => setShowSaveForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-full shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center"
          >
            <Star size={18} className="mr-2 fill-white" /> Save to JobCompass
          </button>
        )}

        {saveSuccess && (
          <div className="px-6 py-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={18} className="mr-2" /> Saved to Dashboard!
          </div>
        )}

        <button 
          onClick={handleDownload}
          className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-full shadow hover:shadow-md transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700"
        >
          <Download size={18} className="mr-2" /> Download Report
        </button>
      </motion.div>

      {/* Save to Dashboard Form */}
      {showSaveForm && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl col-span-full border border-primary/20 bg-primary/5 mt-4"
        >
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Track this Job</h3>
          <form onSubmit={handleSaveToDashboard} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" required placeholder="Company Name"
              value={company} onChange={e => setCompany(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none"
            />
            <input 
              type="text" required placeholder="Job Role"
              value={role} onChange={e => setRole(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none"
            />
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors">
                Save
              </button>
              <button type="button" onClick={() => setShowSaveForm(false)} className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResultsDashboard;
