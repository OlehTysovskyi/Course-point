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

                UserInput: {
                    type: 'object',
                    required: ['name', 'email', 'password', 'role'],
                    properties: {
                        name: {
                            type: 'string',
                            example: 'Олена Петрівна'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'olena@example.com'
                        },
                        password: {
                            type: 'string',
                            example: 'securePass123!'
                        },
                        role: {
                            type: 'string',
                            enum: ['student', 'teacher', 'admin'],
                            example: 'teacher'
                        }
                    }
                },
                User: {
                    type: 'object',
                    required: ['_id', 'name', 'email', 'role', 'createdAt'],
                    properties: {
                        _id: {
                            type: 'string',
                            example: '60d5eeb2fc13ae3c28000003'
                        },
                        name: {
                            type: 'string',
                            example: 'Олена Петрівна'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'olena@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['student', 'teacher', 'admin'],
                            example: 'admin'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-05-07T12:45:00.123Z'
                        }
                    }
                },

                CourseInput: {
                    type: 'object',
                    required: ['title', 'description'],
                    properties: {
                        title: {
                            type: 'string'
                        },
                        description: {
                            type: 'string'
                        },
                        lessons: {
                            type: 'array',
                            items: { type: 'string' },
                            example: []
                        },
                        modules: {
                            type: 'array',
                            items: { type: 'string' },
                            example: []
                        },
                        published: {
                            type: 'boolean',
                            example: false
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

                ContentBlock: {
                    type: 'object',
                    required: ['id', 'type'],
                    properties: {
                        id: {
                            type: 'string',
                            example: '550e8400-e29b-41d4-a716-446655440000'
                        },
                        type: {
                            type: 'string',
                            enum: ['heading', 'paragraph', 'list', 'quote', 'code', 'video', 'image', 'quiz'],
                            example: 'paragraph'
                        },
                        level: {
                            type: 'integer',
                            description: 'Рівень заголовка (для type=heading)',
                            example: 2
                        },
                        text: {
                            type: 'string',
                            description: 'Текст для paragraph|heading|quote',
                            example: 'Це приклад абзацу.'
                        },
                        items: {
                            type: 'array',
                            description: 'Пункти списку (для type=list)',
                            items: { type: 'string' },
                            example: ['Пункт 1', 'Пункт 2']
                        },
                        code: {
                            type: 'string',
                            description: 'Код (для type=code)',
                            example: "console.log('Hello');"
                        },
                        url: {
                            type: 'string',
                            description: 'Посилання на відео (для type=video)',
                            example: 'https://youtu.be/xyz'
                        },
                        images: {
                            type: 'array',
                            description: 'URL зображень (для type=image)',
                            items: { type: 'string' },
                            example: ['https://.../img1.png']
                        },
                        question: {
                            type: 'string',
                            description: 'Питання (для type=quiz)',
                            example: 'Що таке JavaScript?'
                        },
                        answers: {
                            type: 'array',
                            description: 'Варіанти відповідей (для type=quiz)',
                            items: { type: 'string' },
                            example: ['Мова програмування', 'Бібліотека', 'Фреймворк']
                        },
                        correctIndex: {
                            type: 'integer',
                            description: 'Індекс правильної відповіді (для type=quiz)',
                            example: 0
                        }
                    }
                },

                LessonInput: {
                    type: 'object',
                    required: ['title', 'blocks'],
                    properties: {
                        title: {
                            type: 'string',
                            example: 'Вступ до JavaScript'
                        },
                        blocks: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/ContentBlock' },
                            example: [
                                {
                                    id: '550e8400-e29b-41d4-a716-446655440000',
                                    type: 'heading',
                                    level: 2,
                                    text: 'Що таке JavaScript?'
                                },
                                {
                                    id: '660e8400-e29b-41d4-a716-446655440001',
                                    type: 'paragraph',
                                    text: 'JavaScript — це мова програмування для вебу.'
                                }
                            ]
                        }
                    }
                },

                Lesson: {
                    type: 'object',
                    required: ['_id', 'title', 'blocks', 'createdAt'],
                    properties: {
                        _id: {
                            type: 'string',
                            example: '60d5f012fc13ae3c28000009'
                        },
                        title: {
                            type: 'string',
                            example: 'Вступ до JavaScript'
                        },
                        blocks: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/ContentBlock' }
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-05-10T14:20:00.000Z'
                        }
                    }
                },

                ModuleQuestion: {
                    type: 'object',
                    required: ['question', 'answers', 'correctAnswers'],
                    properties: {
                        question: {
                            type: 'string',
                            example: 'Яке ключове слово використовується для оголошення змінної в JavaScript?'
                        },
                        answers: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['var', 'let', 'const', 'function']
                        },
                        correctAnswers: {
                            type: 'array',
                            items: { type: 'integer' },
                            description: 'Індекс(и) правильних відповідей у масиві answers',
                            example: [1, 2]
                        },
                        multiple: {
                            type: 'boolean',
                            description: 'Чи може бути більше однієї правильної відповіді',
                            example: true
                        }
                    }
                },

                // Схема вхідних даних для POST/PUT /modules
                ModuleInput: {
                    type: 'object',
                    required: ['title', 'course', 'graded'],
                    properties: {
                        title: {
                            type: 'string',
                            example: 'Контрольний модуль з JavaScript'
                        },
                        course: {
                            type: 'string',
                            description: 'ID курсу',
                            example: '60d5ef12fc13ae3c28000005'
                        },
                        lessons: {
                            type: 'array',
                            items: { type: 'string' },
                            example: []
                        },
                        graded: {
                            type: 'boolean',
                            description: 'Чи впливає модуль на оцінку',
                            example: true
                        },
                        grade: {
                            type: 'number',
                            description: 'Вага модуля (максимальна кількість балів)',
                            example: 10
                        },
                        questions: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/ModuleQuestion' },
                            example: [
                                {
                                    question: 'Що таке замикання?',
                                    answers: ['Scope', 'Closure', 'Callback'],
                                    correctAnswers: [1],
                                    multiple: false
                                }
                            ]
                        }
                    }
                },

                // Повна відповідь від GET
                Module: {
                    type: 'object',
                    required: ['_id', 'title', 'course', 'graded', 'createdAt'],
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        course: { type: 'string', description: 'ID курсу' },
                        lessons: { type: 'array', items: { type: 'string' } },
                        graded: { type: 'boolean' },
                        grade: { type: 'number' },
                        questions: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/ModuleQuestion' }
                        },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Progress: {
                    type: 'object',
                    required: ['user', 'course', 'grade', 'createdAt'],
                    properties: {
                        _id: { type: 'string' },
                        user: { type: 'string' },
                        course: { type: 'string' },
                        completedLessons: { type: 'array', items: { type: 'string' } },
                        passedModules: { type: 'array', items: { type: 'string' } },
                        grade: { type: 'number' },
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
