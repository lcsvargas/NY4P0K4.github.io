/*
  PORTFOLIO LUCAS — app.js
  A interface é montada a partir de data/activities.json.
  Para adicionar ou editar atividades, altere somente o JSON.
*/

const BASE = (document.body.dataset.root || ".").replace(/\/$/, "");
const PAGE = document.body.dataset.page || "home";
const local = (path = "") => `${BASE}/${path}`;
const app = document.getElementById("app");

const icons = {
  arrow:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
  external:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 15.4A8.5 8.5 0 0 1 8.6 3.7 8.5 8.5 0 1 0 20.3 15.4Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
};

const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char])
  );

function setupTheme() {
  let saved = "light";
  try {
    saved = localStorage.getItem("portfolio-theme") || "light";
  } catch (_) {}
  document.documentElement.dataset.theme = saved;

  document.querySelector(".theme-toggle")?.addEventListener("click", () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch (_) {}
    updateThemeButton();
  });
  updateThemeButton();
}

function updateThemeButton() {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;
  const dark = document.documentElement.dataset.theme === "dark";
  button.innerHTML = dark ? icons.sun : icons.moon;
  button.setAttribute(
    "aria-label",
    dark ? "Ativar tema claro" : "Ativar tema escuro"
  );
  button.title = dark ? "Tema claro" : "Tema escuro";
}

function renderHeader(subjects) {
  const navItems = subjects
    .map((subject) => {
      const route = subject.id[0].toUpperCase() + subject.id.slice(1);
      const active = PAGE === subject.id ? " is-active" : "";
      return `<a class="nav-link${active}" href="${local(
        `${route}/`
      )}">${escapeHTML(subject.name)}</a>`;
    })
    .join("");
  const homeActive = PAGE === "home" ? " is-active" : "";

  document.getElementById("site-header").innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${local()}" aria-label="Portfólio de Lucas Vargas — início">
          <span class="brand-mark">LV<span>.</span></span>
          <span class="brand-copy"><strong>LUCAS VARGAS</strong><small>PORTFÓLIO ACADÊMICO · 2026</small></span>
        </a>
        <button class="mobile-menu" type="button" aria-label="Abrir menu" aria-expanded="false">${
          icons.menu
        }</button>
        <nav class="main-nav" aria-label="Navegação principal">
          <a class="nav-link${homeActive}" href="${local()}">Início</a>
          ${navItems}
        </nav>
        <button class="theme-toggle" type="button" aria-label="Alternar tema"></button>
      </div>
    </header>`;

  const menuButton = document.querySelector(".mobile-menu");
  const nav = document.querySelector(".main-nav");
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu"
    );
    menuButton.innerHTML = isOpen ? icons.close : icons.menu;
  });
  nav
    .querySelectorAll("a")
    .forEach((link) =>
      link.addEventListener("click", () => nav.classList.remove("is-open"))
    );
  setupTheme();
}

function renderFooter(profile) {
  document.getElementById("site-footer").innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <a class="footer-brand" href="${local()}">LV<span>.</span></a>
        <p>Um registro do que foi aprendido, criado e colocado em prática.</p>
        <a class="footer-contact" href="${escapeHTML(
          profile.instagram
        )}" target="_blank" rel="noopener noreferrer">Instagram ${
    icons.external
  }</a>
      </div>
      <div class="footer-bottom"><span>© ${escapeHTML(
        profile.year
      )} Lucas Vargas</span><span>Feito com cuidado e curiosidade.</span></div>
    </footer>`;
}

function getAllActivities(subjects) {
  return subjects.flatMap((subject) =>
    subject.periods.flatMap((period) => period.activities)
  );
}

