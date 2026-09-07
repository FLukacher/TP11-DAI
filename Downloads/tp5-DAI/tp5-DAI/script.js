const input = document.getElementById("inputPokemon");
const btn = document.getElementById("btnBuscar");

const nombre = document.getElementById("nombre");
const imagen = document.getElementById("imagen");
const tipo = document.getElementById("tipo");
const peso = document.getElementById("peso");
const altura = document.getElementById("altura");

const card = document.getElementById("pokemonCard");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

btn.addEventListener("click", buscarPokemon);

async function buscarPokemon() {
    const valor = input.value.toLowerCase().trim();

    // validación básica
    if (valor === "") {
        mostrarError("Escribí un Pokémon");
        return;
    }

    ocultarTodo();
    loading.classList.remove("hidden");

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`);

        if (!response.ok) {
            throw new Error("No existe el Pokémon");
        }

        const data = await response.json();

        mostrarPokemon(data);

    } catch (err) {
        mostrarError(err.message);
    } finally {
        loading.classList.add("hidden");
    }
}

function mostrarPokemon(data) {
    nombre.textContent = data.name;
    imagen.src = data.sprites.front_default;

    // tipos (puede tener más de uno)
    const tipos = data.types.map(t => t.type.name);
    tipo.textContent = tipos.join(", ");

    peso.textContent = data.weight;
    altura.textContent = data.height;

    card.classList.remove("hidden");
}

function mostrarError(mensaje) {
    error.textContent = mensaje;
    error.classList.remove("hidden");
}

function ocultarTodo() {
    card.classList.add("hidden");
    error.classList.add("hidden");
}