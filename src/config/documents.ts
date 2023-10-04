import swagger from "@elysiajs/swagger"
const DOCUMENT = {
  PATH: "/document",
}
const DOCUMENTATION = {
  INFO: {
    TITLE: "IE104 BACK END",
    VERSION: "0.0.1",
  },
}
const document = swagger({
  path: DOCUMENT.PATH,
  documentation: {
    info: {
      title: DOCUMENTATION.INFO.TITLE,
      version: DOCUMENTATION.INFO.VERSION,
    },
    tags: [
      { name: "App", description: "General Endpoint" },
      { name: "Auth", description: "Authorization: /auth" },
    ],
  },
})
export default document
