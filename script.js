/* ============================================
   FLASH EXPRESS - LÓGICA PRINCIPAL v7
   Con combos y cupones
   ============================================ */

/* ============================================
   1. CONFIGURACIÓN GLOBAL
   ============================================ */
const CONFIG = {
  urlBase: 'https://grandeyeison65-sudo.github.io/flash-express',
  whatsapp: '50375605466'
};

/* ============================================
   2. CONTADOR DE VISITAS
   ============================================ */
(function contarVisitas() {
  let visitas = parseInt(localStorage.getItem('fe_visitas')) || 0;
  visitas++;
  localStorage.setItem('fe_visitas', visitas);
})();

/* ============================================
   3. HEADER CON SOMBRA + BACK TO TOP
   ============================================ */
const header = document.getElementById('header');
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    if (header) header.classList.add('scrolled');
  } else {
    if (header) header.classList.remove('scrolled');
  }

  if (window.scrollY > 400) {
    if (backTop) backTop.classList.add('visible');
  } else {
    if (backTop) backTop.classList.remove('visible');
  }
});

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   4. MENÚ HAMBURGUESA
   ============================================ */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });
}

document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    if (nav) nav.classList.remove('open');
    if (hamburger) {
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    }
  });
});

/* ============================================
   5. CONTADORES ANIMADOS
   ============================================ */
const contadores = document.querySelectorAll('.contador');

const observerContadores = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animarContador(entry.target);
      observerContadores.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

contadores.forEach(c => observerContadores.observe(c));

function animarContador(elemento) {
  const objetivo = parseInt(elemento.dataset.target);
  const duracion = 1800;
  const paso = objetivo / (duracion / 16);
  let actual = 0;

  const actualizar = () => {
    actual += paso;
    if (actual < objetivo) {
      elemento.textContent = '+' + Math.floor(actual).toLocaleString();
      requestAnimationFrame(actualizar);
    } else {
      elemento.textContent = '+' + objetivo.toLocaleString();
    }
  };

  actualizar();
}

/* ============================================
   6. CARRUSEL HERO
   ============================================ */
(function inicializarCarruselHero() {
  const slides = document.querySelectorAll('#carrusel-hero .carrusel__slide');
  const dots = document.querySelectorAll('#dots-hero .dot');
  const btnPrev = document.getElementById('prev-hero');
  const btnNext = document.getElementById('next-hero');

  if (!slides.length) return;

  let actual = 0;
  let autoplay;

  function irA(indice) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    actual = (indice + slides.length) % slides.length;

    slides[actual].classList.add('active');
    if (dots[actual]) dots[actual].classList.add('active');
  }

  function siguiente() { irA(actual + 1); }
  function anterior() { irA(actual - 1); }

  function iniciarAutoplay() { autoplay = setInterval(siguiente, 5000); }
  function reiniciarAutoplay() { clearInterval(autoplay); iniciarAutoplay(); }

  if (btnNext) btnNext.addEventListener('click', () => { siguiente(); reiniciarAutoplay(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { anterior(); reiniciarAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { irA(i); reiniciarAutoplay(); });
  });

  let startX = 0;
  const carruselEl = document.getElementById('carrusel-hero');

  if (carruselEl) {
    carruselEl.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    carruselEl.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) siguiente();
        else anterior();
        reiniciarAutoplay();
      }
    });
  }

  iniciarAutoplay();
})();

/* ============================================
   7. CARRUSEL GALERÍA
   ============================================ */
