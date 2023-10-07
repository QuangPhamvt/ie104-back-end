import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import type { StreamingBlobPayloadInputTypes } from "@smithy/types/dist-types/streaming-payload/streaming-blob-payload-input-types"
import { client } from "./clients"

export const getObject = async (key: string) => {
  const input = {
    Bucket: Bun.env.AWS_BUCKET_NAME || "",
    Key: key,
  }
  const command = new GetObjectCommand(input)
  const response = await client.send(command)
  return response
}
export const putObject = async (
  key: string,
  body: StreamingBlobPayloadInputTypes,
) => {
  const input = {
    Bucket: Bun.env.AWS_BUCKET_NAME || "",
    Key: key,
    Body: body,
  }
  const command = new PutObjectCommand(input)
}
