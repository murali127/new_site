// Enhanced Portfolio JavaScript with Memory Game and Updated Color Scheme
class PortfolioGameEngine {
    constructor() {
        this.score = 0;
        this.progress = 0;
        this.achievements = {
            explorer: false,
            interactor: false,
            master: false
        };
        this.sectionsVisited = new Set();
        this.interactions = 0;
        this.memoryGame = null;
        
        this.init();
    }
    
    init() {
        this.setupCursor();
        this.setupMatrixBackground();
        this.setupThreeJSScenes();
        this.setupScrollTracking();
        this.setupInteractiveElements();
        this.setupSkillAnimations();
        this.setupMemoryGame();
        this.setupFormHandling();
        this.updateUI();
    }
    
    setupCursor() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 100);
        });
        
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            follower.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
    
    setupMatrixBackground() {
        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function draw() {
            ctx.fillStyle = 'rgba(26, 26, 46, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0f3460';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(draw, 35);
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    setupThreeJSScenes() {
        this.setupHeroScene();
        this.setupSkillsScene();
        this.setupContactScene();
    }
    
    setupHeroScene() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Create floating geometric objects
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.7, 32, 32),
            new THREE.ConeGeometry(0.7, 1.5, 32),
            new THREE.OctahedronGeometry(0.8),
            new THREE.TetrahedronGeometry(0.9)
        ];
        
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x0f3460,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        
        const objects = [];
        for (let i = 0; i < 15; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.x = (Math.random() - 0.5) * 20;
            mesh.position.y = (Math.random() - 0.5) * 20;
            mesh.position.z = (Math.random() - 0.5) * 20;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            scene.add(mesh);
            objects.push(mesh);
        }
        
        camera.position.z = 15;
        
        function animate() {
            requestAnimationFrame(animate);
            
            objects.forEach((obj, index) => {
                obj.rotation.x += 0.01 + index * 0.001;
                obj.rotation.y += 0.01 + index * 0.001;
                
                obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
                obj.position.x += Math.cos(Date.now() * 0.001 + index) * 0.005;
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
    }
    
    setupSkillsScene() {
        const canvas = document.getElementById('skills-canvas');
        if (!canvas) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Create skill constellation
        const skillPoints = [];
        const skillConnections = [];
        
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 16, 16);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x533483,
                transparent: true,
                opacity: 0.8
            });
            const point = new THREE.Mesh(geometry, material);
            
            point.position.x = (Math.random() - 0.5) * 10;
            point.position.y = (Math.random() - 0.5) * 10;
            point.position.z = (Math.random() - 0.5) * 10;
            
            scene.add(point);
            skillPoints.push(point);
        }
        
        // Create connections between points
        for (let i = 0; i < skillPoints.length; i++) {
            for (let j = i + 1; j < skillPoints.length; j++) {
                const distance = skillPoints[i].position.distanceTo(skillPoints[j].position);
                if (distance < 3) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        skillPoints[i].position,
                        skillPoints[j].position
                    ]);
                    const material = new THREE.LineBasicMaterial({ 
                        color: 0x7209b7,
                        transparent: true,
                        opacity: 0.3
                    });
                    const line = new THREE.Line(geometry, material);
                    scene.add(line);
                    skillConnections.push(line);
                }
            }
        }
        
        camera.position.z = 8;
        
        function animate() {
            requestAnimationFrame(animate);
            
            skillPoints.forEach((point, index) => {
                point.rotation.x += 0.02;
                point.rotation.y += 0.02;
                
                point.position.y += Math.sin(Date.now() * 0.001 + index) * 0.005;
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
    }
    
    setupContactScene() {
        const canvas = document.getElementById('contact-canvas');
        if (!canvas) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Create communication network
        const nodes = [];
        const connections = [];
        
        for (let i = 0; i < 12; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 16, 16);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x457b9d,
                transparent: true,
                opacity: 0.9
            });
            const node = new THREE.Mesh(geometry, material);
            
            const angle = (i / 12) * Math.PI * 2;
            const radius = 3 + Math.random() * 2;
            node.position.x = Math.cos(angle) * radius;
            node.position.y = Math.sin(angle) * radius;
            node.position.z = (Math.random() - 0.5) * 4;
            
            scene.add(node);
            nodes.push(node);
        }
        
        // Create data flow lines
        for (let i = 0; i < nodes.length; i++) {
            const nextIndex = (i + 1) % nodes.length;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                nodes[i].position,
                nodes[nextIndex].position
            ]);
            const material = new THREE.LineBasicMaterial({ 
                color: 0x0f3460,
                transparent: true,
                opacity: 0.6
            });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            connections.push(line);
        }
        
        camera.position.z = 10;
        
        function animate() {
            requestAnimationFrame(animate);
            
            nodes.forEach((node, index) => {
                const angle = (index / nodes.length) * Math.PI * 2 + Date.now() * 0.001;
                const radius = 3 + Math.sin(Date.now() * 0.001 + index) * 0.5;
                
                node.position.x = Math.cos(angle) * radius;
                node.position.y = Math.sin(angle) * radius;
                
                node.material.opacity = 0.5 + Math.sin(Date.now() * 0.002 + index) * 0.3;
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
    }
    
    setupScrollTracking() {
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.visitSection(sectionId);
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    visitSection(sectionId) {
        if (!this.sectionsVisited.has(sectionId)) {
            this.sectionsVisited.add(sectionId);
            this.addScore(10);
            this.updateProgress();
            
            if (this.sectionsVisited.size >= 3 && !this.achievements.explorer) {
                this.unlockAchievement('explorer');
            }
        }
    }
    
    setupInteractiveElements() {
        const interactiveElements = document.querySelectorAll('.interactive-element, .interactive-btn, .interactive-card, .interactive-project-card, .interactive-cert-card, .interactive-skill, .interactive-stat');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addInteraction();
                this.createParticleEffect(element);
            });
            
            element.addEventListener('click', () => {
                this.addScore(5);
                this.addInteraction();
                this.createClickEffect(element);
            });
        });
    }
    
    addInteraction() {
        this.interactions++;
        if (this.interactions >= 20 && !this.achievements.interactor) {
            this.unlockAchievement('interactor');
        }
    }
    
    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const particles = document.createElement('div');
        particles.style.position = 'fixed';
        particles.style.left = rect.left + rect.width / 2 + 'px';
        particles.style.top = rect.top + rect.height / 2 + 'px';
        particles.style.width = '4px';
        particles.style.height = '4px';
        particles.style.background = '#0f3460';
        particles.style.borderRadius = '50%';
        particles.style.pointerEvents = 'none';
        particles.style.zIndex = '9999';
        particles.style.animation = 'particleFloat 1s ease-out forwards';
        
        document.body.appendChild(particles);
        
        setTimeout(() => {
            particles.remove();
        }, 1000);
    }
    
    createClickEffect(element) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = rect.left + rect.width / 2 + 'px';
        ripple.style.top = rect.top + rect.height / 2 + 'px';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.background = 'radial-gradient(circle, rgba(15, 52, 96, 0.6), transparent)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9998';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'rippleEffect 0.6s ease-out forwards';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupSkillAnimations() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width;
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }
    
    setupMemoryGame() {
        this.memoryGame = new MemoryGame();
    }
    
    setupFormHandling() {
        document.getElementById('contactForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                // Using EmailJS service
                await emailjs.send(
                    'lio_040', // Replace with your EmailJS service ID
                    'template_vj3jt6v', // Replace with your EmailJS template ID
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        subject: formData.subject,
                        message: formData.message,
                        to_email: 'muralijay360@gmail.com' // Your email address
                    },
                    'WgbAOVtu3iCT64oaD' // Replace with your EmailJS user ID
                );

                // Show success message
                submitButton.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                submitButton.classList.add('success');

                // Reset form
                this.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    submitButton.classList.remove('success');
                }, 3000);

            } catch (error) {
                console.error('Error:', error);
                submitButton.innerHTML = '<i class="fas fa-times"></i> Failed to Send';
                submitButton.classList.add('error');

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    submitButton.classList.remove('error');
                }, 3000);
            }
        });
    }
    
    handleFormSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('success');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        
        this.addScore(25);
        this.addInteraction();
        
        setTimeout(() => {
            submitBtn.classList.remove('success');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            form.reset();
        }, 3000);
    }
    
    addScore(points) {
        this.score += points;
        this.updateUI();
    }
    
    updateProgress() {
        const totalSections = 7;
        this.progress = Math.round((this.sectionsVisited.size / totalSections) * 100);
        
        if (this.progress >= 100 && !this.achievements.master) {
            this.unlockAchievement('master');
        }
        
        this.updateUI();
    }
    
    unlockAchievement(type) {
        this.achievements[type] = true;
        this.addScore(50);
        this.showAchievementNotification(type);
        this.updateUI();
    }
    
    showAchievementNotification(type) {
        const notification = document.getElementById('achievementNotification');
        const text = document.getElementById('achievementText');
        
        const messages = {
            explorer: 'Explorer Unlocked! You\'ve visited multiple sections.',
            interactor: 'Interactor Unlocked! You love clicking around!',
            master: 'Master Unlocked! You\'ve explored the entire portfolio!'
        };
        
        text.textContent = messages[type];
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('progressText').textContent = this.progress + '%';
        document.getElementById('progressFill').style.width = this.progress + '%';
        
        Object.keys(this.achievements).forEach(key => {
            const badge = document.getElementById(key + 'Badge');
            if (this.achievements[key]) {
                badge.classList.add('unlocked');
            }
        });
    }
}

