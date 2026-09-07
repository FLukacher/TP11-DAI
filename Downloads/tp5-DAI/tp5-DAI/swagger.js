const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Mini Pokédex API",
    description: "Servidor proxy que expone endpoints de PokéAPI para la aplicación Mini Pokédex Web. Permite consultar datos de Pokémon, tipos, habilidades, especies, encuentros y generaciones.",
    version: "1.0.0",
    contact: {
      name: "TP5 DAI"
    }
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  tags: [
    {
      name: "Pokemon",
      description: "Endpoints para consultar datos de Pokémon individuales o listas"
    },
    {
      name: "Tipos",
      description: "Endpoints para consultar tipos de Pokémon (fire, water, grass, etc.)"
    },
    {
      name: "Habilidades",
      description: "Endpoints para consultar habilidades de los Pokémon"
    },
    {
      name: "Especies",
      description: "Endpoints para consultar datos de especies Pokémon"
    },
    {
      name: "Encuentros",
      description: "Endpoints para consultar ubicaciones de encuentro de Pokémon"
    },
    {
      name: "Generaciones",
      description: "Endpoints para consultar información por generación"
    }
  ],

  // ─── MODELOS / DEFINICIONES ──────────────────────────────────────────────
  definitions: {

    // Modelo principal: datos de un Pokémon individual
    Pokemon: {
      type: "object",
      description: "Datos completos de un Pokémon individual retornados por /api/pokemon/:name",
      properties: {
        id: {
          type: "integer",
          example: 25,
          description: "Identificador numérico único del Pokémon en la Pokédex Nacional"
        },
        name: {
          type: "string",
          example: "pikachu",
          description: "Nombre del Pokémon en minúsculas y sin acentos"
        },
        height: {
          type: "integer",
          example: 4,
          description: "Altura del Pokémon expresada en decímetros (4 = 0,4 metros)"
        },
        weight: {
          type: "integer",
          example: 60,
          description: "Peso del Pokémon expresado en hectogramos (60 = 6 kg)"
        },
        sprites: {
          type: "object",
          description: "URLs de las imágenes oficiales del Pokémon",
          properties: {
            front_default: {
              type: "string",
              example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
              description: "URL de la imagen frontal por defecto del Pokémon"
            }
          }
        },
        types: {
          type: "array",
          description: "Lista de tipos del Pokémon. Un Pokémon puede tener uno o dos tipos",
          items: {
            type: "object",
            properties: {
              slot: {
                type: "integer",
                example: 1,
                description: "Posición del tipo (1 = tipo primario, 2 = tipo secundario)"
              },
              type: {
                type: "object",
                properties: {
                  name: { type: "string", example: "electric", description: "Nombre del tipo en inglés" },
                  url:  { type: "string", example: "https://pokeapi.co/api/v2/type/13/", description: "URL del recurso del tipo en PokéAPI" }
                }
              }
            }
          }
        },
        abilities: {
          type: "array",
          description: "Lista de habilidades del Pokémon",
          items: {
            type: "object",
            properties: {
              ability: {
                type: "object",
                properties: {
                  name: { type: "string", example: "static",    description: "Nombre de la habilidad en inglés" },
                  url:  { type: "string", example: "https://pokeapi.co/api/v2/ability/9/", description: "URL del recurso de la habilidad" }
                }
              },
              is_hidden: {
                type: "boolean",
                example: false,
                description: "Indica si es una habilidad oculta (solo obtenible por métodos especiales)"
              }
            }
          }
        }
      }
    },

    // Modelo: item de la lista paginada de Pokémon
    PokemonListItem: {
      type: "object",
      description: "Elemento de la lista paginada retornada por /api/pokemon",
      properties: {
        name: {
          type: "string",
          example: "bulbasaur",
          description: "Nombre del Pokémon"
        },
        url: {
          type: "string",
          example: "https://pokeapi.co/api/v2/pokemon/1/",
          description: "URL para obtener los datos completos del Pokémon en PokéAPI"
        }
      }
    },

    // Modelo: tipo de Pokémon
    Tipo: {
      type: "object",
      description: "Datos de un tipo de Pokémon retornados por /api/type/:name",
      properties: {
        id:   { type: "integer", example: 10,     description: "Identificador numérico del tipo" },
        name: { type: "string",  example: "fire",  description: "Nombre del tipo en inglés" },
        damage_relations: {
          type: "object",
          description: "Relaciones de efectividad del tipo contra otros tipos",
          properties: {
            double_damage_to: {
              type: "array",
              description: "Tipos a los que este tipo hace el doble de daño",
              items: { type: "object", properties: { name: { type: "string", example: "grass" } } }
            },
            half_damage_to: {
              type: "array",
              description: "Tipos a los que este tipo hace la mitad de daño",
              items: { type: "object", properties: { name: { type: "string", example: "fire" } } }
            },
            double_damage_from: {
              type: "array",
              description: "Tipos que hacen el doble de daño a este tipo",
              items: { type: "object", properties: { name: { type: "string", example: "water" } } }
            }
          }
        }
      }
    },

    // Modelo: habilidad
    Habilidad: {
      type: "object",
      description: "Datos de una habilidad Pokémon retornados por /api/ability/:name",
      properties: {
        id:   { type: "integer", example: 66,      description: "Identificador numérico de la habilidad" },
        name: { type: "string",  example: "blaze",  description: "Nombre de la habilidad en inglés" },
        effect_entries: {
          type: "array",
          description: "Descripciones del efecto de la habilidad en distintos idiomas",
          items: {
            type: "object",
            properties: {
              effect:       { type: "string", example: "When the Pokémon has 1/3 or less HP, its fire moves do 1.5× damage.", description: "Descripción larga del efecto" },
              short_effect: { type: "string", example: "Strengthens fire moves to 1.5× at 1/3 HP or less.",                  description: "Descripción corta del efecto" },
              language: {
                type: "object",
                properties: { name: { type: "string", example: "en", description: "Código del idioma" } }
              }
            }
          }
        }
      }
    },

    // Modelo: especie
    Especie: {
      type: "object",
      description: "Datos de la especie de un Pokémon retornados por /api/pokemon-species/:name",
      properties: {
        id:           { type: "integer", example: 1,           description: "Identificador numérico de la especie" },
        name:         { type: "string",  example: "bulbasaur",  description: "Nombre de la especie" },
        is_legendary: { type: "boolean", example: false,        description: "Indica si el Pokémon es legendario" },
        is_mythical:  { type: "boolean", example: false,        description: "Indica si el Pokémon es mítico" },
        generation: {
          type: "object",
          description: "Generación en la que fue introducido el Pokémon",
          properties: {
            name: { type: "string", example: "generation-i",                         description: "Nombre de la generación" },
            url:  { type: "string", example: "https://pokeapi.co/api/v2/generation/1/", description: "URL del recurso de la generación" }
          }
        },
        evolution_chain: {
          type: "object",
          description: "Referencia a la cadena evolutiva del Pokémon",
          properties: {
            url: { type: "string", example: "https://pokeapi.co/api/v2/evolution-chain/1/", description: "URL de la cadena evolutiva completa" }
          }
        },
        flavor_text_entries: {
          type: "array",
          description: "Textos de la Pokédex del Pokémon en distintos juegos e idiomas",
          items: {
            type: "object",
            properties: {
              flavor_text: { type: "string",  example: "A strange seed was planted on its back at birth.", description: "Texto descriptivo del Pokémon" },
              language:    { type: "object",  properties: { name: { type: "string", example: "en" } } },
              version:     { type: "object",  properties: { name: { type: "string", example: "red" } } }
            }
          }
        }
      }
    },

    // Modelo: encuentro (ubicación)
    Encuentro: {
      type: "object",
      description: "Ubicación donde puede encontrarse un Pokémon en estado salvaje, retornado por /api/encounters/:name",
      properties: {
        location_area: {
          type: "object",
          description: "Zona del mapa donde aparece el Pokémon",
          properties: {
            name: { type: "string", example: "viridian-forest-area",                             description: "Nombre de la zona en formato slug" },
            url:  { type: "string", example: "https://pokeapi.co/api/v2/location-area/321/",     description: "URL del recurso de la zona" }
          }
        },
        version_details: {
          type: "array",
          description: "Detalles del encuentro por versión del juego",
          items: {
            type: "object",
            properties: {
              max_chance: { type: "integer", example: 10, description: "Probabilidad máxima de encuentro expresada en porcentaje" },
              version: {
                type: "object",
                properties: { name: { type: "string", example: "red", description: "Nombre del juego (versión)" } }
              }
            }
          }
        }
      }
    },

    // Modelo: generación
    Generacion: {
      type: "object",
      description: "Datos de una generación de Pokémon retornados por /api/generation/:id",
      properties: {
        id:   { type: "integer", example: 1,              description: "Identificador numérico de la generación" },
        name: { type: "string",  example: "generation-i",  description: "Nombre de la generación en formato slug" },
        main_region: {
          type: "object",
          description: "Región principal asociada a esta generación",
          properties: {
            name: { type: "string", example: "kanto",                               description: "Nombre de la región" },
            url:  { type: "string", example: "https://pokeapi.co/api/v2/region/1/", description: "URL del recurso de la región" }
          }
        },
        version_groups: {
          type: "array",
          description: "Grupos de juegos que pertenecen a esta generación",
          items: {
            type: "object",
            properties: {
              name: { type: "string", example: "red-blue",                                    description: "Nombre del grupo de juegos" },
              url:  { type: "string", example: "https://pokeapi.co/api/v2/version-group/1/",  description: "URL del recurso del grupo" }
            }
          }
        },
        pokemon_species: {
          type: "array",
          description: "Pokémon introducidos por primera vez en esta generación",
          items: {
            type: "object",
            properties: {
              name: { type: "string", example: "bulbasaur",                                       description: "Nombre del Pokémon" },
              url:  { type: "string", example: "https://pokeapi.co/api/v2/pokemon-species/1/",    description: "URL del recurso de la especie" }
            }
          }
        }
      }
    },

    // Modelo: respuesta de error
    Error: {
      type: "object",
      description: "Estructura de respuesta cuando ocurre un error",
      properties: {
        error: {
          type: "string",
          example: "Pokémon no encontrado",
          description: "Mensaje descriptivo del error ocurrido"
        }
      }
    }
  }
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
