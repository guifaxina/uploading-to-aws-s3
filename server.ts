import express from "express";
import { readFileSync } from "fs";
import multer from "multer";
import UploadToAmazonS3 from "./src/s3";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
  region: process.env.AWS_BUCKET_REGION,
});

const app = express();

const upload = multer({ dest: 'uploads/' });

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
      res.set('Content-Type', 'image/jpeg');
      res.send(imageBuffer);
    }
  });
})

app.post("/images", upload.single("image"), async (req, res) => {
  const file = req.file!;
  //console.log(file);
  const result = await UploadToAmazonS3.upload(file);
  //console.log(result);

  res.send("ok");
})

app.get("/", (req, res) => {
  res.send("ok");
})

app.listen(3000, () => console.log("Server running."));