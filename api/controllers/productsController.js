
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
     create: (req,resp) =>{

            let product = req.product;

            try{
                
                 await persistence.inster(modelName,product);
                 const newProd = await persistence.searchByCriteria(modelName, {where: {title: product.title}})

                resp.status(200).json(newProd);


            }catch(error){
                resp.status(500).json( {message : "Error interno del servidor"});
            }

        },
            //modifica un producto existente
    modify: (req,resp) => {


            try{

                let product = persistence.findByIdDB("products.json", req.params.id)

                if(product)
                {
                    let {...parametorsModificados} = req.body;
                   
                    if(parametorsModificados.price)
                    {
                        
                        if(parametorsModificados.price < 0)
                        {
                            
                            return resp.status(401).json({message: "Precio no puede ser negativo"})
                        }
                    }
                    if(parametorsModificados.gallery)
                    {
                        let nuevagalleria = parametorsModificados.gallery.map(el =>{
                        let pictures = picture.getPicture(el);
                        return pictures;
                    })
                    parametorsModificados.gallery = nuevagalleria;
                    }
                    if(parametorsModificados.id)
                    {
                        parametorsModificados.id = Number(req.params.id)
                    }

                    const modifiedProd = { ...product , ...parametorsModificados }
                    persistence.updateDB("products.json", modifiedProd);

                    resp.status(200).json(modifiedProd);
                }
                else
                {
                    resp.status(404).json({message: "Producto no encontrado"});
                }
                   

            }catch(error){
                resp.status(500).json( {message : "Error interno del servidor"});
            }


        },
        //busca un producto a travez de una palabra clave
    search: (req,resp) => {

            const keyword = req.query.q;

           

        try{
            
            const data = persistence.readDB("products.json");

            const info = data.filter(el=> {
                let ret;
                if(el.title.includes(keyword) )
                {
                    ret = el;
                }
                if(el.description)
                {
                    if(el.description.includes(keyword))
                        ret = el;
                }
                if(el.category)
                {
                    if(el.category.includes(keyword))
                        ret = el
                }
                return ret
               
            })
            if(info.length > 0) {
                resp.status(200).json(info)
            } else {
                resp.status(404).json({message: "No hubieron resultados"});
            }

        }catch(error){
            resp.status(500).json({message : "Error interno", error: error.message})
        }
         



        },

    mostwanted: (req,resp) => {

        try{
            
           
           
            const data = persistence.readDB("products.json")
          
            const info = data.filter(el => el.mostwanted == true)

            resp.status(200).json(info);

         }catch(error){
            resp.status(500).json( {message : "No se pudo acceder a la informacion"});
         }
    },

    //borra el producto con id pasado por parametro
    delete: (req,resp) => {
        try{
            
           
         
            const product = persistence.findByIdDB("products.json", req.params.id);

            if(product)
            {
                persistence.removeFromDB("products.json", req.params.id)
                resp.status(200).json(product);
            }
            else
            {
                resp.status(404).json({message: "no existe el articulo"})
            }
            

         }catch(error){
            resp.status(500).json( {message : "Error interno", message: error.message});
         }

    },

            //MIDDLEWARE: chequea que los datos titulo y precio hayan sido pasados envia el producto armado a create
    chekData: (req,resp,next) => {

            let {title,price,description,image,gallery,category, mostwanted, stock} = req.body;
            
            if(!title || !price)
            {
                resp.status(400).json({mssage: "Los valores  title y precio son obligatorios"})
            }
            else {
                if(Number(price) < 0)
                {
                    resp.status(401).json({mssage: "El precio no puede ser negativo"})
                }
                else
                {
                    req.product = {title,price,description,category,mostwanted,stock} 
                    next();
                }
            }
        },

    getProduct: (id) => {
        
        let retorno = persistence.findByIdDB("products.json", id);

    return retorno
    },
}




module.exports = controller;

