// Face Auth POC - Main JavaScript
// Auto-detect API base path: /faceauth-poc/api/faceauth for production, /api/faceauth for local
const API_BASE = window.location.pathname.includes('/faceauth-poc/') 
    ? '/faceauth-poc/api/faceauth' 
    : '/api/faceauth';
let modelsLoaded = false;
let currentMode = null; // 'register' or 'login'
let stream = null;
let userName = '';

// DOM Elements
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const nameModal = document.getElementById('nameModal');
const nameInput = document.getElementById('nameInput');
const nameOkBtn = document.getElementById('nameOkBtn');
const nameCancelBtn = document.getElementById('nameCancelBtn');
const videoModal = document.getElementById('videoModal');
const resultModal = document.getElementById('resultModal');
const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const captureBtn = document.getElementById('captureBtn');
const cancelBtn = document.getElementById('cancelBtn');
const resultOkBtn = document.getElementById('resultOkBtn');
const statusText = document.getElementById('statusText');
const detectionStatus = document.getElementById('detectionStatus');
const modalTitle = document.getElementById('modalTitle');

// Initialize
async function init() {
    try {
        updateStatus('Loading face detection models...');
        
        // Load face-api.js models from CDN (using SSD MobileNet for better accuracy)
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        
        await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);

        modelsLoaded = true;
        updateStatus('✓ Ready! Choose an option below.');
        registerBtn.disabled = false;
        loginBtn.disabled = false;

        // Check if user is already registered
        checkRegistrationStatus();
    } catch (error) {
        console.error('Error loading models:', error);
        updateStatus('❌ Error loading models. Please refresh the page.');
    }
}

// Check registration status
async function checkRegistrationStatus() {
    try {
        const response = await fetch(`${API_BASE}/status`);
        const data = await response.json();
        
        if (data.registered) {
            updateStatus(`✓ User "${data.username}" is registered. You can login now.`);
        }
    } catch (error) {
        console.error('Error checking status:', error);
    }
}

// Update status message
function updateStatus(message) {
    statusText.textContent = message;
}

// Start webcam with higher resolution for better accuracy
async function startWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            }
        });
        video.srcObject = stream;
        
        // Wait for video to be ready
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                overlay.width = video.videoWidth;
                overlay.height = video.videoHeight;
                resolve();
            };
        });
    } catch (error) {
        console.error('Error accessing webcam:', error);
        showResult(false, 'Camera access denied', 'Please allow camera access to use face recognition.');
        throw error;
    }
}

// Stop webcam
function stopWebcam() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    video.srcObject = null;
}

// Detect face with higher accuracy settings and eye detection
async function detectFace() {
    try {
        const detection = await faceapi
            .detectSingleFace(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
            .withFaceLandmarks()
            .withFaceDescriptor();

        // Validate eyes are visible (relaxed check)
        if (detection) {
            const landmarks = detection.landmarks;
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            
            // Check if both eyes are detected (at least 2 points each - relaxed)
            if (leftEye.length < 2 || rightEye.length < 2) {
                return null;
            }
        }

        return detection;
    } catch (error) {
        console.error('Detection error:', error);
        return null;
    }
}

// Start face detection loop with eye highlighting
let detectionInterval = null;
function startFaceDetection() {
    console.log('Starting face detection loop');
    detectionInterval = setInterval(async () => {
        if (!video || !video.videoWidth || !overlay) {
            console.log('Video not ready yet');
            return;
        }
        
        const detection = await detectFace();
        
        // Clear previous drawings
        const ctx = overlay.getContext('2d');
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        if (detection) {
            console.log('Face detected!');
            // Draw face box
            const box = detection.detection.box;
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            // Highlight eyes
            const landmarks = detection.landmarks;
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            
            // Draw eye regions
            ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
            [leftEye, rightEye].forEach(eye => {
                ctx.beginPath();
                eye.forEach((point, i) => {
                    if (i === 0) ctx.moveTo(point.x, point.y);
                    else ctx.lineTo(point.x, point.y);
                });
                ctx.closePath();
                ctx.fill();
            });

            // Draw all landmarks
            ctx.fillStyle = '#10b981';
            detection.landmarks.positions.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
                ctx.fill();
            });

            if (detectionStatus) {
                detectionStatus.textContent = '✓ Face and eyes detected! Ready to capture.';
                detectionStatus.style.background = '#d1fae5';
                detectionStatus.style.color = '#065f46';
            }
            if (captureBtn) captureBtn.disabled = false;
        } else {
            if (detectionStatus) {
                detectionStatus.textContent = 'Position your face in the frame. Ensure eyes are visible.';
                detectionStatus.style.background = '#f0f4ff';
                detectionStatus.style.color = '#333';
            }
            if (captureBtn) captureBtn.disabled = true;
        }
    }, 100);
}

