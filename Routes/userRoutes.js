// const {registerUser,loginUser,getProfile}=require("../Controllers/userController");
// const express= require("express");
// Router=express.Router();

// Router.route("/register")
// .post(registerUser)
// Router.route("/login")
// .post(loginUser)
// Router.route("/profile")
// .get(getProfile)


// module.exports=router;
import express from "express";
import { deleteUser, getSingleUser, getUserDetails, getUserList, loginUser, logoutUser, registerUser, requestPasswordReset, resetPassword, updatePassword, updateProfile, updateUserRole } from "../Controllers/userController.js";
import { roleBasedAcess, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router.route('/register')
  .post(registerUser)
router.route('/login')
  .post(loginUser)
router.route('/logout')
  .post(logoutUser)
router.route('/password/forgot')
  .post(requestPasswordReset)
router.route('/reset/:token')
  .post(resetPassword)


router.route('/profile')
  .post(verifyUserAuth, getUserDetails)
router.route('/password/update')
  .put(verifyUserAuth, updatePassword)
router.route('/profile/update')
  .put(verifyUserAuth, updateProfile)



router.route('/admin/users')
  .get(verifyUserAuth, roleBasedAcess('admin'), getUserList)

  
router.route('/admin/users/:id')
  .get(verifyUserAuth, roleBasedAcess('admin'), getSingleUser)
  .put(verifyUserAuth, roleBasedAcess('admin'), updateUserRole)
  .delete(verifyUserAuth, roleBasedAcess('admin'), deleteUser)







export default router;