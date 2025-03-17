const URL = "./model/"; // Ruta a tu modelo de Teachable Machine
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; // Voltea la cámara si es necesario
    webcam = new tmImage.Webcam(200, 200, flip); // Tamaño de la cámara
    await webcam.setup(); // Solicita acceso a la cámara
    await webcam.play();
    window.requestAnimationFrame(loop);

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // Actualiza el fotograma de la cámara
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        // Aquí puedes agregar la lógica para enviar datos al servidor
        if (prediction[0].probability > 0.9){
            console.log("Mano abierta detectada");
            //funcion para enviar datos al servidor
        }
        if (prediction[1].probability > 0.9){
            console.log("Mano cerrada detectada");
            //funcion para enviar datos al servidor
        }
    }
}

init();
