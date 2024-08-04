import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    // Crie uma instância do Formidable
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'uploads'), // Diretório temporário para upload
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // Limite de 10MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Erro ao processar o upload:', err);
        res.status(500).json({ error: 'Falha no upload do arquivo' });
        return;
      }

      const uploadedFile = files.file[0]; // O nome do campo de input é 'file'
      const tempFilePath = uploadedFile.filepath;
      const fileName = path.basename(tempFilePath);
      const publicFilePath = path.join(process.cwd(), 'public', 'uploads', fileName);

      // Mova o arquivo para o diretório público
      fs.rename(tempFilePath, publicFilePath, (err) => {
        if (err) {
          console.error('Erro ao mover o arquivo:', err);
          res.status(500).json({ error: 'Falha ao mover o arquivo' });
          return;
        }

        // Envie a URL do arquivo para o cliente
        const fileUrl = `/uploads/${fileName}`;
        res.status(200).json({
          message: 'Arquivo enviado com sucesso',
          fileUrl,
        });
      });
    });
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
};

export default handler;
