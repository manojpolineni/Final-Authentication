import User from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import useragent from 'useragent';
import geoip from 'geoip-lite';
import Joi from 'joi';
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";
dotenv.config();



//User Register
export const userRegister = async (req, res) => {
  const { userName, email, password } = req.body;

  const schema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    // phone: Joi.string().pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(6).required(),
  });

  const {error} = schema.validate(req.body);
   if(error){
    return res.status(400).json({message:error.details[0].message})
   }

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res
        .status(400)
        .json({ message: "User email is already exist! Please Login" });
    }

    const hasPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hasPassword,
      // phone,
    });

    const token = jwt.sign({id: user._id}, process.env.MY_SECRETE_TOKEN, {expiresIn: '2d'});

    

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
      maxAge:  2 * 24 * 60 * 60 * 1000, //expires in 2 days 
    })

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Mastan IT Solutions",
      text: `Welcome to Mastan IT Solutions Website. Your Account has been created with email id: ${email}`
    }
 
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success:true,
      _id: user.id,
      email: user.email,  
      message: "User Created successfully",
     
    });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


// User Login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const {error} = schema.validate(req.body);
  if(error){
    return res.status(400).json({success:false, message: error.details[0].message})
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User Email is not Found! Please Register" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({success:false, message: " Password doesn't Match! try again" });
    }

    const accessToken = jwt.sign(
      {
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
        },
      },
      process.env.MY_SECRETE_TOKEN,
      { expiresIn: "2d" }
    );

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
      maxAge:  7 * 24 * 60 * 60 * 1000, //Expires in 7 days 
    })

    //capture IP Address
    const IPAddress= req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    //Capture Device Details
    const agent = useragent.parse(req.headers['user-agent']);
    const device ={
      browser: agent.family || "Unknown Browser",
      version: agent.major || "Unknown Version",
      os: agent.os.family || "Unknown OS",
      device: agent.device.family || "Unknown Device",
    };

    //Capture User Location
    const location = geoip.lookup(IPAddress);

    return res.status(200).json({
      success:true,
      message: "User login Successfully",
      data:{
        id:user._id,
        token: accessToken,
        device,
        ip: IPAddress,
        location: location || null,
      }
    })

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//user Logout
export const userLogOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    await User.findByIdAndUpdate(userId, {isAccountVerified:false})

    return res.json({ success: true, message: "Logout successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res)=>{
  const userId = req.user.id;
  const user = await User.findById(userId);
  if(!user){
    return res.status(401).json({success:false, message: "user not found!"});
  }
  try {
    if(user.isAccountVerified){
      return res.status(400).json({success:false, message: "user already verified!"})
    }

    const otp = String(Math.floor(100000 +  Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption ={
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      // text: `Your OTP is ${otp}. Verify your account using this OTP. `
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)    
    }

    await transporter.sendMail(mailOption);

    res.json({success:true, message: "Verification OTP  Send on Email" });
    
  } catch (error) {
    return res.status(500).json({success:false, message: error.message});
  }
}


//Verify the Email using the OTP
export const verifyEmail = async (req, res) => {
  const userId = req.user.id;
  const {otp} = req.body;

  if(!otp){
    return res.status(400).json({success:false, message: "Missing Details"});
  }
  const user = await User.findById(userId);

  if(!user) {
    return res.status(400).json({success:false, message: "User  Not Found!"})
  }
  try {

    if(user.verifyOtp === '' || user.verifyOtp !== otp){
      return res.status(400).json({success:false, message : "Invalid  OTP"})
    }
    if(user.verifyOtpExpireAt < Date.now()){
      return res.json({success : false, message: "OTP Expired"});
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({success:true, message: "email is verified"});
    
  } catch (error) {
    return res.status(500).json({success:false, message: error.message});
  }
}

export const isAuthenticated = async (req, res)=>{
  try {
    return res.status(200).json({success:true})
    
  } catch (error) {
    return res.status(500).json({success:false, message: error.message});
  }
}

//forgot password
export const forgotPassowrd = async (req, res) =>{
  const {email} = req.body;
  if(!email) {
    return res.status(400).json({success:false, message: "Email is required!"})
  }
  try {
    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({success:false, message: "user Not  found"})
    };

    const otp = String(Math.floor(100000 +  Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() +  15 * 60 * 1000;

    await user.save();

    const mailOption ={
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: " Password Reset OTP",
      // text: `Your OTP for resetting your password is ${otp}. Use this OTP to produce with resetting your password.`
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    }

    await transporter.sendMail(mailOption);

    return res.json({success:true, message: "OTP sent your Email "})
    
  } catch (error) {
    return res.status(500).json({success:false, message: error.message});
  }
}

//reset password endpoint
export const resetPassword = async (req, res) =>{
  const {email, otp, newPassword} = req.body;

  if(!email  || !otp || !newPassword){
    return res.json({success:false, message: "email, OTP and newPassword is Required"});
  }

  try {
    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({success:false, message: "user not found"});
    }

    if(user.resetOtp === "" || user.resetOtp !== otp){
      return es.status(400).json({message: "invalid otp"});
    }
    if(user.resetOtpExpireAt < Date.now()){
      return res.status(400).json({success:false,  message: "otp expired"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({success:true, message: " Password Reset Successfully" })
    
  } catch (error) {
    return res.status(500).json({success:false, message:  error.message});
  }
}

// get AllUsers
export const getAllUsers = async (req, res) => {
  const users = await User.find();
  return res.status(200).json({ users });
};

//Get Single User
export const getSingleUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: " USer not Found!" });
    }

    const address = user.address.length > 0 ? user.address[0] : {};

    const singleUser = {
      id: user._id,
      userName: user.userName,
      verifiedUser : user.isAccountVerified,
      email: user.email,
      profilePic: user.profilePic,
      gender: user.gender,
      phone: user.phone,
      address: {
        city: address.city || "",
        area: address.area || "",
        district: address.district || "",
        pinCode: address.pinCode || "",
        state: address.state || "",
        County: address.country || "",
      },
    };
    return res.status(200).json({success:true, singleUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//update user
export const updateUser = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(400).json({ message: "User Not found!" });
  }

  try {
    const { userName, email, address, gender, phone, city } = req.body;

    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;

    if (address) {
      if (!user.address) user.address = {}; // Ensure the address object exists
      user.address = {
        city: address.city || "",
        area: address.area || user.address.area || "",
        district: address.district || user.address.district || "",
        pinCode: address.pinCode || user.address.pinCode || "",
        state: address.state || user.address.state || "",
        country: address.country || user.address.country || "",
      };
    }

    await user.save();

    return res
      .status(200)
      .json({success:true, message: "User Updated Successfully", user });
  } catch (error) {
    return res.status(500).json({ success:false, message: error.message });
  }
};

//delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export default {
  userRegister,
  userLogin,
  userLogOut,
  getAllUsers,
  getSingleUser,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  forgotPassowrd,
  resetPassword,
  updateUser,
  deleteUser
};