class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.gameTimer = null;
        this.isGameActive = false;
        
        this.techIcons = [
            '⚛️', '🐍', '☕', '🌐', '📱', '🔧', '🎨', '🔒',
            '⚛️', '🐍', '☕', '🌐', '📱', '🔧', '🎨', '🔒'
        ];
        
        this.init();
    }
    
    init() {
        this.createGameBoard();
        this.setupGameControls();
    }
    
    createGameBoard() {
        const grid = document.getElementById('memoryGrid');
        if (!grid) return;
        
        this.shuffleArray(this.techIcons);
        
        this.techIcons.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.icon = icon;
            card.dataset.index = index;
            card.textContent = '?';
            
            card.addEventListener('click', () => this.flipCard(card));
            
            grid.appendChild(card);
            this.cards.push(card);
        });
    }
    
    setupGameControls() {
        const startBtn = document.getElementById('startMemoryGame');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
    }
    
    startGame() {
        this.resetGame();
        this.isGameActive = true;
        this.startTimer();
        
        const startBtn = document.getElementById('startMemoryGame');
        startBtn.textContent = 'Game Active';
        startBtn.disabled = true;
    }
    
    resetGame() {
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.isGameActive = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        this.cards.forEach(card => {
            card.classList.remove('flipped', 'matched');
            card.textContent = '?';
        });
        
        this.updateGameStats();
    }
    
    startTimer() {
        this.gameTimer = setInterval(() => {
            this.gameTime++;
            this.updateGameStats();
        }, 1000);
    }
    
    flipCard(card) {
        if (!this.isGameActive || card.classList.contains('flipped') || card.classList.contains('matched') || this.flippedCards.length >= 2) {
            return;
        }
        
        card.classList.add('flipped');
        card.textContent = card.dataset.icon;
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateGameStats();
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.dataset.icon === card2.dataset.icon) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.matchedPairs++;
                this.flippedCards = [];
                
                if (this.matchedPairs === this.techIcons.length / 2) {
                    this.endGame();
                }
                
                this.updateGameStats();
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '?';
                card2.textContent = '?';
                this.flippedCards = [];
            }, 1000);
        }
    }
    
    endGame() {
        this.isGameActive = false;
        clearInterval(this.gameTimer);
        
        const startBtn = document.getElementById('startMemoryGame');
        startBtn.textContent = 'Play Again';
        startBtn.disabled = false;
        
        // Add score to main game
        if (window.portfolioGame) {
            const timeBonus = Math.max(0, 120 - this.gameTime);
            const moveBonus = Math.max(0, 50 - this.moves);
            const totalScore = 100 + timeBonus + moveBonus;
            window.portfolioGame.addScore(totalScore);
        }
        
        setTimeout(() => {
            alert(`Congratulations! You completed the game in ${this.moves} moves and ${this.formatTime(this.gameTime)}!`);
        }, 500);
    }
    
    updateGameStats() {
        document.getElementById('moveCount').textContent = this.moves;
        document.getElementById('matchCount').textContent = this.matchedPairs;
        document.getElementById('gameTime').textContent = this.formatTime(this.gameTime);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) translateY(-50px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes rippleEffect {
        0% {
            width: 0px;
            height: 0px;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Visitor Counter using CountAPI
const updateVisitorCount = async () => {
    try {
        const response = await fetch('https://api.countapi.xyz/hit/muralijay.netlify.app/visits');
        const data = await response.json();
        document.getElementById('visitor-count').textContent = data.value.toLocaleString();
    } catch (error) {
        console.error('Error updating visitor count:', error);
    }
};

// Call when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioGame = new PortfolioGameEngine();
    updateVisitorCount();
});

// Handle window resize
window.addEventListener('resize', () => {
    const matrixCanvas = document.getElementById('matrixCanvas');
    if (matrixCanvas) {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    }
});

