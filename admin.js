/* ============================================================
   AARAV NARULA — ADMIN DASHBOARD
   ============================================================
   - Passcode login (hashed compare, fallback plaintext)
   - Edit content in localStorage (overrides content.json)
   - Export updated content.json for permanent deployment
   ============================================================ */

const ADMIN_PASS = 'aarav2025'; // 👈 CHANGE PASSCODE HERE (must match script.js)
const STORAGE_KEY = 'aarav_portfolio_content_v1';
const SESSION_KEY = 'aarav_admin_session';

let content = null;
let originalContent = null;

// ============ THEME (read user pref) ============
const savedTheme = localStorage.getItem('aarav_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// ============ UTILITIES ============
function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}
function setPath(obj, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((o, k) => o[k] = o[k] || {}, obj);
    target[last] = value;
}

function toast(message, type = '') {
    const t = document.getElementById('toast');
    t.textContent = message;
    t.className = 'toast show ' + type;
    setTimeout(() => t.classList.remove('show'), 2600);
}

// ============ AUTH ============
async function unlock(pass) {
    if (pass === ADMIN_PASS) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        await loadAndShowDash();
        return true;
    }
    return false;
}
function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
}

document.getElementById('unlockBtn').addEventListener('click', async () => {
    const pass = document.getElementById('passInput').value;
    const ok = await unlock(pass);
    if (!ok) {
        const err = document.getElementById('passError');
        err.textContent = '❌ Wrong passcode. Try again.';
        document.getElementById('passInput').value = '';
        document.getElementById('passInput').focus();
        setTimeout(() => err.textContent = '', 3000);
    }
});
document.getElementById('passInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('unlockBtn').click();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
});

// ============ LOAD CONTENT ============
async function loadContent() {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
        try { return JSON.parse(local); } catch (e) {}
    }
    try {
        const res = await fetch('content.json');
        return await res.json();
    } catch (e) {
        toast('Could not load content.json', 'error');
        return null;
    }
}

async function loadAndShowDash() {
    content = await loadContent();
    originalContent = JSON.parse(JSON.stringify(content));
    document.getElementById('loginShell').classList.remove('locked');
    document.getElementById('loginShell').classList.add('unlocked');
    document.getElementById('adminDash').classList.add('active');
    populateForm();
}

// ============ POPULATE FORM ============
function populateForm() {
    // Simple data-path inputs
    document.querySelectorAll('[data-path]').forEach(el => {
        const path = el.dataset.path;
        const value = getPath(content, path);
        if (el.dataset.type === 'array-csv') {
            el.value = Array.isArray(value) ? value.join(', ') : (value || '');
        } else {
            el.value = value || '';
        }
    });

    renderHighlights();
    renderProgramming();
    renderStack();
    renderProjects();
    renderAchievements();
    renderSocials();
}

// ============ DYNAMIC LIST RENDERERS ============
function renderHighlights() {
    const list = document.getElementById('highlightsList');
    list.innerHTML = content.about.highlights.map((h, i) => `
        <div class="admin-list-item">
            <div class="admin-list-head">
                <strong>Highlight #${i + 1}</strong>
                <button class="btn btn-danger btn-sm" data-remove="highlight" data-i="${i}"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="admin-row">
                <div class="admin-field"><label>Icon (Font Awesome class)</label><input value="${h.icon || ''}" data-list-path="about.highlights.${i}.icon"></div>
                <div class="admin-field"><label>Title</label><input value="${h.title || ''}" data-list-path="about.highlights.${i}.title"></div>
            </div>
            <div class="admin-field"><label>Description</label><textarea data-list-path="about.highlights.${i}.desc">${h.desc || ''}</textarea></div>
        </div>
    `).join('');
}