(function inicializarGaleria() {
  const track = document.getElementById('gal-track');
  const btnPrev = document.getElementById('gal-prev');
  const btnNext = document.getElementById('gal-next');

  if (!track) return;

  let posicion = 0;

  function obtenerPorPagina() {
    const w = window.innerWidth;
    if (w <= 720) return 1;
    if (w <= 960) return 2;
    return 3;
  }

  function mover(direccion) {
    const total = track.children.length;
    const porPagina = obtenerPorPagina();
    const maxPos = total - porPagina;

    posicion += direccion;

    if (posicion < 0) posicion = maxPos;
    if (posicion > maxPos) posicion = 0;

    const itemWidth = track.children[0].offsetWidth + 16;
    track.style.transform = `translateX(-${posicion * itemWidth}px)`;
  }

  if (btnNext) btnNext.addEventListener('click', () => mover(1));
  if (btnPrev) btnPrev.addEventListener('click', () => mover(-1));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      posicion = 0;
      track.style.transform = 'translateX(0)';
    }, 200);
  });

  let startX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) mover(1);
      else mover(-1);
    }
  });
})();

/* ============================================
   8. MODAL DE COTIZACIÓN
   ============================================ */
(function inicializarModal() {
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalProducto = document.getElementById('modal-producto');
  const modalNombre = document.getElementById('modal-nombre');
  const modalCantidad = document.getElementById('modal-cantidad');
  const modalEnviar = document.getElementById('modal-enviar');

  if (!modal) return;

  let productoActual = '';

  document.querySelectorAll('.card__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      productoActual = btn.dataset.producto;
      modalProducto.textContent = productoActual;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => modalNombre.focus(), 300);
    });
  });

  function cerrarModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    modalNombre.value = '';
    modalCantidad.value = 1;
  }

  if (modalClose) modalClose.addEventListener('click', cerrarModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) cerrarModal();
  });

  if (modalEnviar) {
    modalEnviar.addEventListener('click', () => {
      const nombre = modalNombre.value.trim();
      const cantidad = modalCantidad.value || 1;

      if (!nombre) {
        modalNombre.focus();
        modalNombre.style.borderColor = '#ff3b3b';
        setTimeout(() => modalNombre.style.borderColor = '', 1500);
        mostrarToast('Por favor escribe tu nombre', 'error');
        return;
      }

      let msg = '¡Hola Flash Express! 👋%0A%0A';
      msg += 'Mi nombre es *' + encodeURIComponent(nombre) + '*.%0A';
      msg += 'Quiero cotizar *' + cantidad + '* unidad(es) de *' + productoActual + '*.%0A%0A';
      msg += '¿Me pueden dar más información?';

      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + msg, '_blank');
      mostrarToast('Abriendo WhatsApp...', 'ok');
      cerrarModal();
    });
  }
})();

/* ============================================
   9. COPIAR CUPONES
   ============================================ */
(function inicializarCopiarCupones() {
  document.querySelectorAll('[data-codigo]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const codigo = btn.dataset.codigo;

      try {
        await navigator.clipboard.writeText(codigo);

        const textoOriginal = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
        btn.classList.add('copiado');

        mostrarToast('Cupón ' + codigo + ' copiado al portapapeles', 'ok');

        setTimeout(() => {
          btn.innerHTML = textoOriginal;
          btn.classList.remove('copiado');
        }, 2000);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = codigo;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();

        mostrarToast('Cupón ' + codigo + ' copiado', 'ok');
      }
    });
  });
})();

/* CONTINÚA EN PARTE 2 */
/* ============================================
   10. FORMULARIO DE PEDIDO
   ============================================ */
