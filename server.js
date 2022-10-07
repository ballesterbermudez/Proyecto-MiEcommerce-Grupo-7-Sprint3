require("dotenv").config();
const express = require("express");
const app = express();
const routeCarts = require("./api/routes/routeCarts");
const routeLogin = require("./api/routes/routeLogin");
const routePictures = require("./api/routes/routePictures");
const routeProducts = require("./api/routes/routeProducts");
const routeUsers = require("./api/routes/routeUsers");
const routeCategory = require("./api/routes/routeCategory");
const verifyJWT = require("./api/middelware/verifyJWT");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const db = require("./api/database/models");
require("dotenv").config();

app.use(express.json());

// Home

app.get("/api/v1", (req, res) => {
  res.status(200).json("Bienvenido al inicio");
});

// Swagger - Documentacion api

app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas

app.use("/api/v1/login", routeLogin);
app.use("/api/v1/pictures", verifyJWT, routePictures);
app.use("/api/v1/products", verifyJWT, routeProducts);
app.use("/api/v1/users", routeUsers);
app.use("/api/v1/carts", verifyJWT, routeCarts);
app.use("/api/v1/category", verifyJWT, routeCategory);

// Server open

const server = app.listen(process.env.PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
  console.log("Se abrio correctamente en el puerto " + process.env.PORT);
});

// Redireccionamiento de pagina

app.get("*", (req, res) => {
  res.status(200).redirect("/api/v1");
});

module.exports = { app, server };
