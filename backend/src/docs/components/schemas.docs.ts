
export const schemas = {
    MessageResponse: {
        type: 'object',
        properties: {
            message: {
                type: 'string'
            }
        }
    },
    LoginResponse: {
        type: 'object',
        properties: {
            accessToken: {
                type: 'string'
            },
            refreshToken: {
                type: 'string'
            }
        }
    },
    UserRegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
            name: {
                type: "string",
                minLength: 3,
                maxLength: 100,
            },
            email: {
                type: "string",
                format: "email"
            },
            password: {
                type: "string",
                minLength: 6,
                maxLength: 50
            }
        }
    },
    UserLoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: {
                type: "string",
                format: "email",
            },
            password: {
                type: "string",
                minLength: 6,
                maxLength: 50,
            }
        }
    },
    ShortUrlRequest: {
        type: 'object',
        required: ['longUrl'],
        properties: {
            longUrl: {
                type: 'string',
                format: 'uri',
                example: 'https://github.com/devmoisesz'
            }
        }
    },
    ShortUrlResponse: {
        type: 'object',
        properties: {
            shortUrl: {
                type: 'string',
                example: {
                    userId: '6b12t76mv65414ea7pid9c34',
                    shortCode: 'abc123',
                    shortUrl: 'http://localhost:3000/abc123'
                }
            }
        }
    },
    UrlsResponse: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                _id: {
                    type: 'string'
                },
                shortCode: {
                    type: 'string'
                },
                userId: {
                    type: 'string'
                },
                longUrl: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
            }
        }
    }
}