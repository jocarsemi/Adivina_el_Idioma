import { ALL_LANGUAGES, COLOR_PALETTE, generateGameCode } from './data.js';
import {
  db, ref, onValue, createGame, updateGame, deleteGame, get, gameExists
} from './db.js';

// ---------- ESTADO ----------
const state = {
  selectedIds: [],          // 10 idiomas
  rounds: Array(10).fill(null).map(() => ({ correctLanguageId: '', label: '', audioUrl: '', localFile: null })),
  code: null,
  game: null,
  audioEl: null
};

// ---------- ELEMENTOS ----------
const $ = (id) => document.getElementById(id);
const langGrid = $('lang-grid');
const langCount = $('lang-count');
const langSearch = $('lang-search');
const roundsConfig = $('rounds-config');
const launchBtn = $('launch-btn');
const phaseConfig = $('phase-config');
const phaseControl = $('phase-control');
const phaseResults = $('phase-results');

// ---------- RENDER GRID IDIOMAS ----------
function renderLangGrid(filter = '') {
  const f = filter.toLowerCase();
  langGrid.innerHTML = '';
  ALL_LANGUAGES.forEach((lang) => {
    if (f && !lang.name.toLowerCase().includes(f)) return;
    const selected = state.selectedIds.includes(lang.id);
    const reachedLimit = state.selectedIds.length >= 10 && !selected;
    const chip = document.createElement('div');
    chip.className = 'lang-chip' + (selected ? ' selected' : '') + (reachedLimit ? ' disabled' : '');
    chip.dataset.id = lang.id;
    if (selected) {
      const colorIdx = state.selectedIds.indexOf(lang.id);
      chip.style.background = COLOR_PALETTE[colorIdx % COLOR_PALETTE.length];
      chip.style.borderColor = '#1a1a1a';
    }
    chip.innerHTML = `<span class="emoji">${lang.emoji}</span>${lang.name}`;
    chip.addEventListener('click', () => toggleLanguage(lang.id));
    langGrid.appendChild(chip);
  });
}

function toggleLanguage(id) {
  if (state.selectedIds.includes(id)) {
    state.selectedIds = state.selectedIds.filter(x => x !== id);
    // Si quitamos un idioma, limpiamos las respuestas correctas que lo usaban
    state.rounds.forEach(r => { if (r.correctLanguageId === id) r.correctLanguageId = ''; });
  } else {
    if (state.selectedIds.length >= 10) return;
    state.selectedIds.push(id);
  }
  langCount.textContent = state.selectedIds.length;
  renderLangGrid(langSearch.value);
  renderRoundsConfig();
  validateLaunch();
}

// ---------- RENDER RONDAS ----------
function renderRoundsConfig() {
  roundsConfig.innerHTML = '';
  if (state.selectedIds.length === 0) {
    roundsConfig.innerHTML = '<p class="sketch-sub">Selecciona primero los 10 idiomas.</p>';
    return;
  }
  state.rounds.forEach((round, i) => {
    const card = document.createElement('div');
    card.className = 'round-card';
    const options = state.selectedIds.map(id => {
      const lang = ALL_LANGUAGES.find(l => l.id === id);
      const sel = round.correctLanguageId === id ? 'selected' : '';
      return `<option value="${id}" ${sel}>${lang.emoji} ${lang.name}</option>`;
    }).join('');
    card.innerHTML = `
      <h4>Ronda ${i + 1}</h4>
      <select data-i="${i}" class="correct-select">
        <option value="">— Respuesta correcta —</option>
        ${options}
      </select>
      <input type="text" data-i="${i}" class="label-input" placeholder="Etiqueta (opcional)" value="${round.label || ''}" />
      <input type="url" data-i="${i}" class="url-input" placeholder="URL audio (opcional)" value="${round.audioUrl || ''}" />
      <input type="file" accept="audio/*" data-i="${i}" class="file-input" />
    `;
    roundsConfig.appendChild(card);
  });

  roundsConfig.querySelectorAll('.correct-select').forEach(el => {
    el.addEventListener('change', (e) => {
      state.rounds[+e.target.dataset.i].correctLanguageId = e.target.value;
      validateLaunch();
    });
  });
  roundsConfig.querySelectorAll('.label-input').forEach(el => {
    el.addEventListener('input', (e) => { state.rounds[+e.target.dataset.i].label = e.target.value; });
  });
  roundsConfig.querySelectorAll('.url-input').forEach(el => {
    el.addEventListener('input', (e) => { state.rounds[+e.target.dataset.i].audioUrl = e.target.value.trim(); });
  });
  roundsConfig.querySelectorAll('.file-input').forEach(el => {
    el.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) state.rounds[+e.target.dataset.i].localFile = URL.createObjectURL(file);
    });
  });
}

function validateLaunch() {
  const okLangs = state.selectedIds.length === 10;
  const okRounds = state.rounds.every(r => r.correctLanguageId);
  launchBtn.disabled = !(okLangs && okRounds);
}

