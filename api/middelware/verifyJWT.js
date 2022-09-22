const jwt = require("jsonwebtoken");
const { request } = require("express");

const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

const verifyJWT = async(req = request, res, next) => {
  
  const token = extractToken(req);
  try {
    const  tokens = await jwt.verify(token, process.env.JSON_AUTH);
    req.tokens = tokens;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: "Token invalido",
    });
  }
};

module.exports = verifyJWT;
