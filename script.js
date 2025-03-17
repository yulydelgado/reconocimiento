const URL = "./model/"; // Ruta a tu modelo de Teachable Machine Pose
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Cargar el modelo de Teachable Machine Pose
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Configurar la cámara web
    const size = 200;
    const flip = true;
    webcam = new tmPose.Webcam(size, size, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Configurar el canvas
    const canvas = document.getElementById("webcamCanvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");

    // Configurar el contenedor de etiquetas
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop(timestamp) {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Estimar la pose
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Realizar la predicción
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    // Dibujar la pose
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

async function sendDataToServer(gesture) {
    const serverURL = "tu-url-del-servidor";
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

init();