(function inicializarFormPedido() {
  const form = document.getElementById('form-pedido');
  if (!form) return;

  const COSTOS_ENVIO = {
    'San Isidro': 2,
    'Izalco': 3,
    'Sonsonate': 5,
    'Santa Ana / Ahuachapán': 8,
    'San Salvador / Resto': 10,
    'Recoger en tienda': 0
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('pedido-nombre').value.trim();
    const telefono = document.getElementById('pedido-telefono').value.trim();
    const producto = document.getElementById('pedido-producto').value;
    const cantidad = document.getElementById('pedido-cantidad').value;
    const zona = document.getElementById('pedido-zona').value;
    const pago = document.getElementById('pedido-pago').value;
    const detalles = document.getElementById('pedido-detalles').value.trim();

    if (!nombre || !telefono || !producto || !zona || !pago) {
      mostrarToast('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    const costoEnvio = COSTOS_ENVIO[zona] ?? 0;
    const envioTexto = costoEnvio === 0
      ? 'Recojo en tienda (GRATIS)'
      : 'Envío a *' + zona + '* ($' + costoEnvio + ')';

    let msg = '*NUEVO PEDIDO - Flash Express* 🚀%0A%0A';
    msg += '👤 *Nombre:* ' + encodeURIComponent(nombre) + '%0A';
    msg += '📞 *Teléfono:* ' + encodeURIComponent(telefono) + '%0A';
    msg += '🛍️ *Producto:* ' + encodeURIComponent(producto) + '%0A';
    msg += '🔢 *Cantidad:* ' + cantidad + '%0A';
    msg += '🚚 *' + envioTexto + '*%0A';
    msg += '💳 *Pago:* ' + encodeURIComponent(pago) + '%0A';

    if (detalles) {
      msg += '%0A📝 *Detalles:*%0A' + encodeURIComponent(detalles) + '%0A';
    }

    msg += '%0A_Enviado desde la página web_';

    window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + msg, '_blank');

    mostrarToast('¡Pedido enviado! Te contactamos pronto 🚀', 'ok');

    setTimeout(() => form.reset(), 800);
  });
})();

/* ============================================
   11. FAQ ACORDEÓN
   ============================================ */
(function inicializarFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const pregunta = item.querySelector('.faq-item__q');
    if (!pregunta) return;

    pregunta.addEventListener('click', () => {
      const estabaAbierto = item.classList.contains('abierto');

      items.forEach(i => i.classList.remove('abierto'));

      if (!estabaAbierto) item.classList.add('abierto');
    });
  });

  if (items[0]) items[0].classList.add('abierto');
})();

/* ============================================
   12. SISTEMA DE RESEÑAS
   ============================================ */
const CLAVE_RESENAS = 'flash_resenas_v7';
let resenas = JSON.parse(localStorage.getItem(CLAVE_RESENAS)) || [];

const formResena = document.getElementById('form-resena');
const listaResenas = document.getElementById('resenas-lista');
const promedioNumero = document.getElementById('promedio-numero');
const promedioEstrellas = document.getElementById('promedio-estrellas');
const promedioTotal = document.getElementById('promedio-total');
const barrasEstrellas = document.getElementById('barras-estrellas');
const estrellasInput = document.getElementById('estrellas-input');
const inputPuntuacion = document.getElementById('puntuacion');

/* ---------- 12.1 INPUT DE ESTRELLAS ---------- */
let puntuacionSeleccionada = 0;

if (estrellasInput) {
  estrellasInput.querySelectorAll('i').forEach(estrella => {
    estrella.addEventListener('mouseenter', () => {
      pintarEstrellasInput(parseInt(estrella.dataset.valor));
    });

    estrella.addEventListener('click', () => {
      puntuacionSeleccionada = parseInt(estrella.dataset.valor);
      inputPuntuacion.value = puntuacionSeleccionada;
      pintarEstrellasInput(puntuacionSeleccionada);
    });
  });

  estrellasInput.addEventListener('mouseleave', () => {
    pintarEstrellasInput(puntuacionSeleccionada);
  });
}

function pintarEstrellasInput(valor) {
  if (!estrellasInput) return;
  estrellasInput.querySelectorAll('i').forEach((el, i) => {
    if (i < valor) {
      el.classList.remove('fa-regular');
      el.classList.add('fa-solid');
    } else {
      el.classList.remove('fa-solid');
      el.classList.add('fa-regular');
    }
  });
}

