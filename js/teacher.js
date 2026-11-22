import { ALL_LANGUAGES, COLOR_PALETTE, generateGameCode, openGoogleTranslate } from './data.js';
import { db, ref, onValue, createGame, updateGame, deleteGame, get } from './db.js';

const $ = (id) => document.getElementById(id);

const state = {
  selectedIds: [],   // 10 idiomas en orden de selección
  code: null,
  game: null,
  unsub: null
};

const langGrid    = $('lang-grid');
const langCount   = $('lang-count');
const langSearch  = $('lang-search');
const roundsPreview = $('rounds-preview');
const launchBtn   = $('launch-btn');
const phaseConfig = $('phase-config');
const phaseControl= $('phase-control');
const phaseResults= $('phase-results');
const configError = $('config-error');

// ---------- GRID IDIOMAS ----------
function renderLangGrid(filter = '') {
  const f = filter.toLowerCase();
  langGrid.innerHTML = '';
  ALL_LANGUAGES.forEach((lang) => {
    if (f && !lang.name.toLowerCase().includes(f)) return;
    const selected = state.selectedIds.includes(lang.id);
    const reachedLimit = state.selectedIds.length >= 10 && !selected;
    const chip = document.createElement('div');
    chip.className = 'lang-chip' + (selected ? ' selected' : '') + (reachedLimit ? ' disabled' : '');
    if (selected) {
      const idx = state.selectedIds.indexOf(lang.id);
      chip.style.background = COLOR_PALETTE[idx % COLOR_PALETTE.length];
    }
    chip.innerHTML = `<span class="emoji">${lang.emoji}</span>${lang.name}`;
    chip.addEventListener('click', () => toggleLanguage(lang.id));
    langGrid.appendChild(chip);
  });
}

function toggleLanguage(id) {
  if (state.selectedIds.includes(id)) {
    state.selectedIds = state.selectedIds.filter(x => x !== id);
  } else if (state.selectedIds.length < 10) {
    state.selectedIds.push(id);
  }
  langCount.textContent = state.selectedIds.length;
  renderLangGrid(langSearch.value);
  renderRoundsPreview();
  launchBtn.disabled = state.selectedIds.length !== 10;
}

// ---------- PREVIEW DEL ORDEN DE RONDAS ----------
function renderRoundsPreview() {
  roundsPreview.innerHTML = '';
  if (state.selectedIds.length === 0) {
    roundsPreview.innerHTML = '<li class="sketch-sub">Aún no has elegido ningún idioma.</li>';
    return;
  }
  state.selectedIds.forEach((id, i) => {
    const lang = ALL_LANGUAGES.find(l => l.id === id);
    const li = document.createElement('li');
    li.className = 'round-preview-item';
    li.innerHTML = `<strong>Ronda ${i + 1}</strong>: ${lang.emoji} ${lang.name}`;
    roundsPreview.appendChild(li);
  });
}

// ---------- LANZAR PARTIDA ----------
launchBtn.addEventListener('click', async () => {
  if (state.selectedIds.length !== 10) return;
  configError.classList.add('hidden');
  launchBtn.disabled = true;
  launchBtn.textContent = 'Creando partida…';

  const languages = state.selectedIds.map((id, i) => {
    const lang = ALL_LANGUAGES.find(l => l.id === id);
    return {
      id: lang.id,
      name: lang.name,
      emoji: lang.emoji,
      color: COLOR_PALETTE[i % COLOR_PALETTE.length],
      // La respuesta correcta de la ronda i es el idioma i-ésimo elegido
    };
  });

  const rounds = state.selectedIds.map((id, i) => ({
    index: i,
    label: `Audio ${i + 1}`,
    correctLanguageId: id   // 👈 orden de selección = respuesta correcta
  }));

  try {
    // Genera código único (comprueba una sola vez por intento, con timeout)
    let code = generateGameCode();
    // No comprobamos con gameExists en bucle para no colgar la UI.
    // Si por casualidad colisiona (muy improbable con 32^6), la nueva partida
    // sobrescribe la anterior. Para uso de aula es aceptable.
    state.code = code;

    await createGame(code, { languages, rounds });

    // Mostrar fase de control INMEDIATAMENTE (no esperar snapshot)
    phaseConfig.classList.add('hidden');
    phaseControl.classList.remove('hidden');
    $('game-code').textContent = code;
    $('current-round-num').textContent = '1';
    $('current-round-lang').textContent = `Idioma a adivinar: ${languages[0].emoji} (${languages[0].name})`;

    // Suscribirse a la partida (alumnos en tiempo real)
    subscribeToGame(code);
  } catch (err) {
    console.error(err);
    configError.textContent = '❌ No se pudo crear la partida. Revisa tu firebase-config.js y las reglas de Firebase. ' + (err?.message || '');
    configError.classList.remove('hidden');
    launchBtn.textContent = '🚀 Lanzar partida';
    launchBtn.disabled = false;
  }
});