function renderHome(data) {
  const { profile, subjects } = data;
  const allActivities = getAllActivities(subjects);
  const available = allActivities.filter(
    (item) => item.status === "available"
  ).length;
  const subjectCards = subjects
    .map((subject, index) => {
      const route = subject.id[0].toUpperCase() + subject.id.slice(1);
      const count = subject.periods.reduce(
        (sum, period) => sum + period.activities.length,
        0
      );
      const mark = ["∑", "Aa", "◎", "✳", "⌘"][index] || "＋";
      return `
      <a class="subject-card" href="${local(`${route}/`)}">
        <div class="subject-card-top"><span class="subject-index">0${
          index + 1
        } / 05</span><span class="subject-mark">${mark}</span></div>
        <div class="subject-card-bottom">
          <div><h3>${escapeHTML(subject.name)}</h3><p>${escapeHTML(
        subject.teachers
      )}</p></div>
          <span class="subject-arrow">${icons.arrow}</span>
        </div>
        <span class="subject-count">${count} ${
        count === 1 ? "atividade" : "atividades"
      }</span>
      </a>`;
    })
    .join("");

  app.innerHTML = `
    <section class="home-hero content-width">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-dot"></span> PORTFÓLIO ACADÊMICO <span class="eyebrow-year">/ ${escapeHTML(
          profile.year
        )}</span></p>
        <h1>Ideias que viram <em>projetos.</em></h1>
        <p class="hero-lead">Um espaço para reunir trabalhos, experiências e aprendizados construídos ao longo do terceiro ano.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#disciplinas">Explorar portfólio ${
            icons.arrow
          }</a>
          <a class="text-link" href="#sobre">Conhecer o autor <span>↓</span></a>
        </div>
        <div class="hero-note"><span class="note-line"></span><span>ENSINO MÉDIO · 3º ANO</span></div>
      </div>
      <div class="hero-art">
        <div class="portrait-frame">
          <img src="${local(
            profile.photo
          )}" alt="Foto de Lucas Vargas" fetchpriority="high">
          <div class="portrait-shade"></div>
          <div class="portrait-label"><span>PORTFÓLIO PESSOAL</span><strong>Lucas<br>Vargas<span>.</span></strong></div>
          <span class="portrait-index">LV — 026</span>
        </div>
        <div class="floating-stamp"><span>CRIAR</span><span>·</span><span>EXPLORAR</span><span>·</span><span>APRENDER</span></div>
      </div>
    </section>

    <section class="stats-band content-width" aria-label="Resumo do portfólio">
      <div class="stat"><strong>${String(subjects.length).padStart(
        2,
        "0"
      )}</strong><span>DISCIPLINAS</span></div>
      <div class="stat"><strong>${String(allActivities.length).padStart(
        2,
        "0"
      )}</strong><span>REGISTROS</span></div>
      <div class="stat"><strong>${String(available).padStart(
        2,
        "0"
      )}</strong><span>MATERIAIS COM LINK</span></div>
      <div class="stat stat-year"><strong>${escapeHTML(
        profile.year
      )}</strong><span>ANO LETIVO</span></div>
    </section>

    <section class="about-section content-width" id="sobre">
      <div class="section-kicker"><span>01</span><span>UM POUCO SOBRE MIM</span></div>
      <div class="about-layout">
        <h2>Aprender fazendo.<br><em>Criar por curiosidade.</em></h2>
        <div class="about-copy">
          ${profile.about
            .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
            .join("")}
          <a class="text-link about-social" href="${escapeHTML(
            profile.instagram
          )}" target="_blank" rel="noopener noreferrer">Acompanhe no Instagram ${
    icons.external
  }</a>
        </div>
      </div>
    </section>

    <section class="subjects-section content-width" id="disciplinas">
      <div class="section-heading">
        <div><div class="section-kicker"><span>02</span><span>ÍNDICE DO PORTFÓLIO</span></div><h2>Explore por <em>disciplina.</em></h2></div>
        <p>Selecione uma área para visualizar os trabalhos e materiais organizados por trimestre.</p>
      </div>
      <div class="subjects-grid">${subjectCards}</div>
    </section>

    <section class="links-section content-width">
      <div class="links-panel">
        <div><p class="eyebrow eyebrow-light">MAIS SOBRE MIM</p><h2>Outros caminhos<br><em>e projetos.</em></h2></div>
        <div class="resource-links">
          ${profile.links
            .map(
              (link) =>
                `<a href="${escapeHTML(
                  link.url
                )}" target="_blank" rel="noopener noreferrer"><span>${escapeHTML(
                  link.label
                )}</span>${icons.external}</a>`
            )
            .join("")}
          <a href="${escapeHTML(
            profile.instagram
          )}" target="_blank" rel="noopener noreferrer"><span>Instagram</span>${
    icons.external
  }</a>
        </div>
      </div>
    </section>`;
}

function statusInfo(status) {
  if (status === "not-submitted")
    return {
      label: "Não entregue",
      className: "status-pending",
      action: "Sem material",
    };
  if (status === "link-pending")
    return {
      label: "Link não vinculado",
      className: "status-unlinked",
      action: "Link indisponível",
    };
  return {
    label: "Material disponível",
    className: "status-available",
    action: "Abrir atividade",
  };
}

