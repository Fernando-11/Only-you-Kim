const FECHA_CORRECTA = { dia: 22, mes:05 , anio: 03 };
const RANGO = { dia: { min: 0, max: 31 }, mes: { min: 0, max: 12 }, anio: { min: 0, max: 99 } };
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const app = $('#app');
const recuerdos = $('#recuerdos');
const closeBtn = $('#close-btn');

// Fecha de Nacimiento: 10 de Febrero de 2005
// Nota: En JS los meses van de 0 a 11 (Enero=0, Febrero=1)
const FECHA_NACIMIENTO = new Date(2003,04,22, 0, 0, 0);

const state = { dia: 0, mes: 0, anio: 0 };

function two(n) { return String(n).padStart(2, '0'); }
function wrap(v, min, max) { if (v < min) return max; if (v > max) return min; return v; }

function setValue(type, val) {
  const { min, max } = RANGO[type];
  state[type] = wrap(val, min, max);
  const dial = $(`.dial[data-type="${type}"]`);
  if (dial) {
    dial.querySelector('[data-value]').textContent = two(state[type]);
  }
  check();
}

function step(type, dir) { setValue(type, state[type] + dir); }

$$('.dial').forEach(dial => {
  const type = dial.getAttribute('data-type');
  dial.querySelector('.up').addEventListener('click', () => step(type, +1));
  dial.querySelector('.down').addEventListener('click', () => step(type, -1));
});

let unlocked = false;
function check() {
  if (unlocked) return;
  if (state.dia === FECHA_CORRECTA.dia && state.mes === FECHA_CORRECTA.mes && state.anio === FECHA_CORRECTA.anio) {
    unlocked = true;
    app.classList.add('fade-out');
    setTimeout(() => {
      recuerdos.classList.add('active');
      setupCarousel();
    }, 900);
  }
}

closeBtn.addEventListener('click', () => {
  recuerdos.classList.remove('active');
  setTimeout(() => {
    app.classList.remove('fade-out');
    setValue('dia', 0);
    setValue('mes', 0);
    setValue('anio', 0);
    unlocked = false;
  }, 300);
});

function setupCarousel() {
  const images = $$('.carousel-inner img, .carousel-inner video');
  if (images.length === 0) return;
  const angle = 360 / images.length;
  images.forEach((img, i) => {
    const rotateY = i * angle;
    img.style.transform = `rotateY(${rotateY}deg) translateZ(220px)`;
  });
}

// LÓGICA DEL CONTADOR DE VIDA
function calcularTiempoVivido() {
  const ahora = new Date();
  
  let anos = ahora.getFullYear() - FECHA_NACIMIENTO.getFullYear();
  let meses = ahora.getMonth() - FECHA_NACIMIENTO.getMonth();
  let dias = ahora.getDate() - FECHA_NACIMIENTO.getDate();

  // Ajuste si no ha llegado su cumple este año
  if (meses < 0 || (meses === 0 && dias < 0)) {
    anos--;
    meses += 12;
  }

  // Ajuste de días negativos (meses con distinta duración)
  if (dias < 0) {
    const ultimoDiaMesPasado = new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
    meses--;
    dias += ultimoDiaMesPasado;
  }

  return {
    anos,
    meses,
    dias,
    horas: ahora.getHours(),
    minutos: ahora.getMinutes(),
    segundos: ahora.getSeconds()
  };
}

function actualizarContador() {
  const t = calcularTiempoVivido();
  
  if ($('#anos')) $('#anos').textContent = t.anos;
  if ($('#meses')) $('#meses').textContent = t.meses;
  if ($('#dias')) $('#dias').textContent = t.dias;
  if ($('#horas')) $('#horas').textContent = two(t.horas);
  if ($('#minutos')) $('#minutos').textContent = two(t.minutos);
  if ($('#segundos')) $('#segundos').textContent = two(t.segundos);
}

// MODAL CARTA
const cartaImagen = $('#carta-imagen');
const cartaModal = $('#carta-modal');
const cartaCloseBtn = $('#carta-close-btn');

if (cartaImagen) {
  cartaImagen.addEventListener('click', () => cartaModal.classList.add('active'));
}
if (cartaCloseBtn) {
  cartaCloseBtn.addEventListener('click', () => cartaModal.classList.remove('active'));
}

// PARTÍCULAS
function crearExplosionParticulas(x, y) {
  const colores = ['#ff69b4', '#ff1493', '#ff91a4', '#ffc0cb'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particula';
    const size = Math.random() * 8 + 4;
    Object.assign(p.style, {
      width: size + 'px',
      height: size + 'px',
      backgroundColor: colores[Math.floor(Math.random() * colores.length)],
      left: x + 'px',
      top: y + 'px',
      position: 'fixed',
      pointerEvents: 'none',
      borderRadius: '50%',
      zIndex: '1000'
    });
    document.body.appendChild(p);

    const angulo = Math.random() * Math.PI * 2;
    const dist = Math.random() * 100 + 50;
    
    p.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angulo) * dist}px, ${Math.sin(angulo) * dist}px) scale(0)`, opacity: 0 }
    ], { duration: 1500, easing: 'ease-out' }).onfinish = () => p.remove();
  }
}

recuerdos.addEventListener('click', (e) => {
  if (recuerdos.classList.contains('active')) crearExplosionParticulas(e.clientX, e.clientY);
});

// INICIO
document.addEventListener('DOMContentLoaded', () => {
  actualizarContador();
  setInterval(actualizarContador, 1000);
});
