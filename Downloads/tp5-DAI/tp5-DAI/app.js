const express = require("express");
const fetch = require("node-fetch");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

const app = express();
const PORT = 3000;
const POKEAPI_BASE = "https://pokeapi.co/api/v2";

// Middlewares
app.use(express.json());
app.use(express.static("public"));

// Swagger UI en /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// ─── ENDPOINTS ───────────────────────────────────────────────────────────────

app.get("/api/pokemon/:name", async (req, res) => {
  // #swagger.tags = ['Pokemon']
  // #swagger.summary = 'Obtiene un Pokémon por nombre o ID'
  // #swagger.description = 'Devuelve los datos completos de un Pokémon: nombre, imagen, tipos, peso y altura. Se puede buscar por nombre (ej: pikachu) o por ID numérico (ej: 25).'
  /* #swagger.parameters['name'] = {
       in: 'path',
       description: 'Nombre o ID del Pokémon. Ejemplos: pikachu, bulbasaur, 25, 1',
       required: true,
       type: 'string'
     } */
  /* #swagger.responses[200] = {
       description: 'Datos del Pokémon obtenidos correctamente.',
       schema: {
         type: 'object',
         properties: {
           id:     { type: 'integer', example: 25 },
           name:   { type: 'string',  example: 'pikachu' },
           height: { type: 'integer', example: 4, description: 'Altura en decímetros' },
           weight: { type: 'integer', example: 60, description: 'Peso en hectogramos' },
           sprites: {
             type: 'object',
             properties: {
               front_default: { type: 'string', example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' }
             }
           },
           types: {
             type: 'array',
             items: {
               type: 'object',
               properties: {
                 slot: { type: 'integer', example: 1 },
                 type: {
                   type: 'object',
                   properties: {
                     name: { type: 'string', example: 'electric' },
                     url:  { type: 'string', example: 'https://pokeapi.co/api/v2/type/13/' }
                   }
                 }
               }
             }
           },
           abilities: {
             type: 'array',
             items: {
               type: 'object',
               properties: {
                 ability: {
                   type: 'object',
                   properties: {
                     name: { type: 'string', example: 'static' },
                     url:  { type: 'string', example: 'https://pokeapi.co/api/v2/ability/9/' }
                   }
                 },
                 is_hidden: { type: 'boolean', example: false }
               }
             }
           }
         }
       }
     } */
  /* #swagger.responses[404] = {
       description: 'Pokémon no encontrado. El nombre o ID ingresado no existe en la Pokédex.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Pokémon no encontrado' } } }
     } */
  /* #swagger.responses[500] = {
       description: 'Error interno del servidor al comunicarse con PokéAPI.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Error interno del servidor' } } }
     } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon/${req.params.name}`);
    if (!response.ok) return res.status(404).json({ error: "Pokémon no encontrado" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/pokemon", async (req, res) => {
  // #swagger.tags = ['Pokemon']
  // #swagger.summary = 'Obtiene una lista paginada de Pokémon'
  // #swagger.description = 'Devuelve un listado de Pokémon con su nombre y URL de detalle. La cantidad y posición se controlan con los parámetros limit y offset.'
  /* #swagger.parameters['limit'] = {
       in: 'query',
       description: 'Cantidad de Pokémon a devolver. Por defecto: 20. Máximo recomendado: 100.',
       required: false,
       type: 'integer',
       example: 20
     } */
  /* #swagger.parameters['offset'] = {
       in: 'query',
       description: 'Posición desde la que empezar la lista (para paginación). Por defecto: 0.',
       required: false,
       type: 'integer',
       example: 0
     } */
  /* #swagger.responses[200] = {
       description: 'Lista de Pokémon obtenida correctamente.',
       schema: {
         type: 'object',
         properties: {
           count:    { type: 'integer', example: 1302, description: 'Total de Pokémon disponibles en la API' },
           next:     { type: 'string',  example: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20', description: 'URL de la siguiente página (null si no hay más)' },
           previous: { type: 'string',  example: null, description: 'URL de la página anterior (null si es la primera)' },
           results: {
             type: 'array',
             items: {
               type: 'object',
               properties: {
                 name: { type: 'string', example: 'bulbasaur' },
                 url:  { type: 'string', example: 'https://pokeapi.co/api/v2/pokemon/1/' }
               }
             }
           }
         }
       }
     } */
  /* #swagger.responses[500] = {
       description: 'Error interno del servidor.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Error interno del servidor' } } }
     } */
  try {
    const { limit = 20, offset = 0 } = req.query;
    const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/type/:name", async (req, res) => {
  // #swagger.tags = ['Tipos']
  // #swagger.summary = 'Obtiene información de un tipo de Pokémon'
  // #swagger.description = 'Devuelve datos del tipo indicado: lista de Pokémon que pertenecen a ese tipo, relaciones de daño (a qué tipos es efectivo, débil, inmune) y más.'
  /* #swagger.parameters['name'] = {
       in: 'path',
       description: 'Nombre del tipo en inglés. Ejemplos: fire, water, grass, electric, psychic, dragon',
       required: true,
       type: 'string'
     } */
  /* #swagger.responses[200] = {
       description: 'Datos del tipo obtenidos correctamente.',
       schema: {
         type: 'object',
         properties: {
           id:   { type: 'integer', example: 10 },
           name: { type: 'string',  example: 'fire' },
           damage_relations: {
             type: 'object',
             description: 'Relaciones de daño del tipo con otros tipos',
             properties: {
               double_damage_to:   { type: 'array', items: { type: 'object', properties: { name: { type: 'string', example: 'grass' } } } },
               half_damage_to:     { type: 'array', items: { type: 'object', properties: { name: { type: 'string', example: 'fire' } } } },
               double_damage_from: { type: 'array', items: { type: 'object', properties: { name: { type: 'string', example: 'water' } } } }
             }
           },
           pokemon: {
             type: 'array',
             description: 'Lista de Pokémon de este tipo',
             items: {
               type: 'object',
               properties: {
                 pokemon: {
                   type: 'object',
                   properties: {
                     name: { type: 'string', example: 'charmander' },
                     url:  { type: 'string', example: 'https://pokeapi.co/api/v2/pokemon/4/' }
                   }
                 }
               }
             }
           }
         }
       }
     } */
  /* #swagger.responses[404] = {
       description: 'Tipo no encontrado.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Tipo no encontrado' } } }
     } */
  /* #swagger.responses[500] = {
       description: 'Error interno del servidor.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Error interno del servidor' } } }
     } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/type/${req.params.name}`);
    if (!response.ok) return res.status(404).json({ error: "Tipo no encontrado" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/ability/:name", async (req, res) => {
  // #swagger.tags = ['Habilidades']
  // #swagger.summary = 'Obtiene información de una habilidad'
  // #swagger.description = 'Devuelve la descripción, efecto y datos de la habilidad indicada, incluyendo los Pokémon que pueden tenerla.'
  /* #swagger.parameters['name'] = {
       in: 'path',
       description: 'Nombre de la habilidad en inglés. Ejemplos: blaze, torrent, overgrow, static, levitate',
       required: true,
       type: 'string'
     } */
  /* #swagger.responses[200] = {
       description: 'Datos de la habilidad obtenidos correctamente.',
       schema: {
         type: 'object',
         properties: {
           id:   { type: 'integer', example: 66 },
           name: { type: 'string',  example: 'blaze' },
           effect_entries: {
             type: 'array',
             description: 'Descripción del efecto de la habilidad',
             items: {
               type: 'object',
               properties: {
                 effect:        { type: 'string', example: 'When the Pokémon has 1/3 or less of its HP remaining, its fire-type moves do 1.5x more damage.' },
                 short_effect:  { type: 'string', example: 'Strengthens fire moves to 1.5× their power when the user has 1/3 or less of its maximum HP.' },
                 language: {
                   type: 'object',
                   properties: { name: { type: 'string', example: 'en' } }
                 }
               }
             }
           },
           pokemon: {
             type: 'array',
             description: 'Pokémon que pueden tener esta habilidad',
             items: {
               type: 'object',
               properties: {
                 pokemon: {
                   type: 'object',
                   properties: {
                     name: { type: 'string', example: 'charmander' },
                     url:  { type: 'string', example: 'https://pokeapi.co/api/v2/pokemon/4/' }
                   }
                 },
                 is_hidden: { type: 'boolean', example: false }
               }
             }
           }
         }
       }
     } */
  /* #swagger.responses[404] = {
       description: 'Habilidad no encontrada.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Habilidad no encontrada' } } }
     } */
  /* #swagger.responses[500] = {
       description: 'Error interno del servidor.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Error interno del servidor' } } }
     } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/ability/${req.params.name}`);
    if (!response.ok) return res.status(404).json({ error: "Habilidad no encontrada" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/pokemon-species/:name", async (req, res) => {
  // #swagger.tags = ['Especies']
  // #swagger.summary = 'Obtiene datos de la especie de un Pokémon'
  // #swagger.description = 'Devuelve la descripción de la Pokédex, la generación en la que fue introducido, si es legendario o mítico, y la referencia a su cadena evolutiva.'
  /* #swagger.parameters['name'] = {
       in: 'path',
       description: 'Nombre de la especie en inglés. Ejemplos: bulbasaur, charmander, pikachu',
       required: true,
       type: 'string'
     } */
  /* #swagger.responses[200] = {
       description: 'Datos de la especie obtenidos correctamente.',
       schema: {
         type: 'object',
         properties: {
           id:            { type: 'integer', example: 1 },
           name:          { type: 'string',  example: 'bulbasaur' },
           is_legendary:  { type: 'boolean', example: false },
           is_mythical:   { type: 'boolean', example: false },
           generation: {
             type: 'object',
             properties: {
               name: { type: 'string', example: 'generation-i' },
               url:  { type: 'string', example: 'https://pokeapi.co/api/v2/generation/1/' }
             }
           },
           evolution_chain: {
             type: 'object',
             properties: {
               url: { type: 'string', example: 'https://pokeapi.co/api/v2/evolution-chain/1/' }
             }
           },
           flavor_text_entries: {
             type: 'array',
             description: 'Entradas de texto de la Pokédex en distintos juegos e idiomas',
             items: {
               type: 'object',
               properties: {
                 flavor_text: { type: 'string', example: 'A strange seed was planted on its back at birth.' },
                 language:    { type: 'object', properties: { name: { type: 'string', example: 'en' } } },
                 version:     { type: 'object', properties: { name: { type: 'string', example: 'red' } } }
               }
             }
           }
         }
       }
     } */
  /* #swagger.responses[404] = {
       description: 'Especie no encontrada.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Especie no encontrada' } } }
     } */
  /* #swagger.responses[500] = {
       description: 'Error interno del servidor.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Error interno del servidor' } } }
     } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon-species/${req.params.name}`);
    if (!response.ok) return res.status(404).json({ error: "Especie no encontrada" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/encounters/:name", async (req, res) => {
  // #swagger.tags = ['Encuentros']
  // #swagger.summary = 'Obtiene las ubicaciones donde aparece un Pokémon'
  // #swagger.description = 'Devuelve la lista de zonas del mapa en los distintos juegos de la saga donde puede encontrarse el Pokémon indicado en estado salvaje.'
  /* #swagger.parameters['name'] = {
       in: 'path',
       description: 'Nombre del Pokémon en inglés. Ejemplos: pikachu, mewtwo, snorlax',
       required: true,
       type: 'string'
     } */
  /* #swagger.responses[200] = {
       description: 'Lista de ubicaciones obtenida correctamente. Puede ser un array vacío si el Pokémon no aparece en ninguna zona salvaje.',
       schema: {
         type: 'array',
         items: {
           type: 'object',
           properties: {
             location_area: {
               type: 'object',
               properties: {
                 name: { type: 'string', example: 'viridian-forest-area' },
                 url:  { type: 'string', example: 'https://pokeapi.co/api/v2/location-area/321/' }
               }
             },
             version_details: {
               type: 'array',
               description: 'Detalles por versión del juego',
               items: {
                 type: 'object',
                 properties: {
                   max_chance: { type: 'integer', example: 10, description: 'Probabilidad máxima de encuentro (%)' },
                   version: {
                     type: 'object',
                     properties: { name: { type: 'string', example: 'red' } }
                   }
                 }
               }
             }
           }
         }
       }
     } */
  /* #swagger.responses[404] = {
       description: 'Pokémon no encontrado.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Pokémon no encontrado' } } }
     } */
  /* #swagger.responses[500] = {
       description: 'Error interno del servidor.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Error interno del servidor' } } }
     } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon/${req.params.name}/encounters`);
    if (!response.ok) return res.status(404).json({ error: "Pokémon no encontrado" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/generation/:id", async (req, res) => {
  // #swagger.tags = ['Generaciones']
  // #swagger.summary = 'Obtiene información de una generación de Pokémon'
  // #swagger.description = 'Devuelve el listado de Pokémon y movimientos introducidos en la generación indicada, junto con los juegos que la representan.'
  /* #swagger.parameters['id'] = {
       in: 'path',
       description: 'Número de generación entre 1 y 9. Ejemplos: 1 (Rojo/Azul), 2 (Oro/Plata), 3 (Rubí/Zafiro)',
       required: true,
       type: 'integer'
     } */
  /* #swagger.responses[200] = {
       description: 'Datos de la generación obtenidos correctamente.',
       schema: {
         type: 'object',
         properties: {
           id:   { type: 'integer', example: 1 },
           name: { type: 'string',  example: 'generation-i' },
           main_region: {
             type: 'object',
             properties: {
               name: { type: 'string', example: 'kanto' },
               url:  { type: 'string', example: 'https://pokeapi.co/api/v2/region/1/' }
             }
           },
           version_groups: {
             type: 'array',
             description: 'Juegos que pertenecen a esta generación',
             items: {
               type: 'object',
               properties: {
                 name: { type: 'string', example: 'red-blue' },
                 url:  { type: 'string', example: 'https://pokeapi.co/api/v2/version-group/1/' }
               }
             }
           },
           pokemon_species: {
             type: 'array',
             description: 'Pokémon introducidos en esta generación',
             items: {
               type: 'object',
               properties: {
                 name: { type: 'string', example: 'bulbasaur' },
                 url:  { type: 'string', example: 'https://pokeapi.co/api/v2/pokemon-species/1/' }
               }
             }
           }
         }
       }
     } */
  /* #swagger.responses[404] = {
       description: 'Generación no encontrada.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Generación no encontrada' } } }
     } */
  /* #swagger.responses[500] = {
       description: 'Error interno del servidor.',
       schema: { type: 'object', properties: { error: { type: 'string', example: 'Error interno del servidor' } } }
     } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/generation/${req.params.id}`);
    if (!response.ok) return res.status(404).json({ error: "Generación no encontrada" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─── INICIO DEL SERVIDOR ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`);
});
