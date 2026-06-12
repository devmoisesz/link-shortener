const shortUrlPaths = {
  '/shortener/api/shorten': {
    post: {
      summary: 'Encurtar URL',
      security: [
        {
          BearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ShortUrlRequest'
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'URL encurtada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ShortUrlResponse'
              }
            }
          }
        },
        '400': {
          description: 'URL inválida',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse'
              },
              example: {
                message: 'URL inválida'
              }
            }
          }
        }
      }
    }
  },

  '/shortener/{shortCode}': {
    get: {
      summary: 'Redirecionar para a URL original',
      parameters: [
        {
          name: 'shortCode',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      responses: {
        '302': {
          description: 'Redirecionamento realizado com sucesso'
        },
        '404': {
          description: 'URL não encontrada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse'
              },
              example: {
                message: 'URL não encontrada'
              }
            }
          }
        }
      }
    }
  },

  '/shortener/api/urls': {
    get: {
      summary: 'Listar URLs do usuário',
      security: [
        {
          BearerAuth: []
        }
      ],
      responses: {
        '200': {
          description: 'Lista de URLs retornada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UrlsResponse'
              },
              example: {
                    _id: '6b79l21pu12344ea7kyt1pcc',
                    shortCode: 'abc123',
                    userId: '6b12t76mv65414ea7pid9c34',
                    longUrl: 'https://github.com/devmoisesz',
                    createdAt: '2026-06-06T01:02:36.201Z'
                }
            }
          }
        },
        '401': {
          description: 'Erro de autenticação',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse'
              }, 
              example: {
                message: 'Usuário não autenticado!'
              }
            }
          }
        }
      }
    }
  },

  '/shortener/api/{shortCode}': {
    delete: {
      summary: 'Excluir URL encurtada',
      security: [
        {
          BearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'shortCode',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      responses: {
        '200': {
          description: 'URL excluída com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse'
              },
              example: {
                message: 'URL deletada com sucesso'
              }
            }
          }
        },
        '404': {
          description: 'URL não encontrada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse'
              },
              example: {
                message: 'URL não encontrada'
              }
            }
          }
        },
        '401': {
          description: 'Sem permissão para deletar esta URL',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse'
              },
              example: {
                message: 'Sem permissão para deletar esta URL'
              }
            }
          }
        }
      }
    }
  }
}

export default shortUrlPaths;