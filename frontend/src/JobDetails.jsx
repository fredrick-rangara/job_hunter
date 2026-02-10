import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/jobs/${id}`)
      .then(res => {
        setJob(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Job not found");
        setLoading(false);
      });
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to apply");
      return navigate('/login');
    }

    setIsApplying(true);
    const loadingToast = toast.loading("Submitting application...");

    try {
      await axios.post('http://localhost:5000/api/apply', 
        { jobId: id, userId: 1 }, // Note: In production, backend gets ID from token
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Applied successfully!", { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed", { id: loadingToast });
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <div className="pt-40 text-center animate-pulse">Loading job...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-xs font-black uppercase">{job?.type || 'Full Time'}</span>
        <h1 className="text-4xl font-black text-slate-900 mt-4">{job?.title}</h1>
        <p className="text-xl text-slate-500 font-bold mb-8">{job?.company} • {job?.location}</p>
        
        <div className="prose prose-slate mb-12">
          <h3 className="font-black text-slate-900">Description</h3>
          <p className="text-slate-600 leading-relaxed">{job?.description}</p>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="font-black text-lg">Interested in this role?</h4>
            <p className="text-slate-400 text-sm">Your CV will be sent to the hiring manager.</p>
          </div>
          <button 
            onClick={handleApply}
            disabled={isApplying}
            className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-purple-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            {isApplying ? "Sending..." : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
}