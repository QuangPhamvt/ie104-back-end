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
      contact: {
        name: "CustomAFK",
        url: "https://www.facebook.com/profile.php?id=100079764644387",
        email: "quangpm220503vt@gmail.com",
      },
    },
    tags: [
      { name: "App", description: "General Endpoint" },
      { name: "Auth", description: "Authorization: /auth" },
      { name: "USER", description: "User information: /user" },
    ],
  },
})
export default document
