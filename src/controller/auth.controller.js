import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebToken";
import config from "../config/config.js";

 export async function register(req,res){
    const{username,email,password}= req.body;
    const isAlreadyRegisterd =await userModel.findOne({
        $or:[
            {username},
            {email}
        ]

    })
    if (isAlreadyRegisterd){
        res.status(409).json({
            message:"Username or email is already existed"
        })
    }
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user =await userModel.create({
        username,
        email,
        password:hashedPassword
    })
    const token =jwt.sign({
        id:user._id

    },config.JWT_SCERET_KEY)
    {
        expiresIn:"1d"
    }
    res.status(201).json({
    message:"user registered successfully",
    user:{
        username:user.username,
        email:user.email
    }
})
}


export async function getall(req, res){
    const user =await userModel.find();
    res.status(200).json({
         success: true,
         count: user.length,
         data: user
      });
}
export async function getone(req, res) {
   try {
      const user = await userModel.findOne({
         username: req.body.username
      });

      if (!user) {
         return res.status(404).json({
            message: "User not found"
         });
      }

      res.status(200).json({
         message: "User found successfully",
         user
      });

   } catch (error) {
      res.status(500).json({
         message: error.message
      });
   }
}
export async function updateUser(req, res) {
   try {
      const user = await userModel.findOneAndUpdate(
         { username: req.body.username }, 
         {
            email: req.body.email,
            password: req.body.password
         }, 
         { new: true } 
      );

      if (!user) {
         return res.status(404).json({
            message: "User not found"
         });
      }

      res.status(200).json({
         message: "User updated successfully",
         user
      });

   } catch (error) {
      res.status(500).json({
         message: error.message
      });
   }
}
export async function deleteUser(req, res) {
   try {
      const user = await userModel.findOneAndDelete({
         username: req.body.username
      });

      if (!user) {
         return res.status(404).json({
            message: "User not found"
         });
      }

      res.status(200).json({
         message: "User deleted successfully",
         user
      });

   } catch (error) {
      res.status(500).json({
         message: error.message
      });
   }
}