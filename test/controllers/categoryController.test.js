const request = require('supertest')
const {app, server} = require('../../server')
const db = require('../../api/database/models')
const generateJWT = require('../../helpers/generateToken');


afterEach(() => {
    server.close();
});


afterAll(async () => {
    await db.sequelize.close();
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
    it.skip('crear una categoria correctamente', async () => {
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
})

describe('Modificar una categoria', () => {
    it('modificar una categoria correctamente', async () => {
        const token = await generateJWT({role: 'GOD'})
        const id = 8
        const newCategory = {title: "testCatMod"}
        const resp = await request(app)
            .put('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
            .send(newCategory)
        expect(resp.status).toBe(200) 
        expect(resp.body).toMatchObject(expect.objectContaining({title: "testCatMod"}))
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
    it('error de validacion', async () => {
        const token = await generateJWT({role: 'GOD'})
        const id = 7
        const newCategory = {title: 23}
        const resp = await request(app)
            .put('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
            .send(newCategory)
        expect(resp.status).toBe(401) 
        
    })
})

describe('Borrar una categoria', () => {
    it('borrar una categoria correctamente', async () => {
        const token = await generateJWT({role: 'GOD'})
        const id = 80
        await db.Category.create({id: id, title: 'categoryToDelete'})
        const resp = await request(app)
            .delete('/api/v1/category/' + id)
            .auth(token, {type: 'bearer'})
        expect(resp.status).toBe(200) 
        expect(resp.body).toMatchObject(expect.objectContaining({title: 'categoryToDelete'}))
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

})
