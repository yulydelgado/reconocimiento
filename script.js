// script.js

// Funciones de Teachable Machine (init, loop, predict, drawPose)
// ... (copia el código de Teachable Machine aquí)

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const {
        pose,
        posenetOutput
    } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    let bestPrediction = "";
    let bestProbability = 0;

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        if (prediction[i].probability > bestProbability) {
            bestProbability = prediction[i].probability;
            bestPrediction = prediction[i].className;
        }
    }

    // Actualizar el estado del bombillo
    const estadoBombillo = document.querySelector("#estado-bombillo span");
    if (bestPrediction === "pose1" && bestProbability > 0.8) { // Ajusta el nombre de la clase y el umbral según tu modelo
        estadoBombillo.textContent = "Encendido";
    } else if (bestPrediction === "pose2" && bestProbability > 0.8) { // Ajusta el nombre de la clase y el umbral según tu modelo
        estadoBombillo.textContent = "Apagado";
    } else {
        estadoBombillo.textContent = "Desconocido";
    }

    // finally draw the poses
    drawPose(pose);
}
