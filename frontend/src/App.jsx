import React, { useState, useEffect, useContext } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Sun, Moon, Compass, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ResultsDashboard from './components/ResultsDashboard';
import UploadSection from './components/UploadSection';
import LatexTemplate from './components/LatexTemplate';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthContext } from './context/AuthContext';

function App() {
  const [theme, setTheme] = useState('dark');
  const [mode, setMode] = useState('upload');
  const [file, setFile] = useState(null);
  const [latexContent, setLatexContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAnalyze = async () => {
    if (mode === 'upload' && (!file || !jobDescription.trim())) {
      setError('Please provide both a resume file and a job description.');
      return;
    }
    if (mode === 'latex' && (!latexContent.trim() || !jobDescription.trim())) {
      setError('Please provide both LaTeX content and a job description.');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      let response;
      if (mode === 'upload') {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);
        
        response = await axios.post('http://localhost:5000/api/analyze', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('http://localhost:5000/api/latex-update', {
          latexContent,
          jobDescription
        });
      }
      
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during analysis.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setLatexContent('');
    setJobDescription('');
    setResults(null);
    setError(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans`}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link to="/" onClick={resetState} className="flex items-center space-x-3 group">
              <div className="bg-primary/10 group-hover:bg-primary/20 p-2.5 rounded-xl text-primary transition-colors">
                <Compass size={22} className="group-hover:scale-110 transition-transform" />
              </div>
              <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 hidden sm:block tracking-tight">
                JobCompass
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
                  <Link 
                    to="/dashboard" 
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${location.pathname === '/dashboard' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/" 
                    onClick={resetState}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${location.pathname === '/' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                  >
                    Matcher
                  </Link>
                </div>
                
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-2 pr-4 py-1.5 rounded-full">
                    <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {user.name}
                    </span>
                  </div>
                  <button 
                    onClick={logout}
                    title="Logout"
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-primary text-white px-5 py-2.5 rounded-xl shadow-md shadow-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-4"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={
        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto mt-10">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  Land your dream job with <span className="text-primary">AI analysis</span>
                </h2>
                <p className="text-slate-700 dark:text-slate-400 text-lg">
                  Upload your resume and the job description to see how well you match. Get instant feedback on missing skills and ATS optimization.
                </p>
              </div>

              <div className="glass-panel rounded-3xl p-6 md:p-8 mt-10 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none"></div>
                
                <div className="flex justify-center mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-full w-max mx-auto">
                  <button 
                    onClick={() => setMode('upload')}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${mode === 'upload' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    File Upload
                  </button>
                  <button 
                    onClick={() => setMode('latex')}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${mode === 'latex' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Smart Template (LaTeX)
                  </button>
                </div>

                {mode === 'upload' ? (
                  <UploadSection 
                    file={file} 
                    setFile={setFile} 
                    jobDescription={jobDescription} 
                    setJobDescription={setJobDescription} 
                  />
                ) : (
                  <LatexTemplate
                    latexContent={latexContent}
                    setLatexContent={setLatexContent}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                  />
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="mt-6 flex items-center p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800"
                  >
                    <AlertCircle className="mr-3 flex-shrink-0" size={20} />
                    <p>{error}</p>
                  </motion.div>
                )}

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || (mode === 'upload' ? (!file || !jobDescription) : (!latexContent || !jobDescription))}
                    className={`
                      relative group overflow-hidden rounded-full px-10 py-4 font-semibold text-white shadow-lg transition-all
                      ${loading || (mode === 'upload' ? (!file || !jobDescription) : (!latexContent || !jobDescription)) ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-blue-500 hover:shadow-primary/30 hover:-translate-y-1'}
                    `}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      {loading ? (
                        <>
                          <RefreshCw className="animate-spin" size={20} />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          <span>Analyze Match Score</span>
                        </>
                      )}
                    </span>
                    {!loading && (mode === 'upload' ? (file && jobDescription) : (latexContent && jobDescription)) && (
                      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <button 
                onClick={resetState}
                className="flex items-center space-x-2 text-slate-500 hover:text-primary transition-colors mb-6"
              >
                <RefreshCw size={16} />
                <span>Start New Analysis</span>
              </button>
              
              <ResultsDashboard results={results} />
            </motion.div>
          )}
        </AnimatePresence>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
