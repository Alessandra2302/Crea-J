//Partículas del fondo
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 80; // Ajustar para el tamaño del header

let particlesArray = [];
const colors = [
    'rgba(75, 95, 42, 0.7)', 
    'rgba(117, 149, 99, 0.6)', 
    'rgba(107, 107, 105, 0.9)', 
    'rgba(255, 255, 255, 0.6)' 
];
let mouse = { x: null, y: null };

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 3;
        this.baseSize = this.size;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.shape = Math.random() > 0.7 ? 'star' : 'circle';
        this.opacity = Math.random() * 0.4 + 0.3;
        this.glow = Math.random() * 2 + 1;
    }

    update() {
        // Mouse
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.speedX += (dx / distance) * force * 0.1;
                this.speedY += (dy / distance) * force * 0.1;
                this.size = this.baseSize * (1 + force * 0.4); // Para que crezcan cuando están cerca del mouse
            }
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Desvanecido y reinicio
        this.opacity -= 0.002;
        if (this.opacity <= 0 || this.size <= 0.1) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = this.baseSize = Math.random() * 3 + 2;
            this.opacity = Math.random() * 0.4 + 0.3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = Math.random() > 0.7 ? 'star' : 'circle';
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.glow;
        ctx.shadowColor = this.color;

        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Forma de estrella
            ctx.beginPath();
            const spikes = 5;
            const outerRadius = this.size;
            const innerRadius = this.size / 2;
            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (Math.PI / spikes) * i;
                ctx.lineTo(
                    this.x + Math.cos(angle) * radius,
                    this.y + Math.sin(angle) * radius
                );
            }
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
}

function connectParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.save();
                ctx.strokeStyle = `rgba(75, 95, 42, ${0.3 * (1 - distance / 120)})`;
                ctx.lineWidth = 1 + Math.sin(Date.now() / 500) * 0.5; 
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectParticles();
}

// Inicialización de partículas
for (let i = 0; i < 60; i++) {
    particlesArray.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
    ));
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top - 80;
    for (let i = 0; i < 2; i++) {
        particlesArray.push(new Particle(mouse.x, mouse.y));
    }
});

canvas.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

animate();