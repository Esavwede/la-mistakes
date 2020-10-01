var express = require('express');
var router = express.Router();
const passport = require('passport')
const chalk = require('chalk')


/* GET home page. */
router.get('/lamistakes', function(req, res, next) { 
        res.render('index')
});


router.get('/lamistakes/about', function(req, res, next) {

    res.render('about')

});

router.get('/lamistakes/contact', function(req, res, next) {

  res.render('contact')

});

router.post('/lamistakes/contact', function(req, res, next) {

  const { name, email, phone, message } = req.body
  const messages = req.app.locals.messages

  messages.insertOne({ name, email, phone, message })
  .then(()=>{

    req.flash('success','We have received your message thanks for contacting us ')
    res.redirect('/lamistakes')
  })
  .catch(()=>{
    req.flash('error','Oops, please try again ')
    res.redirect('/lamistakes/contact')
  })

});

//////
/* GET login page. */
router.get('/lamistakes/login', function(req, res, next) {
  const flash = req.flash()
  const errors = flash.error || []
  const success = flash.success || [] 
  res.render('login',{ errors, success })
});


/* POST login page. */
router.post('/lamistakes/login',passport.authenticate('local',{ failureFlash: true, failureRedirect:'/lamistakes/login'}), function(req, res, next) {
      res.redirect('/lamistakes/dashboard')
});




/* GET registration page. */
router.get('/lamistakes/signup', function(req, res, next) {
  const flash = req.flash()
  const errors = flash.error || []
  const success = flash.success || []
  res.render('signup',{ errors, success })
});


/* POST registration page. */
router.post('/lamistakes/signup', function(req, res, next) {
  const users = req.app.locals.users 
  const newUser = req.body

  users.insertOne( newUser )
  .then(()=>{
    req.flash('success','registration successfull , login to get started ')
    res.redirect('/lamistakes/login')
  })
  .catch(()=>{
    req.flash('error','registration successfull , login to get started ')
    res.redirect('/lamistakes/signup')
  })
});








module.exports = router;
