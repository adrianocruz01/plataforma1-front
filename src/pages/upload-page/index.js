import FileUpload from '../../components/FileUpload';

const UploadPage = () => {
  const handleUpload = (data) => {
    console.log('Upload bem-sucedido:', data);
  };

  return (
    <div className='bg-cyan-400 bg-fuchsia-400'>
      <h1>Upload de Arquivo</h1>
      <FileUpload onUpload={handleUpload} />
    </div>
  );
};

export default UploadPage;
