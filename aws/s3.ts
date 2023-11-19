import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3"
import type {
  StreamingBlobPayloadInputTypes,
  BrowserRuntimeStreamingBlobPayloadInputTypes,
} from "@smithy/types/dist-types/streaming-payload/streaming-blob-payload-input-types"
import { client } from "./clients"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const getObject = async (key: string) => {
  const input = {
    Bucket: process.env.AWS_BUCKET_NAME || "",
    Key: key,
  }
  const command = new GetObjectCommand(input)
  const url = await getSignedUrl(client, command, {
    expiresIn: 3600,
  })
  return url
}
export const s3ObjectUrl = (url: string) =>
  `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/` + url
export const putObject = async (
  key: string,
  body: StreamingBlobPayloadInputTypes | BrowserRuntimeStreamingBlobPayloadInputTypes,
) => {
  const input: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAME || "",
    Key: key,
    Body: body,
  }
  const command = new PutObjectCommand(input)
  await client.send(command)
}
export const upload = async (key: string, body: StreamingBlobPayloadInputTypes, contentType: string) => {
  try {
    const parallelUploads3 = new Upload({
      client,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
      tags: [],
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    })
    parallelUploads3.on("httpUploadProgress", (process) => {
      console.log("🚀 ~ file: s3.ts:54 ~ parallelUploads3.on ~ process:", process)
    })
    await parallelUploads3.done()
  } catch (error) {
    console.log("🚀 ~ file: s3.ts:39 ~ upload ~ error:", error)
  }
}
