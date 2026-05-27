import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, MoreVertical, Calendar, Building, Briefcase, ExternalLink, X, Wand2, TrendingUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statuses = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: '', role: '', platform: '', status: 'Applied', link: '', notes: ''
  });
  const [isScraping, setIsScraping] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/applications', config);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/applications', formData, config);
      setIsModalOpen(false);
      setFormData({ company: '', role: '', platform: '', status: 'Applied', link: '', notes: '' });
      fetchApplications();
    } catch (error) {
      console.error('Error adding application', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/applications/${id}`, { status: newStatus }, config);
      fetchApplications();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/applications/${id}`, config);
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application', error);
    }
  };

  if (!user) {
    return <div className="text-center mt-20 text-xl font-semibold">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Job Board</h2>
          <p className="text-slate-600 dark:text-slate-400">Track and manage your job applications</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-primary text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-primary/30 hover:-translate-y-1 transition-all"
        >
          <Plus size={20} />
          <span>New Application</span>
        </button>
      </div>

      {/* Funnel Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5"><TrendingUp size={60} /></div>
          <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{applications.length}</span>
          <span className="text-sm font-medium text-slate-500 flex items-center"><Briefcase size={14} className="mr-1" /> Total Saved</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center border border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm">
          <span className="text-3xl font-black text-blue-500">{applications.filter(a => a.status === 'Applied').length}</span>
          <span className="text-sm font-medium text-slate-500">Applications Sent</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 shadow-sm">
          <span className="text-3xl font-black text-amber-500">{applications.filter(a => a.status === 'Interviewing').length}</span>
          <span className="text-sm font-medium text-slate-500">Active Interviews</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-sm">
          <span className="text-3xl font-black text-emerald-500">{applications.filter(a => a.status === 'Offer').length}</span>
          <span className="text-sm font-medium text-slate-500 flex items-center">🎉 Job Offers</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-8 custom-scrollbar snap-x">
        {statuses.map(status => (
          <div key={status} className="flex-shrink-0 w-80 snap-center">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 
                  ${status === 'Saved' ? 'bg-slate-400' : 
                    status === 'Applied' ? 'bg-blue-400' : 
                    status === 'Interviewing' ? 'bg-amber-400' : 
                    status === 'Offer' ? 'bg-emerald-400' : 'bg-red-400'}`} 
                />
                {status}
              </h3>
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-full">
                {applications.filter(app => app.status === status).length}
              </span>
            </div>
            
            <div className="space-y-4">
              {applications.filter(app => app.status === status).map(app => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={app._id} 
                  className="glass-panel p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-shadow group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {app.role}
                    </h4>
                    <button onClick={() => deleteApplication(app._id)} className="text-slate-500 dark:text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center">
                      <Building size={14} className="mr-2 text-slate-500 dark:text-slate-400" />
                      {app.company}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-slate-500 dark:text-slate-400" />
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </div>
                      {app.link && (
                        <a href={app.link} target="_blank" rel="noreferrer" className="text-primary hover:text-blue-500">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Interview Prep Hub */}
                  {app.status === 'Interviewing' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl shadow-inner">
                      <div className="flex justify-between items-center text-amber-700 dark:text-amber-400 font-bold text-xs mb-2">
                        <span className="flex items-center"><HelpCircle size={12} className="mr-1" /> Interview Prep Hub</span>
                      </div>
                      <textarea 
                        className="w-full text-xs p-2 rounded-lg border border-amber-200/80 dark:border-amber-700/50 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-amber-400 h-16 resize-none custom-scrollbar placeholder-amber-900/30 dark:placeholder-amber-200/30"
                        placeholder="Log interview dates, interviewer names, and questions to prep for..."
                        defaultValue={app.notes}
                        onBlur={(e) => {
                          if (e.target.value !== app.notes) {
                            axios.put(`http://localhost:5000/api/applications/${app._id}`, { notes: e.target.value }, { headers: { Authorization: `Bearer ${user.token}` } }).then(fetchApplications);
                          }
                        }}
                      />
                    </motion.div>
                  )}

                  <div className="mt-4 flex space-x-1 overflow-x-auto custom-scrollbar pb-1">
                    {statuses.map(s => (
                      <button 
                        key={s}
                        onClick={() => updateStatus(app._id, s)}
                        className={`text-[10px] px-2 py-1 rounded border font-semibold whitespace-nowrap transition-colors
                          ${app.status === s ? 'bg-primary/10 border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {applications.filter(app => app.status === status).length === 0 && (
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl h-32 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                  No applications
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for New Application */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 relative z-10 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Add Application</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Auto-Fill Feature */}
                <div className="mb-2 p-3 bg-primary/5 border border-primary/20 rounded-xl flex flex-col space-y-2">
                  <label className="text-xs font-bold text-primary flex items-center uppercase tracking-wider">
                    <Wand2 size={12} className="mr-1" /> Auto-Fill Magic
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="url" id="autofill-url" 
                      placeholder="Paste LinkedIn or Indeed Job URL..." 
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary outline-none text-sm placeholder-slate-400" 
                    />
                    <button 
                      type="button" 
                      disabled={isScraping}
                      onClick={async () => {
                        const url = document.getElementById('autofill-url').value;
                        if (!url) return;
                        setIsScraping(true);
                        try {
                          const { data } = await axios.post('http://localhost:5000/api/scrape-job', { url });
                          setFormData(prev => ({
                            ...prev, 
                            company: data.company || prev.company, 
                            role: data.role || prev.role, 
                            platform: data.platform || prev.platform,
                            link: url
                          }));
                        } catch (e) {
                          alert("Failed to auto-extract. Please fill details manually.");
                        } finally {
                          setIsScraping(false);
                        }
                      }} 
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-semibold rounded-lg text-sm transition-colors flex items-center shadow-sm disabled:opacity-50"
                    >
                      {isScraping ? 'Extracting...' : 'Extract'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company *</label>
                    <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:border-primary outline-none" placeholder="Google" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role *</label>
                    <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:border-primary outline-none" placeholder="Frontend Engineer" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:border-primary outline-none">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Platform</label>
                    <input type="text" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:border-primary outline-none" placeholder="LinkedIn" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link to Job</label>
                  <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:border-primary outline-none" placeholder="https://..." />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                  <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:border-primary outline-none h-24 resize-none" placeholder="Any thoughts..." />
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20">
                  Save Application
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
