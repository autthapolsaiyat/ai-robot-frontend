const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
const processBtn = document.getElementById('processBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const statusText = document.getElementById('statusText');

canvas.width = 800;
canvas.height = 600;

let isProcessing = false;
let processProgress = 0;
let processingIntensity = 1;

// Matrix Rain Effect
const matrixChars = '01';
let fontSize = 14;
let columns = canvas.width / fontSize;
let drops = [];

function initMatrixRain() {
    columns = canvas.width / fontSize;
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }
}

initMatrixRain();

function drawMatrixRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    
    const speed = processingIntensity;
    
    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i] += speed;
    }
}

// Neural Network
const layers = [8, 12, 12, 12, 6];
const nodes = [];
const connections = [];

const layerSpacing = canvas.width / (layers.length + 1);

layers.forEach((nodeCount, layerIndex) => {
    const layerNodes = [];
    const nodeSpacing = canvas.height / (nodeCount + 1);
    
    for (let i = 0; i < nodeCount; i++) {
        layerNodes.push({
            x: layerSpacing * (layerIndex + 1),
            y: nodeSpacing * (i + 1),
            radius: 12,
            activation: Math.random(),
            pulsePhase: Math.random() * Math.PI * 2,
            colorIndex: (layerIndex + i) % 5
        });
    }
    nodes.push(layerNodes);
});

for (let i = 0; i < nodes.length - 1; i++) {
    for (let j = 0; j < nodes[i].length; j++) {
        for (let k = 0; k < nodes[i + 1].length; k++) {
            connections.push({
                from: nodes[i][j],
                to: nodes[i + 1][k],
                weight: Math.random(),
                flowPhase: Math.random() * Math.PI * 2,
                baseWeight: Math.random(),
                direction: 1
            });
        }
    }
}

let time = 0;

const colorPalette = [
    { hue: 180 },
    { hue: 280 },
    { hue: 330 },
    { hue: 60 },
    { hue: 120 }
];

function drawConnection(conn, t) {
    // คำนวณตำแหน่งของ particle ที่วิ่งไปมา
    const flowSpeed = 3 * processingIntensity;
    let flowPosition = (Math.sin(t * flowSpeed + conn.flowPhase) + 1) / 2;
    
    // สุ่มเปลี่ยนทิศทางบางเส้น
    if (Math.sin(t + conn.flowPhase) > 0.7) {
        flowPosition = 1 - flowPosition;
    }
    
    // คำนวณตำแหน่งของ particle
    const particleX = conn.from.x + (conn.to.x - conn.from.x) * flowPosition;
    const particleY = conn.from.y + (conn.to.y - conn.from.y) * flowPosition;
    
    // วาดเส้นพื้นฐาน (บางลง)
    const baseAlpha = 0.1 + conn.weight * 0.15;
    const hue = conn.weight * 60 + 180;
    
    ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${baseAlpha})`;
    ctx.lineWidth = 0.3 + conn.weight * 0.5; // ลดความหนา
    ctx.beginPath();
    ctx.moveTo(conn.from.x, conn.from.y);
    ctx.lineTo(conn.to.x, conn.to.y);
    ctx.stroke();
    
    // วาด particle ที่วิ่ง (เล็กลง)
    const particleSize = 2 + conn.weight * 2; // ลดขนาด
    const particleGlow = particleSize * 2 * processingIntensity; // ลด glow
    
    const particleGradient = ctx.createRadialGradient(
        particleX, particleY, 0,
        particleX, particleY, particleGlow
    );
    
    particleGradient.addColorStop(0, `hsla(${hue}, 100%, 80%, ${0.7 * processingIntensity})`);
    particleGradient.addColorStop(0.3, `hsla(${hue}, 90%, 60%, ${0.4 * processingIntensity})`);
    particleGradient.addColorStop(1, `hsla(${hue}, 80%, 40%, 0)`);
    
    ctx.fillStyle = particleGradient;
    ctx.beginPath();
    ctx.arc(particleX, particleY, particleGlow, 0, Math.PI * 2);
    ctx.fill();
    
    // วาดหาง trail (บางลง)
    const trailLength = 15; // ลดความยาว
    for (let i = 1; i <= trailLength; i++) {
        const trailPos = flowPosition - (i / trailLength) * 0.08;
        if (trailPos >= 0 && trailPos <= 1) {
            const trailX = conn.from.x + (conn.to.x - conn.from.x) * trailPos;
            const trailY = conn.from.y + (conn.to.y - conn.from.y) * trailPos;
            const trailAlpha = (1 - i / trailLength) * 0.2 * processingIntensity; // ลดความเข้ม
            
            ctx.fillStyle = `hsla(${hue}, 90%, 70%, ${trailAlpha})`;
            ctx.beginPath();
            ctx.arc(trailX, trailY, particleSize * (1 - i / trailLength) * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawNode(node, t) {
    const pulse = Math.sin(t * 3 + node.pulsePhase) * 0.2 + 0.8;
    const glowSize = node.radius + pulse * 6;
    
    const color = colorPalette[node.colorIndex];
    const hue = color.hue + node.activation * 20;
    
    const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, glowSize
    );
    
    gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.7)`);
    gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 0.25)`);
    gradient.addColorStop(1, `hsla(${hue}, 80%, 40%, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = `hsla(${hue}, 85%, 65%, ${0.8 + pulse * 0.1})`;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = `hsla(${hue}, 100%, 75%, 0.9)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.stroke();
}

function animate() {
    time += 0.016;
    
    drawMatrixRain();
    
    connections.forEach(conn => drawConnection(conn, time));
    
    nodes.forEach(layer => {
        layer.forEach(node => {
            const changeSpeed = 0.015 * processingIntensity;
            node.activation += (Math.random() - 0.5) * changeSpeed;
            node.activation = Math.max(0, Math.min(1, node.activation));
            drawNode(node, time);
        });
    });
    
    requestAnimationFrame(animate);
}

async function startProcess() {
    if (isProcessing) return;
    
    isProcessing = true;
    processProgress = 0;
    processBtn.disabled = true;
    processBtn.textContent = 'Processing...';
    
    const duration = 5000;
    const startTime = Date.now();
    
    const processInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        processProgress = Math.min((elapsed / duration) * 100, 100);
        
        processingIntensity = 1 + (processProgress / 100) * 2.5;
        
        fontSize = 14 - (processProgress / 100) * 5;
        initMatrixRain();
        
        progressBar.style.width = processProgress + '%';
        progressText.textContent = Math.floor(processProgress) + '%';
        
        if (processProgress < 30) {
            statusText.textContent = 'Initializing neural pathways...';
        } else if (processProgress < 60) {
            statusText.textContent = 'Processing data streams...';
        } else if (processProgress < 90) {
            statusText.textContent = 'Optimizing connections...';
        } else {
            statusText.textContent = 'Finalizing computation...';
        }
        
        if (processProgress >= 100) {
            clearInterval(processInterval);
            setTimeout(() => {
                isProcessing = false;
                processingIntensity = 1;
                fontSize = 14;
                initMatrixRain();
                processBtn.disabled = false;
                processBtn.textContent = 'Start Process';
                statusText.textContent = 'Process completed! ✓';
                progressBar.style.width = '0%';
                progressText.textContent = '0%';
                
                setTimeout(() => {
                    statusText.textContent = '';
                }, 2000);
            }, 500);
        }
    }, 50);
}

processBtn.addEventListener('click', startProcess);

animate();

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    nodes.forEach(layer => {
        layer.forEach(node => {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                node.activation = 1 - distance / 100;
            }
        });
    });
});
