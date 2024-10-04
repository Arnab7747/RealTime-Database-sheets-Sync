require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const payload = {
    "Developer_name": "User",
    "Developer_email": "user@gmail.com",
}

const token = jwt.sign(payload,secret,{
    expiresIn:"30d"
});

console.log(token);
const isVerified = jwt.verify(token,secret);
console.log(isVerified);

const generateToken = () => {
    const token = jwt.sign(payload,secret,{
        expiresIn:"7d"
    });

    return token;
}

const verifyJwt = (token) =>{
    try {
        const data = jwt.verify(token,secret);
        if(data) return true;
        else return false;
    } catch (error) {
        return false;
    }
};

module.exports = {
    verifyJwt,
    generateToken
};