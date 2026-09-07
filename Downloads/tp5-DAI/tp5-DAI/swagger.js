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
  ]
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
