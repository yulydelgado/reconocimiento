// the link to your model provided by Teachable Machine export panel
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;
let port; // Variable para almacenar el puerto serial

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    // Agregar botón de conexión
    const connectButton = document.createElement("button");
    connectButton.textContent = "Conectar Arduino";
    connectButton.onclick = connectSerial;
    document.body.appendChild(connectButton);
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let bestPrediction = "";
    let bestProbability = 0;
    let serialData = ""; // Variable para almacenar los datos seriales

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        if (prediction[i].probability > bestProbability) {
            bestProbability = prediction[i].probability;
            bestPrediction = prediction[i].className;
        }
    }
    const estadoBombillo = document.querySelector("#estado-bombillo span");
    if (bestPrediction === "Encender" && bestProbability > 0.8) {
        estadoBombillo.textContent = "Su mano esta abierta!!";
        serialData = "1"; // Enviar '1' para encender
    } else if (bestPrediction === "Apagar" && bestProbability > 0.8) {
        estadoBombillo.textContent = "Su mano esta cerrada";
        serialData = "0"; // Enviar '0' para apagar
    } else {
        estadoBombillo.textContent = "Desconocido";
        serialData = "2"; // Enviar '2' para desconocido
    }
    sendSerialData(serialData); // Envía los datos seriales a Arduino Uno
}

// Función para conectar al puerto serial
async function connectSerial() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 }); // Ajusta la velocidad de baudios según tu configuración
        console.log("Puerto serial conectado.");
    } catch (error) {
        console.error("Error al conectar al puerto serial:", error);
    }
}

// Función para enviar datos seriales a Arduino Uno
async function sendSerialData(data) {
    if (!port) {
        console.error("Puerto serial no conectado.");
        return;
    }

    try {
        const textEncoder = new TextEncoder();
        const writer = port.writable.getWriter();
        await writer.write(textEncoder.encode(data));
        writer.releaseLock();
    } catch (error) {
        console.error("Error al enviar datos seriales:", error);
    }
}

init();
