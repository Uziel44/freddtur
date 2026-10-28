(() => {
  'use strict';

  // ---- Idiomas ----------------------------------------------------------
  // El español (idioma principal) vive en el propio HTML (respaldo sin JS y para buscadores): al cargar
  // se guarda una copia de cada texto marcado y es lo que se restaura al volver a "es". Aquí está el portugués.
  //   data-i18n="clave"                      → reemplaza el contenido del elemento
  //   data-i18n-attr="atributo:clave;..."    → reemplaza atributos (aria-label, ...)
  // Los textos que arma app.js (destinos, paquetes, mensajes de WhatsApp) salen de t('clave'): por eso
  // están en los dos idiomas. Para cambiar una traducción, buscá su clave en DICT.pt (o en DICT.es si es del JS).
  // Para agregar otro idioma: sumalo a LANGS, creá su diccionario en DICT y agregá un botón [data-lang].
  const LANGS = ['es', 'pt'];
  const DEFAULT = 'es';
  const STORAGE_KEY = 'freddtur-lang';
  const HTML_LANG = { es: 'es', pt: 'pt-BR' };

  const DICT = {
    es: {
      // Textos que arma el JS (en el HTML el español ya está escrito)
      "menu.open": "Abrir menú",
      "menu.close": "Cerrar menú",
      "zona.todas": "Todas",
      "zona.sur": "Costa sur de SC",
      "zona.norte": "Norte de Florianópolis",
      "atajo.traslados": "Traslados",
      "dest.garopaba.lema": "Surf, ballenas y un centro con vida propia",
      "dest.garopaba.desc": "Playas de mar abierto en la costa sur de Santa Catarina, con surf y avistaje de ballenas franca entre el invierno y la primavera. El centro tiene restaurantes, comercios y vida nocturna.",
      "dest.praia-do-rosa.lema": "Naturaleza, surf y pousadas entre colinas",
      "dest.praia-do-rosa.desc": "Playa de mar abierto rodeada de colinas, en el municipio de Imbituba. Ambiente tranquilo, pousadas, surf y ballenas en temporada. Es la zona donde está la base de Fredd Tur.",
      "dest.ferrugem.lema": "Una playa amplia con olas y bares sobre la arena",
      "dest.ferrugem.desc": "Larga playa de arena clara en Garopaba, con mar abierto, escuelas de surf y bares sobre la costa.",
      "dest.canasvieiras.lema": "Aguas calmas y servicios para toda la familia",
      "dest.canasvieiras.desc": "Playa de aguas tranquilas en el norte de la isla de Florianópolis, con mucha oferta de alojamiento, restaurantes y comercios. Muy elegida por turistas argentinos.",
      "dest.jurere.lema": "Playa tranquila, beach clubs y buena mesa",
      "dest.jurere.desc": "Playa de aguas calmas y arena clara en el norte de la isla de Florianópolis, conocida por sus beach clubs y su gastronomía.",
      "dest.ingleses.lema": "Extensa, con todos los servicios",
      "dest.ingleses.desc": "Extensa playa de arena clara en el norte de la isla de Florianópolis, con gran variedad de alojamiento, gastronomía y comercios.",
      "modo.aereo.nombre": "Aéreo + traslado",
      "modo.aereo.corto": "Aéreo",
      "modo.aereo.resumen": "Volás a Florianópolis y te esperamos en la trafic.",
      "modo.aereo.inc1": "Pasaje aéreo a Florianópolis",
      "modo.aereo.inc2": "Traslado del aeropuerto al alojamiento",
      "modo.aereo.inc3": "Alojamiento en posada u hotel de la zona",
      "modo.aereo.inc4": "Excursiones opcionales",
      "modo.bus.nombre": "Bus + traslado",
      "modo.bus.corto": "Bus",
      "modo.bus.resumen": "Viajás por tierra desde Argentina y te llevamos hasta la puerta.",
      "modo.bus.inc1": "Pasaje en bus de larga distancia",
      "modo.bus.inc2": "Traslado desde la terminal al alojamiento",
      "modo.bus.inc3": "Alojamiento en posada u hotel de la zona",
      "modo.bus.inc4": "Excursiones opcionales",
      "modo.mixto.nombre": "Aéreo + bus",
      "modo.mixto.corto": "Aéreo + bus",
      "modo.mixto.resumen": "Ida en avión y vuelta en bus, o al revés.",
      "modo.mixto.inc1": "Un tramo en avión y el otro en bus",
      "modo.mixto.inc2": "Traslados de llegada y de salida",
      "modo.mixto.inc3": "Alojamiento en posada u hotel de la zona",
      "modo.mixto.inc4": "Excursiones opcionales",
      "ui.ver_detalle": "Ver detalle →",
      "ui.aria_detalle": "Ver detalle de {n}",
      "ui.cerrar": "Cerrar detalle",
      "ui.modalidad": "Elegí la modalidad",
      "ui.pax": "Pasajeros",
      "ui.origen": "Salida desde",
      "ui.origen_ph": "Ej: Córdoba",
      "ui.mes": "Mes de viaje",
      "ui.agencia": "Consulto como agencia",
      "ui.pedir": "Pedir cotización por WhatsApp",
      "ui.nota_modal": "Paquete modelo de {n} noches. Las tarifas y los cupos se confirman por WhatsApp.",
      "ui.tag": "Paquete · {n} noches",
      "ui.desde": "Desde",
      "ui.tarifa": "Consultá tarifa",
      "ui.cotizar_wa": "Cotizar por WhatsApp",
      "ui.proximamente": "Próximamente",
      "ui.pie_copy": "© {y} {r} Fotos de muestra: Unsplash.",
      "lang.group": "Idioma",
      "msg.general": "Hola Fredd Tur! Quiero consultar por un paquete a Santa Catarina.",
      "msg.pasaje": "Hola Fredd Tur! Quiero consultar por pasajes (aéreo o en bus) a Santa Catarina.",
      "msg.traslado": "Hola Fredd Tur! Quiero cotizar un traslado en trafic.",
      "msg.alojamiento": "Hola Fredd Tur! Quiero consultar por alojamiento en Santa Catarina.",
      "msg.excursion": "Hola Fredd Tur! Quiero consultar por excursiones en la zona.",
      "msg.paquete": "Hola Fredd Tur! Quiero cotizar un paquete \"{m}\" de {n} noches a Santa Catarina.",
      "msg.d.intro": "Hola Fredd Tur! Quiero cotizar un paquete.",
      "msg.d.destino": "Destino: {v}",
      "msg.d.modalidad": "Modalidad: {v}",
      "msg.d.noches": "Noches: {v}",
      "msg.d.pax": "Pasajeros: {v}",
      "msg.d.origen": "Salida desde: {v}",
      "msg.d.mes": "Mes de viaje: {v}",
      "msg.d.como": "Consulto como: {v}",
      "msg.d.agencia": "agencia",
      "msg.d.pasajero": "pasajero",
    },
    pt: {
      // Título y descripción de la página
      "meta.title": "Fredd Tur | Pacotes para as praias de Santa Catarina",
      "meta.description": "Pacotes completos com passagens aéreas e rodoviárias, hospedagem e transfers para Garopaba, Praia do Rosa, Ferrugem, Canasvieiras, Jurerê e Praia dos Ingleses.",
      // Textos que arma el JS (app.js)
      "menu.open": "Abrir menu",
      "menu.close": "Fechar menu",
      "zona.todas": "Todas",
      "zona.sur": "Costa sul de SC",
      "zona.norte": "Norte de Florianópolis",
      "atajo.traslados": "Transfers",
      "dest.garopaba.lema": "Surfe, baleias e um centro com vida própria",
      "dest.garopaba.desc": "Praias de mar aberto na costa sul de Santa Catarina, com surfe e observação de baleias-francas entre o inverno e a primavera. O centro tem restaurantes, comércio e vida noturna.",
      "dest.praia-do-rosa.lema": "Natureza, surfe e pousadas entre colinas",
      "dest.praia-do-rosa.desc": "Praia de mar aberto cercada por colinas, no município de Imbituba. Ambiente tranquilo, pousadas, surfe e baleias na temporada. É a região onde fica a base da Fredd Tur.",
      "dest.ferrugem.lema": "Uma praia ampla com ondas e bares na areia",
      "dest.ferrugem.desc": "Longa praia de areia clara em Garopaba, com mar aberto, escolas de surfe e bares à beira-mar.",
      "dest.canasvieiras.lema": "Águas calmas e serviços para toda a família",
      "dest.canasvieiras.desc": "Praia de águas tranquilas no norte da ilha de Florianópolis, com muita oferta de hospedagem, restaurantes e comércio. Muito escolhida por turistas argentinos.",
      "dest.jurere.lema": "Praia tranquila, beach clubs e boa mesa",
      "dest.jurere.desc": "Praia de águas calmas e areia clara no norte da ilha de Florianópolis, conhecida pelos seus beach clubs e pela gastronomia.",
      "dest.ingleses.lema": "Extensa, com todos os serviços",
      "dest.ingleses.desc": "Extensa praia de areia clara no norte da ilha de Florianópolis, com grande variedade de hospedagem, gastronomia e comércio.",
      "modo.aereo.nombre": "Aéreo + transfer",
      "modo.aereo.corto": "Aéreo",
      "modo.aereo.resumen": "Você voa para Florianópolis e esperamos você na van.",
      "modo.aereo.inc1": "Passagem aérea para Florianópolis",
      "modo.aereo.inc2": "Transfer do aeroporto até a hospedagem",
      "modo.aereo.inc3": "Hospedagem em pousada ou hotel da região",
      "modo.aereo.inc4": "Passeios opcionais",
      "modo.bus.nombre": "Ônibus + transfer",
      "modo.bus.corto": "Ônibus",
      "modo.bus.resumen": "Você viaja por terra desde a Argentina e levamos até a porta.",
      "modo.bus.inc1": "Passagem de ônibus de longa distância",
      "modo.bus.inc2": "Transfer da rodoviária até a hospedagem",
      "modo.bus.inc3": "Hospedagem em pousada ou hotel da região",
      "modo.bus.inc4": "Passeios opcionais",
      "modo.mixto.nombre": "Aéreo + ônibus",
      "modo.mixto.corto": "Aéreo + ônibus",
      "modo.mixto.resumen": "Ida de avião e volta de ônibus, ou ao contrário.",
      "modo.mixto.inc1": "Um trecho de avião e o outro de ônibus",
      "modo.mixto.inc2": "Transfers de chegada e de saída",
      "modo.mixto.inc3": "Hospedagem em pousada ou hotel da região",
      "modo.mixto.inc4": "Passeios opcionais",
      "ui.ver_detalle": "Ver detalhes →",
      "ui.aria_detalle": "Ver detalhes de {n}",
      "ui.cerrar": "Fechar detalhes",
      "ui.modalidad": "Escolha a modalidade",
      "ui.pax": "Passageiros",
      "ui.origen": "Saída de",
      "ui.origen_ph": "Ex.: Córdoba",
      "ui.mes": "Mês da viagem",
      "ui.agencia": "Consulto como agência",
      "ui.pedir": "Pedir cotação pelo WhatsApp",
      "ui.nota_modal": "Pacote modelo de {n} noites. As tarifas e as vagas são confirmadas pelo WhatsApp.",
      "ui.tag": "Pacote · {n} noites",
      "ui.desde": "A partir de",
      "ui.tarifa": "Consulte a tarifa",
      "ui.cotizar_wa": "Cotar pelo WhatsApp",
      "ui.proximamente": "Em breve",
      "ui.pie_copy": "© {y} {r} Fotos de amostra: Unsplash.",
      "lang.group": "Idioma",
      "msg.general": "Olá Fredd Tur! Quero consultar sobre um pacote para Santa Catarina.",
      "msg.pasaje": "Olá Fredd Tur! Quero consultar sobre passagens (aérea ou de ônibus) para Santa Catarina.",
      "msg.traslado": "Olá Fredd Tur! Quero cotar um transfer de van.",
      "msg.alojamiento": "Olá Fredd Tur! Quero consultar sobre hospedagem em Santa Catarina.",
      "msg.excursion": "Olá Fredd Tur! Quero consultar sobre passeios na região.",
      "msg.paquete": "Olá Fredd Tur! Quero cotar um pacote \"{m}\" de {n} noites para Santa Catarina.",
      "msg.d.intro": "Olá Fredd Tur! Quero cotar um pacote.",
      "msg.d.destino": "Destino: {v}",
      "msg.d.modalidad": "Modalidade: {v}",
      "msg.d.noches": "Noites: {v}",
      "msg.d.pax": "Passageiros: {v}",
      "msg.d.origen": "Saída de: {v}",
      "msg.d.mes": "Mês da viagem: {v}",
      "msg.d.como": "Consulto como: {v}",
      "msg.d.agencia": "agência",
      "msg.d.pasajero": "passageiro",
      // Textos marcados con data-i18n / data-i18n-attr en index.html
      "saltar": "Pular para o conteúdo",
      "anuncio.txt": "Passagens aéreas e rodoviárias para Santa Catarina ·",
      "anuncio.cta": "Cote pelo WhatsApp",
      "brand.sub": "Viagem · Praia · Passeios · Experiências",
      "destinos": "Destinos",
      "nav.paquetes": "Pacotes",
      "nav.traslados": "Transfers",
      "nav.preguntas": "Perguntas",
      "nav.cotizar": "Cotar",
      "hero.lema": "com passagens, hospedagem e transfers incluídos",
      "hero.sub": "A Fredd Tur monta o seu pacote de ponta a ponta: avião ou ônibus, pousada ou hotel e transfer de van.",
      "pill.zona": "Desde 2007 na região",
      "pill.pasajes": "Passagens aéreas e rodoviárias",
      "pill.traslados": "Transfers próprios",
      "atencion_wa": "Atendimento pelo WhatsApp",
      "hero.ver": "Ver pacotes",
      "hero.wa": "Falar pelo WhatsApp",
      "atajos.tit": "Mais procurados",
      "atajos.sub": "· direto ao ponto",
      "pasos.eyebrow": "Você escolhe",
      "pasos.h2": "Em qual etapa podemos ajudar?",
      "pasos.p": "Montamos a viagem completa ou só a parte de que você precisa.",
      "paso1.h3": "Passagem aérea ou de ônibus",
      "paso1.p": "Voe para Florianópolis ou viaje por terra desde a Argentina.",
      "paso2.h3": "Transfer de van",
      "paso2.p": "Buscamos você no aeroporto ou na rodoviária e levamos até a hospedagem.",
      "paso3.h3": "Hospedagem",
      "paso3.p": "Pousadas e hotéis da região, de acordo com a sua praia e o seu orçamento.",
      "paso4.h3": "Passeios",
      "paso4.p": "Passeios pela região para aproveitar cada dia da viagem.",
      "consultar": "Consultar",
      "dest.h2": "Escolha a sua praia",
      "dest.p": "Costa sul de Santa Catarina e norte de Florianópolis. Toque em uma praia para ver as modalidades e pedir a sua cotação.",
      "paq.eyebrow": "Pacotes prontos",
      "paq.h2": "Três formas de chegar",
      "paq.p": "Escolha como viajar. Hospedagem e transfers são somados a qualquer uma das três, e os passeios são opcionais.",
      "paq.nota": "Pacotes modelo de 7 noites. As saídas, as vagas e as tarifas são confirmadas pelo WhatsApp conforme a data da viagem.",
      "sc.eyebrow": "Por que Santa Catarina",
      "sc.h2": "Um destino completo para qualquer viagem",
      "sc.p": "Do surfe da costa sul às águas calmas do norte da ilha.",
      "sc.l1": "Praias para todos os gostos",
      "sc.l2": "Ondas e surfe na costa sul",
      "sc.l3": "Águas calmas para ir em família",
      "sc.l4": "Baleias-francas do inverno à primavera",
      "sc.l5": "Gastronomia de frutos do mar",
      "sc.l6": "Aeroporto de Florianópolis por perto",
      "sc.l7": "Dá para chegar por terra desde a Argentina",
      "sc.l8": "Natureza e trilhas",
      "tras.eyebrow": "Operação própria",
      "tras.h2": "Transfers e passeios de van",
      "tras.p": "Buscamos os seus passageiros em aeroportos e rodoviárias e levamos até Florianópolis, Imbituba, Garopaba e Paulo Lopes. Também montamos passeios pela região.",
      "tras.btn": "Cotar um transfer",
      "ft.eyebrow": "Por que a Fredd Tur",
      "ft.h2": "Um único contato para toda a viagem",
      "ft.p": "A sua passagem, a sua hospedagem e o seu transfer com a mesma empresa.",
      "val1.h3": "Operação no destino",
      "val1.p": "As nossas vans esperam você no aeroporto ou na rodoviária. Trabalhamos na região desde 2007.",
      "val2.h3": "Pousadas e hotéis parceiros",
      "val2.p": "Montamos o seu pacote com hospedagens da região com as quais já trabalhamos.",
      "val3.h3": "Aéreo e rodoviário",
      "val3.p": "Avião, ônibus ou os dois: propomos a combinação que melhor funciona para você.",
      "val4.p": "Escreva para nós e enviamos opções e tarifas para as suas datas.",
      "real.eyebrow": "Uma empresa real",
      "real.h2": "Com sede em Praia do Rosa",
      "real.p": "Se você vai viajar, queremos que saiba com quem está tratando.",
      "real.l1": "Empresa registrada",
      "real.l2": "Sede no destino",
      "real.l3": "Contato direto",
      "real.l3t": "Por WhatsApp ou e-mail, com pessoas da região.",
      "sobre.eyebrow": "Vivemos o que vendemos",
      "sobre.h2": "O seu amigo de Praia do Rosa",
      "sobre.p": "A Praia do Rosa é a nossa casa. Montamos a sua viagem com o conhecimento de quem vive e trabalha na costa sul de Santa Catarina, e acompanhamos você desde a chegada até a partida.",
      "faq.eyebrow": "Perguntas frequentes",
      "faq.h2": "Dúvidas? Nós respondemos",
      "faq1.q": "O que os pacotes incluem?",
      "faq1.a": "Cada pacote combina a passagem (aérea, de ônibus ou as duas), o transfer de van e a hospedagem. Os passeios podem ser adicionados. O detalhe exato é confirmado na cotação.",
      "faq2.q": "Como chegar a Santa Catarina?",
      "faq2.a": "De avião até o aeroporto de Florianópolis, de ônibus desde a Argentina ou combinando os dois. Montamos a opção de acordo com a sua cidade de saída e as suas datas.",
      "faq3.q": "Posso montar o meu próprio pacote?",
      "faq3.a": "Sim. Conte o que você precisa (passagem, transfer, hospedagem ou passeios) e cotamos o que falta.",
      "faq4.q": "Como é o pagamento?",
      "faq4.a": "As formas de pagamento são combinadas pelo WhatsApp no momento da cotação.",
      "faq5.q": "E se eu precisar mudar ou cancelar?",
      "faq5.a": "As condições dependem de cada serviço (passagem, hospedagem, transfer) e são informadas na cotação.",
      "faq6.q": "Vocês trabalham com agências de viagens?",
      "faq6.a": "Sim. Escreva para nós pelo WhatsApp e combinamos.",
      "cta.eyebrow": "Pronto para Santa Catarina?",
      "cta.h2": "A sua viagem começa com um olá",
      "cta.p": "Conte quando você viaja e com quem. Nós montamos o resto.",
      "cta.btn": "Escrever pelo WhatsApp",
      "pie.contacto": "Contato",
      "pie.redes": "Siga-nos",
      "hero.h1": "Praias de <span class=\"hero__resalte\">Santa Catarina</span>",
      "aria.inicio": "Fredd Tur, início",
      "aria.arriba": "Fredd Tur, voltar ao topo",
      "aria.principal": "Principal",
      "aria.filtrar": "Filtrar por região",
      "aria.costa": "Costa de Santa Catarina",
    },
  };

  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const metaDesc = document.querySelector('meta[name="description"]');

  let lang = DEFAULT;

  // ---- Copia del español original (antes de que app.js toque el DOM) ----
  const source = new Map();
  $$('[data-i18n], [data-i18n-attr]').forEach((el) => {
    const entry = { html: null, attrs: [] };
    if (el.dataset.i18n) entry.html = el.innerHTML;
    (el.dataset.i18nAttr || '').split(';').filter(Boolean).forEach((pair) => {
      const i = pair.indexOf(':');
      const attr = pair.slice(0, i).trim();
      entry.attrs.push({ attr, key: pair.slice(i + 1).trim(), value: el.getAttribute(attr) });
    });
    source.set(el, entry);
  });
  source.set('title', document.title);
  source.set('description', metaDesc ? metaDesc.content : '');

  // t('clave', { n: 7 }): texto del JS en el idioma actual (si falta, cae al español). {n} se reemplaza.
  const t = (key, vars) => {
    const text = (DICT[lang] && DICT[lang][key]) ?? DICT[DEFAULT][key] ?? key;
    return vars ? text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m)) : text;
  };

  const apply = () => {
    const isDefault = lang === DEFAULT;
    const pick = (key, original) => (isDefault ? original : DICT[lang][key] ?? original);

    source.forEach((entry, el) => {
      if (typeof el === 'string') return;
      if (entry.html !== null) el.innerHTML = pick(el.dataset.i18n, entry.html);
      entry.attrs.forEach(({ attr, key, value }) => el.setAttribute(attr, pick(key, value)));
    });
    document.title = pick('meta.title', source.get('title'));
    if (metaDesc) metaDesc.content = pick('meta.description', source.get('description'));
    document.documentElement.lang = HTML_LANG[lang] || lang;

    // El botón del menú cambia de etiqueta según esté abierto o cerrado (lo maneja app.js)
    const menu = document.getElementById('menu');
    const burger = document.getElementById('burger');
    if (burger) burger.setAttribute('aria-label', t(menu && menu.classList.contains('abierto') ? 'menu.close' : 'menu.open'));

    $$('[data-lang]').forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
  };

  const setLang = (next, { persist = true } = {}) => {
    if (!LANGS.includes(next) || next === lang) return;
    lang = next;
    apply();
    if (persist) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* modo privado */ } }
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }));
  };

  // Idioma inicial: ?lang=pt → elección guardada → idioma del navegador → español
  const initial = () => {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LANGS.includes(saved)) return saved;
    } catch (_) { /* sin almacenamiento */ }
    const preferred = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]) || [];
    const match = preferred.map((l) => String(l).toLowerCase().slice(0, 2)).find((l) => LANGS.includes(l));
    return match || DEFAULT;
  };

  $$('[data-lang]').forEach((btn) => btn.addEventListener('click', () => setLang(btn.dataset.lang)));

  window.I18N = { t, setLang, get lang() { return lang; } };

  setLang(initial(), { persist: false });
})();
