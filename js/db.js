// Wrapper de Firebase Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase, ref, set, get, onValue, update, remove, onDisconnect, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export { ref, set, get, onValue, update, remove, onDisconnect, serverTimestamp };

// Comprueba si un código de partida existe
export async function gameExists(code) {
  const snap = await get(ref(db, `games/${code}`));
  return snap.exists();
}

// Crea una partida nueva
export async function createGame(code, data) {
  await set(ref(db, `games/${code}`), {
    ...data,
    status: 'lobby',
    createdAt: serverTimestamp(),
    currentRound: 0,
    students: {}
  });
}

// Añade/actualiza un alumno en la partida
export async function upsertStudent(code, uid, name) {
  const studentRef = ref(db, `games/${code}/students/${uid}`);
  await set(studentRef, { name, connected: true, answers: {}, score: 0 });
  // Marca desconectado si cierra la pestaña
  onDisconnect(ref(db, `games/${code}/students/${uid}/connected`)).set(false);
}

// Actualiza un campo de la partida
export async function updateGame(code, patch) {
  await update(ref(db, `games/${code}`), patch);
}

// Guarda la respuesta de un alumno en una ronda
export async function submitAnswer(code, uid, roundIdx, languageId) {
  await update(ref(db, `games/${code}/students/${uid}/answers`), {
    [roundIdx]: languageId
  });
}

// Elimina la partida
export async function deleteGame(code) {
  await remove(ref(db, `games/${code}`));
}