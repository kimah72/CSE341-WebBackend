const swaggerAutogen = require('swagger-autogen')();

// Determine host based on environment
const isProduction = process.env.NODE_ENV === 'production';
const host = isProduction
  ? 'cse341-webbackend.onrender.com/task-manager-api'
  : 'localhost:5000';
const schemes = isProduction ? ['https'] : ['http'];

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/taskRoutes.js'];

const doc = {
  info: {
    title: 'Task Manager API',
    description: 'API for managing tasks with CRUD operations',
    version: '1.0.0',
  },
  host: host,
  basePath: '/api',
  schemes: schemes,
  definitions: {
    Task: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Test Task',
        },
        description: {
          type: 'string',
          example: 'Testing POST with Postman',
        },
        status: {
          type: 'string',
          example: 'pending',
        },
        dueDate: {
          type: 'string',
          example: '2025-05-30',
        },
      },
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON generated for:', host);
}).catch(err => {
  console.error('Error generating Swagger JSON:', err);
});