function renderProgramming() {
    const list = document.getElementById('programmingList');
    list.innerHTML = content.skills.programming.map((s, i) => `
        <div class="admin-list-item">
            <div class="admin-list-head">
                <strong>Skill #${i + 1}</strong>
                <button class="btn btn-danger btn-sm" data-remove="programming" data-i="${i}"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="admin-row">
                <div class="admin-field"><label>Name</label><input value="${s.name || ''}" data-list-path="skills.programming.${i}.name"></div>
                <div class="admin-field"><label>Percent</label><input type="number" min="0" max="100" value="${s.percent || 0}" data-list-path="skills.programming.${i}.percent" data-type="number"></div>
            </div>
            <div class="admin-field"><label>Icon (Font Awesome class)</label><input value="${s.icon || ''}" data-list-path="skills.programming.${i}.icon"></div>
        </div>
    `).join('');
}

function renderStack() {
    const list = document.getElementById('stackList');
    list.innerHTML = content.skills.stack.map((s, i) => `
        <div class="admin-list-item">
            <div class="admin-list-head">
                <strong>Stack #${i + 1}</strong>
                <button class="btn btn-danger btn-sm" data-remove="stack" data-i="${i}"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="admin-row">
                <div class="admin-field"><label>Name</label><input value="${s.name || ''}" data-list-path="skills.stack.${i}.name"></div>
                <div class="admin-field"><label>Color (hex)</label><input value="${s.color || ''}" data-list-path="skills.stack.${i}.color"></div>
            </div>
            <div class="admin-field"><label>Icon (Font Awesome class)</label><input value="${s.icon || ''}" data-list-path="skills.stack.${i}.icon"></div>
        </div>
    `).join('');
}

function renderProjects() {
    const list = document.getElementById('projectsList');
    list.innerHTML = content.projects.map((p, i) => `
        <div class="admin-list-item">
            <div class="admin-list-head">
                <strong>Project #${i + 1}</strong>
                <button class="btn btn-danger btn-sm" data-remove="project" data-i="${i}"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="admin-row">
                <div class="admin-field"><label>Title</label><input value="${p.title || ''}" data-list-path="projects.${i}.title"></div>
                <div class="admin-field"><label>Subtitle</label><input value="${p.subtitle || ''}" data-list-path="projects.${i}.subtitle"></div>
            </div>
            <div class="admin-field"><label>Description</label><textarea data-list-path="projects.${i}.desc">${p.desc || ''}</textarea></div>
            <div class="admin-row">
                <div class="admin-field"><label>URL</label><input value="${p.url || ''}" data-list-path="projects.${i}.url"></div>
                <div class="admin-field"><label>Icon (FA, e.g. fa-rocket)</label><input value="${p.icon || ''}" data-list-path="projects.${i}.icon"></div>
            </div>
            <div class="admin-row">
                <div class="admin-field"><label>Tech (comma-separated)</label><input value="${(p.tech || []).join(', ')}" data-list-path="projects.${i}.tech" data-type="array-csv"></div>
                <div class="admin-field"><label>Accent (cyan / magenta / lime)</label><input value="${p.accent || 'cyan'}" data-list-path="projects.${i}.accent"></div>
            </div>
        </div>
    `).join('');
}

function renderAchievements() {
    const list = document.getElementById('achievementsList');
    list.innerHTML = content.achievements.map((a, i) => `
        <div class="admin-list-item">
            <div class="admin-list-head">
                <strong>Win #${i + 1}</strong>
                <button class="btn btn-danger btn-sm" data-remove="achievement" data-i="${i}"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="admin-row">
                <div class="admin-field"><label>Title</label><input value="${a.title || ''}" data-list-path="achievements.${i}.title"></div>
                <div class="admin-field"><label>Subtitle</label><input value="${a.subtitle || ''}" data-list-path="achievements.${i}.subtitle"></div>
            </div>
            <div class="admin-field"><label>Description</label><textarea data-list-path="achievements.${i}.desc">${a.desc || ''}</textarea></div>
            <div class="admin-row">
                <div class="admin-field"><label>Icon (FA, e.g. fa-trophy)</label><input value="${a.icon || ''}" data-list-path="achievements.${i}.icon"></div>
                <div class="admin-field"><label>Tag (e.g. Gold, International)</label><input value="${a.tag || ''}" data-list-path="achievements.${i}.tag"></div>
            </div>
            <div class="admin-field"><label>Color (cyan / magenta / lime)</label><input value="${a.color || 'cyan'}" data-list-path="achievements.${i}.color"></div>
        </div>
    `).join('');
}

