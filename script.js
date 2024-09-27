document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.querySelector('#spin-button');
    const wheel = document.querySelector('#wheel');
    const result = document.querySelector('#result');
    const fireworks = document.querySelector('#fireworks');
    const goodbyeMessage = document.querySelector('#goodbye-message');

    let segments = [
        'Supply Chain',
        'Quality Assurance',
        'Process Development',
        'Quality Control',
        'Manufacturing'
    ];

    let lines = ['line0', 'line1', 'line2', 'line3', 'line4'];

    const createWheel = () => {
        // Clear existing lines and segments
        wheel.innerHTML = '';

        // Create lines
        lines.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('line');
            lineDiv.id = line;
            lineDiv.style.transform = `rotate(${index * (360 / lines.length)}deg)`;
            wheel.appendChild(lineDiv);
        });

        // Create segments
        segments.forEach((segment, index) => {
            const segmentDiv = document.createElement('div');
            segmentDiv.classList.add('segment');
            segmentDiv.style.transform = `rotate(${index * (360 / segments.length)}deg)`;
            const segmentText = document.createElement('div');
            segmentText.classList.add('segment-text');
            segmentText.textContent = segment;
            segmentDiv.appendChild(segmentText);
            wheel.appendChild(segmentDiv);
        });

        // Add small circle with logo
        const smallCircle = document.createElement('div');
        smallCircle.classList.add('small-circle');
        const logo = document.createElement('img');
        logo.src = 'AP_LOGO.png';
        logo.alt = 'Logo';
        logo.classList.add('logo');
        smallCircle.appendChild(logo);
        wheel.appendChild(smallCircle);
    };

    const removeRandomLine = () => {
        const remainingLines = lines.filter(line => document.getElementById(line) !== null);
        if (remainingLines.length > 0) {
            const randomLineIndex = Math.floor(Math.random() * remainingLines.length);
            const randomLine = document.getElementById(remainingLines[randomLineIndex]);
            if (randomLine) {
                randomLine.remove();
                lines = lines.filter(line => line !== randomLine.id); // Update the lines array to reflect the removed line
            }
        }
    };

    const triggerFireworks = () => {
        fireworks.width = window.innerWidth;
        fireworks.height = window.innerHeight;
        const ctx = fireworks.getContext('2d');
        fireworks.classList.remove('hidden');

        let particles = [];
        const particleCount = 100;
        const gravity = 0.05;

        function Particle(x, y, angle, speed, radius, life, color) {
            this.x = x;
            this.y = y;
            this.angle = angle;
            this.speed = speed;
            this.radius = radius;
            this.life = life;
            this.color = color;
            this.alpha = 1;
        }

        Particle.prototype.update = function () {
            this.speed *= 0.98;
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle) + gravity;
            this.life -= 1;
            this.alpha = this.life / 100;
        };

        Particle.prototype.draw = function (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
            ctx.fill();
        };

        function createFirework() {
            const x = Math.random() * fireworks.width;
            const y = Math.random() * fireworks.height / 2;
            const colors = [
                '255, 0, 0',
                '0, 255, 0',
                '0, 0, 255',
                '255, 255, 0',
                '0, 255, 255',
                '255, 0, 255'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const speed = Math.random() * 5 + 2;
                const radius = Math.random() * 3 + 1;
                const life = 100;
                particles.push(new Particle(x, y, angle, speed, radius, life, color));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, fireworks.width, fireworks.height);
            particles.forEach((particle, index) => {
                particle.update();
                particle.draw(ctx);
                if (particle.life <= 0) {
                    particles.splice(index, 1);
                }
            });
            requestAnimationFrame(animate);
        }

        // Create multiple fireworks
        for (let i = 0; i < 5; i++) {
            setTimeout(createFirework, i * 500); // Stagger the fireworks
        }
        animate();

        setTimeout(() => {
            fireworks.classList.add('hidden');
        }, 5000); // Display fireworks for 5 seconds
    };

    createWheel();

    spinButton.addEventListener('click', () => {
        result.style.opacity = 0; // Hide previous result text
        goodbyeMessage.classList.add('hidden'); // Hide goodbye message if shown

        const duration = Math.random() * 5 + 5; // Random duration between 5 and 10 seconds
        const totalIntervals = duration / 0.5; // Total intervals of 0.5 seconds
        const initialSpeed = 360 / 0.5; // Initial speed in degrees per 0.5 seconds
        let currentSpeed = initialSpeed;
        let currentRotation = 0;
        let intervalCount = 0;

        const interval = setInterval(() => {
            if (intervalCount >= totalIntervals) {
                clearInterval(interval);

                // Determine the landed segment
                const segmentAngle = 360 / segments.length;
                const landedIndex = Math.floor(((currentRotation % 360) + segmentAngle / 2) / segmentAngle) % segments.length;
                const landedSegment = segments[landedIndex];

                // Display the result text
                result.textContent = landedSegment;
                result.style.opacity = 1;

                // Remove the chosen segment from the list
                segments.splice(landedIndex, 1);

                if (segments.length === 0) {
                    // Show goodbye message if all segments are removed
                    goodbyeMessage.classList.remove('hidden');
                    goodbyeMessage.classList.add('fade-in');
                } else {
                    // Randomly remove one line
                    removeRandomLine();

                    // Recreate the wheel with updated segments and lines
                    createWheel();

                    // Trigger fireworks display
                    triggerFireworks();
                }

                return;
            }

            currentRotation += currentSpeed * 0.5; // Rotate by the current speed
            wheel.style.transform = `rotate(${currentRotation}deg)`; // Apply rotation

            currentSpeed *= 0.95; // Reduce speed by 5% every 0.5 seconds
            intervalCount++;
        }, 500); // Interval of 0.5 seconds
    });
});