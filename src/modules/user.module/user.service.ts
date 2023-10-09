import { getObject, upload } from "../../../aws/s3"

export const getAvatar = async (request: Request) => {
  try {
    const id = request.headers.get("userId")
    const data = await getObject(`user/${id}/avatar.webp`)
    return data
  } catch (error) {
    console.log("🚀 ------------------------------------------------------🚀")
    console.log("🚀 ~ file: user.controller.ts:33 ~ .get ~ error:", error)
    console.log("🚀 ------------------------------------------------------🚀")
  }
}

export const uploadAvatar = async ({ request, body, set }: { request: Request; body: any; set: any }) => {
  console.log("🚀 ---------------------------------------------------🚀")
  console.log("🚀 ~ file: user.controller.ts:52 ~ request:", request)
  console.log("🚀 ---------------------------------------------------🚀")
  try {
    const id = request.headers.get("userId")
    const blob = new Blob([body.file], { type: "image/webp" })
    await upload(`user/${id}/avatar.webp`, blob, typeof body.file)
    set.status = "Created"
    return {
      status: "Created",
    }
  } catch (error) {
    console.log(error)
  }
}
