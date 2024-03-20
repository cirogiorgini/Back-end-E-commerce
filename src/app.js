const express = require('express');
const handlebars = require('express-handlebars');
const { createServer } = require('http');
const { Server } = require('socket.io');
const viewsRouter = require('./routes/home.router');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const realTimeProducts = require('./routes/realTimeProducts');
const bodyParser = require('body-parser');


const app = express();

// Crear el servidor HTTP
const httpServer = createServer(app); // Cambio en la inicialización del servidor
const io = new Server(httpServer); // Crear instancia de socket.io y pasarle el servidor HTTP

//config handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../public`));
app.use(express.urlencoded({ extended: true }));

app.use('/', viewsRouter);
app.use('/', realTimeProducts);
app.use('/', productsRouter);
app.use('/', cartRouter)

// Configurar WebSockets
io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado via WebSocket con id ${socket.id}`);
});

// Asignar el objeto io al app para que esté disponible en otros archivos
app.set('io', io);

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});


module.exports = app;