/* ---------- 12.2 GUARDAR RESEÑA ---------- */
if (formResena) {
  formResena.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const comentario = document.getElementById('comentario').value.trim();
    const puntuacion = parseInt(inputPuntuacion.value);

    if (!nombre) {
      mostrarToast('Por favor escribe tu nombre', 'error');
      return;
    }
    if (puntuacion < 1 || puntuacion > 5) {
      mostrarToast('Selecciona una puntuación de 1 a 5 estrellas', 'error');
      return;
    }
    if (comentario.length < 5) {
      mostrarToast('El comentario debe tener al menos 5 caracteres', 'error');
      return;
    }

    const nuevaResena = {
      id: Date.now(),
      nombre: nombre,
      puntuacion: puntuacion,
      comentario: comentario,
      fecha: new Date().toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    };

    resenas.unshift(nuevaResena);
    localStorage.setItem(CLAVE_RESENAS, JSON.stringify(resenas));

    formResena.reset();
    puntuacionSeleccionada = 0;
    inputPuntuacion.value = 0;
    pintarEstrellasInput(0);

    renderizarResenas();
    calcularPromedio();

    mostrarToast('¡Gracias por tu reseña! 🌟', 'ok');
  });
}

/* ---------- 12.3 MOSTRAR RESEÑAS ---------- */
function renderizarResenas() {
  if (!listaResenas) return;

  listaResenas.innerHTML = '';

  if (resenas.length === 0) {
    listaResenas.innerHTML = '<p class="resenas-vacio"><i class="fa-regular fa-comment-dots"></i><br>Aún no hay reseñas. ¡Sé el primero en opinar!</p>';
    return;
  }

  resenas.forEach(resena => {
    const inicial = resena.nombre.charAt(0).toUpperCase();
    const estrellasHTML = generarEstrellasHTML(resena.puntuacion);

    const div = document.createElement('div');
    div.className = 'resena';
    div.innerHTML = '<div class="resena__head"><div class="resena__avatar">' + inicial + '</div><div class="resena__info"><h5>' + escapeHTML(resena.nombre) + '</h5><div class="estrellas">' + estrellasHTML + '</div></div></div><p class="resena__texto">' + escapeHTML(resena.comentario) + '</p><span class="resena__fecha">' + resena.fecha + '</span>';
    listaResenas.appendChild(div);
  });
}

/* ---------- 12.4 ESTRELLAS HTML ---------- */
function generarEstrellasHTML(puntuacion) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= puntuacion) html += '<i class="fa-solid fa-star"></i>';
    else html += '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

/* ---------- 12.5 PROMEDIO PONDERADO ---------- */
function calcularPromedio() {
  if (!promedioNumero) return;

  const total = resenas.length;

  if (total === 0) {
    promedioNumero.textContent = '0.0';
    promedioTotal.textContent = 'Basado en 0 reseñas';
    promedioEstrellas.innerHTML = generarEstrellasHTML(0);
    barrasEstrellas.innerHTML = '';
    for (let i = 5; i >= 1; i--) {
      barrasEstrellas.appendChild(crearBarra(i, 0));
    }
    return;
  }

  const suma = resenas.reduce((acc, r) => acc + r.puntuacion, 0);
  const promedio = suma / total;
  const promedioRedondeado = promedio.toFixed(1);

  promedioNumero.textContent = promedioRedondeado;
  promedioTotal.textContent = 'Basado en ' + total + ' reseña' + (total !== 1 ? 's' : '');
  promedioEstrellas.innerHTML = generarEstrellasHTML(Math.round(promedio));

  const conteo = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  resenas.forEach(r => conteo[r.puntuacion]++);

  barrasEstrellas.innerHTML = '';
  for (let i = 5; i >= 1; i--) {
    const cantidad = conteo[i];
    const porcentaje = (cantidad / total) * 100;
    barrasEstrellas.appendChild(crearBarra(i, porcentaje, cantidad));
  }
}

