var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID

const ensureAuthenticated = (req, res, next)=>{
  if( req.isAuthenticated())
  {
      return next();
  }

  res.redirect('/lamistakes/login')
}


/* GET users listing. */
router.get('/lamistakes/createPost',ensureAuthenticated, function(req, res, next) {
    const flash = req.flash()
    const errors = flash.error || []
    const success = flash.success || []
  res.render('createPost',{ errors , success });
});



router.post('/lamistakes/createPost', function(req, res, next) {
    const posts = req.app.locals.posts
    const { title, content }= req.body
    const date = new Date().toISOString()
    const author = req.app.locals.username 
    


    posts.insertOne({title, content, author,  date, views: 0 })
    .then(()=>{
      req.flash('success','post created successfully')
      res.redirect('/lamistakes/dashboard')
    })
    .catch(()=>{
      req.flash('error',' error occured while creating post')
      res.redirect('/lamistakes/createPost')
    })
  });


  
/* GET users posts */
router.get('/lamistakes/posts', function(req, res, next) {

    const posts = req.app.locals.posts

    posts
    .find({ })
    .toArray()
    .then( posts =>
        
        res.render('posts',{ posts })
    )

});//


//
/* GET specific post *////
router.get('/lamistakes/post/:id', function(req, res, next) {
  
  const posts = req.app.locals.posts
  
  const id = ObjectID(req.params.id)
  console.log(id)
  posts
  .findOne({ _id: id })
  .then( post =>
      
      res.render('post',{ post })
  )
//
});

  

module.exports = router;
