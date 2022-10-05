const verify = {
   

    checkGetUsers: (req,resp,next) =>{

        const token = req.tokens

        
            if(token.role==='GOD'|| token.role==='ADMIN')
            {
                next();
            }
            else
            {
                if(token.id == req.params.id || token.id == req.params.userId)
                {
                    next();
                }
                else
                {
                    resp.status(403).json({message : "acceso no autorizado"});
                }
            }
      
    },

    checkUpdateGeneral: (req,resp,next) => {

        if (req.tokens.role==='GOD' || req.tokens.role==='ADMIN')
        {
            next();
        }
        else
        {
            resp.status(403).json({message : "acceso no autorizado"});
        }

    },

    checkUpdateUser: (req,resp,next) => {

        const token = req.tokens

            if(token.role === 'GOD')
            {
                next();
            }
            else{
                if(token.id == req.params.id || token.id == req.params.userId)
                {
                    next();
                }
                else
                {
                    resp.status(403).json({message : "acceso no autorizado"});
                }
            }

    }
    
}
module.exports = verify