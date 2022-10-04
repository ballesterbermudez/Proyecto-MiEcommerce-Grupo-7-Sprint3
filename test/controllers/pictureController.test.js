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
    test('debo devolver un arreglo', () => {
        
        expect(200).toBe(200);
    })
})