/* ---------- 12.6 BARRA PORCENTAJE ---------- */
function crearBarra(estrellas, porcentaje, cantidad = 0) {
  const div = document.createElement('div');
  div.className = 'barra';
  div.innerHTML = '<span>' + estrellas + ' <i class="fa-solid fa-star" style="color:#f5c842;font-size:0.75rem"></i></span><div class="barra__track"><div class="barra__fill" style="width: 0%"></div></div><span>' + Math.round(porcentaje) + '%</span>';

  setTimeout(() => {
    const fill = div.querySelector('.barra__fill');
    if (fill) fill.style.width = porcentaje + '%';
  }, 60);

  return div;
}

/* ---------- 12.7 SEGURIDAD ---------- */
function escapeHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/* ============================================
   13. RESEÑAS DE EJEMPLO
   ============================================ */
(function cargarResenasEjemplo() {
  const yaCargado = localStorage.getItem('flash_ejemplo_v7');

  if (!yaCargado && resenas.length === 0) {
    const ejemplos = [
      { id: 1, nombre: 'María López', puntuacion: 5, comentario: 'Excelente servicio, la camiseta quedó increíble. ¡Muy recomendados!', fecha: '12 oct 2025' },
      { id: 2, nombre: 'Carlos Ramírez', puntuacion: 5, comentario: 'Pedí unas gorras para mi equipo y superaron mis expectativas. El diseño quedó perfecto.', fecha: '10 oct 2025' },
      { id: 3, nombre: 'Ana Torres', puntuacion: 4, comentario: 'Buen trabajo con los banners. Solo tardaron un día más de lo previsto pero valió la pena.', fecha: '08 oct 2025' },
      { id: 4, nombre: 'José Martínez', puntuacion: 5, comentario: 'Las tazas personalizadas fueron el hit en la oficina. ¡Gracias por la atención!', fecha: '05 oct 2025' },
      { id: 5, nombre: 'Lucía Hernández', puntuacion: 4, comentario: 'Muy bonitas las pulseras y las manualidades. Recomendados para regalos.', fecha: '02 oct 2025' }
    ];

    resenas = ejemplos;
    localStorage.setItem(CLAVE_RESENAS, JSON.stringify(resenas));
    localStorage.setItem('flash_ejemplo_v7', 'true');
  }
})();

/* ============================================
   14. INICIALIZACIÓN
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderizarResenas();
  calcularPromedio();
});

/* ============================================
   15. TOAST DE NOTIFICACIÓN
   ============================================ */
function mostrarToast(mensaje, tipo = 'ok') {
  const colores = {
    ok: '#1a7f8a',
    error: '#e63946',
    info: '#f59331'
  };

  const iconos = {
    ok: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info'
  };

  document.querySelectorAll('.flash-toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'flash-toast';
  toast.innerHTML = '<i class="fa-solid ' + iconos[tipo] + '"></i> <span>' + mensaje + '</span>';
  toast.style.cssText = 'position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px); background: ' + colores[tipo] + '; color: #fff; padding: 14px 26px; border-radius: 50px; font-family: Inter, sans-serif; font-size: 0.95rem; font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,0.25); z-index: 3000; opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none; display: flex; align-items: center; gap: 10px; max-width: 90vw; text-align: center;';

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

/* ============================================
   16. ATAJOS DE TECLADO
   ============================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (hamburger) {
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    }
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    window.open('https://wa.me/' + CONFIG.whatsapp, '_blank');
    mostrarToast('Abriendo WhatsApp...', 'info');
  }
});

/* ============================================
   17. AÑO AUTOMÁTICO EN FOOTER
   ============================================ */
(function actualizarAnio() {
  const yearElements = document.querySelectorAll('.footer__bottom p');
  const anioActual = new Date().getFullYear();
  yearElements.forEach(el => {
    el.innerHTML = el.innerHTML.replace('2025', anioActual);
    el.innerHTML = el.innerHTML.replace('2026', anioActual);
  });
})();