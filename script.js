// ── FLOATING HEARTS ──
const heartsContainer = document.getElementById('floating-hearts');
const heartSymbols = ['♥', '♡', '✿', '❀', '✦', '·'];

for (let i = 0; i < 20; i++) {
  const h = document.createElement('div');
  h.className = 'float-heart';
  h.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.animationDuration = (15 + Math.random() * 20) + 's';
  h.style.animationDelay = (Math.random() * 15) + 's';
  h.style.fontSize = (0.6 + Math.random() * 1) + 'rem';
  h.style.color = Math.random() > 0.5 ? '#d4919a' : '#d4bf94';
  heartsContainer.appendChild(h);
}

// ── SPARKLE CANVAS ──
const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2;
    this.speedY = -0.2 - Math.random() * 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5;
    this.fadeSpeed = 0.003 + Math.random() * 0.005;
    this.growing = true;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.growing) {
      this.opacity += this.fadeSpeed;
      if (this.opacity >= 0.5) this.growing = false;
    } else {
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0) this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(196, 145, 154, ${this.opacity * 0.5})`;
    ctx.fill();
  }
}

for (let i = 0; i < 60; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// ── GAME LOGIC ──
const questions = [
  { q: "If 3x² − 5x + 2 = 0, what is the larger value of x?", a: 1, hint: "Use the quadratic formula." },
  { q: "What is 17 × 23 + 144 ÷ 12?", a: 403, hint: "Follow BODMAS." },
  { q: "Solve: log₂(64) + √144 = ?", a: 18, hint: "log₂(64) = 6, √144 = 12" },
  { q: "What is 15% of 840 + 3³?", a: 153, hint: "15% of 840 = 126, 3³ = 27" },
  { q: "If a train travels 360 km in 4.5 hours, what is its speed in km/h?", a: 80, hint: "Speed = Distance ÷ Time" },
  { q: "What is the sum of interior angles (in degrees) of a hexagon?", a: 720, hint: "(n−2) × 180" },
  { q: "Solve: 2⁸ ÷ 2⁴ = ?", a: 16, hint: "Subtract exponents." },
  { q: "What is 999 × 9 − 999?", a: 7992, hint: "Factor out 999." },
];

let currentQuestion = null;
let attempts = 0;
const maxAttempts = 3;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelector('.game-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function goYes() {
  showScreen('screen-yes-win');
  launchConfetti();
}

function goNo() {
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  attempts = 0;
  document.getElementById('math-display').textContent = currentQuestion.q;
  document.getElementById('math-input').value = '';
  document.getElementById('math-feedback').textContent = '';
  document.getElementById('math-feedback').className = 'math-feedback';
  document.getElementById('attempt-note').textContent = 'You have 3 attempts.';
  showScreen('screen-math');
}

function checkAnswer() {
  const input = document.getElementById('math-input');
  const val = parseFloat(input.value.trim());
  const feedback = document.getElementById('math-feedback');
  const note = document.getElementById('attempt-note');

  if (input.value.trim() === '') {
    feedback.textContent = 'Please enter an answer.';
    feedback.className = 'math-feedback wrong';
    return;
  }

  attempts++;

  if (val === currentQuestion.a) {
    feedback.textContent = 'Correct! Okay, you passed. 😲';
    feedback.className = 'math-feedback right';
    note.textContent = '';
    setTimeout(() => showScreen('screen-no-win'), 1200);
  } else {
    const left = maxAttempts - attempts;
    if (left <= 0) {
      feedback.textContent = 'Wrong again! Back to Yes you go. 😄';
      feedback.className = 'math-feedback wrong';
      note.textContent = '';
      setTimeout(() => showScreen('screen-question'), 1500);
    } else {
      feedback.textContent = 'Wrong! Hint: ' + currentQuestion.hint;
      feedback.className = 'math-feedback wrong';
      note.textContent = left + ' attempt' + (left === 1 ? '' : 's') + ' left.';
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 400);
      input.value = '';
    }
  }
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && document.getElementById('screen-math').classList.contains('active')) {
    checkAnswer();
  }
});

function backToQuestion() {
  showScreen('screen-question');
}

// ── CONFETTI ──
function launchConfetti() {
  const container = document.getElementById('confetti');
  const colors = ['#c4727e', '#b89b6a', '#b8a9d4', '#d4919a', '#d4bf94', '#e8c4c4', '#c9b99a'];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration = (2 + Math.random() * 3) + 's';
    piece.style.animationDelay = (Math.random() * 1) + 's';
    container.appendChild(piece);
  }
  setTimeout(() => { container.innerHTML = ''; }, 5000);
}
