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

### Pokémon

Respuesta del endpoint `/api/pokemon/{name}` (propiedades relevantes):

```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/.../pikachu.png"
  },
  "types": [
    { "slot": 1, "type": { "name": "electric", "url": "..." } }
  ],
  "abilities": [
    { "ability": { "name": "static", "url": "..." }, "is_hidden": false }
  ]
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | Identificador numérico del Pokémon en la Pokédex nacional |
| `name` | string | Nombre del Pokémon en minúsculas |
| `height` | integer | Altura en decímetros |
| `weight` | integer | Peso en hectogramos |
| `sprites.front_default` | string | URL de la imagen frontal del Pokémon |
| `types` | array | Lista de tipos del Pokémon (puede tener uno o dos) |
| `abilities` | array | Lista de habilidades del Pokémon |

### Lista de Pokémon

Respuesta del endpoint `/api/pokemon`:

```json
{
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    { "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/" },
    { "name": "ivysaur",   "url": "https://pokeapi.co/api/v2/pokemon/2/" }
  ]
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `count` | integer | Total de Pokémon disponibles en la API |
| `next` | string \| null | URL para obtener la siguiente página |
| `previous` | string \| null | URL para obtener la página anterior |
| `results` | array | Lista de Pokémon con nombre y URL de detalle |

---

## 5. Decisiones tomadas

- Se creó un **servidor proxy en Express** en lugar de consumir PokéAPI directamente desde el frontend. Esto permite documentar los endpoints con Swagger y centralizar el manejo de errores.
- Se usó **swagger-autogen** con comentarios en el código para mantener la documentación cerca de cada endpoint y facilitar su actualización.
- Los endpoints del proxy respetan la misma estructura de rutas que PokéAPI para que sea intuitivo.
- El frontend se actualizó para consumir `/api/pokemon/:name` (servidor propio) en lugar de llamar a PokéAPI directamente.

---

## 6. Manejo de errores

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| 200 | OK | La operación fue exitosa |
| 404 | Not Found | El Pokémon, tipo, habilidad, especie o generación no existe |
| 500 | Internal Server Error | Error al comunicarse con PokéAPI |

---

## 7. Acceso a Swagger

Con el servidor corriendo, la documentación está disponible en:

```
http://localhost:3000/api-docs
```

Desde esa interfaz se puede:
- Ver todos los endpoints documentados organizados por categoría
- Leer la descripción y parámetros de cada endpoint
- Ejecutar pruebas directamente desde el navegador
- Ver las respuestas y códigos HTTP obtenidos
