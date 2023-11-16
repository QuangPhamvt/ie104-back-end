import jwt from "@elysiajs/jwt"

const JWT_AS = process.env.JWT_ACCESS_SECRETKEY || "access_token"
const JWT_AE = process.env.JWT_ACCESS_EXPIRY || "60s"
const JWT_RS = process.env.JWT_REFRESH_SECRETKEY || "refresh_token"
const JWT_RE = process.env.JWT_REFRESH_EXPIRY || "3d"
export const JWT_ACCESS_TOKEN = jwt({
  name: "JWT_ACCESS_TOKEN",
  secret: JWT_AS,
  exp: JWT_AE,
})
export const JWT_REFRESH_TOKEN = jwt({
  name: "JWT_REFRESH_TOKEN",
  secret: JWT_RS,
  exp: JWT_RE,
})
