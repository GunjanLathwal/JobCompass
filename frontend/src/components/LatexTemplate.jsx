import React from 'react';
import { Code, Briefcase } from 'lucide-react';

const LatexTemplate = ({ latexContent, setLatexContent, jobDescription, setJobDescription }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 relative z-10">
      <div className="space-y-4 flex flex-col h-full">
        <h3 className="text-xl font-semibold flex items-center text-slate-800 dark:text-slate-200">
          <Code className="mr-2 text-primary" size={20} />
          LaTeX Template
        </h3>
        <p className="text-sm text-slate-500">
          Add <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">% TARGET_SKILLS_HERE %</code> where skills should be injected.
        </p>
        <div className="flex-grow">
          <textarea
            value={latexContent}
            onChange={(e) => setLatexContent(e.target.value)}
            placeholder="\documentclass{article}&#10;...&#10;% TARGET_SKILLS_HERE %&#10;..."
            className="w-full h-64 p-4 rounded-2xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none custom-scrollbar font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-4 flex flex-col h-full">
        <h3 className="text-xl font-semibold flex items-center text-slate-800 dark:text-slate-200">
          <Briefcase className="mr-2 text-primary" size={20} />
          Job Description
        </h3>
        <p className="text-sm text-slate-500">Paste the target job description.</p>
        <div className="flex-grow">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-64 p-4 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none custom-scrollbar"
          />
        </div>
      </div>
    </div>
  );
};

export default LatexTemplate;
