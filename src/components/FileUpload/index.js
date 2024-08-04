import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage('');
    setFileUrl('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message || 'Arquivo enviado com sucesso');
      setFileUrl(result.fileUrl || '');
      
      // Usar a URL do arquivo para enviar para outra API
      if (result.fileUrl) {
        await fetch('URL_DA_OUTRA_API', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileUrl: result.fileUrl }),
        });
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setMessage('Falha no upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {message && <p>{message}</p>}
      {fileUrl && (
        <div>
          <p>Arquivo enviado com sucesso:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
