const persistence = require("../persistence/persistence");

module.exports = {

    validateCartBody: (req,res,next)=>{
        const cart = req.body
        cart.forEach((product)=>{
            if(typeof product.id != number){
                res.status(500).json({ok: false, msg: `El producto ${product.id} debe tener un id numerico`})
            }
            if (!persistence.searchById(Product, product.id)) {
                res.status(404).json({
                  ok: false,
                  msg: `El producto con id ${product.id} no existe en la base de datos`,
                });
              }
            }); 
            next();
        }
            
            
        
    

    

