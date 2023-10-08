import Elysia from "elysia"

const DETAIL = {
  detail: {
    tags: ["USER"],
  },
}
const userController = new Elysia()
userController
  .get(
    "/",
    () => {
      return "This is user!"
    },
    {
      ...DETAIL,
    },
  )
  .get("/image", ({ set }) => {
    set.headers["Content-type"] = "image/jpeg"
    return Bun.file("/home/custom_afk/Desktop/mami.jpg")
  })

export default userController
