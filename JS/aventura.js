// Script para mejorar la experiencia de las tarjetas de aventura
document.addEventListener('DOMContentLoaded', function() {
    // Carga progresiva de imágenes
    const images = document.querySelectorAll('.card-image img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                // Si la imagen ya está cargada
                if (img.complete) {
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Animación suave al hacer scroll
    const cards = document.querySelectorAll('.destination-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        card.style.animationPlayState = 'paused';
        cardObserver.observe(card);
    });
    
    // Efecto parallax suave en las imágenes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.card-image img');
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = scrolled * 0.02;
                element.style.transform = `translateY(${speed}px)`;
            }
        });
    });
    
    // Efecto de loading para botones
    const exploreButtons = document.querySelectorAll('.btn-explore');
    
    exploreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Solo si el href es "#" (placeholder)
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                
                // Crear efecto de ripple
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                
                // Posicionar el ripple
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                
                // Remover el ripple después de la animación
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Mostrar mensaje temporal
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Próximamente';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    });
});

// CSS para el efecto ripple (se agrega dinámicamente)
const style = document.createElement('style');
style.textContent = `
    .btn-explore {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .card-image img {
        opacity: 0;
        transition: opacity 0.5s ease, transform 0.3s ease;
    }
    
    .card-image img.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);
