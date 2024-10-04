const {verifyJwt} = require("../helpers/jwt");

const isAuthorized = (req,res,next)=>{
    const token = req.headers.authorization;
    if(verifyJwt(token)) return next();
    else return res.json([]);
}

module.exports = {
    isAuthorized
};