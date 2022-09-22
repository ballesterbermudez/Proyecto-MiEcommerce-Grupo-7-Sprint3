const fs = require('fs')
const path = require('path');


const persistence = {
    readDB:  (dataFile) => {
        
        const userDirectory = path.resolve(__dirname, "..", "data", dataFile);
        
        return JSON.parse(fs.readFileSync(userDirectory, "utf-8"));
      },
      
    findByIdDB : (dataFile, id) => {
        const userDirectory = path.resolve(__dirname, "..", "data", dataFile);
        
        const data = JSON.parse(fs.readFileSync(userDirectory, "utf-8"));
        return data.find((ele) => ele.id == id);
      },
    
    writeDB : (dataFile, arr) => {
        const userDirectory = path.resolve(__dirname, "..", "data", dataFile);
        fs.writeFileSync(userDirectory, JSON.stringify(arr));
      },

      //Prerrequisito el debe existir en el datafile
    updateDB: (datafile, el) => {

        
        let data = persistence.readDB(datafile)

        let newData = data.map(element => {
            let aux;
            if (element.id == el.id) {
               aux = el;
            } else {
               aux = element;
            }
            return aux;})
        
            persistence.writeDB(datafile,newData);

    },
    
    removeFromDB: (datafile, id) =>{

        let data = persistence.readDB(datafile);
        let newData = data.filter(el => el.id != id)
        persistence.writeDB(datafile,newData);
    }

    
}

module.exports = persistence;