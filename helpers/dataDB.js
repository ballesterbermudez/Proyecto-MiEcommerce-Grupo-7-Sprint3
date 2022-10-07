const fs = require('fs');
const path = require('path');
const db = require("../api/database/models");


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
