import multer from "multer";

const storage = multer.memoryStorage();

const MIN_FILE_SIZE = 200 * 1024; // 200kb

const fileFilter = (req, file, cb) => {
  if (file.size < MIN_FILE_SIZE) {
    cb(new Error("File too small. Min 200kb"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