function renderActivity(activity, index, periodNumber) {
  const state = statusInfo(activity.status);
  const chips = [
    ...activity.competencies.map(
      (value) =>
        `<button type="button" class="meta-chip" data-code="${escapeHTML(
          value
        )}">${escapeHTML(value)}</button>`
    ),
    ...activity.skills.map(
      (value) =>
        `<button type="button" class="meta-chip meta-chip-muted" data-code="${escapeHTML(
          value
        )}">${escapeHTML(value)}</button>`
    ),
  ].join("");
  const image = activity.image
    ? `<img src="${local(
        activity.image
      )}" alt="Imagem da atividade ${escapeHTML(
        activity.title
      )}" loading="lazy">`
    : `<div class="cover-placeholder"><span>LV<span>.</span></span><small>REGISTRO ${String(
        index + 1
      ).padStart(2, "0")}</small></div>`;
  const action = activity.url
    ? `<a class="card-action" href="${escapeHTML(
        activity.url
      )}" target="_blank" rel="noopener noreferrer">${state.action} ${
        icons.external
      }</a>`
    : `<span class="card-action is-disabled">${state.action}</span>`;
  const searchText = [
    activity.title,
    activity.description || "",
    ...activity.competencies,
    ...activity.skills,
  ]
    .join(" ")
    .toLowerCase();

  return `
    <article class="activity-card" data-search="${escapeHTML(searchText)}">
      <div class="activity-cover ${activity.image ? "has-image" : "no-image"}">
        ${image}
        <span class="cover-period">0${periodNumber}º TRIMESTRE</span>
        <span class="cover-number" title="Avaliação ${
          index + 1
        } do trimestre">AV${index + 1}</span>
      </div>
      <div class="activity-content">
        <div class="activity-status ${state.className}"><span></span>${
    state.label
  }</div>
        <h3>${escapeHTML(activity.title)}</h3>
        ${
          activity.description
            ? `<p class="activity-desc">${escapeHTML(activity.description)}</p>`
            : ""
        }
        <div class="activity-meta">
          <span class="meta-label">COMPETÊNCIAS E HABILIDADES</span>
          <div class="meta-chips">${
            chips || '<span class="meta-empty">Não informado</span>'
          }</div>
        </div>
        ${action}
      </div>
    </article>`;
}

function renderSubject(subject, subjects) {
  const subjectIndex = subjects.findIndex((item) => item.id === subject.id) + 1;
  const total = subject.periods.reduce(
    (sum, period) => sum + period.activities.length,
    0
  );
  const periodOptions = subject.periods
    .map(
      (period) =>
        `<option value="${period.number}">${period.number}º trimestre</option>`
    )
    .join("");
  const periods = subject.periods
    .map(
      (period) => `
    <section class="period-section" data-period="${period.number}">
      <div class="period-heading"><div><span class="period-overline">ETAPA 0${
        period.number
      }</span><h2>${
        period.number
      }º trimestre</h2></div><span class="period-total">${String(
        period.activities.length
      ).padStart(2, "0")} ${
        period.activities.length === 1 ? "ATIVIDADE" : "ATIVIDADES"
      }</span></div>
      <div class="activities-grid">${period.activities
        .map((activity, index) =>
          renderActivity(activity, index, period.number)
        )
        .join("")}</div>
    </section>`
    )
    .join("");

  app.innerHTML = `
    <section class="subject-hero content-width">
      <a class="back-link" href="${local()}">← Voltar ao início</a>
      <div class="subject-hero-main">
        <div><p class="eyebrow"><span class="eyebrow-dot"></span> DISCIPLINA / 0${subjectIndex}</p><h1>${escapeHTML(
    subject.name
  )}<span>.</span></h1></div>
        <div class="subject-hero-info"><p>${escapeHTML(
          subject.description ||
            "Atividades, projetos e registros desenvolvidos ao longo do ano letivo."
        )}</p><span>PROFESSORES</span><strong>${escapeHTML(
    subject.teachers
  )}</strong></div>
      </div>
      <div class="subject-summary"><span><strong>${String(total).padStart(
        2,
        "0"
      )}</strong> REGISTROS NO PORTFÓLIO</span><span>${String(
    subject.periods.length
  ).padStart(2, "0")} TRIMESTRES</span></div>
    </section>

    <section class="activity-section content-width">
      <div class="activity-section-heading"><div><div class="section-kicker"><span>01</span><span>ACERVO DE ATIVIDADES</span></div><h2>Trabalhos e <em>registros.</em></h2></div><p>Abra os materiais, filtre os registros e passe o mouse sobre as competências (C) e habilidades (H) para ver o que significam.</p></div>
      <div class="activity-toolbar">
        <label class="search-field"><span class="search-icon">⌕</span><input id="activity-search" type="search" placeholder="Buscar por atividade, competência ou habilidade…" autocomplete="off"><span class="search-shortcut">⌘ K</span></label>
        <label class="filter-field"><span>TRIMESTRE</span><select id="period-filter"><option value="all">Todos</option>${periodOptions}</select></label>
      </div>
      <div class="activity-results" id="activity-results">${periods}</div>
      <p class="empty-state" id="empty-state" hidden>Nenhuma atividade encontrada com esses filtros.</p>
    </section>`;

  const search = document.getElementById("activity-search");
  const filter = document.getElementById("period-filter");
  const empty = document.getElementById("empty-state");
  const update = () => {
    const term = search.value.trim().toLowerCase();
    const selected = filter.value;
    let visible = 0;
    document.querySelectorAll(".period-section").forEach((section) => {
      const matchesPeriod =
        selected === "all" || section.dataset.period === selected;
      let sectionVisible = 0;
      section.querySelectorAll(".activity-card").forEach((card) => {
        const matchesText = card.dataset.search.includes(term);
        const show = matchesPeriod && matchesText;
        card.hidden = !show;
        if (show) sectionVisible++;
      });
      section.hidden = sectionVisible === 0;
      visible += sectionVisible;
    });
    empty.hidden = visible !== 0;
  };
  search.addEventListener("input", update);
  filter.addEventListener("change", update);
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      search.focus();
    }
  });
}

