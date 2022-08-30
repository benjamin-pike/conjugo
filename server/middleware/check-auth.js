const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = (req, res, next) => {
    try{
        const token = req.headers["authorization"].split(" ")[1]    
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err){

                if (err instanceof jwt.TokenExpiredError){
                    return res.status( 403 ).send({ message: "token expired" })
                } 
                return res.sendStatus(403)
            }

            req.body.id = user.id
            req.body.username = user.username

            next()
        })
    }

    catch(err){
        return res.sendStatus(401)
    }
}