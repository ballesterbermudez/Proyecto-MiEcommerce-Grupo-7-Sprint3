const request = require("supertest");
const db = require("../../api/database/models");
const { app, server } = require("../../server");
const gerateJWT = require("../../helpers/generateToken");
const cartController = require("../../api/controllers/cartController");

afterEach(() => {
  server.close();
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("GET /api/v1/carts/:id", () => {
  test("debe devolver status 200", async () => {
    const idUser = 1;
    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { statusCode } = await request(app)
      .get("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" });
    expect(statusCode).toBe(200);
  });
  test("debe devolver status 404 si el id no se corresponde con ningun user", async () => {
    const idUser = 9999;

    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { statusCode } = await request(app)
      .get("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" });
    expect(statusCode).toBe(404);
  });
  test("debe devolver un objeto json si no encuentra usuario", async () => {
    let id = 9999;
    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { body } = await request(app)
      .get(`/api/v1/carts/${id}`)
      .auth(jwt, { type: "bearer" });
    expect(body).toBeInstanceOf(Object);
  });
  test("debe devolver un objeto json si encuentra el usuario", async () => {
    const idUser = 3;
    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { body } = await request(app)
      .get(`/api/v1/carts/${idUser}`)
      .auth(jwt, { type: "bearer" });
    expect(body).toBeInstanceOf(Object);
  });
});

describe("PUT /api/v1/carts/:id", () => {
  test("debe devolver status 200 al modiificar un carrito correctamente", async () => {
    const idUser = 1;
    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { statusCode } = await request(app)
      .put("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" })
      .send({ id_product: 1, quantity: 2 });
    expect(statusCode).toBe(200);
  });
  test("debe devolver status 404 al no encontrar un usuario", async () => {
    const idUser = 99999;
    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { statusCode } = await request(app)
      .put("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" })
      .send({ id_product: 1, quantity: 2 });
    expect(statusCode).toBe(404);
  });
  test.todo("debe devolver un json en todo caso (funcione o no)");
  test.todo("debe crear un carrito en un usuario que no tenga carrito");
  test.todo(
    "debe aumentar los elementos de la tabla cart al poner un elemento mas en un carrito ya creado"
  );
  test.todo(
    "debe disminuir los elementos de la tabla cart al eliminar enviar un carrito con un producto menos"
  );
  test.todo("debe eliminar el carrito de un usuario");
});
