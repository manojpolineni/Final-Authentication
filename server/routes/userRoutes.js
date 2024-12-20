import express from 'express';
import { userRegister, userLogin, userLogOut,sendVerifyOtp, verifyEmail, getAllUsers, getSingleUser, isAuthenticated, forgotPassowrd, resetPassword, deleteUser, updateUser } from '../controllers/userController.js';
import { validateToken } from '../middleware/authenticateToken.js';

const router= express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/forgot-password", forgotPassowrd);
router.post("/resetpassword", resetPassword);

//auth user and email, otp verification route
router.post("/sendmail", validateToken, sendVerifyOtp);
router.post('/verifyuser', validateToken, verifyEmail);

//isauth Route
router.get('/is-auth', validateToken, isAuthenticated);

//user logout route
router.post("/logout", validateToken, userLogOut);

//delete  user Account
router.post('/deleteaccount', validateToken, deleteUser);

//get all users
router.get("/allusers", validateToken, getAllUsers);

//gey single user
router.get("/currentuser", validateToken, getSingleUser );

//updated user details
router.put("/updateuser", validateToken, updateUser );

export default router;