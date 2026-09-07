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

/**
 * @swagger
 * /api/pokemon/{name}:
 *   get:
 *     summary: Obtiene un Pokémon por nombre o ID
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre o ID del Pokémon (ej: pikachu, 25)
 *     responses:
 *       200:
 *         description: Datos del Pokémon
 *       404:
 *         description: Pokémon no encontrado
 *       500:
 *         description: Error interno del servidor
 */
app.get("/api/pokemon/:name", async (req, res) => {
  // #swagger.tags = ['Pokemon']
  // #swagger.summary = 'Obtiene un Pokémon por nombre o ID'
  // #swagger.description = 'Devuelve nombre, imagen, tipos, peso y altura del Pokémon indicado.'
  /* #swagger.parameters['name'] = {
       in: 'path',
       description: 'Nombre o ID del Pokémon (ej: pikachu, 25)',
       required: true,
       type: 'string'
     } */
  /* #swagger.responses[200] = { description: 'Datos del Pokémon obtenidos correctamente.' } */
  /* #swagger.responses[404] = { description: 'Pokémon no encontrado.' } */
  /* #swagger.responses[500] = { description: 'Error interno del servidor.' } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon/${req.params.name}`);
    if (!response.ok) return res.status(404).json({ error: "Pokémon no encontrado" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Obtiene una lista paginada de Pokémon
 *     tags: [Pokemon]
 */
app.get("/api/pokemon", async (req, res) => {
  // #swagger.tags = ['Pokemon']
  // #swagger.summary = 'Obtiene una lista paginada de Pokémon'
  // #swagger.description = 'Devuelve un listado de Pokémon. Se puede controlar con los parámetros limit y offset.'
  /* #swagger.parameters['limit'] = {
       in: 'query',
       description: 'Cantidad de Pokémon a devolver (por defecto 20)',
       required: false,
       type: 'integer'
     } */
  /* #swagger.parameters['offset'] = {
       in: 'query',
       description: 'Posición desde la que empezar la lista (por defecto 0)',
       required: false,
       type: 'integer'
     } */
  /* #swagger.responses[200] = { description: 'Lista de Pokémon obtenida correctamente.' } */
  /* #swagger.responses[500] = { description: 'Error interno del servidor.' } */
  try {
    const { limit = 20, offset = 0 } = req.query;
    const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /api/type/{name}:
 *   get:
 *     summary: Obtiene información de un tipo de Pokémon
 *     tags: [Tipos]
 */
app.get("/api/type/:name", async (req, res) => {
  // #swagger.tags = ['Tipos']
  // #swagger.summary = 'Obtiene información de un tipo de Pokémon'
  // #swagger.description = 'Devuelve datos del tipo indicado, incluyendo lista de Pokémon que pertenecen a ese tipo y relaciones de daño.'
  /* #swagger.parameters['name'] = {
       in: 'path',
       description: 'Nombre del tipo (ej: fire, water, grass)',
       required: true,
       type: 'string'
     } */
  /* #swagger.responses[200] = { description: 'Datos del tipo obtenidos correctamente.' } */
  /* #swagger.responses[404] = { description: 'Tipo no encontrado.' } */
  /* #swagger.responses[500] = { description: 'Error interno del servidor.' } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/type/${req.params.name}`);
    if (!response.ok) return res.status(404).json({ error: "Tipo no encontrado" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /api/ability/{name}:
 *   get:
 *     summary: Obtiene información de una habilidad
 *     tags: [Habilidades]
 */
app.get("/api/ability/:name", async (req, res) => {
  // #swagger.tags = ['Habilidades']
  // #swagger.summary = 'Obtiene información de una habilidad'
  // #swagger.description = 'Devuelve la descripción y datos de la habilidad indicada.'
  /* #swagger.parameters['name'] = {
       in: 'path',
       description: 'Nombre de la habilidad (ej: blaze, torrent, overgrow)',
       required: true,
       type: 'string'
     } */
  /* #swagger.responses[200] = { description: 'Datos de la habilidad obtenidos correctamente.' } */
  /* #swagger.responses[404] = { description: 'Habilidad no encontrada.' } */
  /* #swagger.responses[500] = { description: 'Error interno del servidor.' } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/ability/${req.params.name}`);
    if (!response.ok) return res.status(404).json({ error: "Habilidad no encontrada" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /api/pokemon-species/{name}:
 *   get:
 *     summary: Obtiene datos de la especie de un Pokémon
 *     tags: [Especies]
 */
app.get("/api/pokemon-species/:name", async (req, res) => {
  // #swagger.tags = ['Especies']
  // #swagger.summary = 'Obtiene datos de la especie de un Pokémon'
  // #swagger.description = 'Devuelve descripción de la Pokédex, generación de introducción y referencia a la cadena evolutiva.'
  /* #swagger.parameters['name'] = {
       in: 'path',
       description: 'Nombre de la especie (ej: bulbasaur, charmander)',
       required: true,
       type: 'string'
     } */
  /* #swagger.responses[200] = { description: 'Datos de la especie obtenidos correctamente.' } */
  /* #swagger.responses[404] = { description: 'Especie no encontrada.' } */
  /* #swagger.responses[500] = { description: 'Error interno del servidor.' } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon-species/${req.params.name}`);
    if (!response.ok) return res.status(404).json({ error: "Especie no encontrada" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /api/encounters/{name}:
 *   get:
 *     summary: Obtiene las ubicaciones donde aparece un Pokémon
 *     tags: [Encuentros]
 */
app.get("/api/encounters/:name", async (req, res) => {
  // #swagger.tags = ['Encuentros']
  // #swagger.summary = 'Obtiene las ubicaciones donde aparece un Pokémon'
  // #swagger.description = 'Devuelve la lista de zonas del mapa en los juegos donde puede encontrarse el Pokémon indicado.'
  /* #swagger.parameters['name'] = {
       in: 'path',
       description: 'Nombre del Pokémon (ej: pikachu)',
       required: true,
       type: 'string'
     } */
  /* #swagger.responses[200] = { description: 'Lista de encuentros obtenida correctamente.' } */
  /* #swagger.responses[404] = { description: 'Pokémon no encontrado.' } */
  /* #swagger.responses[500] = { description: 'Error interno del servidor.' } */
  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon/${req.params.name}/encounters`);
    if (!response.ok) return res.status(404).json({ error: "Pokémon no encontrado" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /api/generation/{id}:
 *   get:
 *     summary: Obtiene información de una generación de Pokémon
 *     tags: [Generaciones]
 */
app.get("/api/generation/:id", async (req, res) => {
  // #swagger.tags = ['Generaciones']
  // #swagger.summary = 'Obtiene información de una generación de Pokémon'
  // #swagger.description = 'Devuelve los Pokémon y movimientos introducidos en la generación indicada.'
  /* #swagger.parameters['id'] = {
       in: 'path',
       description: 'Número de generación del 1 al 9 (ej: 1)',
       required: true,
       type: 'integer'
     } */
  /* #swagger.responses[200] = { description: 'Datos de la generación obtenidos correctamente.' } */
  /* #swagger.responses[404] = { description: 'Generación no encontrada.' } */
  /* #swagger.responses[500] = { description: 'Error interno del servidor.' } */
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
