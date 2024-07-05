const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'E-commerce API',
      description: 'API para la gestión de productos y carritos en un e-commerce.',
    },
    servers: [
        {
          url: 'http://localhost:8080/api',
          description: 'Servidor local',
        },
      ],
  },
  apis: [path.join(__dirname, '../docs/**/*.yaml')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
