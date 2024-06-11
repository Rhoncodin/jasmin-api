const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/images'); // Destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // File naming
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a short random string
    const randomString = Math.random().toString(36).substring(2, 8);
    // Generate a unique filename using timestamp and short random string
    const uniqueFilename = Date.now() + '-' + randomString;
    cb(null, uniqueFilename); // Use the unique filename
  },
});

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize <= 2000000) {
      cb(null, true);
    } else {
      req.fileValidationError = new Error('Ukuran foto harus kurang dari 2MB');
      cb(null, false);
    }
  } else {
    req.fileValidationError = new Error('Foto harus bertipe png/jpg/jpeg');
    cb(null, false);
  }
};

const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: imageFilter,
}).single('image');

module.exports = { uploadImage };
