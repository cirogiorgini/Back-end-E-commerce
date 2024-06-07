const express = require('express');
const handlebars = require('express-handlebars');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
const sessionMiddleware = require('./session/mongoStorage');
const passport = require('passport');
const mongoose = require('mongoose'); 
const viewsRouter = require('./routes/home.router');
const mockingRouter = require('./routes/mocks.router');
const productsRouter = require('./routes/products.router');
const ProductController = require('./controller/ProductController');
const UserController = require('./controller/UserController');
const UserService = require('./service/UserService');
const cartRouter = require('./routes/cart.router');
const sessionRouter = require('./routes/session.router');
const { dbName, mongoUrl } = require('./dbConfig')
const { errorHandler } = require('./service/errors/errorHandler');
const initializeStrategy = require('./config/passport.config');
const githublogin = require('./config/passport.github');
require('dotenv').config();

const app = express();

// Crear el servidor HTTP
const httpServer = createServer(app); 
const io = new Server(httpServer); 

// Configurar handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.set('ProductController', ProductController);
app.set('UserController', UserController);
app.set('UserService', UserService);

// Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../public`));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(errorHandler);

// Session middleware
app.use(sessionMiddleware);

// Passport middleware
githublogin();
initializeStrategy();
app.use(passport.initialize());
app.use(passport.session());

// RutaR
app.use('/', viewsRouter);
app.use('/', mockingRouter);
app.use('/api', productsRouter);
app.use('', sessionRouter);
app.use('/api', cartRouter);

// Conectar a la base de datos y preparar gestores
const main = async () => {
    await mongoose.connect(mongoUrl, {
        dbName: dbName
    });
    app.listen(8080);

    console.log('http://localhost:8080');
}

main();
module.exports = app;
