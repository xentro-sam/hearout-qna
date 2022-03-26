const User = require('../models/user');

module.exports.renderRegister = (req,res) => {
    res.render('users/register');
};

module.exports.register = async(req,res,next) => {
    try {
        const {username,branch,degree,graduationYear,password} = req.body;
        const user = new User({username,branch,degree,graduationYear});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success','Welcome to HearOut!');
            res.redirect('/questions');
        });
    }
    catch(e) {
        req.flash('error',e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req,res) => {
    res.render('users/login');
};

module.exports.login = (req,res) => {
    req.flash('success','Welcome back!');
    const redirectUrl = req.session.returnTo || '/questions';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success','Goodbye!');
    res.redirect('/questions');
};

module.exports.renderEdit = async(req,res) => {
    res.render('users/edit');
};

module.exports.updateUser = async(req,res) => {
    const user = await User.findByIdAndUpdate(req.user._id,{...req.body.user});
    req.flash('success','Successfully updated User Details!');
    res.redirect('/questions');
}