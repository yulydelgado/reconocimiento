const preguntas = [
    {
        pregunta: "¿Cuál es la capital de Venezuela?",
        respuestas: ["Caracas", "Barcelona", "Valencia", "Mérida"],
        respuestaCorrecta: 1
    },
    {
        pregunta: "¿Cuál es el animal más grande del mundo?",
        respuestas: ["Elefante", "Ballena azul", "Jirafa", "Oso polar"],
        respuestaCorrecta: 2
    },
    {
        pregunta: "¿Cuál es el río más largo del mundo?",
        respuestas: ["Amazonas", "Nilo", "Misisipi-Misuri", "Yangtsé"],
        respuestaCorrecta: 2
    },
    {
        pregunta: "¿Quién fue el Libertador de Venezuela?",
        respuestas: ["Francisco de Miranda", "Andres Bello", "Simón Bolivar", "Abraham Lincon"],
        respuestaCorrecta: 3
    }
];

let preguntaActual = 0;

function mostrarPregunta() {
    const preguntaDiv = document.getElementById("pregunta");
    const respuesta1 = document.getElementById("respuesta1");
    const respuesta2 = document.getElementById("respuesta2");
    const respuesta3 = document.getElementById("respuesta3");
    const respuesta4 = document.getElementById("respuesta4");

    preguntaDiv.textContent = preguntas[preguntaActual].pregunta;
    respuesta1.textContent = preguntas[preguntaActual].respuestas[0];
    respuesta2.textContent = preguntas[preguntaActual].respuestas[1];
    respuesta3.textContent = preguntas[preguntaActual].respuestas[2];
    respuesta4.textContent = preguntas[preguntaActual].respuestas[3];
}

function verificarRespuesta(respuestaSeleccionada) {
    const resultadoDiv = document.getElementById("resultado");

    if (respuestaSeleccionada === preguntas[preguntaActual].respuestaCorrecta) {
        resultadoDiv.textContent = "¡Correcto!";
        resultadoDiv.style.color = "green";
    } else {
        resultadoDiv.textContent = "Incorrecto";
        resultadoDiv.style.color = "red";
    }

    document.getElementById("siguiente").style.display = "inline-block";
}

function siguientePregunta() {
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        mostrarPregunta();
        document.getElementById("resultado").textContent = "";
        document.getElementById("siguiente").style.display = "none";
    } else {
        alert("¡Has completado el juego!");
    }
}

mostrarPregunta();
