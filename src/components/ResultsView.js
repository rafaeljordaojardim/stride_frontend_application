import React, { useState } from 'react';
import pdfGenerator from '../utils/pdfGenerator';

function ResultsView({ results }) {
  const [expandedThreats, setExpandedThreats] = useState({});

  const toggleThreat = (index) => {
    setExpandedThreats(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const expandAll = () => {
    const allThreats = {};
    Object.entries(groupedThreats).forEach(([category, threats]) => {
      threats.forEach((_, idx) => {
        allThreats[`${category}-${idx}`] = true;
      });
    });
    setExpandedThreats(allThreats);
  };

  const collapseAll = () => {
    setExpandedThreats({});
  };

  const handleDownloadPDF = () => {
    try {
      pdfGenerator.downloadReport(results, results.system_name || 'relatorio');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Falha ao gerar PDF. Por favor, tente novamente.');
    }
  };

  const groupedThreats = results.threats.reduce((acc, threat) => {
    const category = threat.category_name || threat.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(threat);
    return acc;
  }, {});

  return (
    <div className="results">
      {/* Download PDF Button */}
      <div className="card" style={{ padding: '15px', backgroundColor: '#f0f8ff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: '1.1rem', color: '#333' }}>📄 Exportar Relatório</strong>
            <p style={{ marginTop: '5px', color: '#666', fontSize: '0.9rem' }}>
              Baixe um relatório PDF completo com todas as descobertas
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            style={{
              padding: '12px 24px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#b71c1c'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}
          >
            📥 Baixar PDF
          </button>
        </div>
      </div>

      {/* Diagram */}
      {results.diagram_image && (
        <div className="card">
          <h2>📊 Diagrama Analisado</h2>
          <img 
            src={results.diagram_image} 
            alt="Diagrama de Arquitetura" 
            className="preview-image"
          />
        </div>
      )}

      {/* Architecture */}
      <div className="card result-section">
        <h2>🏗️ Arquitetura do Sistema</h2>
        <p style={{ marginBottom: '20px', color: '#555', lineHeight: '1.6' }}>
          {results.architecture.description}
        </p>

        <h3>Componentes</h3>
        {results.architecture.components.map((component, idx) => (
          <div key={idx} className="architecture-component">
            <div className="component-name">
              {component.name}
              <span className="component-type">{component.type}</span>
            </div>
            <p style={{ marginTop: '8px', color: '#666' }}>
              {component.description}
            </p>
            {component.technologies && component.technologies.length > 0 && (
              <div className="component-list" style={{ marginTop: '8px' }}>
                {component.technologies.map((tech, i) => (
                  <span key={i} className="component-tag" style={{ fontSize: '0.75rem' }}>
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {results.architecture.data_flows && results.architecture.data_flows.length > 0 && (
          <>
            <h3 style={{ marginTop: '30px' }}>Fluxos de Dados</h3>
            <ul style={{ marginLeft: '20px', color: '#555' }}>
              {results.architecture.data_flows.map((flow, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>{flow}</li>
              ))}
            </ul>
          </>
        )}

        {results.architecture.trust_boundaries && results.architecture.trust_boundaries.length > 0 && (
          <>
            <h3 style={{ marginTop: '30px' }}>Limites de Confiança</h3>
            <ul style={{ marginLeft: '20px', color: '#555' }}>
              {results.architecture.trust_boundaries.map((boundary, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>{boundary}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Threats by Category */}
      <div className="card result-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0 }}>🔒 Análise de Ameaças STRIDE</h2>
            <p style={{ marginTop: '8px', marginBottom: 0, color: '#555' }}>
              Total de ameaças identificadas: <strong>{results.threats.length}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={expandAll}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              📖 Expandir Todos
            </button>
            <button
              onClick={collapseAll}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              📕 Recolher Todos
            </button>
          </div>
        </div>

        {Object.entries(groupedThreats).map(([category, threats]) => (
          <div key={category} style={{ marginBottom: '40px' }}>
            <h3>{category}</h3>
            
            {threats.map((threat, idx) => {
              const threatIndex = `${category}-${idx}`;
              const isExpanded = expandedThreats[threatIndex];
              
              return (
                <div 
                  key={idx} 
                  className={`threat-card ${threat.severity.toLowerCase()}`}
                >
                  <div className="threat-header">
                    <div className="threat-title" style={{ flex: 1 }}>
                      {threat.title}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`severity-badge ${threat.severity.toLowerCase()}`}>
                        {threat.severity}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleThreat(threatIndex);
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: isExpanded ? '#f0f0f0' : '#007bff',
                          color: isExpanded ? '#333' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.opacity = '0.8';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.opacity = '1';
                        }}
                      >
                        {isExpanded ? '🔼 Recolher' : '🔽 Expandir'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <>
                      <div className="threat-description" style={{ userSelect: 'text', cursor: 'text' }}>
                        {threat.description}
                      </div>

                      {threat.affected_components && threat.affected_components.length > 0 && (
                        <div className="threat-detail" style={{ userSelect: 'text', cursor: 'text' }}>
                          <strong>🎯 Componentes Afetados:</strong>
                          <div className="component-list">
                            {threat.affected_components.map((comp, i) => (
                              <span key={i} className="component-tag">{comp}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {threat.attack_scenario && (
                        <div className="threat-detail" style={{ userSelect: 'text', cursor: 'text' }}>
                          <strong>⚔️ Cenário de Ataque:</strong>
                          <p style={{ color: '#555', marginTop: '4px' }}>
                            {threat.attack_scenario}
                          </p>
                        </div>
                      )}

                      {threat.mitigation && (
                        <div className="threat-detail" style={{ userSelect: 'text', cursor: 'text' }}>
                          <strong>🛡️ Estratégia de Mitigação:</strong>
                          <p style={{ color: '#555', marginTop: '4px' }}>
                            {threat.mitigation}
                          </p>
                        </div>
                      )}

                      {threat.references && threat.references.length > 0 && (
                        <div className="threat-detail" style={{ userSelect: 'text', cursor: 'text' }}>
                          <strong>📚 Referências:</strong>
                          <ul style={{ marginLeft: '20px', marginTop: '4px', color: '#555' }}>
                            {threat.references.map((ref, i) => (
                              <li key={i}>{ref}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Botão para copiar todo o conteúdo da ameaça */}
                      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const textToCopy = `
${threat.title}
Severidade: ${threat.severity}

Descrição:
${threat.description}

${threat.affected_components ? `Componentes Afetados:\n${threat.affected_components.join(', ')}` : ''}

${threat.attack_scenario ? `Cenário de Ataque:\n${threat.attack_scenario}` : ''}

${threat.mitigation ? `Estratégia de Mitigação:\n${threat.mitigation}` : ''}

${threat.references ? `Referências:\n${threat.references.join('\n')}` : ''}
                            `.trim();
                            
                            navigator.clipboard.writeText(textToCopy).then(() => {
                              alert('✅ Conteúdo copiado para a área de transferência!');
                            }).catch(() => {
                              alert('❌ Falha ao copiar. Tente selecionar manualmente.');
                            });
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
                        >
                          📋 Copiar Conteúdo
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Download Options */}
      <div className="card" style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '16px' }}>📥 Exportar Resultados</h3>
        <button 
          className="button" 
          onClick={() => {
            const dataStr = JSON.stringify(results, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${results.system_name.replace(/\s+/g, '_')}_relatorio_ameacas.json`;
            link.click();
          }}
        >
          💾 Baixar Relatório JSON
        </button>
      </div>
    </div>
  );
}

export default ResultsView;
