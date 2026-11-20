# 🎧🌍 Adivina el Idioma

Juego de aula: el profesor reproduce 10 audios, los alumnos adivinan qué idioma es entre los 10 idiomas elegidos por el profesor (de un catálogo de 50).

## 🚀 Puesta en marcha

### 1. Crear proyecto Firebase
1. Ve a https://console.firebase.google.com/ y crea un proyecto.
2. En el menú lateral: **Compilación → Realtime Database → Crear base de datos** (modo de prueba).
3. En **Configuración del proyecto → Tus apps → Web (`</>`)**, copia el objeto `firebaseConfig`.
4. Pega ese objeto en `js/firebase-config.js` (sustituyendo los placeholders).
5. En **Realtime Database → Reglas**, pega el contenido de `firebase-rules.json` y publica.

### 2. Desplegar
Sube la carpeta completa a cualquier hosting estático:
- **Netlify Drop**: arrastra la carpeta a https://app.netlify.com/drop
- **GitHub Pages**: sube los archivos a un repo y activa Pages en Settings.
- **Vercel**: importa el repo y despliega sin build.
- **FTP**: sube los archivos a tu hosting.

### 3. Jugar
1. Abre `index.html` en el navegador del profesor → **Soy Profesor**.
2. Selecciona **10 idiomas** de los 50 disponibles (buscador incluido).
3. Configura las **10 rondas**: respuesta correcta obligatoria; audio (URL o archivo local) opcional.
4. Pulsa **Lanzar partida** → aparece un **código de 6 caracteres**.
5. Los alumnos abren `student.html` en sus dispositivos → introducen el código y su nombre.
6. El profesor pulsa **Reproducir audio** (suena en su dispositivo; si configuró `audioUrl`, también en los de los alumnos).
7. Tras cada audio, el profesor pulsa **Siguiente ronda**.
8. Al terminar las 10 rondas, el profesor pulsa **Finalizar partida** → todos ven el ranking y el ganador.

## ⚠️ Limitación sobre los audios
Por defecto, el profesor **reproduce el audio en su propio dispositivo**. Si quieres que los alumnos lo escuchen en el suyo, pega una URL pública del audio en el campo `URL audio` de cada ronda (Drive/Dropbox con enlace directo, bucket público, etc.).

## 🧪 Simular una partida completa en local
1. Abre `teacher.html` en una ventana normal.
2. Abre `student.html` en una ventana de incógnito (o en otro dispositivo).
3. Sigue el flujo normal: el profesor crea la partida, el alumno se une con el código.
4. Puedes abrir varias ventanas de incógnito para simular varios alumnos.

## 🗂️ Estructura
- `index.html` / `teacher.html` / `student.html` — pantallas
- `css/styles.css` — estilos sketch
- `js/data.js` — catálogo de 50 idiomas
- `js/firebase-config.js` — tu configuración Firebase
- `js/db.js` — wrapper de Realtime Database
- `js/teacher.js` / `js/student.js` — lógica
- `firebase-rules.json` — reglas de la BD

## 📝 Notas
- Sin persistencia a largo plazo: la partida vive mientras exista el nodo `games/{code}`. **Nueva partida** borra ese nodo.
- Cada alumno se identifica con un `uid` aleatorio guardado en `sessionStorage` (se pierde al cerrar la pestaña).
- Todo es estático: no hay backend propio.