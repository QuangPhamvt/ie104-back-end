import swagger from "@elysiajs/swagger"
const DOCUMENT = {
  PATH: "/document",
}
const DOCUMENTATION = {
  INFO: {
    TITLE: "IE104 BACK END",
    VERSION: "5.7.2",
  },
}
const document = swagger({
  path: DOCUMENT.PATH,
  version: "5.7.2",
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
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  autoDarkMode: false,
})
export default document
