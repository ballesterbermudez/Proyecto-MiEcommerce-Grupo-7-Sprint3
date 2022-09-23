const express = require("express");
const router = express.Router();
const persistence = require('../persistence/persistence');



router.get('/usuarios', async (req,resp) => {

        try {
          console.log("ENTRE SL ENDPOINT");
          const users = await db.User.findAll({
            include: [
              {
                model: db.Product,
                as: "cart",
                through: { attributes: ["quantity"] },
                attributes: ["title"],
              
              },
            ],
          });
      
         // const categori = await db.Product.findByPk(1,{include: [{all: true, nested: true}]})
      
          res.send(categori);
        } catch (error) {
          console.log(error);
          console.log("ENTRE EN EL CATCH");
        }
      });

router.get('/login',async (req,resp) => {

    try{
        
        const username = "diegogod"
        const pass = "diego1234"

        const payload = await persistence.searchBYUsername(username,pass);
         
        if(payload == null)
        {
          resp.send("credencial incorrecta")
        }

        resp.send(payload)

    }catch(error){
        resp.send(error)
    }

})

router.get('/findAll',async (req,resp) => {

  const respuesta = await persistence.searchAll('User');

  resp.send(respuesta);

} )

router.get('/keyword', async (req,resp)=> {

  try {
    
    const key = 'ec'
    const result = await persistence.searchByKeyword(key)

    

    resp.send(result);
  } catch (error) {
     resp.send(error)
  }
  

})

router.get('/cart', async (req,resp) => {

try {

  const result = await persistence.getCartByUserID(4);

  resp.send(result);
} catch (error) {
  resp.send(error)
  
}

})

router.get('/pictures', async (req,resp)=> {

  try {
    
    const id = 6;
    const result = await persistence.searchPictureByProduct(id)

    

    resp.send(result);
  } catch (error) {
     resp.send(error)
  }
  

})

module.exports = router