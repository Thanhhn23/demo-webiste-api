const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.AKIAXLHJOSZZMEZZHBJU,
  secretAccessKey: process.env.U/NkwjmPaGhe7cdK8BgdO4MxwDeLsisHmPNuH3Z5
});

const uploadImageToS3 = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, (err, data) => {
      if (err) reject(err);

      const params = {
        Bucket: process.env.imageruud270423,
        Key: file.filename,
        Body: data
      };

      s3.upload(params, (s3Err, data) => {
        if (s3Err) reject(s3Err);
        resolve(data.Location);
      });
    });
  });
}

// Usage:
// Call this function inside your route handler for image upload, passing in the `req.file` object.
// The returned URL can then be stored in your database along with the other product information.

const imageUrl = await uploadImageToS3(req.file);

console.log(imageUrl); // https://s3.amazonaws.com/{bucketName}/{fileName}
