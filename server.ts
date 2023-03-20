import express from "express";
import multer from "multer";
import UploadToAmazonS3 from "./src/s3";
import S3 from "aws-sdk/clients/s3";
import util from "util";
import fs from "fs";
import {receiveResponse} from "./src/aws-sqs"

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
  region: process.env.AWS_BUCKET_REGION,
});

const app = express();

const upload = multer({ dest: 'uploads/' });

const unlinkFile = util.promisify(fs.unlink);

app.get("/images/:key", async (req, res) => {
  const { key } = req.params

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: key
  };
  
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving image from S3');
    } else {
      const imageBuffer = data.Body;
      res.set('Content-Type', 'image/jpeg').send(imageBuffer);
    }
  });
})

app.post("/images", upload.single("image"), async (req, res) => {
  const file = req.file!;
  //console.log(file);
  const result = await UploadToAmazonS3.upload(file);
  //console.log(result);
  await unlinkFile(file.path);
  res.send("ok");
})

app.get("/", (req, res) => {
  res.send("ok");
})

app.get("/message", async (req, res) => {
  const response = await receiveResponse()
  res.status(200).json(response)
})

app.listen(3000, () => console.log("Server running."));