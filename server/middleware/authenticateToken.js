import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const validateToken = async (req, res, next)=>{
      try {
            // const authHeader = req.headers.authorization;
            // const token = req.cookies.token;
            const token = req.cookies.token;

            // console.log('token', token);

            if(!token){
                  return res.status(400).json({success:false, message:"Access token  is missing or invalid! "})
            }
            // if(!authHeader || !authHeader.startswith("Bearer")){
            //       return res.status(401).json({message:'Access token is missing or invalid'})
            // }
            // const accessToken= authHeader.split(" ")[1];
            
            //verify the token 

            const decode= jwt.verify(token, process.env.MY_SECRETE_TOKEN);
            req.user= decode.user;

            //process to the next middleware ot route handle
            next();

      } catch (error) {
            if(error.name === "JsonwebTokenError"){
                  return res.status(401).json({message:' Invalide accessToken or Token expired'})
            }
            if (error.name === "TokenExpiredError") {
                  return res
                    .status(401)
                    .json({ success: false, message: "Access token has expired" });
            }
            console.error("Token validation err:", error.message);
            return res.status(500).json({message:' Token verification failed'});
      }
};