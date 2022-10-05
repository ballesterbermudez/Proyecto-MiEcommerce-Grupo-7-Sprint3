require('mysql2/node_modules/iconv-lite').encodingExists('foo');

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

describe.skip('Generar JWT', () => {
    test.skip('Generar Token ', async() => {
        const payload = {
            id: 1,
            username: 'diegogod',
            role: 'GOD',
        };
        const jwt = await gerateJWT(payload) 
         expect(jwt).not.toBeUndefined()
        
    })
    test.skip('Generar Token con error', async () => {
        const payload = {
            id: 1,
            username: 'diegogod',
            role: 'GOD',
        };
        const jwt = await gerateJWT()
       expect('No se pudo crear el token').toThrow()
    })
})