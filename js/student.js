import { db, ref, onValue, get, upsertStudent, submitAnswer } from './db.js';

const $ = (id) => document.getElementById(id);
const uid = sessionStorage.getItem('uid') || (() => {
  const u = crypto.randomUUID();
  sessionStorage.setItem('uid', u);
  return u;
})();

const state = {
  code: null,
  name: null,
  game: null,
  selectedLangId: null,    // selección actual en la ronda
  answeredRound: null      // ronda ya confirmada
};

// ---------- JOIN ----------
$('join-btn').addEventListener('click', async () => {
  const code = $('join-code').value.trim().toUpperCase();
  const name = $('join-name').value.trim();
  const err = $('join-error');

  if (code.length !== 6) { showError('El código debe tener 6 caracteres.'); return; }
  if (!name) { showError('Escribe tu nombre.'); return; }

  const snap = await get(ref(db, `games/${code}`));
  if (!snap.exists()) { showError('La partida no existe. Revisa el código.'); return; }
  const game = snap.val();
  if (game.status !== 'lobby') { showError('La partida ya ha comenzado o finalizado.'); return; }

  state.code = code;
  state.name = name;

  await upsertStudent(code, uid, name);

  $('phase-join').classList.add('hidden');
  $('phase-lobby').classList.remove('hidden');

  subscribeToGame(code);
});

function showError(msg) {
  const err = $('join-error');
  err.textContent = msg;
  err.classList.remove('hidden');
}

// ---------- SUSCRIPCIÓN ----------
function subscribeToGame(code) {
  onValue(ref(db, `games/${code}`), (snap) => {
    const game = snap.val();
    if (!game) return;
    state.game = game;
    handleGameState(game);
  });
}

function handleGameState(game) {
  if (game.status === 'lobby') {
    $('phase-lobby').classList.remove('hidden');
    $('phase-play').classList.add('hidden');
    $('phase-results').classList.add('hidden');
    return;
  }

  if (game.status === 'playing') {
    $('phase-lobby').classList.add('hidden');
    $('phase-play').classList.remove('hidden');
    $('phase-results').classList.add('hidden');
    renderRound(game);
    return;
  }

  if (game.status === 'finished') {
    $('phase-lobby').classList.add('hidden');
    $('phase-play').classList.add('hidden');
    $('phase-results').classList.remove('hidden');
    renderResults(game);
  }
}

// ---------- RONDA ----------
let renderedRound = null;

function renderRound(game) {
  const roundIdx = game.currentRound ?? 0;
  $('round-num').textContent = roundIdx + 1;

  const round = game.rounds[roundIdx];
  // Audio compartido (si el profesor puso URL)
  const audioDiv = $('audio-share');
  if (round.audioUrl) {
    audioDiv.classList.remove('hidden');
    const audio = $('student-audio');
    if (audio.src !== round.audioUrl) audio.src = round.audioUrl;
  } else {
    audioDiv.classList.add('hidden');
  }

  // Si ya respondimos esta ronda, mostramos estado
  const myAnswers = game.students?.[uid]?.answers || {};
  const alreadyAnswered = myAnswers[roundIdx] !== undefined;

  // Solo re-renderizamos botones si cambia la ronda
  if (renderedRound !== roundIdx) {
    renderedRound = roundIdx;
    state.selectedLangId = null;
    renderLanguageButtons(game.languages);
    $('play-status').textContent = '';
    $('confirm-btn').disabled = true;
  }

  if (alreadyAnswered) {
    $('play-status').textContent = '✅ Respuesta enviada. Esperando al profesor…';
    $('confirm-btn').disabled = true;
  }
}

function renderLanguageButtons(languages) {
  const container = $('lang-buttons');
  container.innerHTML = '';
  languages.forEach((lang) => {
    const btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.dataset.id = lang.id;
    btn.style.background = lang.color;
    btn.innerHTML = `${lang.emoji}<br>${lang.name}`;
    btn.addEventListener('click', () => selectLanguage(lang.id));
    container.appendChild(btn);
  });
}

function selectLanguage(id) {
  // Ya respondida esta ronda → no permitir cambiar
  const roundIdx = state.game.currentRound ?? 0;
  const myAnswers = state.game.students?.[uid]?.answers || {};
  if (myAnswers[roundIdx] !== undefined) return;

  state.selectedLangId = id;
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.id === id);
  });
  $('confirm-btn').disabled = false;
}

// ---------- CONFIRMAR ----------
$('confirm-btn').addEventListener('click', async () => {
  if (!state.selectedLangId) return;
  const roundIdx = state.game.currentRound ?? 0;
  $('confirm-btn').disabled = true;
  await submitAnswer(state.code, uid, roundIdx, state.selectedLangId);
  $('play-status').textContent = '✅ Respuesta enviada. Esperando al profesor…';
});

// ---------- RESULTADOS ----------
function renderResults(game) {
  const students = Object.entries(game.students || {})
    .map(([id, s]) => ({ id, name: s.name, score: s.score || 0 }))
    .sort((a, b) => b.score - a.score);

  const me = students.find(s => s.id === uid);
  const myPos = students.findIndex(s => s.id === uid) + 1;
  const maxScore = students[0]?.score ?? 0;
  const winners = students.filter(s => s.score === maxScore && maxScore > 0);

  $('student-score').innerHTML = me
    ? `<p class="sketch-title small">Tu puntuación: ${me.score} / 10 · Posición #${myPos}</p>`
    : '';

  const winnersBox = $('student-winners');
  if (winners.length === 0) {
    winnersBox.textContent = '😢 Nadie ha acertado nada…';
  } else {
    winnersBox.innerHTML = `👑 Ganador${winners.length > 1 ? 'es' : ''}: ${winners.map(w => w.name).join(' & ')}`;
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.4 } });
  }
}