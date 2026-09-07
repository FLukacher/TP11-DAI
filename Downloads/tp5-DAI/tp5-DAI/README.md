# TP5 DAI — Documentación de API con Swagger

## 1. Selección y análisis de la API

### Nombre del proyecto
Mini Pokédex Web

### Descripción
Aplicación web que permite buscar cualquier Pokémon por nombre o ID y mostrar su información básica: nombre, imagen, tipo(s), peso y altura. Los datos se obtienen en tiempo real consumiendo una API externa desde JavaScript puro, sin frameworks.

### Tipo de API
Externa (pública y gratuita) — **PokéAPI**

### URL base de la API original
```
https://pokeapi.co/api/v2
```

### URL base del servidor propio (proxy)
```
http://localhost:3000
```

### Endpoints utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pokemon/{name}` | Obtiene los datos de un Pokémon por nombre o ID |
| GET | `/api/pokemon` | Obtiene una lista paginada de Pokémon |
| GET | `/api/type/{name}` | Obtiene información de un tipo específico (ej: fire, water) |
| GET | `/api/ability/{name}` | Obtiene la descripción de una habilidad específica |
| GET | `/api/pokemon-species/{name}` | Obtiene datos de la especie: descripción, generación y cadena evolutiva |
| GET | `/api/encounters/{name}` | Obtiene las ubicaciones donde puede encontrarse un Pokémon |
| GET | `/api/generation/{id}` | Obtiene los Pokémon y movimientos introducidos en una generación |

> Todos los endpoints son **GET** ya que PokéAPI es una API de solo lectura.

---

## 2. Integración de Swagger

### Herramientas utilizadas
- **swagger-autogen** — genera automáticamente el archivo de especificación `swagger-output.json` a partir de los comentarios en el código
- **swagger-ui-express** — sirve la interfaz visual de Swagger UI en la ruta `/api-docs`

### Estructura del proyecto

```
tp5-DAI/
├── public/
│   ├── index.html       # Frontend de la Pokédex
│   ├── estilo.css       # Estilos
│   └── script.js        # Lógica del frontend (consume el servidor propio)
├── app.js               # Servidor Express con endpoints y swagger-ui-express
├── swagger.js           # Script de configuración de swagger-autogen
├── swagger-output.json  # Especificación generada automáticamente
├── package.json
└── README.md
```

### Cómo funciona

1. `swagger.js` lee los comentarios especiales en `app.js` y genera `swagger-output.json`
2. `app.js` carga ese JSON y lo sirve a través de `swagger-ui-express` en `/api-docs`
3. Cada endpoint actúa como proxy: recibe la petición del frontend y la reenvía a PokéAPI

---

## 3. Instalación y ejecución

### Requisitos
- Node.js instalado

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) Regenerar la especificación Swagger
npm run swagger

# 3. Iniciar el servidor
npm start
```

### Acceso

| Recurso | URL |
|---------|-----|
| Aplicación (Pokédex) | http://localhost:3000 |
| Documentación Swagger | http://localhost:3000/api-docs |

---

## 4. Modelos y estructuras de datos

Los modelos están declarados en `swagger.js` (sección `definitions`) y son visibles en Swagger UI bajo el apartado **Schemas** al final de la página.

---

### Modelo: `Pokemon`
*Retornado por `GET /api/pokemon/{name}`*

```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  },
  "types": [
    { "slot": 1, "type": { "name": "electric", "url": "https://pokeapi.co/api/v2/type/13/" } }
  ],
  "abilities": [
    { "ability": { "name": "static", "url": "https://pokeapi.co/api/v2/ability/9/" }, "is_hidden": false }
  ]
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | Identificador numérico único del Pokémon en la Pokédex Nacional |
| `name` | string | Nombre del Pokémon en minúsculas y sin acentos |
| `height` | integer | Altura en decímetros (ej: 4 = 0,4 metros) |
| `weight` | integer | Peso en hectogramos (ej: 60 = 6 kg) |
| `sprites.front_default` | string | URL de la imagen frontal oficial del Pokémon |
| `types[].slot` | integer | Posición del tipo: 1 = primario, 2 = secundario |
| `types[].type.name` | string | Nombre del tipo en inglés (ej: electric, fire) |
| `abilities[].ability.name` | string | Nombre de la habilidad en inglés |
| `abilities[].is_hidden` | boolean | `true` si es una habilidad oculta |

