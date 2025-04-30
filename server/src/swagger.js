const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Online Learning Platform API',
            version: '1.0.0',
            description: 'Документація API для онлайн-курсів',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
            },
        ],
        components: {
            // у definition.components додай:
            components: {
                schemas: {
                    RegistrationRequest: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            name: { type: 'string' },
                            email: { type: 'string', format: 'email' },
                            role: { type: 'string', enum: ['student', 'teacher'] },
                            status: { type: 'string', enum: ['pending', 'approved', 'completed'] },
                            createdAt: { type: 'string', format: 'date-time' }
                        }
                    }
                },
                /* securitySchemes, etc. */
            },

            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
