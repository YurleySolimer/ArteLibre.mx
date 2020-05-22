const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const passport = require('passport');
const { database } = require('./keys');
const multer = require('multer');


//Inicializaciones

const app = express();
require('./lib/passport');

//Configuraciones

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	layoutsDir: path.join(app.get('views'), 'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'),
	extname: '.hbs',
	helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares

//Middlewares

const storage = multer.diskStorage({
	destination: path.join(__dirname, 'public/uploads'),
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

app.use(multer({
	storage,
	dest: path.join(__dirname, 'public/uploads')
}).array('image')
); 



app.use(session({
	secret: 'artelibremysqlsession',
	resave: 'false',
	saveUninitialized: 'false',
	store: new MySqlStore(database)
}));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extends: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales

app.use((req, res, next) => {
	app.locals.success = req.flash('success');	
	app.locals.message = req.flash('message');
	app.locals.user = req.user;	
	next();
});

//Rutas

app.use(require('./routes/artelibre.js'));
app.use(require('./routes/artista.js'));
app.use(require('./routes/clientes.js'));
app.use(require('./routes/index.js'));
app.use(require('./routes/authentication.js'));



// Public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrapjs', express.static(path.join(__dirname , '/../node_modules/bootstrap/dist/js'))); // redirect bootstrap JS
app.use('/jquery', express.static(path.join(__dirname , '/../node_modules/jquery/dist'))); // redirect JS jQuery
app.use('/bootstrapcss', express.static(path.join(__dirname , '/../node_modules/bootstrap/dist/css'))); // redirect CSS bootstrap

//Inicializar Servidor

app.listen(app.get('port'), () => {
	console.log('Server on port', app.get('port'));
});