const request = require('supertest');
const db = require('../../api/database/models');
const {app, server} = require('../../server');
const gerateJWT = require('../../helpers/generateToken');

afterEach(() => {
    server.close();
});

afterAll(async () => {
    await db.sequelize.close();
})

describe('GET /pictures', () => {
    test('debe devolver status 200', () => {
        expect(200).toBe(200);
    })
    test('debo devolver un arreglo', async () => {
        let id = 3;
        const payload = {
            id: 1,
            username: 'diegogod',
            role: 'GOD',
        };
        const jwt = await gerateJWT(payload)
        const {body} = await request(app).get(`/api/v1/pictures/${id}`).auth(jwt, {type: 'bearer'});
        console.log(body);
        expect(200).toBe(200);
    })
})