let GLOSS = {};
const AREA = {
  matematica: "Matemática",
  linguagens: "Linguagens",
  humanas: "Ciências Humanas",
  natureza: "Ciências da Natureza",
  tecnico: "Formação Técnica",
};

function setupTooltips() {
  const tip = document.createElement("div");
  tip.className = "tip";
  tip.id = "tip";
  tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);
  const canHover = matchMedia("(hover:hover)").matches;
  let current = null;
  const find = (target) => target.closest?.(".meta-chip[data-code]");
  const hide = () => {
    tip.classList.remove("is-on");
    current?.removeAttribute("aria-describedby");
    current = null;
  };
  const show = (el) => {
    const code = el.dataset.code,
      kind = code[0] === "C" ? "C" : "H";
    const text = (GLOSS[PAGE] || {})[code];
    tip.dataset.k = kind;
    tip.innerHTML = `<div class="tip-head"><span class="tip-code">${escapeHTML(
      code
    )}</span><span class="tip-kind">${
      kind === "C" ? "Competência" : "Habilidade"
    } · ${escapeHTML(AREA[PAGE] || "")}</span></div>
      <p class="tip-body${text ? "" : " tip-pending"}">${escapeHTML(
      text || "Descrição ainda não cadastrada para este código."
    )}</p>
      <p class="tip-foot">${escapeHTML(
        text ? GLOSS._source || "" : "Adicione em data/glossary.json"
      )}</p>`;
    const r = el.getBoundingClientRect(),
      w = tip.offsetWidth,
      h = tip.offsetHeight;
    tip.style.left =
      Math.min(
        Math.max(12, r.left + r.width / 2 - w / 2),
        innerWidth - w - 12
      ) + "px";
    tip.style.top =
      (r.top - h - 12 < 12 ? r.bottom + 12 : r.top - h - 12) + "px";
    tip.classList.add("is-on");
    el.setAttribute("aria-describedby", "tip");
    current = el;
  };
  if (canHover)
    document.addEventListener("mouseover", (e) => {
      const c = find(e.target);
      c ? c !== current && show(c) : hide();
    });
  else
    document.addEventListener("click", (e) => {
      const c = find(e.target);
      c ? (c === current ? hide() : show(c)) : hide();
    });
  document.addEventListener("focusin", (e) => {
    const c = find(e.target);
    if (c) show(c);
  });
  document.addEventListener("focusout", hide);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });
  addEventListener("scroll", hide, { passive: true });
}

async function start() {
  try {
    const response = await fetch(local("data/activities.json"));
    if (!response.ok)
      throw new Error(
        `Não foi possível carregar os dados (${response.status}).`
      );
    const data = await response.json();
    try {
      const g = await fetch(local("data/glossary.json"));
      if (g.ok) GLOSS = await g.json();
    } catch (_) {}
    setupTooltips();
    renderHeader(data.subjects);
    renderFooter(data.profile);

    if (PAGE === "home") {
      document.title = "Portfólio — Lucas Vargas";
      renderHome(data);
    } else {
      const subject = data.subjects.find((item) => item.id === PAGE);
      if (subject) {
        document.title = `${subject.name} — Portfólio Lucas Vargas`;
        renderSubject(subject, data.subjects);
      } else
        app.innerHTML =
          '<div class="load-error"><h1>Conteúdo não encontrado.</h1><a href="' +
          local() +
          '">Voltar ao início</a></div>';
    }
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <div class="load-error">
        <p class="eyebrow">ERRO AO CARREGAR</p>
        <h1>Não foi possível abrir os dados do portfólio.</h1>
        <p>Abra o projeto usando o Live Server ou publique no GitHub Pages. O navegador bloqueia a leitura do JSON quando a página é aberta diretamente pelo arquivo.</p>
      </div>`;
  }
}

start();
