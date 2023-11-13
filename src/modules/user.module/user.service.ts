import { getObject, upload } from "../../../aws/s3"

export const getAvatar = async (request: Request, set: any) => {
  try {
    const id = request.headers.get("userId") || ""
    // const user = await prisma.users.findUnique({
    //   where: {
    //     id,
    //   },
    // })
    // if (user) return await getObject(user.avatar)
    set.status = 400
    return {
      status: "Bad request",
    }
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
  const id = request.headers.get("userId") || ""
  const blob = new Blob([body.file], { type: "image" }) || ""
  const avatarUrl = `user/${id}/avatar.webp`
  try {
    // await prisma.users.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     avatar: avatarUrl,
    //   },
    // })
    await upload(`user/${id}/avatar.webp`, blob, "image/webp")
    set.status = "Created"
    return {
      status: "Created",
    }
  } catch (error) {
    console.log(error)
  }
}
