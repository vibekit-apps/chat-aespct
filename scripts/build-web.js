// Script de construcción de la UI web para Capacitor.
// Copia index.html (la única fuente de interfaz), el manifiesto PWA y los iconos
// a www/ sin duplicar la lógica de la aplicación.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WWW = path.join(ROOT, 'www');

// API base pública para la app nativa. En modo web vacío (= misma origen).
// Se sobrescribe en el despliegue móvil si se usa servidor remoto.
const API_BASE = '';

mkdir(WWW);
mkdir(path.join(WWW, 'icons'));
mkdir(path.join(WWW, 'manifest'));

// 1) index.html sin cambios (única fuente de interfaz UI)
copy('index.html', path.join(WWW, 'index.html'));

// 2) manifest.json de PWA (copia; las rutas de iconos son relativas a www/)
copy('resources/manifest.json', path.join(WWW, 'manifest.json'));

// 3) iconos fuente (SVG y futuros PNG)
copy('resources/icon.svg', path.join(WWW, 'icons', 'icon-source.svg'));
copy('resources/splash.svg', path.join(WWW, 'icons', 'splash-source.svg'));

console.log('www/ listo en', WWW);

function mkdir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function copy(src, dest) { fs.copyFileSync(path.join(ROOT, src), dest); }
