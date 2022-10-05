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


describe( 'Listado de productos', () => {
   
    it('solicitud de listado de productos', async() => {
        const token = await generateJWT({role: 'GUEST'})
        const resp = await request(app)
            .get('/api/v1/products')
            .auth(token, {type: 'bearer'})
            .send()
        expect(resp.status).toBe(200) 
        expect(resp.body).toBeInstanceOf(Array)
    })
    it('solicitud de busqueda por categoria existente' , async () => {
        const token = await generateJWT({role: 'GUEST'})
        const resp = await request(app)
            .get('/api/v1/products')
            .auth(token, {type: 'bearer'})
            .query({category: 'lacteos'})
        expect(resp.status).toBe(200) 
        expect(resp.body).toBeInstanceOf(Array)
    })
    it('solicitud de busqueda por categoria inexistente' , async () => {
        const token = await generateJWT({role: 'GUEST'})
        const resp = await request(app)
            .get('/api/v1/products')
            .auth(token, {type: 'bearer'})
            .query({category: 'chocolates'})
        expect(resp.status).toBe(404) 
        expect(resp.body.message).toBe("No hubieron resultados")
    })
})

describe( 'Detalle de productos', () => {
    it('solicitud de producto existente', async () =>{
        const token = await generateJWT({role: 'GUEST'})
        const id = 1
        const resp = await request(app)
            .get('/api/v1/products/' + id)
            .auth(token, {type: 'bearer'})
            .send()
        expect(resp.status).toBe(200)
        expect(resp.body).toMatchObject(expect.arrayContaining([expect.objectContaining({title: 'leche'})]))
        expect(resp.body.length).toBe(1)
    })
    it('solicitud de producto inexistente', async () =>{
        const token = await generateJWT({role: 'GUEST'})
        const id = 1000
        const resp = await request(app)
            .get('/api/v1/products/' + id)
            .auth(token, {type: 'bearer'})
            .send()
        expect(resp.status).toBe(404)
    })

})

describe( 'Creacion de productos', () => {
    it.skip('crear un prodocto nuevo', async ()=>{
        const token = await generateJWT({role: 'GOD'})
        const newProduct = { 
            "title": 'testProduct',
            "price": 100,
            "description": 'lorem ipsum dolor sit amet,consectetur adipscing elit,...',
            "mostwanted": true,
            "stock": 1,
            "category": 1 
        }
        const resp = await request(app)
            .post('/api/v1/products/')
            .auth(token, {type: 'bearer'})
            .send(newProduct)
        expect(resp.status).toBe(200)
        expect(resp.body).toMatchObject(expect.objectContaining({title: 'testProduct'}))
    })
    it('se envia una categoria inexistente', async ()=>{
        const token = await generateJWT({role: 'GOD'})
        const newProduct = {
            "title": 'testProduct',
            "price": 100,
            "description": 'lorem ipsum dolor sit amet,consectetur adipscing elit,...',
            "mostwanted": true,
            "stock": 1,
            "category": 100 
        }
        const resp = await request(app)
            .post('/api/v1/products/')
            .auth(token, {type: 'bearer'})
            .send(newProduct)
        expect(resp.status).toBe(404)
        expect(resp.body.message).toBe("no se encontro la categoria")
    })
    it('hay errores de validacion', async ()=>{
        const token = await generateJWT({role: 'GOD'})
        const newProduct = {
            "category": 1 
        }
        const resp = await request(app)
            .post('/api/v1/products/')
            .auth(token, {type: 'bearer'})
            .send(newProduct)
        expect(resp.status).toBe(401)
        
    })
})

describe( 'Modificacion de Productos', () => {
    it('modificamos un producto existente',async () =>{
        const token = await generateJWT({role: 'GOD'})
        const id = 30
        const newData = {
            "title": 'testProductModification',
            "price": 120,
        }
        const resp = await request(app)
            .put('/api/v1/products/' + id)
            .auth(token, {type: 'bearer'})
            .send(newData)
        expect(resp.status).toBe(200)
        expect(resp.body).toMatchObject(expect.objectContaining({title: 'testProductModification'}))
    })
    it('modificamos un producto inexistente',async () =>{
        const token = await generateJWT({role: 'GOD'})
        const id = 100
        const newData = {
            "title": 'testProductModification',
            "price": 120,
        }
        const resp = await request(app)
            .put('/api/v1/products/' + id)
            .auth(token, {type: 'bearer'})
            .send(newData)
            expect(resp.status).toBe(404)
            expect(resp.body.message).toBe("Producto no encontrado")
    })
    it('encontramos un error de validacion',async () =>{
        const token = await generateJWT({role: 'GOD'})
        const id = 30
        const newData = {
            "title": 'testProductModification',
            "price": -120,
        }
        const resp = await request(app)
            .put('/api/v1/products/' + id)
            .auth(token, {type: 'bearer'})
            .send(newData)
        expect(resp.status).toBe(401)
    })
})

describe('Buscamos por keyword', () =>{
    it('obtenemos resultados de la busqueda', async() =>{
        const token = await generateJWT({role: 'GUEST'})
        const keyword = "ec"
            const resp = await request(app)
                .get('/api/v1/products/search')
                .auth(token, {type: 'bearer'})
                .query({q: keyword})
            expect(resp.status).toBe(200) 
            expect(resp.body).toBeInstanceOf(Array)
            expect(resp.body.length).toBeGreaterThan(0)
                  
    })
    it('No obtenemos resultados de la busqueda', async() =>{
        const token = await generateJWT({role: 'GUEST'})
        const keyword = "kyewordImposible"
            const resp = await request(app)
                .get('/api/v1/products/search')
                .auth(token, {type: 'bearer'})
                .query({q: keyword})
            expect(resp.status).toBe(404) 
            expect(resp.body.message).toBe("No hubieron resultados")         
    })
})

describe('Buscamos productos mostwanted', () => {
    it('No obtenemos resultados de la busqueda', async() =>{
        const token = await generateJWT({role: 'GUEST'})
        await  db.Product.update({mostwanted: false}, {where: {id: 30}})
        const resp = await request(app)
            .get('/api/v1/products/mostwanted')
            .auth(token, {type: 'bearer'})
        expect(resp.status).toBe(404) 
        expect(resp.body.message).toBe("No hubieron resultados")         
    })
    it('obtenemos resultados de la busqueda', async() =>{
        const token = await generateJWT({role: 'GUEST'})
        await db.Product.update({mostwanted: true}, {where: {id: 30}})
            const resp = await request(app)
                .get('/api/v1/products/mostwanted')
                .auth(token, {type: 'bearer'})
            expect(resp.status).toBe(200) 
            expect(resp.body).toBeInstanceOf(Array)
            expect(resp.body.length).toBeGreaterThan(0)
                  
    })
})

describe('Eliminamos productos', () => {
    it('Borramos un producto existente', async ()=> {
        const token = await generateJWT({role: 'GOD'})
        await db.Product.create({id: 40, title: 'deletThis', price: 20, id_category: 1})
        const id = 40
        const resp = await request(app)
            .delete('/api/v1/products/' + id)
            .auth(token, {type: 'bearer'})
        expect(resp.status).toBe(200) 
        expect(resp.body).toMatchObject(expect.objectContaining({title: 'deletThis'}))
    })
    it('Borramos un producto inexistente', async ()=> {
        const token = await generateJWT({role: 'GOD'})
        const id = 100
        const resp = await request(app)
            .delete('/api/v1/products/' + id)
            .auth(token, {type: 'bearer'})
        expect(resp.status).toBe(404) 
        expect(resp.body.message).toBe("no existe el articulo")
    })
})



