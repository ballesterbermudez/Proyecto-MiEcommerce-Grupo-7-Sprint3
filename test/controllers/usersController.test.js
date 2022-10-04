const request = require('supertest');
const db = require('../../api/database/models');
const generateJWT = require('../../helpers/generateToken');
const {app, server} = require('../../server');

afterEach(()=>{
    server.close()
})
afterAll(async () => {
    await db.sequelize.close();
})

describe('GET /usuarios', ()=>{
    test('Debe retornar un statusCode 200', async ()=>{
        const payload = {
            id: 1,
            username: 'diegogod',
            role: 'GOD',
          };
        const token = await generateJWT(payload);
        const { statusCode } = await request(app).get('/api/v1/users').auth(token, {type: 'bearer'});
        expect(statusCode).toBe(200);
    })

    test('Debe retornar un statusCode 500', async ()=>{
        const payload = {
            id: 1,
            username: 'diegogod',
            role: 'GOD',
          };
        const token = await generateJWT(payload);
        await db.sequelize.close();
        const { statusCode } = await request(app).get('/api/v1/users').auth(token, {type: 'bearer'});
        expect(statusCode).toBe(500);
    })
})

describe('GET /usuario/:id', () => {
    // test('Debe retornar un statusCode 200', async ()=>{
    //     const payload = {
    //         id: 1,
    //         username: 'diegogod',
    //         role: 'GOD',
    //       };
    //     const token = await generateJWT(payload);
    //     const { statusCode } = await request(app).get('/api/v1/users').auth(token, {type: 'bearer'});
    //     expect(statusCode).toBe(200);
    // })
})