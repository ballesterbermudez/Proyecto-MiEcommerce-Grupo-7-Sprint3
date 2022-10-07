const fs = require('fs');
const path = require('path');
const db = require("../api/database/models");


// const pictures = [
//     {
//         url: "leche.com",
//         description: "foto leche",
//         id_product: 1,
//     },
//     {
//         url: "fireball.com",
//         description: "foto fireball",
//         id_product: 2,
//     },
//     {
//         url: "marlboro.com",
//         description: "foto marlboro 1",
//         id_product: 3,
//     },
//     {
//         url: "marlboro1.com",
//         description: "foto marlboro 2",
//         id_product: 3,
//     },
//     {
//         url: "capitanEspacio.com",
//         description: "foto capitan del espacio",
//         id_product: 4,
//     },
//     {
//         url: "pringles.com",
//         description: "foto pringles 1",
//         id_product: 5,
//     },
//     {
//         url: "pringles2.com",
//         description: "foto pringles 2",
//         id_product: 5,
//     },
//     {
//         url: "pringles3.com",
//         description: "foto pringles 3",
//         id_product: 5,
//     },
//     {
//         url: "heladera1.com",
//         description: "foto heladera 1",
//         id_product: 6,
//     },
//     {
//         url: "heladera2.com",
//         description: "foto heladera 2",
//         id_product: 6,
//     },
//     {
//         url: "heladera3.com",
//         description: "foto heladera 3",
//         id_product: 6,
//     },
//     {
//         url: "heladera4.com",
//         description: "foto heladera 4",
//         id_product: 6,
//     },
//     {
//         url: "heladera5.com",
//         description: "foto heladera 5",
//         id_product: 6,
//     },
//     {
//         url: "fagar.com",
//         description: "foto fagar 1",
//         id_product: 7,
//     },
//     {
//         url: "fagar2.com",
//         description: "foto fagar 2",
//         id_product: 7,
//     },
//     {
//         url: "fagar3.com",
//         description: "foto fagar 3",
//         id_product: 7,
//     },
//     {
//         url: "fagar4.com",
//         description: "foto fagar 4",
//         id_product: 7,
//     },
//     {
//         url: "fagar5.com",
//         description: "foto fagar 5",
//         id_product: 7,
//     },
// ];

// const carts = [
//     {
//         id_usuario: 3,
//         id_product: 1,
//         quantity: 1,
//         date: '2022-09-22 16:36:03',
//     },
//     {
//         id_usuario: 3,
//         id_product: 4,
//         quantity: 2,
//         date: '2022-09-22 16:36:03',
//     },
//     {
//         id_usuario: 3,
//         id_product: 5,
//         quantity: 1,
//         date: '2022-09-22 16:36:03',
//     },
//     {
//         id_usuario: 3,
//         id_product: 1,
//         quantity: 1,
//         date: '2022-09-22 16:36:03',
//     },
// ]

// (3, 5, 1, '2022-09-22 16:36:03'),
// (4, 2, 1, '2022-09-22 16:36:03'),
// (4, 6, 1, '2022-09-22 16:36:03'),
// (57, 1, 1, '2022-09-28 00:51:52'),
// (57, 2, 9, '2022-09-28 00:51:52'),
// (57, 3, 4, '2022-09-28 00:51:52');

const data = fs.readFileSync(path.resolve(__dirname, '..', 'api', 'database', 'migrations', 'dump_test.sql')).toString('utf-8')
let querys = data.split(/;\n/)

const Data = async () => {
    
    try {
        console.log(querys);
        for( let i = 0 ; i< querys.length ; i++) {
            await db.sequelize.query(querys[i])
        }

    } catch (err) {
        console.log(err);;
        throw err;
    }
};


module.exports = {
    Data,
};