// Stop face detection loop
function stopFaceDetection() {
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }
}

// Open video modal
async function openVideoModal(mode) {
    currentMode = mode;
    modalTitle.textContent = mode === 'register' ? 'Register Your Face' : 'Login with Face';
    videoModal.classList.add('active');
    
    try {
        await startWebcam();
        startFaceDetection();
    } catch (error) {
        closeVideoModal();
    }
}

// Close video modal
function closeVideoModal() {
    videoModal.classList.remove('active');
    stopFaceDetection();
    stopWebcam();
    captureBtn.disabled = true;
}

// Capture and process face with multiple samples for accuracy
async function captureAndProcess() {
    captureBtn.disabled = true;
    detectionStatus.textContent = 'Processing... Please hold still.';
    
    try {
        // Single capture for better user experience
        const detection = await detectFace();
        if (!detection) {
            detectionStatus.textContent = '❌ Face or eyes not detected. Please try again.';
            captureBtn.disabled = false;
            return;
        }

        const descriptor = Array.from(detection.descriptor);
        console.log('Face captured, descriptor length:', descriptor.length);

        closeVideoModal();

        // Send to backend
        if (currentMode === 'register') {
            await registerFace(descriptor);
        } else {
            await loginWithFace(descriptor);
        }

    } catch (error) {
        console.error('Error processing face:', error);
        detectionStatus.textContent = '❌ Error processing face. Please try again.';
        captureBtn.disabled = false;
    }
}

// Register face with user-provided name
async function registerFace(descriptor) {
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: userName,
                descriptor: descriptor
            })
        });

        const data = await response.json();

        if (response.ok) {
            showResult(true, 'Registration Successful!', `Welcome, ${data.username}! You can now login with your face.`);
            updateStatus(`✓ User "${data.username}" registered successfully.`);
        } else {
            showResult(false, 'Registration Failed', data.message);
        }
    } catch (error) {
        console.error('Error registering:', error);
        showResult(false, 'Registration Failed', 'Network error. Please try again.');
    }
}

// Login with face
async function loginWithFace(descriptor) {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                descriptor: descriptor
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showResult(
                true, 
                'Login Successful!', 
                `Welcome back, ${data.username}!`,
                data.confidence
            );
        } else {
            showResult(
                false, 
                'Login Failed', 
                data.message,
                data.confidence
            );
        }
    } catch (error) {
        console.error('Error logging in:', error);
        showResult(false, 'Login Failed', 'Network error. Please try again.');
    }
}

// Show result modal
function showResult(success, title, message, confidence = null) {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const resultConfidence = document.getElementById('resultConfidence');

    resultIcon.textContent = success ? '✓' : '✕';
    resultIcon.className = success ? 'result-icon success' : 'result-icon error';
    resultTitle.textContent = title;
    resultMessage.textContent = message;

    if (confidence !== null) {
        resultConfidence.textContent = `Confidence: ${confidence}%`;
        resultConfidence.style.display = 'block';
    } else {
        resultConfidence.style.display = 'none';
    }

    resultModal.classList.add('active');
}

// Close result modal
function closeResultModal() {
    resultModal.classList.remove('active');
}

// Event Listeners
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        console.log('Register button clicked');
        if (nameInput) nameInput.value = '';
        if (nameModal) {
            nameModal.classList.add('active');
            console.log('Name modal opened');
        }
    });
}

if (nameOkBtn) {
    nameOkBtn.addEventListener('click', () => {
        console.log('Name OK button clicked');
        const name = nameInput ? nameInput.value.trim() : '';
        console.log('Name entered:', name);
        if (!name) {
            alert('Please enter your name');
            return;
        }
        userName = name;
        if (nameModal) nameModal.classList.remove('active');
        console.log('Opening video modal for registration');
        openVideoModal('register');
    });
}

if (nameCancelBtn) {
    nameCancelBtn.addEventListener('click', () => {
        if (nameModal) nameModal.classList.remove('active');
    });
}

if (loginBtn) loginBtn.addEventListener('click', () => openVideoModal('login'));
if (cancelBtn) cancelBtn.addEventListener('click', closeVideoModal);
if (captureBtn) captureBtn.addEventListener('click', captureAndProcess);
if (resultOkBtn) resultOkBtn.addEventListener('click', closeResultModal);

// Initialize on page load
window.addEventListener('load', init);
