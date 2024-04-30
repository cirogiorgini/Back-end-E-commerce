const express = require('express');
const handlebars = require('express-handlebars');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser'); // Importa cookie-parser
const viewsRouter = require('./routes/home.router');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const realTimeProducts = require('./routes/realTimeProducts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { dbName, mongoUrl } = require('./dbConfig')
const ProductManager = require('./dao/dbManager/productManager');
const CartManager = require('./dao/dbManager/cartManager');
const UserManager = require('./dao/dbManager/userManager');
const sessionRouter = require('./routes/session.router');
const sessionMiddleware = require('./session/mongoStorage');
const passport = require('passport');
const initializeStrategy = require('./config/passport.config');
const app = express();

// Crear el servidor HTTP
const httpServer = createServer(app); 
const io = new Server(httpServer); 

// Configurar handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser()); // Usar cookie-parser
app.use(sessionMiddleware);
app.use(express.static(`${__dirname}/../public`));
app.use(express.urlencoded({ extended: true }));

//passport
initializeStrategy();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', viewsRouter);
app.use('/', realTimeProducts);
app.use('/', productsRouter);
app.use('/', cartRouter);
app.use('/', sessionRouter);

const main = async () => {
    await mongoose.connect(mongoUrl, {
        dbName: dbName
    });

    const userManager = new UserManager();
    await userManager.prepare();
    app.set('userManager', userManager);

    const productManager = new ProductManager();
    await productManager.prepare();
    app.set('productManager', productManager);

    const cartManager = new CartManager();
    await cartManager.prepare();
    app.set('cartManager', cartManager);

    app.listen(8080);

    console.log('http://localhost:8080');
}

main();
module.exports = app;
