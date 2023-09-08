const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const userController = require('../controllers/userController');



router.get('/register', userController.showRegister)
router.post('/register', catchAsync(userController.register));

router.get('/login', userController.showLogin)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.login)

router.get('/logout', userController.logout)
module.exports = router;