// ---------- SUSCRIPCIÓN ----------
function subscribeToGame(code) {
  if (state.unsub) state.unsub();
  const gameRef = ref(db, `games/${code}`);
  state.unsub = onValue(gameRef, (snap) => {
    const game = snap.val();
    if (!game) return;
    state.game = game;
    renderStudents(game);
    const connected = Object.values(game.students || {}).filter(s => s.connected).length;
    $('student-count').textContent = connected;
    $('current-round-num').textContent = (game.currentRound ?? 0) + 1;
    const currentLang = game.languages?.[game.currentRound ?? 0];
    if (currentLang) {
      $('current-round-lang').textContent =
        `Idioma a adivinar: ${currentLang.emoji} (${currentLang.name})`;
    }
    if (game.status === 'finished') showResults(game);
  }, (err) => {
    console.error('onValue error', err);
  });
}

function renderStudents(game) {
  const tbody = $('students-tbody');
  tbody.innerHTML = '';
  const entries = Object.entries(game.students || {});
  if (entries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;opacity:.6">Ningún alumno conectado aún…</td></tr>';
    return;
  }
  entries.forEach(([, s]) => {
    const answered = s.answers && s.answers[game.currentRound] !== undefined;
    const status = !s.connected ? '🔴 Desconectado' : answered ? '✅ Respondido' : '⏳ Esperando';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.name}</td><td>${status}</td><td>${s.score || 0}</td>`;
    tbody.appendChild(tr);
  });
}

// ---------- CONTROLES ----------
$('play-audio').addEventListener('click', () => {
  const idx = state.game?.currentRound ?? 0;
  const lang = state.game?.languages?.[idx];
  if (!lang) return;
  openGoogleTranslate(lang.id);
});

$('next-round').addEventListener('click', async () => {
  const current = state.game?.currentRound ?? 0;
  if (current >= 9) { alert('Ya estás en la última ronda. Pulsa "Finalizar partida".'); return; }
  await updateGame(state.code, { status: 'playing', currentRound: current + 1 });
});

$('finish-game').addEventListener('click', async () => {
  if (!confirm('¿Finalizar la partida y calcular resultados?')) return;
  try {
    const game = (await get(ref(db, `games/${state.code}`))).val();
    if (!game) return;
    const rounds = game.rounds;
    const updates = {};
    Object.entries(game.students || {}).forEach(([uid, s]) => {
      let score = 0;
      rounds.forEach((r, i) => {
        if (s.answers && s.answers[i] === r.correctLanguageId) score++;
      });
      updates[`students/${uid}/score`] = score;
    });
    updates.status = 'finished';
    await updateGame(state.code, updates);
    const updated = (await get(ref(db, `games/${state.code}`))).val();
    showResults(updated);
  } catch (err) {
    console.error(err);
    alert('Error al finalizar: ' + (err?.message || ''));
  }
});

// ---------- RESULTADOS ----------
function showResults(game) {
  phaseControl.classList.add('hidden');
  phaseResults.classList.remove('hidden');
  const ranked = Object.values(game.students || {})
    .map(s => ({ name: s.name, score: s.score || 0 }))
    .sort((a, b) => b.score - a.score);
  const maxScore = ranked[0]?.score ?? 0;
  const winners = ranked.filter(r => r.score === maxScore && maxScore > 0);
  const winnersBox = $('winners-box');
  if (winners.length === 0) {
    winnersBox.textContent = '😢 Nadie ha acertado nada…';
  } else {
    winnersBox.innerHTML = `👑 ${winners.map(w => w.name).join(' & ')}`;
    if (window.confetti) confetti({ particleCount: 200, spread: 90, origin: { y: 0.4 } });
  }
  $('ranking-list').innerHTML = ranked.map((r, i) =>
    `<li><span>${i + 1}. ${r.name}</span><span>${r.score} / 10</span></li>`
  ).join('');
}

$('new-game-btn').addEventListener('click', async () => {
  if (state.code) await deleteGame(state.code);
  location.reload();
});

langSearch.addEventListener('input', (e) => renderLangGrid(e.target.value));

// init
renderLangGrid();
renderRoundsPreview();