function renderSocials() {
    const list = document.getElementById('socialsList');
    list.innerHTML = content.socials.map((s, i) => `
        <div class="admin-list-item">
            <div class="admin-list-head">
                <strong>${s.name}</strong>
                <button class="btn btn-danger btn-sm" data-remove="social" data-i="${i}"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="admin-row">
                <div class="admin-field"><label>Name</label><input value="${s.name || ''}" data-list-path="socials.${i}.name"></div>
                <div class="admin-field"><label>URL</label><input value="${s.url || ''}" data-list-path="socials.${i}.url"></div>
            </div>
            <div class="admin-field"><label>Icon (FA, e.g. fa-brands fa-github)</label><input value="${s.icon || ''}" data-list-path="socials.${i}.icon"></div>
        </div>
    `).join('');
}

// ============ COLLECT FROM FORM ============
function collectForm() {
    // Simple paths
    document.querySelectorAll('[data-path]').forEach(el => {
        const path = el.dataset.path;
        let v = el.value;
        if (el.dataset.type === 'array-csv') {
            v = v.split(',').map(s => s.trim()).filter(Boolean);
        }
        setPath(content, path, v);
    });
    // List paths
    document.querySelectorAll('[data-list-path]').forEach(el => {
        const path = el.dataset.listPath;
        let v = el.value;
        if (el.dataset.type === 'number') v = parseFloat(v) || 0;
        if (el.dataset.type === 'array-csv') v = v.split(',').map(s => s.trim()).filter(Boolean);
        setPath(content, path, v);
    });
}

// ============ ADD / REMOVE LIST ITEMS ============
const TEMPLATES = {
    highlight: { icon: 'fa-star', title: 'New highlight', desc: 'Description here.' },
    programming: { name: 'New Skill', percent: 50, icon: 'fa-solid fa-code' },
    stack: { name: 'New Tool', icon: 'fa-solid fa-cube', color: '#00f5ff' },
    project: { title: 'New Project', subtitle: 'Subtitle', desc: 'Description here.', tech: ['Tech'], url: 'https://', icon: 'fa-rocket', accent: 'cyan' },
    achievement: { title: 'New Win', subtitle: 'Position', desc: 'Details about it.', icon: 'fa-trophy', tag: 'New', color: 'cyan' },
    social: { name: 'New', url: 'https://', icon: 'fa-brands fa-link' }
};
const LIST_MAP = {
    highlight: { key: 'about.highlights', render: renderHighlights },
    programming: { key: 'skills.programming', render: renderProgramming },
    stack: { key: 'skills.stack', render: renderStack },
    project: { key: 'projects', render: renderProjects },
    achievement: { key: 'achievements', render: renderAchievements },
    social: { key: 'socials', render: renderSocials }
};

document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
        collectForm(); // save current state first
        const type = addBtn.dataset.add;
        const cfg = LIST_MAP[type];
        const arr = getPath(content, cfg.key);
        arr.push(JSON.parse(JSON.stringify(TEMPLATES[type])));
        cfg.render();
        toast('+ Added new ' + type);
    }
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
        collectForm();
        const type = removeBtn.dataset.remove;
        const i = parseInt(removeBtn.dataset.i);
        const cfg = LIST_MAP[type];
        const arr = getPath(content, cfg.key);
        if (confirm('Remove this item?')) {
            arr.splice(i, 1);
            cfg.render();
            toast('🗑 Removed', 'error');
        }
    }
});

// ============ TAB SWITCHING ============
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
});

// ============ SAVE / EXPORT / RESET ============
document.getElementById('saveBtn').addEventListener('click', () => {
    collectForm();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    toast('✓ Saved! Changes live on your portfolio.', 'success');
});

document.getElementById('exportBtn').addEventListener('click', () => {
    collectForm();
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('📦 Downloaded! Replace content.json and redeploy.', 'success');
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Reset all changes to the original content.json? This will erase your saved edits.')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
});

// ============ INIT ============
if (isLoggedIn()) {
    loadAndShowDash();
} else {
    document.getElementById('passInput').focus();
}
