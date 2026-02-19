import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUpload({ onFileSelect, selectedFile }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div>
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-icon">
          {selectedFile ? '✅' : '📊'}
        </div>
        {selectedFile ? (
          <>
            <div className="dropzone-text">
              <strong>{selectedFile.name}</strong>
            </div>
            <div className="dropzone-hint">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </div>
            <div className="dropzone-hint" style={{ marginTop: '10px' }}>
              Clique ou arraste para substituir
            </div>
          </>
        ) : (
          <>
            <div className="dropzone-text">
              {isDragActive ? 'Solte a imagem aqui' : 'Arraste e solte a imagem do diagrama'}
            </div>
            <div className="dropzone-hint">
              ou clique para selecionar (PNG, JPG, GIF)
            </div>
          </>
        )}
      </div>

      {selectedFile && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <img 
            src={URL.createObjectURL(selectedFile)} 
            alt="Visualização" 
            className="preview-image"
            style={{ maxHeight: '300px' }}
          />
        </div>
      )}
    </div>
  );
}

export default FileUpload;
