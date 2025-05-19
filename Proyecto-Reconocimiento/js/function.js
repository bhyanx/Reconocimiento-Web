const URL = "./models/";

let model, webcam, maxPredictions, loopId = null;

// Botón para activar/desactivar cámara
const initBtn = document.getElementById('init-btn');
const cameraBtn = document.getElementById('camera-toggle');
const cameraPlaceholder = document.getElementById('camera-placeholder');
const modelInfo = document.getElementById('model-info');

cameraBtn.disabled = true;

initBtn.addEventListener('click', async function () {
    initBtn.disabled = true;
    modelInfo.textContent = "Cargando modelo...";
    // Cargar modelo y metadata
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    modelInfo.textContent = "Modelo local listo";
    // Actualiza nombres de clases en las barras
    const metadata = await fetch(metadataURL).then(r => r.json());
    for (let i = 0; i < maxPredictions; i++) {
        const labelSpan = document.querySelector(`#bar-${i+1}`)?.parentElement.previousElementSibling.querySelector('span');
        if (labelSpan) labelSpan.textContent = metadata.labels[i] || `Clase ${i+1}`;
    }
    // Habilitar botones
    cameraBtn.disabled = false;
});

cameraBtn.addEventListener('click', async function () {
    if (cameraBtn.textContent === 'Activar Cámara') {
        cameraBtn.disabled = true;
        modelInfo.textContent = "Cargando modelo y cámara...";
        await startCameraAndModel();
        cameraBtn.textContent = 'Desactivar Cámara';
        cameraBtn.classList.add('border-red-300', 'text-red-300');
        cameraBtn.classList.remove('border-white/70', 'text-white/90');
        cameraBtn.disabled = false;
    } else {
        stopCamera();
        cameraBtn.textContent = 'Activar Cámara';
        cameraBtn.classList.remove('border-red-300', 'text-red-300');
        cameraBtn.classList.add('border-white/70', 'text-white/90');
    }
});

async function startCameraAndModel() {
    // Cargar modelo solo una vez
    if (!model) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        modelInfo.textContent = "Modelo local listo";
        // Actualiza nombres de clases en las barras
        const metadata = await fetch(metadataURL).then(r => r.json());
        for (let i = 0; i < maxPredictions; i++) {
            const labelSpan = document.querySelector(`#bar-${i+1}`)?.parentElement.previousElementSibling.querySelector('span');
            if (labelSpan) labelSpan.textContent = metadata.labels[i] || `Clase ${i+1}`;
        }
    }
    // Iniciar webcam
    webcam = new tmImage.Webcam(200, 200, true);
    await webcam.setup();
    await webcam.play();
    cameraPlaceholder.innerHTML = "";
    cameraPlaceholder.appendChild(webcam.canvas);
    loopId = requestAnimationFrame(loop);
}

function stopCamera() {
    if (webcam) {
        webcam.stop();
        webcam = null;
    }
    if (loopId) {
        cancelAnimationFrame(loopId);
        loopId = null;
    }
    cameraPlaceholder.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p class="text-white/50 mt-2">Cámara no activada</p>
    `;

    // Reiniciar barras y porcentajes
    for (let i = 1; i <= maxPredictions; i++) {
        const percentId = "percentage-" + i;
        const barId = "bar-" + i;
        if (document.getElementById(percentId)) {
            document.getElementById(percentId).textContent = "0%";
        }
        if (document.getElementById(barId)) {
            document.getElementById(barId).style.width = "0%";
        }
    }
}

async function loop() {
    if (webcam && model) {
        webcam.update();
        await predict();
        loopId = requestAnimationFrame(loop);
    }
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < prediction.length; i++) {
        const percent = Math.round(prediction[i].probability * 100);
        const percentId = "percentage-" + (i + 1);
        const barId = "bar-" + (i + 1);
        if (document.getElementById(percentId) && document.getElementById(barId)) {
            document.getElementById(percentId).textContent = percent + "%";
            document.getElementById(barId).style.width = percent + "%";
        }
    }
}