
const path = require('path');
const persistence = require('../persistence/persistence');
const { ValidationError } = require('sequelize');
const models = require('../database/models')
const modelName = "Product"


const directory = path.resolve(__dirname,"..","data",)

const controller = {

        //retorna la lista de los productos
    list: async (req,resp) => {

         try{
            
           
            const category = req.query.category;
            

            if(category)
            {
                
                const criteria = {include: {
                    association: 'product_category',
                    attributes: ["id", "title"],
                    include: {association: 'galery', limit: 1}}, 
                    where: {title: category.toLowerCase()},
                   
                    }
                const data = await persistence.searchByCriteria("Category",criteria);
                
                if(data.length > 0) {
                    resp.status(200).json(data)
                } else {
                    resp.status(404).json({message: "No hubieron resultados"});
                }
                
            }
            else
            {

                const criteria = {include: {association: 'category_product', attributes: ["title"]}, 
                                  include: {association: 'galery', limit: 1 }}
                const data = await persistence.searchByCriteria(modelName,criteria)

                resp.status(200).json(data);
            }

            

         }catch(error){
            resp.status(500).json( {message : "No se pudo acceder a la informacion"});
         }
        },
    
        //retorna los detalles de un producto
    details: async (req,resp) =>{

        try{

                const criteria = {include: {association: 'product_category', attributes: ["id", "title"]}
                                  ,include: {association: 'galery'}, 
                                  where: {id: req.params.id} }
                const prod = await persistence.searchByCriteria(modelName,criteria)
            

                if(prod.length > 0)
                {
                    resp.status(200).json(prod);
                }
                else
                {
                    resp.status(404).json({message: "Producto no encontrado"});
                }
              

         }catch(error){
            
            resp.status(500).json( {message : "No se pudo acceder a la informacion"});
         }

        } ,
            //crea un producto
     create: async (req,resp) =>{

            const {title,price,description, category, mostwanted, stock} = req.body;
            const product = {title,price,description, id_category: category, mostwanted, stock}

            try{

                if(await persistence.searchById("Category", category))
                {
                    const newProd = await persistence.inster(modelName,product);
                    resp.status(200).json(newProd);
                }
                else{
                    resp.status(404).json({message: "no se encontro la categoria"})
                }
                

            }catch(error){
                if( error instanceof ValidationError)
                {
                    let errorArray = []
                    error.errors.forEach((el,i) => {errorArray[i] = el.message})
                    resp.status(401).json(errorArray)
                }
                else{
                    resp.status(500).json({message: "No fue posible insertar el producto"});
                }
            }

        },
            //modifica un producto existente
    modify: async (req,resp) => {


            try{

                
                    let product = await persistence.searchById(modelName, req.params.id)
                    
                    if(product != null)
                    {
                        let {...parametorsModificados} = req.body;
                   
                        const newProd = {
                            title: parametorsModificados.title,
                            price: parametorsModificados.price,
                            description: parametorsModificados.description,
                            id_category: parametorsModificados.category,
                            mostwanted: parametorsModificados.mostwanted,
                            stock: parametorsModificados.stock
                        }

                        await persistence.updateData(modelName,req.params.id,newProd)
                    
                        product = await persistence.searchById(modelName, req.params.id)
                   

                        resp.status(200).json(product);
                    }
                    else 
                    {
                     resp.status(404).json({message: "Producto no encontrado"});
                    }
                 
                
 
            }catch(error){
                if( error instanceof ValidationError)
                {
                    let errorArray = []
                    error.errors.forEach((el,i) => {errorArray[i] = el.message})
                    resp.status(401).json(errorArray)
                }
                else{
                    resp.status(500).json({message: "No fue posible modificar el producto"});
                }
            }


        },
        //busca un producto a travez de una palabra clave
    search: async (req,resp) => {

            const keyword = req.query.q;
             try{
                
                const data = await persistence.searchByKeyword(keyword)
               
                if(data.length > 0) {
                    resp.status(200).json(data)
                } else {
                    resp.status(404).json({message: "No hubieron resultados"});
                }

            }catch(error){
                    
            resp.status(500).json({message : "Error interno"})

            }
        },

    mostwanted: async (req,resp) => {

        try{
            
            const data = await persistence.searchByCriteria(modelName, {include: {association: 'galery', limit: 1 },where: {mostwanted : true}})
        
            if(data.length > 0){
                resp.status(200).json(data);
            }
            else{
                resp.status(404).json({message: "No hubieron resultados"});
            }
            

         }catch(error){
           
            resp.status(500).json( {message : "No se pudo acceder a la informacion"});
         }
    },

    //borra el producto con id pasado por parametro
    delete: async (req,resp) => {
        try{

            const product = await persistence.searchById(modelName,req.params.id)

            if(product != null)
            {
                await persistence.delete(modelName,req.params.id)
                resp.status(200).json(product);
            }
            else
            {
                resp.status(404).json({message: "no existe el articulo"})
            }
            

         }catch(error){
            
            resp.status(500).json( {message : "Error interno"});
         }

    },


}




module.exports = controller;

