const request = require('supertest');
const db = require('../../api/database/models');
const {app, server} = require('../../server');


afterEach(() => {
    server.close();
});

afterAll(async () => {
    await db.sequelize.close();
})

describe('POST /login', () => {
    test('Login Status 200', async() => {
        const user={
            username:'diegogod',
            password:'diego1234'
        }
        const {statusCode}=await request(app).post('/api/v1/login/').send(user)
        expect(statusCode).toBe(200);
    })
    test('Login Status 400', async() => {
        const body={
            username:'dieod',
            password:'diego1234'
        }
        const {statusCode}=await request(app).post('/api/v1/login/').send(body)
        expect(statusCode).toBe(400);
    })
})
