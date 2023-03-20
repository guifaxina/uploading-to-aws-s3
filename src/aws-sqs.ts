import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import * as dotenv from "dotenv";
dotenv.config();

const sqsClient = new SQSClient({ region: process.env.AWS_BUCKET_REGION });

const receiveMessage = new ReceiveMessageCommand({
  QueueUrl: "https://sqs.sa-east-1.amazonaws.com/908319995710/MyFirstQueue",
});

export const receiveResponse = async () => {
  const response = await sqsClient.send(receiveMessage);
  console.log(response.Messages![0].Body);
  return response;
};
