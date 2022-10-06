const request = require("supertest");
const db = require("../../api/database/models");
const { app, server } = require("../../server");
const gerateJWT = require("../../helpers/generateToken");
const pictureController = require("../../api/controllers/pictureController");
const { Data } = require("../../helpers/dataDB");

afterEach(async () => {
    server.close();
});

afterAll(async () => {
    await db.sequelize.close();
});

beforeAll(async() => {
    await Data();
  })

describe("GET /pictures", () => {
    test("debo devolver un status 200 por query", async () => {
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
    test("debo devolver un status 200 por product", async () => {
        const id = 6;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .get(`/api/v1/products/${id}/pictures`)
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
    test("debo devolver un status 404", async () => {
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
            id_product: 6
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
            .auth(jwt, { type: "bearer" }).send(picture);
            expect(statusCode).toBe(400);
    });
});

describe('PUT /pictures/:id', () => {
    test('devuelve un status 200', async () => {
        const id = 2;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const picture = {
            url: 'fireball.com'
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .put(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" }).send(picture);
            expect(statusCode).toBe(200);
    })            
    test('devuelve un status 200', async () => {
        const id = 2;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const picture = {
            description: 'whisky de calidad'
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .put(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" }).send(picture);
            expect(statusCode).toBe(200);
    })
    test('devuelve un status 400', async () => {
        const id = 2;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const picture = {
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .put(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" }).send(picture);
            expect(statusCode).toBe(400);
    })
    test('devuelve un status 404', async () => {
        const id = 1;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const picture = {
            url: 'fireball.com',
            description: 'whisky de calidad',
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .put(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" }).send(picture);
            expect(statusCode).toBe(404);
    })
    test('devuelve un status 401', async () => {
        const id = 2;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const picture = {
            url: 'fireball',
            description: 'whisky de calidad',
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .put(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" }).send(picture);
            expect(statusCode).toBe(401);
    })
})

describe('DELETE /pictures/:id', () => {
    test('devuelve un status 200', async () => {
        let {id} = await db.Picture.findOne({where: {url: 'alibaba.com'}, attributes: ['id']});
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .delete(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" });
            expect(statusCode).toBe(200);
    })
    test('devuelve un status 404', async () => {
        let id = 1;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .delete(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" });
            expect(statusCode).toBe(404);
    })
})

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

describe('Prueba errores 500', () => {
    beforeAll(async () => {
        await db.sequelize.close();
    })
    test('GET /pictures', async () => {
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
        expect(statusCode).toBe(500);
    })
    test('GET /pictures/:id', async () => {
        const id = 6;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .get(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" });
        expect(statusCode).toBe(500);
    })
    test('POST /pictures', async () => {
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const picture = {
            url: 'alibaba.com',
            description: 'vuela alto',
            id_product: 6
        }
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .post(`/api/v1/pictures`)
            .auth(jwt, { type: "bearer" }).send(picture);
        expect(statusCode).toBe(500);
    })
    test('PUT /pictures', async () => {
        const id = 6;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .put(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" });
        expect(statusCode).toBe(500);
    })
    test('DELETE /pictures', async () => {
        const id = 6;
        const payload = {
            id: 1,
            username: "diegogod",
            role: "GOD",
        };
        const jwt = await gerateJWT(payload);
        const { statusCode } = await request(app)
            .delete(`/api/v1/pictures/${id}`)
            .auth(jwt, { type: "bearer" });
        expect(statusCode).toBe(500);
    })
})
