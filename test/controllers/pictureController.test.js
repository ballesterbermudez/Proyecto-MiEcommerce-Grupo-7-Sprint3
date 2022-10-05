const request = require("supertest");
const db = require("../../api/database/models");
const { app, server } = require("../../server");
const gerateJWT = require("../../helpers/generateToken");
const pictureController = require("../../api/controllers/pictureController");

afterEach(async () => {
    server.close();
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("GET /pictures", () => {
    test("debo devolver un status 200", async () => {
        const id = 6;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .get(`/api/v1/pictures?product=${id}`)
            .auth(jwt, { type: "bearer" });
        expect(statusCode).toBe(200);
    });
    test("debo devolver un status 400", async () => {
        const id = undefined;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .get(`/api/v1/pictures?product=`)
            .auth(jwt, { type: "bearer" });
        expect(statusCode).toBe(400);
    });
    test("debo devolver un status 400", async () => {
        const id = 40;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .get(`/api/v1/pictures?product=${id}`)
            .auth(jwt, { type: "bearer" });
        expect(statusCode).toBe(404);
    });
});

describe("GET /pictures/:id", () => {
    test("debo devolver un status 200", async () => {
        let id = 6;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .get(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" });
        expect(statusCode).toBe(200);
    });
    test("debo devolver un status 404", async () => {
        let id = 20;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .get(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" });
        expect(statusCode).toBe(404);
    });
    test("debo devolver una imagen", async () => {
        let id = 6;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { body } = await request(app)
            .get(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" });
        expect(body).toMatchObject({
            id: expect.any(Number),
            url: expect.any(String),
            description: expect.any(String),
            id_product: expect.any(Number),
        });
    });
});

describe("POST /pictures", () => {
    test("debo devolver un status 200", async () => {
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const picture = {
            url: 'alibaba.com',
            description: 'vuela alto',
            id_product: 2
        }
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .post(`/api/v1/pictures`)
            .auth(jwt, { type: "bearer" }).send(picture);
        expect(statusCode).toBe(200);
    });
    test("debo devolver un status 404", async () => {
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const picture = {
            url: 'alibaba.com',
            description: 'vuela alto',
            id_product: 2
        }
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .post(`/api/v1/pictures`)
            .auth(jwt, { type: "bearer" }).send(picture);
        expect(statusCode).toBe(401);
    });
    test("debo devolver un status 400", async () => {
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const picture = {
            url: 'alibaba.com',
            description: 'vuela alto',
        }
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .post(`/api/v1/pictures`)
            .auth(jwt, { type: "bearer" }).send(picture);;
            expect(statusCode).toBe(400);
    });
});

describe("getPicture controlador picture", () => {
    test("devuelve una picture", async () => {
        const picture = await pictureController.getPicture(6);
        expect(picture).toMatchObject({
            id: expect.any(Number),
            url: expect.any(String),
            description: expect.any(String),
            id_product: expect.any(Number),
        });
    });
});
