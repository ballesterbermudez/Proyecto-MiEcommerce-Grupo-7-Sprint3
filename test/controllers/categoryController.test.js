const request = require('supertest')
const {app, server} = require('../../server')
const db = require('../../api/database/models')
const generateJWT = require('../../helpers/generateToken');
const { Data } = require('../../helpers/dataDB');


afterEach(() => {
    server.close();
});


afterAll(async () => {
    await db.sequelize.close();
})

beforeAll(async () => {
    await Data();
})

describe('Listar categorias', () => {
    it('obtener listado de categorias', async () => {
        const token = await generateJWT({role: 'GUEST'})
        const resp = await request(app)
            .get('/api/v1/category')
            .auth(token, {type: 'bearer'})
            .send()
        expect(resp.status).toBe(200) 
        expect(resp.body).toBeInstanceOf(Array)
    })
})
describe('Listado de productos de una categoria', () => {
    it('obtener productos de una categoria', async () => {
        const token = await generateJWT({role: 'GUEST'})
        const id = 1
        const resp = await request(app)
            .get('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
            .send()
        expect(resp.status).toBe(200) 
        expect(resp.body).toBeInstanceOf(Array)
    })
    it('buscar una categoria inexistente', async () => {
        const token = await generateJWT({role: 'GUEST'})
        const id = 100
        const resp = await request(app)
            .get('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
            .send()
        expect(resp.status).toBe(404) 
       
    })
})

describe('Crear una categoria', () => {
    it('crear una categoria correctamente', async () => {
        const token = await generateJWT({role: 'GOD'})
        const newCategory = {title: "testCategory"}
        const resp = await request(app)
            .post('/api/v1/category')
            .auth(token, {type: 'bearer'})
            .send(newCategory)
        expect(resp.status).toBe(200) 
        expect(resp.body).toMatchObject(expect.objectContaining({title: 'testCategory'}))
    })
    it('crear una categoria incorrectamente', async () => {
        const token = await generateJWT({role: 'GOD'})
        const newCategory = {}
        const resp = await request(app)
            .post('/api/v1/category')
            .auth(token, {type: 'bearer'})
            .send(newCategory)
        expect(resp.status).toBe(400) 
    })
    test('crea una categoria con titulo invalido', async () => {
        const token = await generateJWT({role: 'GOD'})
        const newCategory = {title: 1}
        const resp = await request(app)
            .post('/api/v1/category')
            .auth(token, {type: 'bearer'})
            .send(newCategory)
        expect(resp.status).toBe(401) 
        expect(resp.body).toBeInstanceOf(Array)
    })
})

describe('Modificar una categoria', () => {
    it('modificar una categoria correctamente', async () => {
        const token = await generateJWT({role: 'GOD'})
        let {id} = await db.Category.findOne({where: {title: "testCategory"}, attributes: ['id']});
        const newCategory = {title: "testCategoryEdit"}
        const resp = await request(app)
            .put('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
            .send(newCategory)
        expect(resp.status).toBe(200) 
        expect(resp.body).toMatchObject(expect.objectContaining({id: id, title: "testCategoryEdit"}))
    })
    it('modificar una categoria incorrectamente', async () => {
        const token = await generateJWT({role: 'GOD'})
        const newCategory = {}
        const id = 1
        const resp = await request(app)
            .put('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
            .send(newCategory)
        expect(resp.status).toBe(400) 
        expect(resp.body).toBe("debe ingresar un titulo")
    })
    it('modificar una categoria con titulo invalido', async () => {
        const token = await generateJWT({role: 'GOD'})
        const newCategory = {title: 1}
        const id = 1
        const resp = await request(app)
            .put('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
            .send(newCategory)
        expect(resp.status).toBe(401) 
        expect(resp.body).toBeInstanceOf(Array)
    })
    it('modificar una categoria inexistente', async () => {
        const token = await generateJWT({role: 'GOD'})
        const id = 200
        const newCategory = {title: "testCategoryModificada"}
        const resp = await request(app)
            .put('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
            .send(newCategory)
        expect(resp.status).toBe(404) 
        expect(resp.body).toBe("no se encontro categoria")
    })
})

describe('Borrar una categoria', () => {
    it('borrar una categoria correctamente', async () => {
        const token = await generateJWT({role: 'GOD'})
        let {id} = await db.Category.findOne({where: {title: "testCategoryEdit"}, attributes: ['id']});
        const resp = await request(app)
            .delete('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
        expect(resp.statusCode).toBe(200) 
        expect(resp.body).toMatchObject(expect.objectContaining({id: id, title: 'testCategoryEdit'}))
    })
    it('borrar una categoria inexistente', async () => {
        const token = await generateJWT({role: 'GOD'})
        const id = 80
        const resp = await request(app)
            .delete('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
        expect(resp.status).toBe(404)
        expect(resp.body).toBe("no se encontro la category")
    })
    test('borrar una categoria inexistente', async () => {
        const token = await generateJWT({role: 'GOD'})
        const id = 80
        const resp = await request(app)
            .delete('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
        expect(resp.status).toBe(404)
        expect(resp.body).toBe("no se encontro la category")
    })
})

describe('Prueba de status 500', () => {
    beforeAll(async () => {
        await db.sequelize.query('DROP DATABASE `mi_ecommerce_test`')
        await db.sequelize.close();
    })
    test('GET /category', async () => {
        const token = await generateJWT({role: 'GOD'})
        const {statusCode, body} = await request(app)
            .get('/api/v1/category')
            .auth(token, {type: 'bearer'})
        expect(statusCode).toBe(500)
        expect(body).toBe("No se pudo acceder a la informacion")
    })
    test('GET /category', async () => {
        const token = await generateJWT({role: 'GOD'})
        const id = 1;
        const {statusCode, body} = await request(app)
            .get(`/api/v1/category/${id}`)
            .auth(token, {type: 'bearer'})
        expect(statusCode).toBe(500)
        expect(body).toBe("No se pudo acceder a la informacion")
    })
    test('POST /category', async () => {
        const token = await generateJWT({role: 'GOD'})
        const newCategory = {title: "testCategory"}
        const {statusCode, body} = await request(app)
            .post(`/api/v1/category`)
            .auth(token, {type: 'bearer'}).send(newCategory)
        expect(statusCode).toBe(500)
        expect(body).toBeInstanceOf(Object)
    })
    test('PUT /category', async () => {
        const token = await generateJWT({role: 'GOD'})
        const id = 1;
        const {statusCode, body} = await request(app)
            .put(`/api/v1/category/${id}`)
            .auth(token, {type: 'bearer'})
        expect(statusCode).toBe(500)
        expect(body).toBeInstanceOf(Object)
    })
    test('DELETE /category', async () => {
        const token = await generateJWT({role: 'GOD'})
        const id = 1;
        const {statusCode, body} = await request(app)
            .delete(`/api/v1/category/${id}`)
            .auth(token, {type: 'bearer'})
        expect(statusCode).toBe(500)
        expect(body).toBeInstanceOf(Object)
    })
})