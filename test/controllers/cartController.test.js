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
  test("debe devolver un json si no encuentra user", async () => {
    const idUser = 99999;
    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { body } = await request(app)
      .put("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" })
      .send({ id_product: 1, quantity: 2 });
    expect(body).toBeInstanceOf(Object);
  });

  test("debe devolver un json si encuentr user", async () => {
    const idUser = 1;
    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { body } = await request(app)
      .put("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" })
      .send({ id_product: 1, quantity: 2 });
    expect(body).toBeInstanceOf(Object);
  });
  test("debe crear carrito en un usuario", async () => {
    const idUser = 1;
    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { body } = await request(app)
      .put("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" })
      .send([
        { id_product: 3, quantity: 1 },
        { id_product: 4, quantity: 1 },
      ]);
    let cartConCosas = await db.Cart.findAll({
      where: { id_usuario: idUser },
    });
    expect(cartConCosas).toHaveLength(2);
  });

  test("debe crear y borrar un elemento de un carrito", async () => {
    const idUser = 1;
    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { body } = await request(app)
      .put("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" })
      .send([
        { id_product: 3, quantity: 1 },
        { id_product: 4, quantity: 1 },
      ]);
    let cartConCosas = await db.Cart.findAll({
      where: { id_usuario: idUser },
    });
    expect(cartConCosas).toHaveLength(2);

    await request(app)
      .put("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" })
      .send([{ id_product: 4, quantity: 1 }]);
    let cartConUnaCosaMenos = await db.Cart.findAll({
      where: { id_usuario: idUser },
    });
    expect(cartConUnaCosaMenos).toHaveLength(1);
  });
  test("debe crear e eliminar el carrito de un usuario", async () => {
    const idUser = 1;
    const payload = {
      id: 1,
      username: "diegogod",
      role: "GOD",
    };
    const jwt = await gerateJWT(payload);
    const { body } = await request(app)
      .put("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" })
      .send([
        { id_product: 3, quantity: 1 },
        { id_product: 4, quantity: 1 },
      ]);
    let cartConCosas = await db.Cart.findAll({
      where: { id_usuario: idUser },
    });
    expect(cartConCosas).toHaveLength(2);

    await request(app)
      .put("/api/v1/carts/" + idUser)
      .auth(jwt, { type: "bearer" })
      .send([]);
    let cartVacio = await db.Cart.findAll({
      where: { id_usuario: idUser },
    });
    expect(cartVacio).toHaveLength(0);
  });
});
