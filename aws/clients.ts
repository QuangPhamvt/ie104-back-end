import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
const config = {
  region: Bun.env.AWS_REGION,
  credentials: {
    accessKeyId: Bun.env.AWS_ACCESSKEY_ID || "",
    secretAccessKey: Bun.env.AWS_SECRET_ACCESS_KEY || "",
  },
}
export const client = new S3Client({
  region: Bun.env.AWS_REGION,
  credentials: {
    accessKeyId: Bun.env.AWS_ACCESSKEY_ID || "",
    secretAccessKey: Bun.env.AWS_SECRET_ACCESS_KEY || "",
  },
})
