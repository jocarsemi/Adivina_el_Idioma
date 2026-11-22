// Catálogo de 50 idiomas. `samplePhrase` = frase de ejemplo para Google Translate.
// `gcode` = código de idioma de Google Translate.
export const ALL_LANGUAGES = [
  { id: 'es', name: 'Español',         emoji: '🇪🇸', gcode: 'es',    samplePhrase: 'Hola, ¿cómo estás? Bienvenido al juego.' },
  { id: 'en', name: 'Inglés',          emoji: '🇬🇧', gcode: 'en',    samplePhrase: 'Hello, how are you? Welcome to the game.' },
  { id: 'fr', name: 'Francés',         emoji: '🇫🇷', gcode: 'fr',    samplePhrase: 'Bonjour, comment allez-vous ? Bienvenue au jeu.' },
  { id: 'de', name: 'Alemán',          emoji: '🇩🇪', gcode: 'de',    samplePhrase: 'Hallo, wie geht es dir? Willkommen beim Spiel.' },
  { id: 'it', name: 'Italiano',        emoji: '🇮🇹', gcode: 'it',    samplePhrase: 'Ciao, come stai? Benvenuto al gioco.' },
  { id: 'pt', name: 'Portugués',       emoji: '🇵🇹', gcode: 'pt',    samplePhrase: 'Olá, como estás? Bem-vindo ao jogo.' },
  { id: 'nl', name: 'Neerlandés',      emoji: '🇳🇱', gcode: 'nl',    samplePhrase: 'Hallo, hoe gaat het met je? Welkom bij het spel.' },
  { id: 'sv', name: 'Sueco',           emoji: '🇸🇪', gcode: 'sv',    samplePhrase: 'Hej, hur mår du? Välkommen till spelet.' },
  { id: 'no', name: 'Noruego',         emoji: '🇳🇴', gcode: 'no',    samplePhrase: 'Hei, hvordan har du det? Velkommen til spillet.' },
  { id: 'da', name: 'Danés',           emoji: '🇩🇰', gcode: 'da',    samplePhrase: 'Hej, hvordan går det? Velkommen til spillet.' },
  { id: 'fi', name: 'Finés',           emoji: '🇫🇮', gcode: 'fi',    samplePhrase: 'Hei, mitä kuuluu? Tervetuloa peliin.' },
  { id: 'is', name: 'Islandés',        emoji: '🇮🇸', gcode: 'is',    samplePhrase: 'Halló, hvernig hefurðu það? Velkomin í leikinn.' },
  { id: 'pl', name: 'Polaco',          emoji: '🇵🇱', gcode: 'pl',    samplePhrase: 'Cześć, jak się masz? Witamy w grze.' },
  { id: 'cs', name: 'Checo',           emoji: '🇨🇿', gcode: 'cs',    samplePhrase: 'Ahoj, jak se máš? Vítej ve hře.' },
  { id: 'sk', name: 'Eslovaco',        emoji: '🇸🇰', gcode: 'sk',    samplePhrase: 'Ahoj, ako sa máš? Vitaj v hre.' },
  { id: 'hu', name: 'Húngaro',         emoji: '🇭🇺', gcode: 'hu',    samplePhrase: 'Szia, hogy vagy? Üdvözlünk a játékban.' },
  { id: 'ro', name: 'Rumano',          emoji: '🇷🇴', gcode: 'ro',    samplePhrase: 'Bună, ce faci? Bine ai venit la joc.' },
  { id: 'bg', name: 'Búlgaro',         emoji: '🇧🇬', gcode: 'bg',    samplePhrase: 'Здравей, как си? Добре дошъл в играта.' },
  { id: 'el', name: 'Griego',          emoji: '🇬🇷', gcode: 'el',    samplePhrase: 'Γεια σου, πώς είσαι; Καλώς ήρθες στο παιχνίδι.' },
  { id: 'ru', name: 'Ruso',            emoji: '🇷🇺', gcode: 'ru',    samplePhrase: 'Привет, как дела? Добро пожаловать в игру.' },
  { id: 'uk', name: 'Ucraniano',       emoji: '🇺🇦', gcode: 'uk',    samplePhrase: 'Привіт, як справи? Ласкаво просимо до гри.' },
  { id: 'tr', name: 'Turco',           emoji: '🇹🇷', gcode: 'tr',    samplePhrase: 'Merhaba, nasılsın? Oyuna hoş geldin.' },
  { id: 'ar', name: 'Árabe',           emoji: '🇸🇦', gcode: 'ar',    samplePhrase: 'مرحبا، كيف حالك؟ أهلا بك في اللعبة.' },
  { id: 'he', name: 'Hebreo',          emoji: '🇮🇱', gcode: 'iw',    samplePhrase: 'שלום, מה שלומך? ברוך הבא למשחק.' },
  { id: 'fa', name: 'Persa',           emoji: '🇮🇷', gcode: 'fa',    samplePhrase: 'سلام، حال شما چطور است؟ به بازی خوش آمدید.' },
  { id: 'hi', name: 'Hindi',           emoji: '🇮🇳', gcode: 'hi',    samplePhrase: 'नमस्ते, आप कैसे हैं? खेल में आपका स्वागत है।' },
  { id: 'bn', name: 'Bengalí',         emoji: '🇧🇩', gcode: 'bn',    samplePhrase: 'হ্যালো, আপনি কেমন আছেন? খেলায় স্বাগতম।' },
  { id: 'ur', name: 'Urdu',            emoji: '🇵🇰', gcode: 'ur',    samplePhrase: 'ہیلو، آپ کیسے ہیں؟ کھیل میں خوش آمدید۔' },
  { id: 'th', name: 'Tailandés',       emoji: '🇹🇭', gcode: 'th',    samplePhrase: 'สวัสดี สบายดีไหม ยินดีต้อนรับสู่เกม' },
  { id: 'vi', name: 'Vietnamita',      emoji: '🇻🇳', gcode: 'vi',    samplePhrase: 'Xin chào, bạn khỏe không? Chào mừng đến với trò chơi.' },
  { id: 'id', name: 'Indonesio',       emoji: '🇮🇩', gcode: 'id',    samplePhrase: 'Halo, apa kabar? Selamat datang di permainan.' },
  { id: 'ms', name: 'Malayo',          emoji: '🇲🇾', gcode: 'ms',    samplePhrase: 'Helo, apa khabar? Selamat datang ke permainan.' },
  { id: 'tl', name: 'Filipino',        emoji: '🇵🇭', gcode: 'tl',    samplePhrase: 'Kumusta ka? Maligayang pagdating sa laro.' },
  { id: 'zh', name: 'Chino mandarín',  emoji: '🇨🇳', gcode: 'zh-CN', samplePhrase: '你好，你好吗？欢迎来到游戏。' },
  { id: 'yue', name: 'Chino cantonés', emoji: '🇭🇰', gcode: 'zh-TW', samplePhrase: '你好，你好嗎？歡迎嚟到遊戲。' },
  { id: 'ja', name: 'Japonés',         emoji: '🇯🇵', gcode: 'ja',    samplePhrase: 'こんにちは、お元気ですか？ゲームへようこそ。' },
  { id: 'ko', name: 'Coreano',         emoji: '🇰🇷', gcode: 'ko',    samplePhrase: '안녕하세요, 어떻게 지내세요? 게임에 오신 것을 환영합니다.' },
  { id: 'sw', name: 'Swahili',         emoji: '🇰🇪', gcode: 'sw',    samplePhrase: 'Habari, habari yako? Karibu kwenye mchezo.' },
  { id: 'zu', name: 'Zulú',            emoji: '🇿🇦', gcode: 'zu',    samplePhrase: 'Sawubona, unjani? Uyamukelwa emdlalweni.' },
  { id: 'af', name: 'Afrikáans',       emoji: '🇿🇦', gcode: 'af',    samplePhrase: 'Hallo, hoe gaan dit? Welkom by die speletjie.' },
  { id: 'am', name: 'Amhárico',        emoji: '🇪🇹', gcode: 'am',    samplePhrase: 'ሰላም፣ እንዴት ነህ? ወደ ጨዋታው እንኳን ደህና መጣህ።' },
  { id: 'yo', name: 'Yoruba',          emoji: '🇳🇬', gcode: 'yo',    samplePhrase: 'Bawo ni, bawo ni o se wa? Kaabo si ere.' },
  { id: 'ha', name: 'Hausa',           emoji: '🇳🇬', gcode: 'ha',    samplePhrase: 'Sannu, yaya kake? Barka da zuwa wasan.' },
  { id: 'ca', name: 'Catalán',         emoji: '🟡', gcode: 'ca',    samplePhrase: 'Hola, com estàs? Benvingut al joc.' },
  { id: 'gl', name: 'Gallego',         emoji: '🔵', gcode: 'gl',    samplePhrase: 'Ola, como estás? Benvido ao xogo.' },
  { id: 'eu', name: 'Euskera',         emoji: '🟢', gcode: 'eu',    samplePhrase: 'Kaixo, zer moduz? Ongi etorri jokora.' },
  { id: 'la', name: 'Latín',           emoji: '🏛️', gcode: 'la',    samplePhrase: 'Salve, quomodo vales? Gratus ad ludum.' },
  { id: 'eo', name: 'Esperanto',       emoji: '🌍', gcode: 'eo',    samplePhrase: 'Saluton, kiel vi fartas? Bonvenon al la ludo.' },
  { id: 'ga', name: 'Irlandés',        emoji: '🇮🇪', gcode: 'ga',    samplePhrase: 'Dia duit, conas atá tú? Fáilte go dtí an cluiche.' },
  { id: 'cy', name: 'Galés',           emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', gcode: 'cy',    samplePhrase: 'Helo, sut wyt ti? Croeso i\'r gêm.' },
];

export const COLOR_PALETTE = [
  '#ff6b6b', '#4ecdc4', '#ffd93d', '#a06cd5', '#ff9f1c',
  '#6bcf7f', '#4d96ff', '#ff6fb5', '#c9b6e4', '#95e1d3',
];

export function generateGameCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Abre Google Translate con la frase del idioma y el botón de escuchar listo.
// Se abre en pestaña nueva para no perder el panel del profesor.
export function openGoogleTranslate(languageId) {
  const lang = ALL_LANGUAGES.find(l => l.id === languageId);
  if (!lang) return;
  const url = `https://translate.google.com/?sl=es&tl=${lang.gcode}&text=${encodeURIComponent(lang.samplePhrase)}&op=translate`;
  window.open(url, '_blank', 'noopener');
}
