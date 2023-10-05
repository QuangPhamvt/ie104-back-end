import document from "./documents"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "./jwt.token"
export { default as Document } from "./documents"

const config = {
  Document: document,
  JWT_ACCESS_TOKEN: JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN: JWT_REFRESH_TOKEN,
}
export { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN }
export default config
