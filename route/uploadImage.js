const express = require("express");
const path = require("path");
const route = express.Router();
const formidable = require("formidable");
const fs = require("fs");

const app = express();

const url = 'http://localhost:5000';

route.post("/", (req, res) => {
  //console.log(req);
  if (!(req.user.user_type == "admin")) {
    return res.status(401).json({ message: "You don't have the permisson" })
  }
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal server error");
      return;
    }

    // Get the uploaded file
    const file = files.image;

    const fileType = path.extname(file.originalFilename).substring(1);

    // Read the file contents
    fs.readFile(file.filepath, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal server error");
        return;
      }

      // Write the file to a specific folder
      const finalFileName = file.newFilename + '.' + fileType;

      const targetPath = path.join("/home/thanh/Documents/server-api/project_app/public", finalFileName);
      console.log(targetPath)
      fs.writeFile(targetPath, data, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal server error");
          return;
        }
        // File upload successful

        const image_url = url + '/' + finalFileName;
        res.status(200).json({ "image_url": image_url });
      });
    });
  });


});

module.exports = route;