---

### Modelo: `PokemonListItem`
*Elemento del array `results` retornado por `GET /api/pokemon`*

```json
{
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    { "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/" }
  ]
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `count` | integer | Total de Pokémon disponibles en la API |
| `next` | string \| null | URL de la siguiente página de resultados |
| `previous` | string \| null | URL de la página anterior (`null` si es la primera) |
| `results[].name` | string | Nombre del Pokémon |
| `results[].url` | string | URL para obtener los datos completos del Pokémon |

---

### Modelo: `Tipo`
*Retornado por `GET /api/type/{name}`*

```json
{
  "id": 10,
  "name": "fire",
  "damage_relations": {
    "double_damage_to":   [{ "name": "grass" }],
    "half_damage_to":     [{ "name": "fire"  }],
    "double_damage_from": [{ "name": "water" }]
  }
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | Identificador numérico del tipo |
| `name` | string | Nombre del tipo en inglés |
| `damage_relations.double_damage_to` | array | Tipos a los que este tipo hace el doble de daño |
| `damage_relations.half_damage_to` | array | Tipos a los que este tipo hace la mitad de daño |
| `damage_relations.double_damage_from` | array | Tipos que hacen el doble de daño a este tipo |

---

### Modelo: `Habilidad`
*Retornado por `GET /api/ability/{name}`*

```json
{
  "id": 66,
  "name": "blaze",
  "effect_entries": [
    {
      "effect": "When the Pokémon has 1/3 or less HP, its fire moves do 1.5× damage.",
      "short_effect": "Strengthens fire moves to 1.5× at 1/3 HP or less.",
      "language": { "name": "en" }
    }
  ]
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | Identificador numérico de la habilidad |
| `name` | string | Nombre de la habilidad en inglés |
| `effect_entries[].effect` | string | Descripción completa del efecto |
| `effect_entries[].short_effect` | string | Descripción corta del efecto |
| `effect_entries[].language.name` | string | Idioma de la descripción (ej: `en`, `es`) |

---

### Modelo: `Especie`
*Retornado por `GET /api/pokemon-species/{name}`*

```json
{
  "id": 1,
  "name": "bulbasaur",
  "is_legendary": false,
  "is_mythical": false,
  "generation": { "name": "generation-i", "url": "https://pokeapi.co/api/v2/generation/1/" },
  "evolution_chain": { "url": "https://pokeapi.co/api/v2/evolution-chain/1/" },
  "flavor_text_entries": [
    { "flavor_text": "A strange seed was planted on its back at birth.", "language": { "name": "en" }, "version": { "name": "red" } }
  ]
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | Identificador numérico de la especie |
| `name` | string | Nombre de la especie |
| `is_legendary` | boolean | `true` si el Pokémon es legendario |
| `is_mythical` | boolean | `true` si el Pokémon es mítico |
| `generation.name` | string | Generación en la que fue introducido |
| `evolution_chain.url` | string | URL de la cadena evolutiva completa |
| `flavor_text_entries[].flavor_text` | string | Texto descriptivo de la Pokédex |

---

### Modelo: `Encuentro`
*Elemento del array retornado por `GET /api/encounters/{name}`*

```json
[
  {
    "location_area": { "name": "viridian-forest-area", "url": "https://pokeapi.co/api/v2/location-area/321/" },
    "version_details": [
      { "max_chance": 10, "version": { "name": "red" } }
    ]
  }
]
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `location_area.name` | string | Nombre de la zona en formato slug |
| `location_area.url` | string | URL del recurso de la zona |
| `version_details[].max_chance` | integer | Probabilidad máxima de encuentro (en %) |
| `version_details[].version.name` | string | Nombre del juego donde ocurre el encuentro |

---

### Modelo: `Generacion`
*Retornado por `GET /api/generation/{id}`*

```json
{
  "id": 1,
  "name": "generation-i",
  "main_region": { "name": "kanto", "url": "https://pokeapi.co/api/v2/region/1/" },
  "version_groups": [{ "name": "red-blue", "url": "https://pokeapi.co/api/v2/version-group/1/" }],
  "pokemon_species": [{ "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon-species/1/" }]
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | Identificador numérico de la generación |
| `name` | string | Nombre de la generación (ej: `generation-i`) |
| `main_region.name` | string | Región principal de la generación (ej: `kanto`) |
| `version_groups[].name` | string | Nombre del grupo de juegos (ej: `red-blue`) |
| `pokemon_species[].name` | string | Nombre de los Pokémon introducidos en esta generación |

---

### Modelo: `Error`
*Retornado en todas las respuestas de error (4xx, 5xx)*

```json
{
  "error": "Pokémon no encontrado"
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `error` | string | Mensaje descriptivo del error ocurrido |

---

## 5. Prueba de los endpoints

Las pruebas se realizan directamente desde **Swagger UI** en `http://localhost:3000/api-docs`.  
Para ejecutar cualquier prueba: expandir el endpoint → click en **"Try it out"** → completar los parámetros → click en **"Execute"**.

> ⚠️ PokéAPI es de solo lectura, por lo que no existen endpoints POST, PUT, PATCH ni DELETE. Todas las pruebas son GET con distintos tipos de parámetros.

---

### Prueba 1 — GET con parámetro de ruta (búsqueda por nombre)

**Endpoint:** `GET /api/pokemon/{name}`  
**Parámetro:** `name = pikachu`  
**Qué se verifica:** que el servidor devuelve los datos correctos del Pokémon solicitado.

Respuesta esperada — código `200`:
```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "sprites": { "front_default": "https://raw.githubusercontent.com/..." },
  "types": [{ "slot": 1, "type": { "name": "electric" } }]
}
```

---

### Prueba 2 — GET con parámetro de ruta (búsqueda por ID numérico)

**Endpoint:** `GET /api/pokemon/{name}`  
**Parámetro:** `name = 1`  
**Qué se verifica:** que el endpoint acepta tanto nombres como IDs numéricos.

Respuesta esperada — código `200`: datos de `bulbasaur` (ID 1).

---

### Prueba 3 — GET con parámetros de consulta (paginación)

**Endpoint:** `GET /api/pokemon`  
**Parámetros:** `limit = 5`, `offset = 0`  
**Qué se verifica:** que la paginación funciona y devuelve exactamente la cantidad solicitada.

Respuesta esperada — código `200`:
```json
{
  "count": 1302,
  "results": [
    { "name": "bulbasaur" },
    { "name": "ivysaur" },
    { "name": "venusaur" },
    { "name": "charmander" },
    { "name": "charmeleon" }
  ]
}
```

---

### Prueba 4 — GET con parámetro de ruta (tipo)

**Endpoint:** `GET /api/type/{name}`  
**Parámetro:** `name = fire`  
**Qué se verifica:** que se devuelven las relaciones de daño y los Pokémon del tipo indicado.

Respuesta esperada — código `200`: objeto con `damage_relations` y array `pokemon`.

---

### Prueba 5 — GET con parámetro de ruta (habilidad)

**Endpoint:** `GET /api/ability/{name}`  
**Parámetro:** `name = blaze`  
**Qué se verifica:** que se devuelve la descripción del efecto de la habilidad.

Respuesta esperada — código `200`: objeto con `effect_entries` en inglés y otros idiomas.

---

### Prueba 6 — GET con error intencional (recurso inexistente)

**Endpoint:** `GET /api/pokemon/{name}`  
**Parámetro:** `name = pokemoninexistente`  
**Qué se verifica:** que el servidor maneja el error correctamente y devuelve el código y mensaje esperados.

Respuesta esperada — código `404`:
```json
{
  "error": "Pokémon no encontrado"
}
```

---

### Prueba 7 — GET especie (datos extendidos)

**Endpoint:** `GET /api/pokemon-species/{name}`  
**Parámetro:** `name = mewtwo`  
**Qué se verifica:** que se indica correctamente que es legendario y se incluye la cadena evolutiva.

Respuesta esperada — código `200`:
```json
{
  "name": "mewtwo",
  "is_legendary": true,
  "is_mythical": false,
  "generation": { "name": "generation-i" }
}
```

---

### Prueba 8 — GET generación

**Endpoint:** `GET /api/generation/{id}`  
**Parámetro:** `id = 1`  
**Qué se verifica:** que se devuelven los Pokémon introducidos en la primera generación y la región Kanto.

Respuesta esperada — código `200`: objeto con `main_region.name = "kanto"` y array `pokemon_species` con 151 entradas.

---

## 6. Manejo de respuestas y errores

La API puede devolver los siguientes códigos HTTP. No se implementan 201, 400 ni 401 porque PokéAPI es de solo lectura y no requiere autenticación.

| Código | Nombre | Cuándo ocurre | Ejemplo de respuesta |
|--------|--------|---------------|----------------------|
| `200` | OK | La operación fue exitosa y se devuelven los datos solicitados | `{ "id": 25, "name": "pikachu", ... }` |
| `404` | Not Found | El nombre, ID o parámetro indicado no existe en PokéAPI | `{ "error": "Pokémon no encontrado" }` |
| `500` | Internal Server Error | Error de red o falla al comunicarse con PokéAPI | `{ "error": "Error interno del servidor" }` |

### Ejemplos de cada código

**200 — Éxito**
```
GET /api/pokemon/pikachu  →  200 OK
GET /api/type/fire        →  200 OK
GET /api/generation/1     →  200 OK
```

**404 — No encontrado**
```
GET /api/pokemon/xxxxxxx        →  404 { "error": "Pokémon no encontrado" }
GET /api/type/tipoinexistente   →  404 { "error": "Tipo no encontrado" }
GET /api/ability/xxxxxxx        →  404 { "error": "Habilidad no encontrada" }
GET /api/generation/99          →  404 { "error": "Generación no encontrada" }
```

**500 — Error de servidor**
```
Ocurre si PokéAPI está caída o hay un problema de red en el servidor.
```

---

## 7. Evidencia del trabajo

> Las capturas de pantalla deben tomarse con el servidor corriendo (`npm start`) y abriendo `http://localhost:3000/api-docs` en el navegador.

### Capturas requeridas

| # | Qué capturar | Cómo obtenerla |
|---|-------------|----------------|
| 1 | Interfaz principal de Swagger con todos los endpoints visibles | Abrir `/api-docs` y hacer screenshot de la página completa |
| 2 | Sección **Schemas** con los modelos desplegados | Bajar al final de `/api-docs` y expandir los modelos |
| 3 | Prueba 1 ejecutada: `GET /api/pokemon/pikachu` con respuesta 200 | Try it out → Execute → screenshot del resultado |
| 4 | Prueba 3 ejecutada: `GET /api/pokemon?limit=5&offset=0` con respuesta 200 | Try it out → completar query params → Execute |
| 5 | Prueba 6 ejecutada: `GET /api/pokemon/pokemoninexistente` con respuesta 404 | Try it out → Execute → screenshot del error |
| 6 | Prueba 7 ejecutada: `GET /api/pokemon-species/mewtwo` mostrando `is_legendary: true` | Try it out → Execute → screenshot |

### Herramientas recomendadas para capturas de pantalla completas
- **GoFullPage** (extensión Chrome) — captura la página entera en un click
- **Awesome Screenshot** (extensión Chrome) — permite anotar y recortar
- Grabación de pantalla con OBS si se prefiere video

---

## 8. Decisiones tomadas

- Se creó un **servidor proxy en Express** en lugar de consumir PokéAPI directamente desde el frontend. Esto permite documentar los endpoints con Swagger y centralizar el manejo de errores.
- Se usó **swagger-autogen** con comentarios `#swagger` en el código para mantener la documentación cerca de cada endpoint y facilitar su actualización futura.
- Los endpoints del proxy respetan la misma estructura de rutas que PokéAPI para que la API sea intuitiva.
- El frontend se actualizó para consumir `/api/pokemon/:name` (servidor propio) en lugar de llamar a PokéAPI directamente.
- No se implementaron endpoints de escritura (POST, PUT, DELETE) porque PokéAPI es de solo lectura. Se documentó esta decisión explícitamente en la sección de pruebas.

---

## 9. Acceso a Swagger

Con el servidor corriendo, la documentación está disponible en:

```
http://localhost:3000/api-docs
```

Desde esa interfaz se puede:
- Ver todos los endpoints documentados organizados por categoría (tags)
- Leer la descripción, parámetros y esquemas de respuesta de cada endpoint
- Ejecutar pruebas en vivo directamente desde el navegador
- Ver los modelos de datos en la sección **Schemas**
