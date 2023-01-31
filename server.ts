import express from "express";
import { readFileSync } from "fs";
import multer from "multer";
import UploadToAmazonS3 from "./src/s3";

const app = express();

const upload = multer({ dest: 'uploads/' });

const image = readFileSync('./qrcode.png');

app.post("/images", upload.single("image"), async (req, res) => {
  const file = req.file!;
  console.log(file);
  const result = await UploadToAmazonS3.upload(file);
  console.log(result);
  res.send("ok");
})

app.get("/", (req, res) => {
  res.send("ok");
})

app.listen(3000, () => console.log("Server running."));