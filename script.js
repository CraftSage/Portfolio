/* ============================================================
   AARAV NARULA — VIBE CODER PORTFOLIO · MAIN SCRIPT
   ============================================================
   Sections:
   1.  CONFIG & PASSWORD (change ADMIN_PASS here to rename passcode)
   2.  CONTENT LOADER (loads content.json + localStorage edits)
   3.  RENDERERS (populates DOM from content)
   4.  THEME TOGGLE
   5.  CUSTOM CURSOR
   6.  SCROLL PROGRESS + REVEAL ON SCROLL
   7.  NAVBAR (active link, scrolled state, mobile menu)
   8.  HERO: ROTATING WORDS + 3D THREE.JS
   9.  MATRIX RAIN BACKGROUND
   10. FLOATING CODE ICONS (scroll rain)
   11. PROJECT CARD 3D TILT
   12. CONTACT MAILTO + KEYBOARD SHORTCUT
   13. INIT
   ============================================================ */

// ============ 1. CONFIG ============
const ADMIN_PASS = 'aarav2025'; // 👈 CHANGE YOUR PASSCODE HERE (also update in admin.js)
const STORAGE_KEY = 'aarav_portfolio_content_v1';

// Code icons that rain while scrolling
const CODE_ICONS = [
    'fa-brands fa-python', 'fa-brands fa-js', 'fa-brands fa-html5',
    'fa-brands fa-css3-alt', 'fa-brands fa-php', 'fa-brands fa-react',
    'fa-brands fa-node-js', 'fa-brands fa-github', 'fa-code',
    'fa-solid fa-terminal', 'fa-solid fa-brain', 'fa-solid fa-robot',
    'fa-solid fa-microchip', 'fa-solid fa-rocket', 'fa-solid fa-bolt',
    'fa-solid fa-cube', 'fa-solid fa-cubes', 'fa-solid fa-wand-magic-sparkles',
    'fa-solid fa-laptop-code', 'fa-solid fa-database', 'fa-brands fa-docker',
    'fa-solid fa-bug', 'fa-solid fa-gear', 'fa-brands fa-git-alt'
];
const ICON_COLORS = ['#00f5ff', '#ff2e97', '#aaff00', '#a16eff', '#ff8a00'];

// ============ 2. CONTENT LOADER ============
async function loadContent() {
    // Check localStorage first (admin-edited overrides)
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
        try { return JSON.parse(local); } catch (e) { console.warn('Corrupt localStorage, falling back'); }
    }
    // Fallback: fetch content.json
    try {
        const res = await fetch('content.json');
        return await res.json();
    } catch (e) {
        console.error('Could not load content.json', e);
        return null;
    }
}

