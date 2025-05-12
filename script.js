// Particle Animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle class
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(0, 255, 136, ${Math.random() * 0.5 + 0.1})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((particle, index) => {
        for (let j = index + 1; j < particles.length; j++) {
            const dx = particle.x - particles[j].x;
            const dy = particle.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animate);
}

animate();

// Initialize Vanilla-tilt
VanillaTilt.init(document.querySelectorAll(".database-card"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    scale: 1.05
});

// Initialize GSAP ScrollTrigger and ScrollTo
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Header animation
gsap.from('header', {
    duration: 1,
    y: -100,
    opacity: 0,
    ease: 'power3.out'
});

// Navigation animation
gsap.from('nav', {
    duration: 1,
    y: -50,
    opacity: 0,
    delay: 0.3,
    ease: 'power3.out'
});

// Section title animations
gsap.utils.toArray('.section h2').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
});

// Feature cards animation
gsap.utils.toArray('.feature').forEach((feature, index) => {
    gsap.from(feature, {
        scrollTrigger: {
            trigger: feature,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// Database cards animation
gsap.utils.toArray('.database-card').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        scale: 0.8,
        opacity: 0,
        delay: index * 0.1,
        ease: 'back.out(1.7)'
    });
});

// RNA-Seq workflow animation
const workflowSteps = gsap.utils.toArray('.workflow-step');
const workflowArrows = gsap.utils.toArray('.workflow-arrow');
const workflowRows = gsap.utils.toArray('.workflow-row');

// Create a timeline for the workflow
const workflowTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.rnaseq-workflow',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    }
});

// Animate rows first
workflowRows.forEach((row, index) => {
    workflowTimeline.from(row, {
        duration: 0.5,
        y: 50,
        opacity: 0,
        ease: 'power2.out'
    }, index * 0.3);
});

// Animate steps and arrows within each row
workflowRows.forEach((row, rowIndex) => {
    const steps = row.querySelectorAll('.workflow-step');
    const arrows = row.querySelectorAll('.workflow-arrow');

    steps.forEach((step, index) => {
        workflowTimeline.from(step, {
            duration: 0.4,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(1.7)'
        }, rowIndex * 0.3 + index * 0.2);

        if (index < arrows.length) {
            workflowTimeline.from(arrows[index], {
                duration: 0.3,
                scale: 0,
                opacity: 0,
                ease: 'power2.out'
            }, rowIndex * 0.3 + index * 0.2 + 0.1);
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a, .footer-section a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: targetSection,
                    offsetY: 70,
                    autoKill: false
                },
                ease: 'power3.inOut'
            });
        }
    });
});

// Layout toggle animation
document.addEventListener('DOMContentLoaded', function() {
    const layoutToggle = document.getElementById('layoutToggle');
    const workflowContainer = document.querySelector('.workflow-container');
    const toggleIcon = layoutToggle.querySelector('i');
    const toggleText = layoutToggle.querySelector('span');

    layoutToggle.addEventListener('click', function() {
        // Toggle between horizontal and vertical layouts
        workflowContainer.classList.toggle('horizontal');
        workflowContainer.classList.toggle('vertical');

        // Animate the transition
        gsap.to(workflowContainer, {
            duration: 0.5,
            scale: 0.95,
            opacity: 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Update button icon and text with animation
        gsap.to(toggleIcon, {
            duration: 0.3,
            rotation: workflowContainer.classList.contains('vertical') ? 90 : 0,
            ease: 'power2.inOut'
        });

        if (workflowContainer.classList.contains('vertical')) {
            toggleIcon.className = 'fas fa-arrows-alt-v';
            toggleText.textContent = 'Switch to Horizontal';
        } else {
            toggleIcon.className = 'fas fa-arrows-alt-h';
            toggleText.textContent = 'Switch to Vertical';
        }
    });
});

// Add hover animations to cards
gsap.utils.toArray('.feature, .database-card, .resource-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            duration: 0.3,
            scale: 1.05,
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.3,
            scale: 1,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            ease: 'power2.out'
        });
    });
});

// Add active class to navigation items on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add animation to cards on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature, .tool-card, .database-card, .resource-card').forEach(card => {
    observer.observe(card);
}); 