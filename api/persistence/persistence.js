const { Op } = require('sequelize');
const db = require('../database/models')



const persistence = {
  
    searchBYUsername: async (username, password) => {

      try{
          const user = await db.User.findOne({
                           attributes:['id','username'], 
                           where: {username: username, password: password}, 
                           include: { 
                           association: "userrole",
                           attributes: ["role"] }  
                          })
          return user;
      }catch (error)
      {
         throw "Error acceso de bd"
      }

    },

    searchAll: async (modelName) => {
        try{
          const info = await db[modelName].findAll();
          return info
        }catch(error){throw "Error acceso a bd"}

    },

    searchById : async (modelName, id) => {
      try{
        const info = await db[modelName].findByPk(id);
        return info
      }catch(error){throw "Error acceso a bd"}

  },

  updateData: async (modelName, id, datos) => {

    try {

         await  db[modelName].update(
            datos,
          {
            where: {id: id}
          })


    } catch (error) {
      throw "Error acceso a bd"
    }

  },

  delete: async (modelName, id) => {

   try {
    
       await db[modelName].destroy({where: {id: id}})

    } catch (error) {
     throw "Error acceso a bd"
    }
  },

  inster: async (modelName, datos) => {

    try {
      
      await db[modelName].create(datos);

    } catch (error) {
      throw "Error acceso a bd"
    }

  },


  //Criteria es un objeto con las propiedades dentro del findAll

  searchByCriteria: async (modelName, criteria) => {

    try {

      const respuesta = await db[modelName].findAll(criteria);
      return respuesta
  
    } catch (error) {

      throw "Error acceso a bd"
    }
  },

  searchByKeyword: async  (keyWord) => {

    try {
      db.Sequelize.or
      const respuesta = await db.Product.findAll({
        
        include: {
            association: 'category_product',
            attributes: ["title"]
            },
        where: {
          [db.Sequelize.Op.or]: [
            { description: {[db.Sequelize.Op.like] : "%"+keyWord+"%"}},
            {title: {[db.Sequelize.Op.like] : "%"+keyWord+"%"}},
            db.Sequelize.or(db.Sequelize.col('category_product.title'),  'lacteos') 
            ],
            
          }
          
    });

      return respuesta
  
    } catch (error) {

      throw new Error("Error acceso a bd")
    }
  },

  //Obtener fotos de un producto

  searchPictureByProduct: async (id) => {

    try {

      const respuesta = await db.Product.findByPk(id, {
        include: {
          association: 'galery'
        },
        attributes: {exclude: ['id','title', 'price', 'description', 'id_category']}
      });
      return respuesta
  
    } catch (error) {

      throw "Error acceso a bd"
    }
  },

}
 


module.exports = persistence;