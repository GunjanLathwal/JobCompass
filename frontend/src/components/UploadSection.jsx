import React, { useCallback } from 'react';
import { UploadCloud, File, X, FileText, Briefcase } from 'lucide-react';

const UploadSection = ({ file, setFile, jobDescription, setJobDescription }) => {
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx')) {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF or DOCX file.");
      }
    }
  }, [setFile]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 relative z-10">
      {/* Resume Upload */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center text-slate-800 dark:text-slate-200">
          <FileText className="mr-2 text-primary" size={20} />
          Your Resume
        </h3>
        
        {!file ? (
          <div 
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors h-64"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <UploadCloud className="text-primary" size={32} />
            </div>
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Click or drag and drop</p>
            <p className="text-sm text-slate-500">PDF or DOCX (Max 5MB)</p>
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center h-64 bg-slate-50 dark:bg-slate-800/30">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full mb-4">
              <File className="text-emerald-600 dark:text-emerald-400" size={32} />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-4 max-w-full truncate px-4">{file.name}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); removeFile(); }}
              className="flex items-center text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-full"
            >
              <X size={16} className="mr-1" /> Remove File
            </button>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div className="space-y-4 flex flex-col h-full">
        <h3 className="text-xl font-semibold flex items-center text-slate-800 dark:text-slate-200">
          <Briefcase className="mr-2 text-primary" size={20} />
          Job Description
        </h3>
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

export default UploadSection;
