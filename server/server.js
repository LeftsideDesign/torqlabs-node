require("./config/config");
const path = require("path");
const aws = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.S3_REGION
});

const port = process.env.PORT;
const app = express();
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function(req, file, cb) {
      cb(null, file.originalname);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") cb(null, true);
    else cb(null, false);
  }
});

app.post("/upload", upload.single("kaasa"), (req, res) => {
  res.send("File Uploaded to S3!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}!`);
});
