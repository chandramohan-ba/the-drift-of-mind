/* ============================================================
   app.js — builds the book from the HTML files in /articles.
   Each article is its own .html file — edit it directly.
   To add a new article: create a new .html file in /articles,
   then add one line to articles/index.json.
   ============================================================ */

const App = (() => {

  const SITE = {
    title: "The Drift of Mind",
    tagline1: "From Creation\u2019s natural world to man\u2019s fictional world.",
    tagline2: "From free expression to its continuity \u2014 from natural circle of life to serving cultural, political, and legal systems.",
  };

  const PREFACE_LEFT = `
    <div class="preface-meta reveal">Preface</div>
    <h2 class="reveal d1">Why these articles</h2>
    <p class="dropcap reveal d2">I write about truth as I have experienced and understood it. I have not come across this understanding expressed in a way that fully reflects what I mean. If I had, I would have shared that instead.</p>
    <div class="ornament reveal d3">\u2726 \u2726 \u2726</div>
    <h3 class="reveal d3">The drift</h3>
    <p class="reveal d4">Mind stepped in with concepts, identities, and continuity. Slowly, free expression turned into maintaining a story.</p>
  `;

  const PREFACE_RIGHT = `
    <h3 class="reveal">The movement</h3>
    <p class="reveal d1">The drift is not an event. It\u2019s a movement. It happens every time thought is taken as intelligence \u2014 every time continuity matters more than life. This space is simply a mirror for that movement.</p>
    <div class="ornament reveal d2">\u2726 \u2726 \u2726</div>
    <h3 class="reveal d2">Who am I / who are we / the code</h3>
    <p class="reveal d3">The seeker is not the soul. The seeker is mind \u2014 occupied by scriptures, gurus, ideas, beliefs, memory, and its own continuity.</p>
    <p class="reveal d4">The body has its own intelligence \u2014 the code. Breathing, healing, digesting, surviving: none of it needs thought.</p>
  `;

  const CAUTION = `
    <div class="seal-line reveal">\u2726 &nbsp; A NOTE OF CAUTION &nbsp; \u2726</div>
    <h2 class="reveal d1">A Note of Caution</h2>
    <p class="reveal d2">These articles are my opinion \u2014 my expression of what I have experienced and understood. They are not teachings, instructions, or a method to follow.</p>
    <p class="reveal d3">Read them as one person\u2019s honest looking. Take what speaks to you, question everything, and keep your own judgement alive.</p>
    <p class="reveal d4"><em>Nothing here is asked of you.</em></p>
  `;

  const CONNECT = `
    <h2 class="reveal">Connect</h2>
    <p class="reveal d1">If this resonates and you would like to explore these ideas more deeply with me, you are welcome to write.</p>
    <p class="reveal d2"><a href="mailto:your-email@example.com?subject=The%20Drift%20of%20Mind">Write to me</a></p>
    <div class="kj-link reveal d3">If you\u2019re interested in learning Kannada, you can check out <a href="https://kannadajourney.com" target="_blank" rel="noopener">Kannada Journey</a>.</div>
  `;

  const Pages = {
    cover: () => `
      <div class="page cover">
        <h1 class="reveal">${SITE.title}</h1>
        <div class="rule reveal d1"></div>
        <p class="tagline reveal d2">${SITE.tagline1}</p>
        <p class="tagline reveal d3">${SITE.tagline2}</p>
        <button id="open-btn" class="reveal d4">Open the book</button>
      </div>`,
    prefaceLeft: () => `<div class="page">${PREFACE_LEFT}</div>`,
    prefaceRight: () => `<div class="page">${PREFACE_RIGHT}</div>`,
    toc: (articles) => {
      const groups = [...new Set(articles.map(a => a.group || ""))];
      let html = "", counter = 0;
      groups.forEach(groupName => {
        const groupArticles = articles.filter(a => (a.group || "") === groupName);
        if (!groupArticles.length) return;
        html += `<div class="toc-group reveal d1">`;
        if (groupName) html += `<div class="toc-group-title">${groupName}</div>`;
        groupArticles.forEach(a => {
          counter++;
          html += `
          <div class="toc-item" data-slug="${a.slug}">
            <span><span class="num">${String(counter).padStart(2,"0")}.</span>${a.title}</span>
            <span class="status">${a.status === "published" ? "read" : "forthcoming"}</span>
          </div>`;
        });
        html += `</div>`;
      });
      return `<div class="page"><h2 class="reveal">Table of Contents</h2>${html}</div>`;
    },
    article: (a) => a.status === "published"
      ? `<div class="page"><h2>${a.title}</h2>${a.body}</div>`
      : `<div class="page coming-soon">
           <div class="seal reveal">\u2726</div>
           <h2 class="reveal d1">${a.title}</h2>
           <div class="mark reveal d2">Coming soon</div>
           <p class="reveal d3">This chapter is being written.</p>
         </div>`,
    caution: () => `<div class="page caution-page">${CAUTION}</div>`,
    connect: () => `<div class="page connect-page">${CONNECT}</div>`
  };

  let pageFlip = null;
  const TOC_INDEX = 3;

  function buildPages(articles) {
    return [
      Pages.cover(),
      Pages.prefaceLeft(),
      Pages.prefaceRight(),
      Pages.toc(articles),
      ...articles.map(Pages.article),
      Pages.caution(),
      Pages.connect()
    ];
  }

  function mount(articles) {
    const el = document.getElementById("book");
    el.innerHTML = "";
    buildPages(articles).forEach(html => {
      const div = document.createElement("div");
      div.innerHTML = html;
      el.appendChild(div.firstElementChild);
    });
  }

  function bindEvents(articles) {
    const cautionIndex = pageFlip.getPageCount() - 2;
    document.getElementById("open-btn").onclick = () => pageFlip.turnToPage(1);
    document.getElementById("toc-btn").onclick = () => pageFlip.turnToPage(TOC_INDEX);
    document.getElementById("caution-link").onclick = (e) => {
      e.preventDefault();
      pageFlip.turnToPage(cautionIndex);
    };
    document.querySelectorAll(".toc-item").forEach(item => {
      item.onclick = () => {
        const idx = articles.findIndex(a => a.slug === item.dataset.slug);
        pageFlip.turnToPage(TOC_INDEX + 1 + idx);
      };
    });
  }

  function init(articles) {
    const el = document.getElementById("book");
    const wrap = document.getElementById("book-wrap");
    const isMobile = window.innerWidth < 700;
    const pw = isMobile ? Math.min(wrap.clientWidth, 430) : Math.min(wrap.clientWidth, 960) / 2;
    const ph = Math.round(pw * 1.42);
    if (pageFlip) { try { pageFlip.destroy(); } catch (e) {} }
    mount(articles);
    pageFlip = new St.PageFlip(el, {
      width: pw, height: ph, size: "fixed",
      maxShadowOpacity: 0.45, showCover: true, mobileScrollSupport: false
    });
    pageFlip.loadFromHTML(el.querySelectorAll(".page"));
    window.bookFlip = pageFlip;
    bindEvents(articles);
  }

  async function loadArticles() {
    const res = await fetch("articles/index.json");
    const manifest = await res.json();
    const articles = [];
    for (const entry of manifest.articles) {
      const r = await fetch(`articles/${entry.file}`);
      const html = await r.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const meta = {};
      doc.querySelectorAll("meta[data-field]").forEach(m => {
        meta[m.dataset.field] = m.content;
      });
      articles.push({
        slug: entry.file.replace(/\.html$/, ""),
        title: meta.title || entry.file,
        group: meta.group || "",
        order: Number(meta.order) || 999,
        status: meta.status || "draft",
        body: doc.querySelector("article") ? doc.querySelector("article").innerHTML : ""
      });
    }
    return articles.sort((a, b) => a.order - b.order);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => loadArticles().then(init), 220);
  });

  return { start: () => loadArticles().then(init) };
})();

document.addEventListener("DOMContentLoaded", App.start);
