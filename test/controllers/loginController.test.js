const request = require('supertest');
const db = require('../../api/database/models');
const {app, server} = require('../../server');
const { Data } = require("../../helpers/dataDB");

afterEach(() => {
    server.close();
});

afterAll(async () => {
    await db.sequelize.query("drop database if exists mi_ecommerce_test;")
    await db.sequelize.close();
})

beforeAll(async() => {
    await Data();
  })

describe("POST /login", () => {
    test("Login Status 200", async () => {
        const user = {
            username: "diegogod",
            password: "diego1234",
        };
        const { statusCode } = await request(app)
            .post("/api/v1/login/")
            .send(user);
        expect(statusCode).toBe(200);
    })
    test('Login Status 400 credenciales incorrectas', async() => {
        const body={
            username:'diegogod',
            password:'asdsa'
        }
        const {statusCode}=await request(app).post('/api/v1/login/').send(body)
        expect(statusCode).toBe(400);
    })
    test('Login Status 400 credenciales vacias', async() => {
        const body={
            username:'',
            password:''
        }
        const {statusCode}=await request(app).post('/api/v1/login/').send(body)
        expect(statusCode).toBe(400);
    })
   
    test('Login Status 500', async() => {
        const body={
            username:'',
            password:''
        }
          await db.sequelize.close();
          const {statusCode}=await request(app).post('/api/v1/login/').send(body)
          expect(statusCode).toBe(500);
    })
})


