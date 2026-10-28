/* Fredd Tur — MVP web estática.
   Todo lo que se edita (contacto, destinos, modalidades de paquete) está en la sección DATOS EDITABLES.
   Los textos (español y portugués) están en i18n.js: ahí se cambia lo que dice cada destino, paquete y mensaje de WhatsApp.
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

  // Los mensajes que abren WhatsApp están en i18n.js ('msg.general', 'msg.pasaje', ...).
  // La clave se usa en los enlaces con data-wa="clave" del HTML; si no existe, se usa 'general'.
  const MENSAJES = ['general', 'pasaje', 'traslado', 'alojamiento', 'excursion'];

  // incluye = cantidad de ítems de la lista "incluye" (sus textos son 'modo.<id>.inc1', 'inc2', ... en i18n.js)
  const MODALIDADES = [
    { id: 'aereo', iconos: ['i-plane'], foto: '1527605158555-853f200063e9', incluye: 4 },
    { id: 'bus', iconos: ['i-bus'], foto: '1786545638379-2c556a8ab23b', incluye: 4 },
    { id: 'mixto', iconos: ['i-plane', 'i-bus'], foto: '1639616322896-357c8e5a449a', incluye: 4 }
  ];

  // El lema y la descripción de cada destino están en i18n.js ('dest.<id>.lema' y 'dest.<id>.desc').
  const DESTINOS = [
    { id: 'garopaba', nombre: 'Garopaba', zona: 'sur', foto: '1687783313981-8a016dc28ed4', colores: ['#4cc3e6', '#0b5f7a'] },
    { id: 'praia-do-rosa', nombre: 'Praia do Rosa', zona: 'sur', foto: '1725378531698-fbc644a0f0f8', colores: ['#3f9d73', '#145139'] },
    { id: 'ferrugem', nombre: 'Ferrugem', zona: 'sur', foto: '1638644447679-60d208ae5875', colores: ['#f7c948', '#b5791a'] },
    { id: 'canasvieiras', nombre: 'Canasvieiras', zona: 'norte', foto: '1669761151628-20999598357a', colores: ['#5ed0ea', '#0b7a9e'] },
    { id: 'jurere', nombre: 'Jurerê', zona: 'norte', foto: '1725378531790-dc2b9cf5a647', colores: ['#79c9a0', '#1b6a4a'] },
    { id: 'ingleses', nombre: 'Praia dos Ingleses', zona: 'norte', foto: '1681157865251-2155d60882c0', colores: ['#4cc3e6', '#1b6a4a'] }
  ];

  // Foto del atajo "Traslados" (la sección de traslados usa otra, definida en styles.css).
  const FOTO_TRASLADO = '1688619103602-35c5b27a6619';

  /* =====================================================================
     UTILIDADES
     ===================================================================== */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Texto en el idioma actual (ver i18n.js). Sin i18n.js devuelve la clave, así se nota enseguida.
  const t = (clave, vars) => (window.I18N ? window.I18N.t(clave, vars) : clave);

  const txtModo = (m, campo) => t(`modo.${m.id}.${campo}`);
  const incluidos = (m) => Array.from({ length: m.incluye }, (_, i) => t(`modo.${m.id}.inc${i + 1}`));
  const txtDestino = (d, campo) => t(`dest.${d.id}.${campo}`);
  const nombreZona = (zona) => t(`zona.${zona}`);

  const foto = (id, ancho = 900) =>
    id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=${ancho}`;

  const waLink = (texto) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`;

  const icono = (id) => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;

  const estiloDestino = (d, ancho) =>
    `--c1:${d.colores[0]};--c2:${d.colores[1]};--foto:url('${foto(d.foto, ancho)}')`;

  const buscarDestino = (id) => DESTINOS.find((d) => d.id === id);
  const buscarModalidad = (id) => MODALIDADES.find((m) => m.id === id);

  // Zona elegida en los filtros: se recuerda para no perderla al cambiar de idioma.
  let zonaActual = 'todas';

  /* =====================================================================
     RENDER DE SECCIONES
     ===================================================================== */

  function renderAtajos() {
    const items = [
      ...DESTINOS.map((d) => ({ attr: `data-destino="${d.id}"`, texto: d.nombre, foto: d.foto })),
      ...MODALIDADES.map((m) => ({ attr: 'data-ir="#paquetes"', texto: txtModo(m, 'corto'), foto: m.foto })),
      { attr: 'data-ir="#traslados"', texto: t('atajo.traslados'), foto: FOTO_TRASLADO }
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
    const opciones = [['todas', t('zona.todas')], ['sur', t('zona.sur')], ['norte', t('zona.norte')]];
    $('#filtros').innerHTML = opciones.map(([clave, texto]) =>
      `<button class="filtro" type="button" data-zona="${clave}" aria-pressed="${clave === zonaActual}">${texto}</button>`).join('');
  }

  function renderDestinos(zona = zonaActual) {
    const lista = DESTINOS.filter((d) => zona === 'todas' || d.zona === zona);
    $('#gridDestinos').innerHTML = lista.map((d) => `
      <article class="dest" style="${estiloDestino(d, 800)}">
        <button class="dest__btn" type="button" data-destino="${d.id}" aria-label="${t('ui.aria_detalle', { n: d.nombre })}">
          <span class="dest__zona">${nombreZona(d.zona)}</span>
          <span class="dest__nombre">${d.nombre}</span>
          <span class="dest__lema">${txtDestino(d, 'lema')}</span>
          <span class="dest__ver">${t('ui.ver_detalle')}</span>
        </button>
      </article>`).join('');
  }

  function renderModalidades() {
    $('#gridModos').innerHTML = MODALIDADES.map((m) => {
      const texto = t('msg.paquete', { m: txtModo(m, 'nombre'), n: NOCHES });
      return `
      <article class="ficha">
        <div class="ficha__foto" style="--foto:url('${foto(m.foto, 800)}')">
          <span class="ficha__tag">${t('ui.tag', { n: NOCHES })}</span>
          <span class="ficha__iconos">${m.iconos.map(icono).join('')}</span>
        </div>
        <div class="ficha__body">
          <h3>${txtModo(m, 'nombre')}</h3>
          <p class="ficha__resumen">${txtModo(m, 'resumen')}</p>
          <ul class="lista-check">${incluidos(m).map((i) => `<li>${icono('i-check')}${i}</li>`).join('')}</ul>
          <div class="ficha__precio"><small>${t('ui.desde')}</small><b>${t('ui.tarifa')}</b></div>
          <a class="btn btn--wa btn--bloque" href="${waLink(texto)}" target="_blank" rel="noopener">${icono('i-wa')}${t('ui.cotizar_wa')}</a>
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
      `<li><a href="${waLink(t('msg.general'))}" target="_blank" rel="noopener">${icono('i-wa')}${c.whatsappVisible}</a></li>`,
      ...c.emails.map((e) => `<li><a href="mailto:${e}">${icono('i-mail')}${e}</a></li>`)
    ];
    $('#pieContacto').innerHTML = filas.join('');

    const redes = [['Instagram', c.instagram], ['Facebook', c.facebook]]
      .filter(([, url]) => url)
      .map(([nombre, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${nombre}</a></li>`);
    $('#pieRedes').innerHTML = redes.length ? redes.join('') : `<li class="pie__vacio">${t('ui.proximamente')}</li>`;

    $('#pieCopy').textContent = t('ui.pie_copy', { y: new Date().getFullYear(), r: c.razonSocial });
  }

  // Enlaces del HTML con data-wa="clave": abren WhatsApp con el mensaje de esa clave.
  function enlazarWhatsApp() {
    $$('[data-wa]').forEach((a) => {
      const clave = MENSAJES.includes(a.dataset.wa) ? a.dataset.wa : 'general';
      a.href = waLink(t(`msg.${clave}`));
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
        <button aria-label="${t('ui.cerrar')}">${icono('i-close')}</button>
      </form>
      <header class="modal__head" style="${estiloDestino(d, 1100)}">
        <span class="dest__zona">${nombreZona(d.zona)}</span>
        <h2 id="dTitulo">${d.nombre}</h2>
        <p>${txtDestino(d, 'lema')}</p>
      </header>
      <div class="modal__body">
        <p>${txtDestino(d, 'desc')}</p>
        <fieldset class="modos">
          <legend>${t('ui.modalidad')}</legend>
          ${MODALIDADES.map((m) => `
            <label class="modo-op">
              <input type="radio" name="modo" value="${m.id}" ${m.id === modoId ? 'checked' : ''}>
              <span class="modo-op__caja">
                <span class="modo-op__t">${m.iconos.map(icono).join('')}${txtModo(m, 'nombre')}</span>
                <span class="modo-op__r">${txtModo(m, 'resumen')}</span>
              </span>
            </label>`).join('')}
        </fieldset>
        <ul class="lista-check" id="dIncluye"></ul>
        <div class="campos">
          <label>${t('ui.pax')}<input id="fPax" type="number" min="1" max="60" value="2" inputmode="numeric"></label>
          <label>${t('ui.origen')}<input id="fOrigen" type="text" maxlength="60" placeholder="${t('ui.origen_ph')}"></label>
          <label>${t('ui.mes')}<input id="fMes" type="month"></label>
          <label class="campo--check"><input id="fAg" type="checkbox">${t('ui.agencia')}</label>
        </div>
        <a class="btn btn--wa btn--bloque" id="dWa" href="#" target="_blank" rel="noopener">${icono('i-wa')}${t('ui.pedir')}</a>
        <p class="nota">${t('ui.nota_modal', { n: NOCHES })}</p>
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

    $('#dIncluye', dlg).innerHTML = incluidos(m).map((i) => `<li>${icono('i-check')}${i}</li>`).join('');

    const pax = Math.max(1, Math.min(60, parseInt($('#fPax', dlg).value, 10) || 1));
    const origen = $('#fOrigen', dlg).value.trim();
    const mes = $('#fMes', dlg).value.trim().split('-').reverse().join('/');
    const agencia = $('#fAg', dlg).checked;

    const lineas = [
      t('msg.d.intro'),
      t('msg.d.destino', { v: d.nombre }),
      t('msg.d.modalidad', { v: txtModo(m, 'nombre') }),
      t('msg.d.noches', { v: NOCHES }),
      t('msg.d.pax', { v: pax })
    ];
    if (origen) lineas.push(t('msg.d.origen', { v: origen }));
    if (mes) lineas.push(t('msg.d.mes', { v: mes }));
    lineas.push(t('msg.d.como', { v: t(agencia ? 'msg.d.agencia' : 'msg.d.pasajero') }));

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
      burger.setAttribute('aria-label', t('menu.open'));
    };
    burger.addEventListener('click', () => {
      const abierto = menu.classList.toggle('abierto');
      burger.setAttribute('aria-expanded', String(abierto));
      burger.setAttribute('aria-label', t(abierto ? 'menu.close' : 'menu.open'));
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
        zonaActual = zona.dataset.zona;
        $$('.filtro').forEach((b) => b.setAttribute('aria-pressed', String(b === zona)));
        renderDestinos(zonaActual);
      }
    });
  }

  // Todo lo que arma este archivo se vuelve a dibujar en el idioma nuevo (el resto lo cambia i18n.js).
  function dibujar() {
    renderAtajos();
    renderFiltros();
    renderDestinos();
    renderModalidades();
    renderPie();
    enlazarWhatsApp();
  }

  function iniciar() {
    dibujar();
    iniciarMenu();
    iniciarClics();
    document.addEventListener('i18n:change', dibujar);
  }

  iniciar();
})();
