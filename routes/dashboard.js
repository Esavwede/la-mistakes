var express = require('express');
var router = express.Router();
const passport = require('passport')



//******************************AUTHENTICATION ZONE *************************************************** */
const ensureAuthenticated = (req, res, next)=>{
    if( req.isAuthenticated())
    {
        return next();
    }
  
    res.redirect('/lamistakes/login')
  }
  
  
  /* GET dashboard page. */
  router.get('/dashboard',ensureAuthenticated,function(req, res, next) {
    const flash = req.flash()
    const errors = flash.error || []
    const success = flash.success || [] 
    const username = req.app.locals.username
        res.render('dashboard',{ errors, success, username})
  });
  
  


module.exports = router;
