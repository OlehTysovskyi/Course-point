const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Online Learning Platform API',
            version: '1.0.0',
            description: 'Документація API для онлайн-курсів'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5001}/api`,
                description: 'Локальний сервер'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                RegistrationRequest: {
                    type: 'object',
                    required: ['_id', 'name', 'email', 'role', 'status', 'createdAt'],
                    properties: {
                        _id: {
                            type: 'string',
                            example: '60d5ec49fc13ae3c28000001'
                        },
                        name: {
                            type: 'string',
                            example: 'Іван Іваненко'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'ivan@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['student', 'teacher'],
                            example: 'student'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'approved', 'completed'],
                            example: 'pending'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-05-07T12:34:56.789Z'
                        }
                    }
                },
                Course: {
                    type: 'object',
                    required: ['_id', 'title', 'description', 'teacher', 'published', 'createdAt', 'updatedAt'],
                    properties: {
                        _id: {
                            type: 'string',
                            example: '60d5ef12fc13ae3c28000005'
                        },
                        title: {
                            type: 'string',
                            example: 'JavaScript Basics'
                        },
                        description: {
                            type: 'string',
                            example: 'Вступ до основ JavaScript'
                        },
                        teacher: {
                            type: 'object',
                            properties: {
                                _id: { type: 'string', example: '60d5eeb2fc13ae3c28000003' },
                                name: { type: 'string', example: 'Олена Петрівна' },
                                email: { type: 'string', format: 'email', example: 'olena@example.com' }
                            }
                        },
                        lessons: {
                            type: 'array',
                            items: { type: 'string', example: '60d5ef99fc13ae3c28000007' }
                        },
                        modules: {
                            type: 'array',
                            items: { type: 'string', example: '60d5f012fc13ae3c28000009' }
                        },
                        published: {
                            type: 'boolean',
                            example: false
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-05-07T12:45:00.123Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-05-07T12:45:00.123Z'
                        }
                    }
                },
                Lesson: {
                    type: 'object',
                    required: ['_id', 'title', 'content'],
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        content: { type: 'string' },
                        videoUrl: { type: 'string' },
                        images: { type: 'array', items: { type: 'string' } },
                        questions: { type: 'array', items: { type: 'object' } },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Module: {
                    type: 'object',
                    required: ['_id', 'title'],
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        lessons: { type: 'array', items: { type: 'string' } },
                        questions: { type: 'array', items: { type: 'object' } },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                }

            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
