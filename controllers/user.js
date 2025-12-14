const listings = require('../models/listing.js');
const User=require("../models/user.js");


module.exports.renderSignupForm=(req,res)=>{
  res.render("users/signup.ejs");
}

module.exports.signup=async (req,res)=>{
  try{
  let {username,email,password}=req.body;
  const user=new User({username,email});
  const registeredUser=await User.register(user,password);

  console.log(registeredUser);
  req.login(registeredUser,function(err){
    if(err){ return next(err);}
    req.flash("success","Welcome to Listing App!");
  res.redirect('/listings');
  
  }
  );

  }catch(e){
    req.flash("error",e.message);
    res.redirect('/signup');
  }
}
module.exports.renderLoginForm=(req,res)=>{
  res.render("users/login.ejs");

}
module.exports.login=(req, res) => {
    req.flash('success', 'Welcome back!');
    
    res.redirect(res.locals.redirectUrl || '/listings');
  };
  module.exports.logout=(req,res,next)=>{
  req.logout(function(err){
    if(err){return next(err);}
    
    req.flash("success","logged out successfully");
    res.redirect('/listings');
  });
}