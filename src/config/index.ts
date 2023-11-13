import document from "./documents"
import { HTTPStatusName } from "elysia/dist/utils"
import { CookieOptions } from "elysia/dist/cookie"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "./jwt.token"
import { Prettify } from "elysia/dist/types"
export { default as Document } from "./documents"

const config = {
  Document: document,
  JWT_ACCESS_TOKEN: JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN: JWT_REFRESH_TOKEN,
}
export type SetElysia = {
  headers: Record<string, string> & {
    "Set-Cookie"?: string | string[]
  }

  status?: number | HTTPStatusName
  redirect?: string
  cookie?: Record<
    string,
    Prettify<
      {
        value: string
      } & CookieOptions
    >
  >
}
export { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN }
export default config
