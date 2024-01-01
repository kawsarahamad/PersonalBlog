const multer = require('multer');
const path = require("path");

const fileFilter = (req, file, cb) => {
  const allowedType = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else cb(null, false);
};


// Set storage engine for image upload
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Set storage engine for video upload
const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/videos');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer for image upload
const imageUpload = multer({ storage: imageStorage, fileFilter}).single('image');

// Initialize multer for video upload
const videoUpload = multer({ storage: videoStorage }).single('video');

// Middleware for image upload
const uploadImage = (req, res, next) => {
    imageUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            return res.status(500).json({ message: 'Image upload failed' });
        } else if (err) {
            // An unknown error occurred when uploading
            return res.status(500).json({ message: 'Something went wrong' });
        }
        next();
    });
};

// Middleware for video upload
const uploadVideo = (req, res, next) => {
    videoUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            return res.status(500).json({ message: 'Video upload failed' });
        } else if (err) {
            // An unknown error occurred when uploading
            return res.status(500).json({ message: 'Something went wrong' });
        }
        next();
    });
};

module.exports = { uploadImage, uploadVideo };
