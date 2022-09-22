
const path = require('path')
const persistence = require('../persistence/persistence');

const pictureController = {
    listPictures : (req, res) => {
        try {
            let idProd = req.query.product;
            if(!idProd) {
                idProd = req.params.id;
                if(!idProd){
                    return res.status(400).json('debe ingresar un id') 
                }
            }
            let producto = persistence.findByIdDB("products.json" , idProd)   
            if(producto) {
                return res.status(200).json(producto.gallery)
            } else {
                return res.status(404).json('No se encontro el producto')
            }
        } catch (error) {
            console.log(error);
            res.status(500).json("No se pudo acceder a la informacion");
        }
    },
    getPictureID : (req, res) => {
        try {
         
            let picture = persistence.findByIdDB("pictures.json", req.params.id)
            if(picture) {
                return res.status(200).json(picture);
            } else {
                return res.status(404).json('no se encontro la imagen')
            }
        } catch (error) {
            console.log(error);
            res.status(500).json("No se pudo acceder a la informacion");
        }
    },
    createPicture : (req, res) => {
        try{
            let id = req.body.id;
            let url = req.body.url;
            let descripcion = req.body.descripcion;
            if(!id || !url) {
                return res.status(400).json('debe ingresar los datos correctamente');
            }
            let picture = {
                id,
                url,
                descripcion,
            }
            let datosPictures = persistence.readDB('pictures.json');
            datosPictures.push(picture);
            persistence.writeDB('pictures.json', datosPictures);
            res.status(200).json(picture);
        } catch (error) {
            console.log(error);
            res.status(500).json("No se pudo acceder a la informacion");
        }
    },
    editPicture : (req, res) => {
        try {   
            let id = req.params.id;
            let encontre = false;
            let datosPictures = persistence.readDB('pictures.json');
            datosPictures.forEach(ele => {
                if(ele.id == id) {
                    if(ele.url)
                        ele.url = req.body.url;
                    else 
                        return res.status(400).json('debe ingresar una url')
                    if(ele.descripcion)
                        ele.descripcion = req.body.descripcion
                    encontre = true;
                }
            });
            if(!encontre) {
                return res.status(404).json('no se encontro la imagen')
            }
            persistence.writeDB("pictures.json", dataosPictures);
            let picture = {
                id: Number(id),
                url: req.body.url,
                descripcion: req.body.descripcion,
            }
            res.status(200).json(picture);
        } catch (error) {
            console.log(error);
            res.status(500).json("No se pudo acceder a la informacion");
        }
    },
    deletePicture : (req, res) => {
        try {
            let id = req.params.id;
            if(!id) {
                res.status(400).json('debe ingresar un id')
            }
            let datosPictures = persistence.readDB("pictures.json")
            let picture;
            let pictures = datosPictures.filter(ele => {
                if(ele.id != id)
                    return ele
                else
                    picture = ele;
            });
            if(datosPictures.length == pictures.length) {
                res.status(404).json('No se encontro la picture')
            }
            persistence.writeDB('pictures.json', pictures);
            res.status(200).json(picture);
        } catch (error) {
            console.log(error);
            res.status(500).json("No se pudo acceder a la informacion");
        }
    },
    getPicture : (id) => {
        return persistence.findByIdDB("pictures.json", id);
    }
}

module.exports = pictureController;