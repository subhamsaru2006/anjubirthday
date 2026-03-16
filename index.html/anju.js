// Global State
let candlesBlown = 0;
let balloonsPopped = 0;
const totalCandles = 3;
const messages = ["You are amazing!", "Best friend ever!", "Stay blessed!", "Smile always!", "Shine bright!"];

// Utility: Sparkle Cursor
document.addEventListener('mousemove', (e) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.pageX + 'px';
    sparkle.style.top = e.pageY + 'px';
    document.getElementById('sparkle-container').appendChild(sparkle);
    
    gsap.to(sparkle, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        onComplete: () => sparkle.remove()
    });
});

// Scene Transitions
function switchScene(hideId, showId) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);
    
    gsap.to(hideEl, {
        opacity: 0, 
        duration: 0.8, 
        onComplete: () => {
            hideEl.classList.remove('active');
            hideEl.classList.add('hidden');
            
            showEl.classList.remove('hidden');
            // Slight delay to allow display:block to compute
            setTimeout(() => {
                showEl.classList.add('active');
                gsap.to(showEl, {opacity: 1, duration: 0.8});
            }, 50);
        }
    });
}

function nextScene(current, next) {
    switchScene(current, next);
}

// 1. Entry Logic
function startExperience() {
    // Attempt to play audio (Browsers require user interaction first)
    const bgMusic = document.getElementById('bg-music');
    bgMusic.volume = 0.5;
    bgMusic.play().catch(e => console.log("Audio autoplay blocked until deeper interaction."));

    // Burst particles
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    
    nextScene('scene-entry', 'scene-gift');
}

// 2. Gift Logic
function openGift() {
    const box = document.querySelector('.gift-box');
    box.classList.add('opened');
    
    // Confetti & Balloons effect
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff0000', '#00ff00', '#0000ff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff0000', '#00ff00', '#0000ff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    setTimeout(() => {
        nextScene('scene-gift', 'scene-message');
        typeWriter("Happy Birthday Anjali 🎉", "bday-text", 100);
    }, 2500);
}

// 3. Typewriter Effect
function typeWriter(text, elementId, speed) {
    let i = 0;
    document.getElementById(elementId).innerHTML = "";
    function type() {
        if (i < text.length) {
            document.getElementById(elementId).innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// 4. Cake & Candles Logic
function blowCandle(element) {
    const flame = element.querySelector('.flame');
    if (flame.style.opacity !== '0') {
        flame.style.opacity = '0'; // Blow out
        candlesBlown++;
        
        // Add smoke effect
        let smoke = document.createElement('div');
        smoke.style.cssText = "position:absolute; width:10px; height:10px; background:rgba(200,200,200,0.5); border-radius:50%; top:-30px; left:2px; filter:blur(2px);";
        element.appendChild(smoke);
        gsap.to(smoke, {y: -50, opacity: 0, scale: 3, duration: 1.5});

        if (candlesBlown === totalCandles) {
            document.getElementById('cake-instruction').innerText = "Make a Wish! ✨";
            // Firework canvas effect
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            function randomInRange(min, max) { return Math.random() * (max - min) + min; }
            var interval = setInterval(function() {
                var timeLeft = 1000; // 1 second of fireworks
                if (timeLeft <= 0) { return clearInterval(interval); }
                confetti(Object.assign({}, defaults, { particleCount: 50, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount: 50, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);

            setTimeout(() => {
                document.getElementById('cut-btn').classList.remove('hidden');
            }, 1500);
        }
    }
}

// 5. Cake Cutting Logic
function cutCake() {
    document.getElementById('cut-btn').classList.add('hidden');
    document.querySelector('.left-half').classList.add('cut');
    document.querySelector('.right-half').classList.add('cut');
    
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    
    setTimeout(() => {
        document.getElementById('next-gallery-btn').classList.remove('hidden');
    }, 1000);
}

// 7. Balloon Pop Game Logic
function initBalloonGame() {
    nextScene('scene-gallery', 'scene-game');
    
    const colors = ['#ff4d85', '#4d79ff', '#ffb84d', '#4dff4d', '#b84dff'];
    const container = document.getElementById('balloon-container');
    
    // Generate balloons
    let spawnInterval = setInterval(() => {
        if(balloonsPopped >= 5) {
            clearInterval(spawnInterval);
            document.getElementById('game-title').innerText = "You got them all!";
            document.getElementById('finish-game-btn').classList.remove('hidden');
            return;
        }

        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
        balloon.style.left = Math.random() * 80 + 10 + 'vw';
        
        container.appendChild(balloon);

        // Animate balloon floating up
        gsap.to(balloon, {
            y: -window.innerHeight - 150,
            duration: Math.random() * 3 + 4,
            ease: "none",
            onComplete: () => {
                if (balloon.parentNode) balloon.remove();
            }
        });

        // Pop interaction
        balloon.addEventListener('click', (e) => {
            // Play sound
            const popAudio = document.getElementById('pop-sound');
            popAudio.currentTime = 0;
            popAudio.play().catch(e=>console.log("Audio skipped"));

            // Confetti at click position
            confetti({
                particleCount: 20,
                spread: 40,
                origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
            });

            // Show random message
            const msgEl = document.getElementById('pop-message');
            msgEl.innerText = messages[Math.floor(Math.random() * messages.length)];
            msgEl.style.left = e.clientX + 'px';
            msgEl.style.top = e.clientY + 'px';
            msgEl.classList.remove('hidden');
            
            gsap.fromTo(msgEl, 
                { opacity: 1, y: 0, scale: 0.5 }, 
                { opacity: 0, y: -50, scale: 1.2, duration: 1.5 }
            );

            balloon.remove();
            balloonsPopped++;
        });

    }, 800);
}

// 9. Ending Scene
function showEnding() {
    nextScene('scene-final', 'scene-ending');
    
    // Floating Lanterns effect
    const container = document.getElementById('lantern-container');
    for(let i=0; i<15; i++) {
        setTimeout(() => {
            const lantern = document.createElement('div');
            lantern.className = 'lantern';
            lantern.style.left = Math.random() * 90 + 5 + 'vw';
            container.appendChild(lantern);
            
            // Swaying and floating up
            gsap.to(lantern, {
                y: -window.innerHeight - 100,
                x: "+=50",
                duration: Math.random() * 5 + 5,
                ease: "power1.inOut",
                yoyo: true,
                onComplete: () => lantern.remove()
            });
        }, i * 400);
    }
}