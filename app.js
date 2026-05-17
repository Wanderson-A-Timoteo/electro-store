var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/rotasIndex');
var usersRouter = require('./routes/users');

var session = require('express-session');
var flash = require('connect-flash');
var passport = require('./config/passport');

// Carrega Modelos
require('./model/modelos');

var app = express();

// --- CONFIGURAÇÃO DE PARTIALS ---
var hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'chave_secreta_electro_store',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// --- MIDDLEWARE GLOBAL PARA AS VIEWS ---
app.use(function(req, res, next) {
  res.locals.user = req.user || null;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
