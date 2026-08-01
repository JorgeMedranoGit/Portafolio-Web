// ==========================================================================
// GAME DEV PORTFOLIO - JORGE ESTEBAN MEDRANO CHACOLLA (v5)
// Features: Modal Audio Auto-Stop, Flying Ships Canvas, Mouse Follower
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initProjectFilters();
  initTabNavigation();
  initMouseFollower();
  initSpaceshipsCanvas();
  initSmoothScroll();

  // Ensure all videos start paused with zero audio on page load
  document.querySelectorAll('video').forEach(video => {
    video.pause();
    video.currentTime = 0;
  });
});

/**
 * Flying Spaceships background canvas animation
 */
function initSpaceshipsCanvas() {
  const canvas = document.getElementById('shipsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.8 + 0.5,
    alpha: Math.random() * 0.7 + 0.2,
    speed: Math.random() * 0.3 + 0.1
  }));

  const ships = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random() * width,
    y: (Math.random() * 0.8 + 0.1) * height,
    speed: Math.random() * 1.5 + 0.8,
    size: Math.random() * 10 + 14,
    color: i % 2 === 0 ? '#cba6f7' : '#89b4fa'
  }));

  function drawShip(ship) {
    ctx.save();
    ctx.translate(ship.x, ship.y);

    ctx.beginPath();
    ctx.moveTo(-ship.size * 0.8, 0);
    ctx.lineTo(-ship.size * 1.6, -ship.size * 0.3);
    ctx.lineTo(-ship.size * 1.6, ship.size * 0.3);
    ctx.closePath();
    ctx.fillStyle = '#fab387';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fab387';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(ship.size, 0);
    ctx.lineTo(-ship.size * 0.7, -ship.size * 0.6);
    ctx.lineTo(-ship.size * 0.4, 0);
    ctx.lineTo(-ship.size * 0.7, ship.size * 0.6);
    ctx.closePath();
    ctx.fillStyle = ship.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = ship.color;
    ctx.fill();

    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      ctx.fillStyle = `rgba(205, 214, 244, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      star.x -= star.speed;
      if (star.x < 0) star.x = width;
    });

    ships.forEach(ship => {
      drawShip(ship);

      ship.x += ship.speed;
      if (ship.x > width + 50) {
        ship.x = -60;
        ship.y = (Math.random() * 0.8 + 0.1) * height;
        ship.speed = Math.random() * 1.5 + 0.8;
      }
    });

    requestAnimationFrame(loop);
  }

  loop();
}

/**
 * Interactive Mouse Follower Effect
 */
function initMouseFollower() {
  const follower = document.getElementById('mouseFollower');
  const dot = document.getElementById('mouseDot');

  if (!follower || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
    requestAnimationFrame(animateFollower);
  }

  animateFollower();
}

/**
 * Filter projects by category
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * VS Code Tab Navigation Highlight
 */
function initTabNavigation() {
  const tabs = document.querySelectorAll('.vscode-tabs .tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

/**
 * Modal Handling (Stops audio/video when closing)
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Play video automatically on open
    const video = modal.querySelector('video');
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    // STOP AUDIO / VIDEO IMMEDIATELY ON CLOSE
    modal.querySelectorAll('video').forEach(video => {
      video.pause();
      video.currentTime = 0;
    });

    // Reset iframe embeds to stop YouTube/Drive playback
    modal.querySelectorAll('iframe').forEach(iframe => {
      const src = iframe.src;
      iframe.src = '';
      iframe.src = src;
    });
  }
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    closeModal(e.target.id);
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      closeModal(modal.id);
    });
  }
});

/**
 * Smooth Navigation Scroll
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}
