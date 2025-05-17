const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for managing contacts',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
      {
        url: 'https://cse341-webbackend.onrender.com',
        description: 'Production server',
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Scan routes and controllers for JSDoc
};

const specs = swaggerJsdoc(options);

module.exports = specs;
