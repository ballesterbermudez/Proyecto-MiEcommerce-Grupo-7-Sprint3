const request = require("supertest");
const db = require("../../api/database/models");
const generateJWT = require("../../helpers/generateToken");
const { app, server } = require("../../server");

afterEach(() => {
  server.close();
});
afterAll(async () => {
  await db.sequelize.close();
});

const payload = {
  id: 1,
  username: "diegogod",
  role: "GOD",
};

describe("GET /usuarios", () => {
  test("Debe retornar un statusCode 200", async () => {
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .get("/api/v1/users")
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(200);
  });

  test.skip("Debe retornar un statusCode 500", async () => {
    const token = await generateJWT(payload);
    await db.sequelize.close();
    const { statusCode } = await request(app)
      .get("/api/v1/users")
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(500);
  });

  test("Debe retornar un array con usuarios", async () => {
    const token = await generateJWT(payload);
    const { body } = await request(app)
      .get("/api/v1/users")
      .auth(token, { type: "bearer" });
    expect(body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: expect.any(String) }),
      ])
    );
  });
});

describe("GET /usuario/:id", () => {
  test("Debe retornar un statusCode 200", async () => {
    const userId = "1";
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un statusCode 401", async () => {
    const userId = "999";
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(401);
  });

  test.skip("Debe retornar un statusCode 500", async () => {
    const userId = "1";
    const token = await generateJWT(payload);
    await db.sequelize.close();
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(500);
  });
});
