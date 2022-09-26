const persistance = require('../persistence/persistence')

module.exports = (req, res, next) => {
    if(!persistance.searchById(User, req.params.id)){
        res.status(404).json({
            ok: false,
            msg: 'No hay usuarios con el id ' + req.params.id,
        })
    }

}