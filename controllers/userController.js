const User = require('../models/user');


module.exports.showRegister = (req,res) =>{
    res.render('users/register')
};

module.exports.register = async(req,res) =>{
    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const regUser = await User.register(user,password);
    req.flash('success', "Welcome to ParkCenter");
    res.redirect('/parks')
    } catch(e){
    req.flash('error', e.message);
    res.redirect('/register');
    }
};

module.exports.showLogin = (req,res) =>{
    res.render('users/login');
};

module.exports.login = (req,res) =>{
    req.flash('success', 'Welcome back!');
    res.redirect('/parks');

}

module.exports.logout = (req,res, next) =>{
    req.logout(function (err) {
        if (err){
            return next(err);
        }
        req.flash('success', 'Successfully logged out');
        res.redirect('/parks');
    });
}