const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('flash');
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

// Starters

const app = express();

// Settings

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs',
    helpers: require('.lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares

app.use(session({
    secret: 'artelibremysqlsession',
    resave: 'false',
    saveUninitialized: 'false',
    store: new MySqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extends: false}));
app.use(express.jason());
app.use(passport.initialize());
app.use(passport.session());

// Globals

app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Routes

app.use(require('./routes/index.js'));

// Static files 

app.use(express.static(path.join(__dirname, 'public')));

// Listening the server

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

