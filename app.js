var createError = require('http-errors');
var express = require('express');
const session = require('express-session')
var MemoryStore = require('memorystore')(session)
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const chalk = require('chalk')
const nodemon = require('nodemon')
var compression = require('compression');
var helmet = require('helmet');
const utils = require('./utils')

/******************IMPORTING MONGODB MODULE INTO THE APPLICATION ***********************/
const MongoClient = require('mongodb').MongoClient

/******************IMPORTING AUTHENTICATION MODULES (Local Strategy) ************************************/
const passport = require('passport')
const LocalStrategy = require('passport-local')

const flash = require('connect-flash')

/*** At this point the application is set *** */




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashboardRouter = require('./routes/dashboard')
var postsRouter = require('./routes/posts')

var app = express();

app.use(compression()); //Compress all routes 
app.use(helmet());


// process.env.DB_CONNECTION
/************ create a connection to the mongodb database ********* */
MongoClient.connect(process.env.DB_CONNECTION,(err, client)=>{
  if(err)
  {
    console.log(chalk.red("error occured while connecting to the mongodb database "))
  }
  else
  {
    // get the database to connect to 
    const db = client.db('lamistakes')
    const users = db.collection('users')
    const posts = db.collection('posts')
    const messages = db.collection('messages')

    // make these collections available all round the application
    app.locals.users = users 
    app.locals.posts = posts
    app.locals.messages = messages 

    console.log(chalk.green("successfully connected to the database"))
  }
})///



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));


//*************CONFIGURING SECURITY PROTOCOLS ****/
app.use( flash())
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  
}))

app.use( passport.initialize())
app.use( passport.session())


passport.use(new LocalStrategy({passReqToCallback: true },(req, username, password, authCheckDone)=>{
  // connect to the users collection

        app.locals.users
        .findOne({ username })
        .then(user=>{

              if( !user )
              {
                  // if the username is incorrect 
                  return authCheckDone(null, false, req.flash('error','username incorrect'))
              }

              if( user.password !== utils.hashPassword(password) )
              {
                 // if the password is incorrect 
                 console.log(password)
                 console.log(user.password)
                 return authCheckDone(null, false, req.flash('error','password incorrect'))
              }


                  // if credentials are correct 
                   return authCheckDone(null, user)
        })
}))


// tell passport to store the id of the user 
passport.serializeUser((user, done)=>{
  done(null,{ id: user._id, username: user.username } )
})

// get the id of the user and throw user out 
passport.deserializeUser(( userData, done)=>{
  done(null, userData )
})//


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lamistakes',dashboardRouter)
app.use('/',postsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
