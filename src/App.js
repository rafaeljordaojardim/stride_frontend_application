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
          console.error('Análise falhou:', jobError);
          setError(jobError || 'Análise falhou');
          setLoading(false);
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Error polling job status:', err);
        setError('Falha ao verificar status do trabalho');
        setLoading(false);
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [jobId, loading]);

  const handleAnalyze = async () => {
    if (!selectedFile || !systemName.trim()) {
      setError('Por favor, forneça o nome do sistema e a imagem do diagrama');
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

      console.log('Criando trabalho de análise...');
      
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
      setError(err.response?.data?.error || err.message || 'Falha ao iniciar análise');
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
          🚀 Nova Análise
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
          📋 Todos os Trabalhos
        </button>
      </div>

      <div className="container">
        {currentView === 'jobs' ? (
          <JobsList onSelectJob={handleSelectJobFromList} />
        ) : !results ? (
          <div className="card">
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Enviar Diagrama de Arquitetura</h2>
            
            <FileUpload 
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />

            <div className="form-group">
              <label htmlFor="systemName">Nome do Sistema *</label>
              <input
                id="systemName"
                type="text"
                placeholder="ex: Plataforma de E-commerce"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error">
                <strong>Erro:</strong> {error}
              </div>
            )}

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <div className="loading-text">
                  <strong>Analisando sua arquitetura...</strong>
                  <p>Isso pode levar 2-3 minutos</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#999' }}>
                    {jobStatus === 'pending' && '⏳ Trabalho na fila, aguardando início...'}
                    {jobStatus === 'processing' && '🔍 Analisando diagrama com IA...'}
                    {!jobStatus && '� Criando trabalho de análise...'}
                  </p>
                  {jobId && (
                    <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#666', fontFamily: 'monospace' }}>
                      ID do Trabalho: {jobId}
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
                🚀 Iniciar Análise
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="success">
                  <strong>✅ Análise Concluída!</strong>
                  <p style={{ marginTop: '8px' }}>{results.summary}</p>
                </div>
                <button 
                  className="button" 
                  onClick={handleReset}
                  style={{ width: 'auto', marginTop: '0' }}
                >
                  🔄 Nova Análise
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
