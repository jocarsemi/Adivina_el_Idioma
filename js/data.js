// Catálogo completo de 50 idiomas disponibles
export const ALL_LANGUAGES = [
  { id: 'es', name: 'Español',         emoji: '🇪🇸' },
  { id: 'en', name: 'Inglés',          emoji: '🇬🇧' },
  { id: 'fr', name: 'Francés',         emoji: '🇫🇷' },
  { id: 'de', name: 'Alemán',          emoji: '🇩🇪' },
  { id: 'it', name: 'Italiano',        emoji: '🇮🇹' },
  { id: 'pt', name: 'Portugués',       emoji: '🇵🇹' },
  { id: 'nl', name: 'Neerlandés',      emoji: '🇳🇱' },
  { id: 'sv', name: 'Sueco',           emoji: '🇸🇪' },
  { id: 'no', name: 'Noruego',         emoji: '🇳🇴' },
  { id: 'da', name: 'Danés',           emoji: '🇩🇰' },
  { id: 'fi', name: 'Finés',           emoji: '🇫🇮' },
  { id: 'is', name: 'Islandés',        emoji: '🇮🇸' },
  { id: 'pl', name: 'Polaco',          emoji: '🇵🇱' },
  { id: 'cs', name: 'Checo',           emoji: '🇨🇿' },
  { id: 'sk', name: 'Eslovaco',        emoji: '🇸🇰' },
  { id: 'hu', name: 'Húngaro',         emoji: '🇭🇺' },
  { id: 'ro', name: 'Rumano',          emoji: '🇷🇴' },
  { id: 'bg', name: 'Búlgaro',         emoji: '🇧🇬' },
  { id: 'el', name: 'Griego',          emoji: '🇬🇷' },
  { id: 'ru', name: 'Ruso',            emoji: '🇷🇺' },
  { id: 'uk', name: 'Ucraniano',       emoji: '🇺🇦' },
  { id: 'tr', name: 'Turco',           emoji: '🇹🇷' },
  { id: 'ar', name: 'Árabe',           emoji: '🇸🇦' },
  { id: 'he', name: 'Hebreo',          emoji: '🇮🇱' },
  { id: 'fa', name: 'Persa',           emoji: '🇮🇷' },
  { id: 'hi', name: 'Hindi',           emoji: '🇮🇳' },
  { id: 'bn', name: 'Bengalí',         emoji: '🇧🇩' },
  { id: 'ur', name: 'Urdu',            emoji: '🇵🇰' },
  { id: 'th', name: 'Tailandés',       emoji: '🇹🇭' },
  { id: 'vi', name: 'Vietnamita',      emoji: '🇻🇳' },
  { id: 'id', name: 'Indonesio',       emoji: '🇮🇩' },
  { id: 'ms', name: 'Malayo',          emoji: '🇲🇾' },
  { id: 'tl', name: 'Filipino',        emoji: '🇵🇭' },
  { id: 'zh', name: 'Chino mandarín',  emoji: '🇨🇳' },
  { id: 'yue', name: 'Chino cantonés', emoji: '🇭🇰' },
  { id: 'ja', name: 'Japonés',         emoji: '🇯🇵' },
  { id: 'ko', name: 'Coreano',         emoji: '🇰🇷' },
  { id: 'sw', name: 'Swahili',         emoji: '🇰🇪' },
  { id: 'zu', name: 'Zulú',            emoji: '🇿🇦' },
  { id: 'af', name: 'Afrikáans',       emoji: '🇿🇦' },
  { id: 'am', name: 'Amhárico',        emoji: '🇪🇹' },
  { id: 'yo', name: 'Yoruba',          emoji: '🇳🇬' },
  { id: 'ha', name: 'Hausa',           emoji: '🇳🇬' },
  { id: 'ca', name: 'Catalán',         emoji: '🟡' },
  { id: 'gl', name: 'Gallego',         emoji: '🔵' },
  { id: 'eu', name: 'Euskera',         emoji: '🟢' },
  { id: 'la', name: 'Latín',           emoji: '🏛️' },
  { id: 'eo', name: 'Esperanto',       emoji: '🌍' },
  { id: 'ga', name: 'Irlandés',        emoji: '🇮🇪' },
  { id: 'cy', name: 'Galés',           emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
];

// Paleta de 10 colores para los idiomas seleccionados
export const COLOR_PALETTE = [
  '#ff6b6b', '#4ecdc4', '#ffd93d', '#a06cd5', '#ff9f1c',
  '#6bcf7f', '#4d96ff', '#ff6fb5', '#c9b6e4', '#95e1d3',
];

// Genera un código de partida de 6 caracteres
export function generateGameCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}