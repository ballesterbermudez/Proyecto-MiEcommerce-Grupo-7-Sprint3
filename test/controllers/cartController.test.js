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
  test("debe devolver un objeto json", async () => {
    let id = 3;
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
});
