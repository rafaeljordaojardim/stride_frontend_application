import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import ResultsView from './components/ResultsView';
import JobsList from './components/JobsList';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [currentView, setCurrentView] = useState('upload'); // 'upload' or 'jobs'
  const [systemName, setSystemName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  // Poll for job status
  useEffect(() => {
    if (!jobId || !loading) return;

    const pollInterval = setInterval(async () => {
      try {
        console.log(`Polling job status: ${jobId}`);
        const response = await axios.get(`${API_URL}/api/analysis/job/${jobId}`);
        
        const { status, data, error: jobError } = response.data;
        setJobStatus(status);

        if (status === 'completed') {
          console.log('Analysis completed!');
          setResults(data);
          setLoading(false);
          clearInterval(pollInterval);
        } else if (status === 'failed') {
          console.error('Analysis failed:', jobError);
          setError(jobError || 'Analysis failed');
          setLoading(false);
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Error polling job status:', err);
        setError('Failed to check job status');
        setLoading(false);
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [jobId, loading]);

  const handleAnalyze = async () => {
    if (!selectedFile || !systemName.trim()) {
      setError('Please provide both system name and diagram image');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setJobId(null);
    setJobStatus('pending');

    try {
      const formData = new FormData();
      formData.append('diagram', selectedFile);
      formData.append('systemName', systemName);

      console.log('Creating analysis job...');
      
      const response = await axios.post(`${API_URL}/api/analysis/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { jobId: newJobId } = response.data;
      console.log('Job created:', newJobId);
      setJobId(newJobId);
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to start analysis');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSystemName('');
    setResults(null);
    setError(null);
    setJobId(null);
    setJobStatus(null);
  };

  const handleSelectJobFromList = (jobData) => {
    setResults(jobData);
    setCurrentView('upload');
  };

  return (
    <div className="App">
      <div className="header">
        <h1>🔐 STRIDE Analyzer</h1>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        marginBottom: '20px',
        padding: '0 20px'
      }}>
        <button
          onClick={() => setCurrentView('upload')}
          style={{
            padding: '12px 24px',
            backgroundColor: currentView === 'upload' ? '#007bff' : '#f0f0f0',
            color: currentView === 'upload' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.2s',
            boxShadow: currentView === 'upload' ? '0 2px 8px rgba(0,123,255,0.3)' : 'none'
          }}
        >
          🚀 New Analysis
        </button>
        <button
          onClick={() => setCurrentView('jobs')}
          style={{
            padding: '12px 24px',
            backgroundColor: currentView === 'jobs' ? '#007bff' : '#f0f0f0',
            color: currentView === 'jobs' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.2s',
            boxShadow: currentView === 'jobs' ? '0 2px 8px rgba(0,123,255,0.3)' : 'none'
          }}
        >
          📋 All Jobs
        </button>
      </div>

      <div className="container">
        {currentView === 'jobs' ? (
          <JobsList onSelectJob={handleSelectJobFromList} />
        ) : !results ? (
          <div className="card">
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Upload Architecture Diagram</h2>
            
            <FileUpload 
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />

            <div className="form-group">
              <label htmlFor="systemName">System Name *</label>
              <input
                id="systemName"
                type="text"
                placeholder="e.g., E-commerce Platform"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error">
                <strong>Error:</strong> {error}
              </div>
            )}

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <div className="loading-text">
                  <strong>Analyzing your architecture...</strong>
                  <p>This may take 2-3 minutes</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#999' }}>
                    {jobStatus === 'pending' && '⏳ Job queued, waiting to start...'}
                    {jobStatus === 'processing' && '🔍 Analyzing diagram with AI...'}
                    {!jobStatus && '� Creating analysis job...'}
                  </p>
                  {jobId && (
                    <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#666', fontFamily: 'monospace' }}>
                      Job ID: {jobId}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <button
                className="button"
                onClick={handleAnalyze}
                disabled={!selectedFile || !systemName.trim()}
              >
                🚀 Start Analysis
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="success">
                  <strong>✅ Analysis Completed!</strong>
                  <p style={{ marginTop: '8px' }}>{results.summary}</p>
                </div>
                <button 
                  className="button" 
                  onClick={handleReset}
                  style={{ width: 'auto', marginTop: '0' }}
                >
                  🔄 New Analysis
                </button>
              </div>
            </div>

            <ResultsView results={results} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
