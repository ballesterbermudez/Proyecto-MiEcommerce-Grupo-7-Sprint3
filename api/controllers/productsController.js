
const path = require('path');
const picture = require('./pictureController')
const persistence = require('../persistence/persistence');
const modelName = "Product"


const directory = path.resolve(__dirname,"..","data",)

const controller = {

        //retorna la lista de los productos
    list: async (req,resp) => {

         try{
            
           
            const category = req.query.category;
            

            if(category)
            {
                const criteria = {include: {association: 'product_category', attributes: ["id", "title"]}, where: {title: category}}
                const data = await persistence.searchByCriteria("Category",criteria);
                
                resp.status(200).json(data);
                
            }
            else
            {

                const criteria = {include: {association: 'category_product', attributes: ["title"]}}
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

            
            const prod = await persistence.searchById(modelName,req.params.id)
            

            if(prod != null)
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
            //crea un producto: requiere titulo y precio a travez de un middleware
     create: async (req,resp) =>{

            let product = req.product;

            try{
                
                 const newProd = await persistence.inster(modelName,product);
                 

                resp.status(200).json(newProd);


            }catch(error){
                console.log(error)
                resp.status(500).json({message: "No se pudo insertar la informacion"});
            }

        },
            //modifica un producto existente
    modify: async (req,resp) => {


            try{

                let product = await persistence.searchById(modelName, req.params.id)
  
                if(product != null)
                {
                    let {...parametorsModificados} = req.body;
                   
                    if(parametorsModificados.price)
                    {
                        
                        if(parametorsModificados.price < 0)
                        {
                            
                            return resp.status(401).json({message: "Precio no puede ser negativo"})
                        }
                    }
                    
                    
                    
                    
                    if(parametorsModificados.id)
                    {
                        parametorsModificados.id = undefined
                    }

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
                console.log(error)
                resp.status(500).json( {message : "Error interno del servidor", error});
            }


        },
        //busca un producto a travez de una palabra clave
    search: async (req,resp) => {

            const keyword = req.query.q;
             try{
            
                const data = await persistence.searchByKeyword(keyword)
               
                if(data != null) {
                    resp.status(200).json(data)
                } else {
                    resp.status(404).json({message: "No hubieron resultados"});
                }

            }catch(error){
            resp.status(500).json({message : "Error interno", error: error.message})
            }
        },

    mostwanted: async (req,resp) => {

        try{
            
            const data = await persistence.searchByCriteria(modelName, {where: {mostwanted : true}})
        
            resp.status(200).json(data);

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
            console.log(error)
            resp.status(500).json( {message : "Error interno"});
         }

    },

            //MIDDLEWARE: chequea que los datos titulo y precio hayan sido pasados envia el producto armado a create
    chekData: (req,resp,next) => {

            let {title,price,description,category, mostwanted, stock} = req.body;
            
            if(!title || !price || !category)
            {
                resp.status(400).json({mssage: "Los valores  title, precio y categoria son obligatorios"})
            }
            else {
                if(Number(price) < 0)
                {
                    resp.status(401).json({mssage: "El precio no puede ser negativo"})
                }
                else
                {
                    req.product = {title,price,description,id_category: category ,mostwanted,stock} 
                    next();
                }
            }
        },

}




module.exports = controller;

