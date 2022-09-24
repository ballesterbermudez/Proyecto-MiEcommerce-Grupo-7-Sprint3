const path = require("path");
const persistence = require("../persistence/persistence");

const pictureController = {
  listPictures: async (req, res) => {
    try {
      let idProd = req.query.product;
      if (!idProd) {
        idProd = req.params.id;
        if (!idProd) {
          return res.status(400).json("debe ingresar un id");
        }
      }
      let gallery = await persistence.searchPictureByProduct(idProd);
      if (gallery) {
        return res.status(200).json(gallery);
      } else {
        return res.status(404).json("No se encontro el producto");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("No se pudo acceder a la informacion");
    }
  },
  getPictureID: async (req, res) => {
    try {
      let picture = await persistence.searchById("Picture", req.params.id);
      if (picture) {
        return res.status(200).json(picture);
      } else {
        return res.status(404).json("no se encontro la imagen");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("No se pudo acceder a la informacion");
    }
  },
  createPicture: async (req, res) => {
    try {
      let url = req.body.url;
      let description = req.body.description;
      let id_product = req.body.id_product;
      if (!url || !id_product) {
        return res.status(400).json("debe ingresar los datos correctamente");
      }
      let picture = {
        url,
        description,
        id_product,
      };
      await persistence.inster("Picture", picture);
      res.status(200).json(picture);
    } catch (error) {
      console.log(error);
      res.status(500).json("No se pudo acceder a la informacion");
    }
  },
  editPicture: async (req, res) => {
    try {
      let id = req.params.id;
      let OldPicture = await persistence.searchById('Picture', id);
      if(OldPicture) {
        if(req.body.url || req.body.id_product || req.body.description) {
            let picture = {
                id: OldPicture.id,
                url: req.body.url || OldPicture.url,
                description: req.body.description || OldPicture.description,
                id_product: req.body.id_product || OldPicture.id_product,
            };
            await persistence.updateData("Picture", id, picture);
            res.status(200).json(picture);
        } else {
            res.status(400).json('debe ingresar datos a modificar')
        }
    }else {
        res.status(404).json('picture no encontrada')
        }
    } catch (error) {
      console.log(error);
      res.status(500).json("No se pudo acceder a la informacion");
    }
  },
  deletePicture: async (req, res) => {
    try {
      let id = req.params.id;
      if (!id) {
        res.status(400).json("debe ingresar un id");
      }
      let picture = await persistence.searchById("Picture", id);
      if (picture != null) {
        await persistence.delete('Picture', req.params.id);
        res.status(200).json(picture);
      } else {
        res.status(404).json('no se encontro la picture');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json('no se pudo acceder a la informacion');
    }
  },
  getPicture: async (id) => {
    return await persistence.searchById("Picture", id);
  },
};

module.exports = pictureController;
