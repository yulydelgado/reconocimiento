const URL = "./model/"; // Ruta a tu modelo de Teachable Machine
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Cargar el modelo de Teachable Machine
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Configurar la cámara web
    const flip = true; // Voltea la cámara si es necesario
    webcam = new tmImage.Webcam(200, 200, flip); // Tamaño de la cámara
    await webcam.setup(); // Solicitar acceso a la cámara
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Configurar el canvas para mostrar el video
    const canvas = document.getElementById("webcamCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = webcam.canvas.width; // Ajustar tamaño del canvas
    canvas.height = webcam.canvas.height;

    // Configurar el contenedor de etiquetas para mostrar las predicciones
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // Actualizar el fotograma de la cámara
    const canvas = document.getElementById("webcamCanvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(webcam.canvas, 0, 0, canvas.width, canvas.height); // Dibujar el fotograma en el canvas
    await predict(); // Realizar predicciones
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas); // Realizar predicciones con el modelo
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction; // Mostrar las predicciones en el contenedor de etiquetas

        // Lógica para enviar datos al servidor
        if (prediction[0].probability > 0.9) {
            console.log("Mano abierta detectada");
            sendDataToServer("abierta"); // Enviar "abierta" al servidor
        }
        if (prediction[1].probability > 0.9) {
            console.log("Mano cerrada detectada");
            sendDataToServer("cerrada"); // Enviar "cerrada" al servidor
        }
    }
}

async function sendDataToServer(gesture) {
    const serverURL = "tu-url-del-servidor"; // Reemplaza con la URL de tu servidor
    try {
        const response = await fetch(serverURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gesture: gesture }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Data sent to server:", gesture);
    } catch (error) {
        console.error("Error sending data:", error);
    }
}

init(); // Inicializar la aplicación
