import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(process.cwd(), 'public', 'images'));
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + Math.floor(Math.random() * 100) + ext);
  },
});

const upload = multer({ storage });

const multerUploadMiddleware = { upload }

export default multerUploadMiddleware
