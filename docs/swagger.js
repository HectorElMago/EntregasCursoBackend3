const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación de las APIs - CoderHouse Backend",
      version: "1.0.0",
      description: "Esta es la documentación de las APIs de nuestro backend.",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
