const multer = require("multer");

const storage = multer.diskStorage({
  //req is req obj, file is user uploaded, cb is call back, callback ma euta error ra euta file name path
  destination: function (req, file, cb) {
    return cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload.single("image");



