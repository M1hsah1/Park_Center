const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/park-db');
const expressError = require('./utils/ExpressError');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local')
const User = require('./models/user');

const users = require('./routes/userRoute');
const parks = require('./routes/parkRoute');
const reviews = require('./routes/reviewRoute');
const flash = require ('connect-flash');


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const config = {
    secret : 'secretya',
    resave: false,
    saveUninitialized: true,
    cookie : {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(config))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', users);
app.use('/parks', parks);
app.use('/parks/:id/reviews', reviews)

app.get('/',(req,res)=> {
    res.render("home")
})




app.all('*',(req,res,next) =>{
    next(new expressError('Page Not Found', 404));
})
app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render('error', {err});

})
app.listen(3000, ()=>{
    console.log("PORT 3000");
})
