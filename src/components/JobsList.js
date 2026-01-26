import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pdfGenerator from '../utils/pdfGenerator';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function JobsList({ onSelectJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analysis/jobs?limit=100`);
      setJobs(response.data.jobs);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Auto-refresh every 5 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚙️';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'processing':
        return '#2196f3';
      case 'completed':
        return '#4caf50';
      case 'failed':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleViewJob = async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/api/analysis/job/${jobId}`);
      if (response.data.status === 'completed' && response.data.data) {
        onSelectJob(response.data.data);
      } else if (response.data.status === 'failed') {
        alert(`Job failed: ${response.data.error}`);
      } else {
        alert(`Job is still ${response.data.status}. Please wait...`);
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      alert('Failed to load job details');
    }
  };

  const handleDownloadPDF = async (jobId, systemName) => {
    try {
      const response = await axios.get(`${API_URL}/api/analysis/job/${jobId}`);
      if (response.data.status === 'completed' && response.data.data) {
        pdfGenerator.downloadReport(response.data.data, systemName);
      } else {
        alert('Cannot download PDF. Job is not completed yet.');
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>📋 All Analysis Jobs</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (5s)
          </label>
          <button 
            className="button" 
            onClick={fetchJobs}
            style={{ width: 'auto', padding: '8px 16px', margin: 0 }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          <p style={{ fontSize: '1.2rem' }}>📭</p>
          <p>No jobs found. Start your first analysis!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>System Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Job ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Created</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Updated</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr 
                  key={job.jobId} 
                  style={{ 
                    borderBottom: '1px solid #eee',
                    backgroundColor: job.status === 'processing' ? '#f0f8ff' : 'transparent'
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    <span 
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: getStatusColor(job.status) + '20',
                        color: getStatusColor(job.status),
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}
                    >
                      {getStatusIcon(job.status)} {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>
                    {job.systemName}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#666' }}>
                    {job.jobId.substring(0, 8)}...
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#666' }}>
                    {formatDate(job.createdAt)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#666' }}>
                    {formatDate(job.updatedAt)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {job.status === 'completed' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleViewJob(job.jobId)}
                          style={{
                            padding: '6px 16px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500'
                          }}
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(job.jobId, job.systemName)}
                          style={{
                            padding: '6px 16px',
                            backgroundColor: '#d32f2f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500'
                          }}
                          title="Download PDF Report"
                        >
                          📥 PDF
                        </button>
                      </div>
                    ) : job.status === 'failed' ? (
                      <button
                        onClick={() => handleViewJob(job.jobId)}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}
                      >
                        ⚠️ View Error
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#999' }}>
                        ⏳ Processing...
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '0.85rem', color: '#666' }}>
        <strong>Total Jobs:</strong> {jobs.length} | 
        <strong style={{ marginLeft: '12px' }}>Pending:</strong> {jobs.filter(j => j.status === 'pending').length} | 
        <strong style={{ marginLeft: '12px' }}>Processing:</strong> {jobs.filter(j => j.status === 'processing').length} | 
        <strong style={{ marginLeft: '12px' }}>Completed:</strong> {jobs.filter(j => j.status === 'completed').length} | 
        <strong style={{ marginLeft: '12px' }}>Failed:</strong> {jobs.filter(j => j.status === 'failed').length}
      </div>
    </div>
  );
}

export default JobsList;