// ============ 3. RENDERERS ============
function render(content) {
    if (!content) return;

    // Hero badges
    const heroBadges = document.getElementById('heroBadges');
    if (heroBadges) {
        heroBadges.innerHTML = content.hero.badges.map(b =>
            `<span class="hero-badge">${b}</span>`
        ).join('');
    }

    // About body + headline
    const aboutBody = document.querySelector('[data-edit="about.body"]');
    if (aboutBody) aboutBody.textContent = content.about.body;
    const aboutHeadline = document.querySelector('[data-edit="about.headline"]');
    if (aboutHeadline) aboutHeadline.textContent = content.about.headline;
    const heroIntro = document.querySelector('[data-edit="hero.intro"]');
    if (heroIntro) heroIntro.textContent = content.hero.intro;
    const heroName = document.querySelector('[data-edit="hero.name"]');
    if (heroName) heroName.textContent = content.hero.name;

    // Stats
    const aboutStats = document.getElementById('aboutStats');
    if (aboutStats && content.stats) {
        aboutStats.innerHTML = `
            <div class="about-stat"><div class="num">${content.stats.age}</div><div class="label">Years Old</div></div>
            <div class="about-stat"><div class="num">${content.stats.hackathonsWon}</div><div class="label">Hackathon Wins</div></div>
            <div class="about-stat"><div class="num">${content.stats.projectsBuilt}</div><div class="label">Projects Shipped</div></div>
            <div class="about-stat"><div class="num">${content.stats.linesOfCode}</div><div class="label">Lines of Code</div></div>
        `;
    }

    // Highlights
    const highlights = document.getElementById('aboutHighlights');
    if (highlights) {
        highlights.innerHTML = content.about.highlights.map(h => `
            <div class="highlight-card reveal">
                <div class="h-icon"><i class="fa-solid ${h.icon}"></i></div>
                <h4>${h.title}</h4>
                <p>${h.desc}</p>
            </div>
        `).join('');
    }

    // Skill bars
    const skillBars = document.getElementById('skillBars');
    if (skillBars) {
        skillBars.innerHTML = content.skills.programming.map(s => `
            <div class="skill-bar">
                <div class="skill-bar-head">
                    <span class="name"><i class="${s.icon}"></i> ${s.name}</span>
                    <span class="pct">${s.percent}%</span>
                </div>
                <div class="skill-bar-track">
                    <div class="skill-bar-fill" data-pct="${s.percent}" style="width:0"></div>
                </div>
            </div>
        `).join('');
    }

    // Specializations
    const specsGrid = document.getElementById('specsGrid');
    if (specsGrid) {
        specsGrid.innerHTML = content.skills.specializations.map(s =>
            `<div class="spec-chip">${s}</div>`
        ).join('');
    }

    // Tech stack marquee — duplicated for infinite scroll
    const stackTrack = document.getElementById('stackTrack');
    if (stackTrack) {
        const items = content.skills.stack.map(s =>
            `<div class="stack-item" style="--brand:${s.color}"><i class="${s.icon}" style="color:${s.color}"></i> ${s.name}</div>`
        ).join('');
        stackTrack.innerHTML = items + items; // double for seamless marquee
    }

    // Projects
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        projectsGrid.innerHTML = content.projects.map(p => `
            <a href="${p.url}" target="_blank" rel="noopener" class="project-card accent-${p.accent} reveal">
                <div class="project-icon"><i class="fa-solid ${p.icon}"></i></div>
                <h3>${p.title}</h3>
                <p class="p-subtitle">// ${p.subtitle}</p>
                <p class="p-desc">${p.desc}</p>
                <div class="project-tech">
                    ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <span class="project-link">Visit Live <i class="fa-solid fa-external-link-alt"></i></span>
            </a>
        `).join('');
    }

    // Timeline / achievements
    const timeline = document.getElementById('timeline');
    if (timeline) {
        timeline.innerHTML = content.achievements.map(a => `
            <div class="tl-item color-${a.color} reveal">
                <div class="tl-card">
                    <div class="tl-header">
                        <div class="tl-title"><i class="fa-solid ${a.icon}"></i> ${a.title}</div>
                        <span class="tl-tag">${a.tag}</span>
                    </div>
                    <div class="tl-sub">${a.subtitle}</div>
                    <p class="tl-desc">${a.desc}</p>
                </div>
            </div>
        `).join('');
    }

    // Contact cards
    const contactCards = document.getElementById('contactCards');
    if (contactCards) {
        contactCards.innerHTML = `
            <div class="contact-card">
                <div class="c-icon"><i class="fa-solid fa-envelope"></i></div>
                <div class="c-text"><div class="c-label">Email</div>${content.contact.email}</div>
            </div>
            <div class="contact-card">
                <div class="c-icon"><i class="fa-solid fa-phone"></i></div>
                <div class="c-text"><div class="c-label">Phone</div>${content.contact.phone}</div>
            </div>
            <div class="contact-card">
                <div class="c-icon"><i class="fa-solid fa-school"></i></div>
                <div class="c-text"><div class="c-label">School</div>${content.contact.school}</div>
            </div>
        `;
    }

    // Mailto button
    const mailto = document.getElementById('contactMailto');
    if (mailto) {
        const subject = encodeURIComponent(content.contact.subject || 'Hello Aarav!');
        const body = encodeURIComponent(content.contact.body || '');
        mailto.href = `mailto:${content.contact.email}?subject=${subject}&body=${body}`;
    }

    // Socials
    const footerSocials = document.getElementById('footerSocials');
    if (footerSocials) {
        footerSocials.innerHTML = content.socials.map(s => `
            <a href="${s.url}" target="_blank" rel="noopener" class="social-link" aria-label="${s.name}" title="${s.name}">
                <i class="${s.icon}"></i>
            </a>
        `).join('');
    }

    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // After render, set up scroll-dependent observers + skill bar fill
    setupReveal();
}

// ============ 4. THEME TOGGLE ============
function setupTheme() {
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    if (!toggle) return;

    const saved = localStorage.getItem('aarav_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    icon.className = saved === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('aarav_theme', next);
        icon.className = next === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    });
}

// ============ 5. CUSTOM CURSOR ============
function setupCursor() {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    // ring lags smoothly behind
    function animateRing() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // hover state for interactive elements
    const interactive = 'a, button, .spec-chip, .project-card, .stack-item, .hero-badge, .contact-card, .highlight-card';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactive)) {
            dot.classList.add('hover');
            ring.classList.add('hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactive)) {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
        }
    });
}

// ============ 6. SCROLL PROGRESS + REVEAL ============
function setupScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update() {
        const h = document.documentElement;
        const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        bar.style.width = scrolled + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
}

function setupReveal() {
    const items = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate skill bar fills
                entry.target.querySelectorAll('.skill-bar-fill').forEach(fill => {
                    const pct = fill.dataset.pct;
                    setTimeout(() => fill.style.width = pct + '%', 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    items.forEach(el => observer.observe(el));

    // Skill bars (in case skill block itself is the .reveal)
    document.querySelectorAll('.skill-block').forEach(block => {
        const bo = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    block.querySelectorAll('.skill-bar-fill').forEach(fill => {
                        const pct = fill.dataset.pct;
                        setTimeout(() => fill.style.width = pct + '%', 100);
                    });
                    bo.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        bo.observe(block);
    });
}

// ============ 7. NAVBAR ============
function setupNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Active link
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop;
            if (scrollY >= top - 150) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }, { passive: true });

    // Mobile menu
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navList.classList.toggle('open');
        });
        navLinks.forEach(l => l.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            navList.classList.remove('open');
        }));
    }
}

