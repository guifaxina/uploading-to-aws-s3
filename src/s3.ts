import dotenv from "dotenv";
import S3 from "aws-sdk/clients/s3";
import fs from "fs";

dotenv.config();

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
  region: process.env.AWS_BUCKET_REGION,
});

// uploads to s3
class UploadToAmazonS3 {
  public upload(file: Express.Multer.File): Promise<S3.ManagedUpload.SendData> {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Body: fileStream,
      Key: file.filename,
    };

    return s3.upload(uploadParams).promise();
  }

  public async download(fileKey: string) {
    const downloadParams = {
      Key: fileKey,
      Bucket: process.env.AWS_BUCKET_NAME!,
    };

    s3.getObject(downloadParams, (err, data) => {
        return data.Body;
    })
  }
}

export default new UploadToAmazonS3();
// downloads from s3
