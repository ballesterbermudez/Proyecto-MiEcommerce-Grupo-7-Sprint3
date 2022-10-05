const request = require('supertest');
const db = require('../../api/database/models');
const sinon = require('sinon')
const persistance=require('../../api/persistence/persistence')
const {app, server} = require('../../server');
const { response } = require('express');


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
            username:'',
            password:''
        }
        const {statusCode}=await request(app).post('/api/v1/login/').send(body)
        expect(statusCode).toBe(400);
    })
    test('Login Status 400', async() => {
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
        sinon.stub(persistance, "searchBYUsername").throws(
            new Error({
              response: { status: 500},
            })
          );

          const {statusCode}=await request(app).post('/api/v1/login/').send(body)
          expect(statusCode).toBe(500);
    })
})


