const usersPaths = {
        '/users/register': {
            post: {
                summary: 'Criar conta de usuário',
                requestBody: {
                    description: "Informações necessárias para criar um novo perfil de usuário.",
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserRegisterRequest'
                            },
                            example: {
                                name: "johndoe",
                                email: "john.doe@example.com",
                                password: "123456"
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Usuário registrado com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/MessageResponse'
                                },
                                example: {
                                    message: 'Usuário Registrado!'
                                }
                            }
                        }
                    },
                    '422': {
                        description: 'Erro de Cadastro',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/MessageResponse'
                                },
                                example: {
                                    message: 'Email já cadastrado'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/users/login': {
            post: {
                summary: 'Fazer Login de usuário',
                    requestBody: {
                        description: "Informações necessárias para usuário fazer login.",
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/UserLoginRequest'
                                },
                                example: {
                                    email: "john.doe@example.com",
                                    password: "123456"
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: "Usuário logado com sucesso",
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/LoginResponse'
                                    },
                                    example: {
                                        accesToken: 'eyJhbGciOi...',
                                        refreshToken: 'eyJhbGciOi...'
                                    }
                                }
                            }
                        },
                        '400': {
                            description: "Erro de login",
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/MessageResponse'
                                    },
                                    example: {
                                        message: 'E-mail ou senha incorretos.'
                                    }
                                }
                            }
                        }
                    }
            }
        }
        
    }


export default usersPaths