// ============ 8. HERO: ROTATING WORDS + 3D ============
function setupRotatingWords() {
    const el = document.getElementById('rotatingWord');
    if (!el) return;
    const words = ['Vibe Coder', 'Prompt Engineer', 'AI Coder', 'Web Dev', 'Python Dev', 'PHP Coder', 'Problem Solver'];
    let i = 0;

    async function typeWord(word) {
        // erase
        while (el.textContent.length > 0) {
            el.textContent = el.textContent.slice(0, -1);
            await sleep(40);
        }
        // type
        for (const ch of word) {
            el.textContent += ch;
            await sleep(80);
        }
    }
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    async function loop() {
        while (true) {
            await typeWord(words[i]);
            await sleep(1800);
            i = (i + 1) % words.length;
        }
    }
    loop();
}

function setupHero3D() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 5;

    // Icosahedron wireframe
    const geo = new THREE.IcosahedronGeometry(1.5, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.6 });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Inner solid
    const inner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.8, 0),
        new THREE.MeshBasicMaterial({ color: 0xff2e97, wireframe: true, transparent: true, opacity: 0.4 })
    );
    scene.add(inner);

    // Particles
    const partGeo = new THREE.BufferGeometry();
    const partCount = 400;
    const positions = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i++) positions[i] = (Math.random() - 0.5) * 12;
    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({ color: 0xaaff00, size: 0.04, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        inner.rotation.x -= 0.005;
        inner.rotation.y -= 0.008;
        particles.rotation.y += 0.0008;

        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}

// ============ 9. MATRIX RAIN BACKGROUND ============
function setupMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオカキクケコサシスセソタチツテト{}[]<>/?$#@!*+-=Lazy';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 15, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f5ff';
        ctx.font = fontSize + 'px JetBrains Mono';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 50);

    window.addEventListener('resize', () => {
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    });
}

// ============ 10. FLOATING CODE ICONS (SCROLL RAIN) ============
function setupFloatingIcons() {
    const container = document.getElementById('floatingIcons');
    if (!container) return;

    let lastScroll = 0;
    let scrollTimer = null;
    let isScrolling = false;

    function spawnIcon() {
        const i = document.createElement('i');
        i.className = CODE_ICONS[Math.floor(Math.random() * CODE_ICONS.length)] + ' float-icon';
        i.style.left = Math.random() * 100 + 'vw';
        i.style.color = ICON_COLORS[Math.floor(Math.random() * ICON_COLORS.length)];
        const duration = 4 + Math.random() * 4;
        i.style.animationDuration = duration + 's';
        i.style.fontSize = (16 + Math.random() * 24) + 'px';
        container.appendChild(i);
        setTimeout(() => i.remove(), duration * 1000);
    }

    window.addEventListener('scroll', () => {
        const diff = Math.abs(window.scrollY - lastScroll);
        lastScroll = window.scrollY;
        if (diff > 5) {
            isScrolling = true;
            // spawn 1-2 icons per scroll burst
            spawnIcon();
            if (Math.random() > 0.5) spawnIcon();
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => { isScrolling = false; }, 200);
        }
    }, { passive: true });

    // Also occasionally spawn while idle for ambient vibe
    setInterval(() => {
        if (!isScrolling && Math.random() > 0.6) spawnIcon();
    }, 1500);
}

// ============ 11. PROJECT 3D TILT ============
function setupProjectTilt() {
    document.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const mx = (x / rect.width) * 100;
        const my = (y / rect.height) * 100;
        card.style.setProperty('--mx', mx + '%');
        card.style.setProperty('--my', my + '%');

        const rx = ((y / rect.height) - 0.5) * -8;
        const ry = ((x / rect.width) - 0.5) * 8;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px)`;
    });
    document.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.project-card');
        if (card && !card.contains(e.relatedTarget)) {
            card.style.transform = '';
        }
    });
}

// ============ 12. KEYBOARD SHORTCUT TO ADMIN ============
function setupAdminShortcut() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            window.location.href = 'admin.html';
        }
    });
}

// ============ 13. INIT ============
(async function init() {
    const content = await loadContent();
    render(content);

    setupTheme();
    setupCursor();
    setupScrollProgress();
    setupNavbar();
    setupRotatingWords();
    setupHero3D();
    setupMatrixRain();
    setupFloatingIcons();
    setupProjectTilt();
    setupAdminShortcut();

    // Console signature
    console.log('%c⚡ Built by Aarav Narula', 'font-size: 24px; font-weight: bold; background: linear-gradient(90deg, #00f5ff, #ff2e97); color: white; padding: 8px 16px; border-radius: 8px;');
    console.log('%cPsst: try Ctrl+Shift+A 👀', 'color: #aaff00; font-family: monospace; font-size: 12px;');
})();
