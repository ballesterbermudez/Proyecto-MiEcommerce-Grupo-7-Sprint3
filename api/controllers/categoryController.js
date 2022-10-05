const persistence = require("../persistence/persistence");
const { ValidationError } = require("sequelize");
const {Product} = require('../database/models');

const categoryController = {
    listCategorys: async (req, res) => {
        try {
            let categorys = await persistence.searchAll("Category");
            if (categorys) {
                return res.status(200).json(categorys);
            } else {
                return res.status(404).json("No se encontro ninguna categoria");
            }
        } catch (error) {
            console.log(error);
            res.status(500).json("No se pudo acceder a la informacion");
        }
    },
    detailCategory: async (req, res) => {
        try {
            let category = await persistence.searchByCriteria("Category", {
                include: { association: "product_category" , include: { association: 'galery', limit: 1}},
                attributes: ["title"],
                where: { id: req.params.id },
            });
            if (category.length > 0) {
                return res.status(200).json(category);
            } else {
                return res.status(404).json("No se encontro ninguna categoria");
            }
        } catch (error) {
            console.log(error);
            res.status(500).json("No se pudo acceder a la informacion");
        }
    },
    create: async (req, res) => {
        try {
            if (req.body.title) {
                let category = {
                    title: req.body.title,
                };
                await persistence.inster("Category", category);
                return res.status(200).json(category);
            } else {
                return res.status(400).json("debe ingresar un titulo valido");
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                let errorArray = [];
                error.errors.forEach((el, i) => {
                    errorArray[i] = el.message;
                });
                res.status(401).json(errorArray);
            } else {
                res.status(500).json({
                    message: "No fue posible insertar el producto",
                });
            }
        }
    },
    update: async (req, res) => {
        try {
            let id = req.params.id;
            if (id) {
                let category = await persistence.searchById("Category", id);
                if (category) {
                    if (req.body.title) {
                        await persistence.updateData("Category", id, {
                            title: req.body.title,
                        });
                        res.status(200).json({
                            id: Number(id),
                            title: req.body.title,
                        });
                    } else {
                        res.status(400).json("debe ingresar un titulo");
                    }
                } else {
                    res.status(404).json("no se encontro categoria");
                }
            } else {
                res.status(400).json("debe ingresar un id valido");
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                let errorArray = [];
                error.errors.forEach((el, i) => {
                    errorArray[i] = el.message;
                });
                res.status(401).json(errorArray);
            } else {
                console.log(error)
                res.status(500).json({
                    message: "No fue posible modificar el producto",
                });
            }
        }
    },
    delete: async (req, res) => {
        try {
            let id = req.params.id;
            if (!id) {
                res.status(400).json("debe ingresar un id");
            }
            let category = await persistence.searchById("Category", id);
            if (category) {
                await persistence.delete("Category", id);
                res.status(200).json(category);
            } else {
                res.status(404).json("no se encontro la category");
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                let errorArray = [];
                error.errors.forEach((el, i) => {
                    errorArray[i] = el.message;
                });
                res.status(401).json(errorArray);
            } else {
                res.status(500).json({
                    message: "No fue posible borrar el producto",
                });
            }
        }
    },
};

module.exports = categoryController;
