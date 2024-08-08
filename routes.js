import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function UploadRoutes(app) {
  const getImage = (req, res) => {
    const imgFilename = req.params.imgFilename;
    const imgPath = path.join(__dirname, 'uploads', imgFilename);
    // console.log(imgPath)

    // Check if the file exists
    fs.access(imgPath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ message: 'Image not found' });
      }

      // Send the file as a response
      res.sendFile(imgPath);
    });
  }

  app.get("/uploads/:imgFilename", getImage);
}
