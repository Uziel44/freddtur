/* Fredd Tur — MVP web estática.
   Todo lo que se edita (contacto, destinos, modalidades de paquete) está en la sección DATOS EDITABLES.
   Las fotos son de Unsplash (banco libre): se guardan solo como ID y se arma la URL en foto().
   Para usar fotos propias, reemplazá el ID por una URL completa que empiece con "http". */
(() => {
  'use strict';

  /* =====================================================================
     DATOS EDITABLES
     ===================================================================== */

  const CONTACTO = {
    whatsapp: '5548991202244',             // solo dígitos: país (55) + área (48) + número
    whatsappVisible: '+55 48 99120-2244',
    emails: ['freddtur@hotmail.com', 'freddturismo@gmail.com'],
    instagram: '',                         // URL completa; vacío = no se muestra
    facebook: '',                          // URL completa; vacío = no se muestra
    razonSocial: 'FREDDTUR TURISMO LTDA.',
    cnpj: '09.303.160/0001-84',
    ubicacion: 'Praia do Rosa · Imbituba · SC · Brasil'
  };

  const NOCHES = 7;                        // duración de los paquetes modelo

  // Mensajes que abren WhatsApp. La clave se usa en los enlaces con data-wa="clave" del HTML.
  const MENSAJES = {
    general: 'Hola Fredd Tur! Quiero consultar por un paquete a Santa Catarina.',
    pasaje: 'Hola Fredd Tur! Quiero consultar por pasajes (aéreo o en bus) a Santa Catarina.',
    traslado: 'Hola Fredd Tur! Quiero cotizar un traslado en trafic.',
    alojamiento: 'Hola Fredd Tur! Quiero consultar por alojamiento en Santa Catarina.',
    excursion: 'Hola Fredd Tur! Quiero consultar por excursiones en la zona.'
  };

  const ZONAS = {
    sur: 'Costa sur de SC',
    norte: 'Norte de Florianópolis'
  };

  const MODALIDADES = [
    {
      id: 'aereo',
      nombre: 'Aéreo + traslado',
      corto: 'Aéreo',
      iconos: ['i-plane'],
      foto: '1527605158555-853f200063e9',
      resumen: 'Volás a Florianópolis y te esperamos en la trafic.',
      incluye: [
        'Pasaje aéreo a Florianópolis',
        'Traslado del aeropuerto al alojamiento',
        'Alojamiento en posada u hotel de la zona',
        'Excursiones opcionales'
      ]
    },
    {
      id: 'bus',
      nombre: 'Bus + traslado',
      corto: 'Bus',
      iconos: ['i-bus'],
      foto: '1786545638379-2c556a8ab23b',
      resumen: 'Viajás por tierra desde Argentina y te llevamos hasta la puerta.',
      incluye: [
        'Pasaje en bus de larga distancia',
        'Traslado desde la terminal al alojamiento',
        'Alojamiento en posada u hotel de la zona',
        'Excursiones opcionales'
      ]
    },
    {
      id: 'mixto',
      nombre: 'Aéreo + bus',
      corto: 'Aéreo + bus',
      iconos: ['i-plane', 'i-bus'],
      foto: '1639616322896-357c8e5a449a',
      resumen: 'Ida en avión y vuelta en bus, o al revés.',
      incluye: [
        'Un tramo en avión y el otro en bus',
        'Traslados de llegada y de salida',
        'Alojamiento en posada u hotel de la zona',
        'Excursiones opcionales'
      ]
    }
  ];

  const DESTINOS = [
    {
      id: 'garopaba', nombre: 'Garopaba', zona: 'sur',
      lema: 'Surf, ballenas y un centro con vida propia',
      descripcion: 'Playas de mar abierto en la costa sur de Santa Catarina, con surf y avistaje de ballenas franca entre el invierno y la primavera. El centro tiene restaurantes, comercios y vida nocturna.',
      foto: '1687783313981-8a016dc28ed4', colores: ['#4cc3e6', '#0b5f7a']
    },
    {
      id: 'praia-do-rosa', nombre: 'Praia do Rosa', zona: 'sur',
      lema: 'Naturaleza, surf y pousadas entre colinas',
      descripcion: 'Playa de mar abierto rodeada de colinas, en el municipio de Imbituba. Ambiente tranquilo, pousadas, surf y ballenas en temporada. Es la zona donde está la base de Fredd Tur.',
      foto: '1725378531698-fbc644a0f0f8', colores: ['#3f9d73', '#145139']
    },
    {
      id: 'ferrugem', nombre: 'Ferrugem', zona: 'sur',
      lema: 'Una playa amplia con olas y bares sobre la arena',
      descripcion: 'Larga playa de arena clara en Garopaba, con mar abierto, escuelas de surf y bares sobre la costa.',
      foto: '1638644447679-60d208ae5875', colores: ['#f7c948', '#b5791a']
    },
    {
      id: 'canasvieiras', nombre: 'Canasvieiras', zona: 'norte',
      lema: 'Aguas calmas y servicios para toda la familia',
      descripcion: 'Playa de aguas tranquilas en el norte de la isla de Florianópolis, con mucha oferta de alojamiento, restaurantes y comercios. Muy elegida por turistas argentinos.',
      foto: '1669761151628-20999598357a', colores: ['#5ed0ea', '#0b7a9e']
    },
    {
      id: 'jurere', nombre: 'Jurerê', zona: 'norte',
      lema: 'Playa tranquila, beach clubs y buena mesa',
      descripcion: 'Playa de aguas calmas y arena clara en el norte de la isla de Florianópolis, conocida por sus beach clubs y su gastronomía.',
      foto: '1725378531790-dc2b9cf5a647', colores: ['#79c9a0', '#1b6a4a']
    },
    {
      id: 'ingleses', nombre: 'Praia dos Ingleses', zona: 'norte',
      lema: 'Extensa, con todos los servicios',
      descripcion: 'Extensa playa de arena clara en el norte de la isla de Florianópolis, con gran variedad de alojamiento, gastronomía y comercios.',
      foto: '1681157865251-2155d60882c0', colores: ['#4cc3e6', '#1b6a4a']
    }
  ];

  // Foto del atajo "Traslados" (la sección de traslados usa otra, definida en styles.css).
  const FOTO_TRASLADO = '1688619103602-35c5b27a6619';

  /* =====================================================================
     UTILIDADES
     ===================================================================== */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const foto = (id, ancho = 900) =>
    id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=${ancho}`;

  const waLink = (texto) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`;

  const icono = (id) => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;

  const estiloDestino = (d, ancho) =>
    `--c1:${d.colores[0]};--c2:${d.colores[1]};--foto:url('${foto(d.foto, ancho)}')`;

  const buscarDestino = (id) => DESTINOS.find((d) => d.id === id);
  const buscarModalidad = (id) => MODALIDADES.find((m) => m.id === id);

  /* =====================================================================
     RENDER DE SECCIONES
     ===================================================================== */

  function renderAtajos() {
    const items = [
      ...DESTINOS.map((d) => ({ attr: `data-destino="${d.id}"`, texto: d.nombre, foto: d.foto })),
      ...MODALIDADES.map((m) => ({ attr: 'data-ir="#paquetes"', texto: m.corto, foto: m.foto })),
      { attr: 'data-ir="#traslados"', texto: 'Traslados', foto: FOTO_TRASLADO }
    ];
    $('#atajos').innerHTML = items.map((it) => `
      <li class="atajo">
        <button type="button" ${it.attr}>
          <span class="atajo__c" style="--foto:url('${foto(it.foto, 240)}')"></span>
          <span>${it.texto}</span>
        </button>
      </li>`).join('');
  }

  function renderFiltros() {
    const opciones = [['todas', 'Todas'], ['sur', ZONAS.sur], ['norte', ZONAS.norte]];
    $('#filtros').innerHTML = opciones.map(([clave, texto], i) =>
      `<button class="filtro" type="button" data-zona="${clave}" aria-pressed="${i === 0}">${texto}</button>`).join('');
  }

  function renderDestinos(zona = 'todas') {
    const lista = DESTINOS.filter((d) => zona === 'todas' || d.zona === zona);
    $('#gridDestinos').innerHTML = lista.map((d) => `
      <article class="dest" style="${estiloDestino(d, 800)}">
        <button class="dest__btn" type="button" data-destino="${d.id}" aria-label="Ver detalle de ${d.nombre}">
          <span class="dest__zona">${ZONAS[d.zona]}</span>
          <span class="dest__nombre">${d.nombre}</span>
          <span class="dest__lema">${d.lema}</span>
          <span class="dest__ver">Ver detalle →</span>
        </button>
      </article>`).join('');
  }

  function renderModalidades() {
    $('#gridModos').innerHTML = MODALIDADES.map((m) => {
      const texto = `Hola Fredd Tur! Quiero cotizar un paquete "${m.nombre}" de ${NOCHES} noches a Santa Catarina.`;
      return `
      <article class="ficha">
        <div class="ficha__foto" style="--foto:url('${foto(m.foto, 800)}')">
          <span class="ficha__tag">Paquete · ${NOCHES} noches</span>
          <span class="ficha__iconos">${m.iconos.map(icono).join('')}</span>
        </div>
        <div class="ficha__body">
          <h3>${m.nombre}</h3>
          <p class="ficha__resumen">${m.resumen}</p>
          <ul class="lista-check">${m.incluye.map((i) => `<li>${icono('i-check')}${i}</li>`).join('')}</ul>
          <div class="ficha__precio"><small>Desde</small><b>Consultá tarifa</b></div>
          <a class="btn btn--wa btn--bloque" href="${waLink(texto)}" target="_blank" rel="noopener">${icono('i-wa')}Cotizar por WhatsApp</a>
        </div>
      </article>`;
    }).join('');
  }

  function renderPie() {
    const c = CONTACTO;
    $('#pieRazon').innerHTML = `${c.razonSocial}<br>CNPJ ${c.cnpj}<br>${c.ubicacion}`;
    $('#cfRazon').textContent = `${c.razonSocial} · CNPJ ${c.cnpj}`;
    $('#cfSede').textContent = c.ubicacion.replace(/ · /g, ', ');

    const filas = [
      `<li><a href="${waLink(MENSAJES.general)}" target="_blank" rel="noopener">${icono('i-wa')}${c.whatsappVisible}</a></li>`,
      ...c.emails.map((e) => `<li><a href="mailto:${e}">${icono('i-mail')}${e}</a></li>`)
    ];
    $('#pieContacto').innerHTML = filas.join('');

    const redes = [['Instagram', c.instagram], ['Facebook', c.facebook]]
      .filter(([, url]) => url)
      .map(([nombre, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${nombre}</a></li>`);
    $('#pieRedes').innerHTML = redes.length ? redes.join('') : '<li class="pie__vacio">Próximamente</li>';

    $('#pieCopy').textContent = `© ${new Date().getFullYear()} ${c.razonSocial} Fotos de muestra: Unsplash.`;
  }

  // Enlaces del HTML con data-wa="clave": abren WhatsApp con el mensaje de esa clave.
  function enlazarWhatsApp() {
    $$('[data-wa]').forEach((a) => {
      a.href = waLink(MENSAJES[a.dataset.wa] || MENSAJES.general);
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  /* =====================================================================
     DETALLE DE DESTINO (modal)
     ===================================================================== */

  const dlg = $('#detalle');

  function abrirDetalle(id, modoId = MODALIDADES[0].id) {
    const d = buscarDestino(id);
    if (!d) return;
    dlg.dataset.actual = d.id;   // no usar data-destino: los clics dentro del modal lo tomarían como "abrir otro destino"

    dlg.innerHTML = `
      <form method="dialog" class="modal__cerrar">
        <button aria-label="Cerrar detalle">${icono('i-close')}</button>
      </form>
      <header class="modal__head" style="${estiloDestino(d, 1100)}">
        <span class="dest__zona">${ZONAS[d.zona]}</span>
        <h2 id="dTitulo">${d.nombre}</h2>
        <p>${d.lema}</p>
      </header>
      <div class="modal__body">
        <p>${d.descripcion}</p>
        <fieldset class="modos">
          <legend>Elegí la modalidad</legend>
          ${MODALIDADES.map((m) => `
            <label class="modo-op">
              <input type="radio" name="modo" value="${m.id}" ${m.id === modoId ? 'checked' : ''}>
              <span class="modo-op__caja">
                <span class="modo-op__t">${m.iconos.map(icono).join('')}${m.nombre}</span>
                <span class="modo-op__r">${m.resumen}</span>
              </span>
            </label>`).join('')}
        </fieldset>
        <ul class="lista-check" id="dIncluye"></ul>
        <div class="campos">
          <label>Pasajeros<input id="fPax" type="number" min="1" max="60" value="2" inputmode="numeric"></label>
          <label>Salida desde<input id="fOrigen" type="text" maxlength="60" placeholder="Ej: Córdoba"></label>
          <label>Mes de viaje<input id="fMes" type="month"></label>
          <label class="campo--check"><input id="fAg" type="checkbox">Consulto como agencia</label>
        </div>
        <a class="btn btn--wa btn--bloque" id="dWa" href="#" target="_blank" rel="noopener">${icono('i-wa')}Pedir cotización por WhatsApp</a>
        <p class="nota">Paquete modelo de ${NOCHES} noches. Las tarifas y los cupos se confirman por WhatsApp.</p>
      </div>`;

    actualizarDetalle();
    document.body.classList.add('bloqueado');
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
  }

  // Recalcula la lista de incluidos y el enlace de WhatsApp según lo que el usuario eligió.
  function actualizarDetalle() {
    const d = buscarDestino(dlg.dataset.actual);
    const marcado = $('input[name="modo"]:checked', dlg);
    if (!d || !marcado) return;
    const m = buscarModalidad(marcado.value);

    $('#dIncluye', dlg).innerHTML = m.incluye.map((i) => `<li>${icono('i-check')}${i}</li>`).join('');

    const pax = Math.max(1, Math.min(60, parseInt($('#fPax', dlg).value, 10) || 1));
    const origen = $('#fOrigen', dlg).value.trim();
    const mes = $('#fMes', dlg).value.trim().split('-').reverse().join('/');
    const agencia = $('#fAg', dlg).checked;

    const lineas = [
      'Hola Fredd Tur! Quiero cotizar un paquete.',
      `Destino: ${d.nombre}`,
      `Modalidad: ${m.nombre}`,
      `Noches: ${NOCHES}`,
      `Pasajeros: ${pax}`
    ];
    if (origen) lineas.push(`Salida desde: ${origen}`);
    if (mes) lineas.push(`Mes de viaje: ${mes}`);
    lineas.push(`Consulto como: ${agencia ? 'agencia' : 'pasajero'}`);

    $('#dWa', dlg).href = waLink(lineas.join('\n'));
  }

  dlg.addEventListener('input', actualizarDetalle);
  dlg.addEventListener('change', actualizarDetalle);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });   // clic en el fondo oscuro
  dlg.addEventListener('close', () => document.body.classList.remove('bloqueado'));

  /* =====================================================================
     INTERACCIONES GENERALES
     ===================================================================== */

  function iniciarMenu() {
    const burger = $('#burger');
    const menu = $('#menu');
    const cerrar = () => {
      menu.classList.remove('abierto');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menú');
    };
    burger.addEventListener('click', () => {
      const abierto = menu.classList.toggle('abierto');
      burger.setAttribute('aria-expanded', String(abierto));
      burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) cerrar(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
  }

  function iniciarClics() {
    document.addEventListener('click', (e) => {
      const destino = e.target.closest('[data-destino]');
      if (destino) { abrirDetalle(destino.dataset.destino); return; }

      const ir = e.target.closest('[data-ir]');
      if (ir) { $(ir.dataset.ir).scrollIntoView(); return; }

      const zona = e.target.closest('[data-zona]');
      if (zona) {
        $$('.filtro').forEach((b) => b.setAttribute('aria-pressed', String(b === zona)));
        renderDestinos(zona.dataset.zona);
      }
    });
  }

  function iniciar() {
    renderAtajos();
    renderFiltros();
    renderDestinos();
    renderModalidades();
    renderPie();
    enlazarWhatsApp();
    iniciarMenu();
    iniciarClics();
  }

  iniciar();
})();