// ---------- LANZAR PARTIDA ----------
launchBtn.addEventListener('click', async () => {
  launchBtn.disabled = true;
  launchBtn.textContent = 'Creando partida…';

  // Genera código único
  let code;
  let attempts = 0;
  do {
    code = generateGameCode();
    attempts++;
    if (attempts > 20) { alert('No se pudo generar código único. Inténtalo de nuevo.'); return; }
  } while (await gameExists(code));

  state.code = code;

  const languages = state.selectedIds.map((id, i) => {
    const lang = ALL_LANGUAGES.find(l => l.id === id);
    return { id: lang.id, name: lang.name, emoji: lang.emoji, color: COLOR_PALETTE[i % COLOR_PALETTE.length] };
  });

  const rounds = state.rounds.map((r, i) => ({
    index: i,
    label: r.label || `Audio ${i + 1}`,
    correctLanguageId: r.correctLanguageId,
    audioUrl: r.audioUrl || ''
  }));

  await createGame(code, { languages, rounds });

  // Cambia a fase de control
  phaseConfig.classList.add('hidden');
  phaseControl.classList.remove('hidden');
  $('game-code').textContent = code;

  subscribeToGame(code);
});

// ---------- SUSCRIPCIÓN A LA PARTIDA ----------
function subscribeToGame(code) {
  const gameRef = ref(db, `games/${code}`);
  onValue(gameRef, (snap) => {
    const game = snap.val();
    if (!game) return;
    state.game = game;
    renderStudents(game);
    $('student-count').textContent = Object.values(game.students || {}).filter(s => s.connected).length;

    if (game.status === 'playing' || game.status === 'lobby') {
      $('current-round-num').textContent = (game.currentRound ?? 0) + 1;
    }
    if (game.status === 'finished' && !phaseResults.classList.contains('hidden') === false) {
      showResults(game);
    }
  });
}

function renderStudents(game) {
  const tbody = $('students-tbody');
  tbody.innerHTML = '';
  const students = Object.entries(game.students || {});
  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;opacity:.6">Ningún alumno conectado aún…</td></tr>';
    return;
  }
  students.forEach(([uid, s]) => {
    const answered = s.answers && s.answers[game.currentRound] !== undefined;
    const status = !s.connected ? '🔴 Desconectado' : answered ? '✅ Respondido' : '⏳ Esperando';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.name}</td><td>${status}</td><td>${s.score || 0}</td>`;
    tbody.appendChild(tr);
  });
}

// ---------- CONTROLES DE RONDA ----------
$('play-audio').addEventListener('click', () => {
  const roundIdx = state.game?.currentRound ?? 0;
  const round = state.rounds[roundIdx];
  if (!round) return;
  let src = round.localFile || round.audioUrl;
  if (!src) { alert('No hay audio configurado para esta ronda.'); return; }
  const audio = $('teacher-audio');
  audio.classList.remove('hidden');
  audio.src = src;
  audio.play();
});

$('next-round').addEventListener('click', async () => {
  const current = state.game?.currentRound ?? 0;
  if (current >= 9) { alert('Ya estás en la última ronda. Pulsa "Finalizar partida".'); return; }
  await updateGame(state.code, { status: 'playing', currentRound: current + 1 });
});

$('finish-game').addEventListener('click', async () => {
  if (!confirm('¿Finalizar la partida y calcular resultados?')) return;
  const game = (await get(ref(db, `games/${state.code}`))).val();
  if (!game) return;
  const rounds = game.rounds;
  const students = game.students || {};
  // Calcula puntos
  const updates = {};
  Object.entries(students).forEach(([uid, s]) => {
    let score = 0;
    rounds.forEach((r, i) => {
      if (s.answers && s.answers[i] === r.correctLanguageId) score++;
    });
    updates[`students/${uid}/score`] = score;
  });
  updates.status = 'finished';
  await updateGame(state.code, updates);
  // Mostrar resultados
  const updated = (await get(ref(db, `games/${state.code}`))).val();
  showResults(updated);
});

// ---------- RESULTADOS ----------
function showResults(game) {
  phaseControl.classList.add('hidden');
  phaseResults.classList.remove('hidden');

  const students = Object.entries(game.students || {});
  const ranked = students
    .map(([uid, s]) => ({ uid, name: s.name, score: s.score || 0 }))
    .sort((a, b) => b.score - a.score);

  const maxScore = ranked[0]?.score ?? 0;
  const winners = ranked.filter(r => r.score === maxScore && maxScore > 0);

  const winnersBox = $('winners-box');
  if (winners.length === 0) {
    winnersBox.textContent = '😢 Nadie ha acertado nada…';
  } else {
    winnersBox.innerHTML = `👑 ${winners.map(w => w.name).join(' & ')}`;
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.4 } });
  }

  const list = $('ranking-list');
  list.innerHTML = ranked.map((r, i) =>
    `<li><span>${i + 1}. ${r.name}</span><span>${r.score} / 10</span></li>`
  ).join('');
}

// ---------- NUEVA PARTIDA ----------
$('new-game-btn').addEventListener('click', async () => {
  if (state.code) await deleteGame(state.code);
  location.reload();
});

// ---------- BÚSQUEDA ----------
langSearch.addEventListener('input', (e) => renderLangGrid(e.target.value));

// ---------- INICIALIZAR ----------
renderLangGrid();
renderRoundsConfig();
validateLaunch();