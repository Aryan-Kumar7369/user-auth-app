if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}


const express = require('express')
const app = express()
const port = process.env.PORT
const path = require('path')
const bcrypt = require('bcrypt')
const { name } = require('ejs')
const initializePassport = require("./passport.config")
const passport = require('passport')
const flash = require("express-flash")
const session = require("express-session")


initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)


const users = []

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.use(express.static(path.join(__dirname,'src')));
app.use('/images', express.static(__dirname + 'src/images'))


app.use(express.urlencoded({extended: false}))

// login functionality
app.post('/login', checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))



// register functionality
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    })

    console.log(users);
    res.redirect("/login")
  } catch (error) {
    console.log(error);
    res.redirect("/register")
  }
})

// Logout Functionality

app.post('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  })
})


app.get('/', checkAuthenticated, (req, res) => {
  res.render('dashboard.ejs',{name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('user_login.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('user_register.ejs')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Checking Authentication

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  next()
}
