/* ==========================================================================
   COBALTO - ASSISTENTE VIRTUAL IA (WIDGET FRONT-END)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof COBALTO_CONFIG === 'undefined') return;

  let messagesHistory = [];
  let isWaiting = false;
  let lastSendTime = 0;
  let panelOpen = false;

  const wAppUrl = `https://wa.me/${COBALTO_CONFIG.whatsappNumeroLink}`;

  const avatarSrc = (COBALTO_CONFIG && COBALTO_CONFIG.avatarUrl) ? COBALTO_CONFIG.avatarUrl : "images/cobalto-logo.png";
  const svgClose = `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>`;
  const svgSend = `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"/></svg>`;

  const launcher = document.createElement("button");
  launcher.className = "cobalto-launcher cobalto-widget";
  launcher.setAttribute("aria-label", "Abrir assistente virtual Cobalto");
  launcher.innerHTML = `
    <span class="cobalto-launcher-avatar-frame">
      <img src="${avatarSrc}" alt="Cobalto" class="cobalto-launcher-avatar" />
    </span>
    <span class="cobalto-launcher-text">${COBALTO_CONFIG.nome}</span>
  `;
  document.body.appendChild(launcher);

  const panel = document.createElement("div");
  panel.className = "cobalto-panel cobalto-widget";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat com Cobalto");

  const header = document.createElement("div");
  header.className = "cobalto-header";
  header.innerHTML = `
    <div class="cobalto-header-brand">
      <div class="cobalto-header-avatar-frame">
        <img src="${avatarSrc}" alt="Cobalto" class="cobalto-header-avatar" />
        <span class="cobalto-online-status" title="Cobalto Online"></span>
      </div>
      <div class="cobalto-header-info">
        <h3 class="cobalto-header-title">${COBALTO_CONFIG.nome}</h3>
        <p class="cobalto-header-subtitle">Assistente virtual (IA) da J. Thales Pinturas</p>
      </div>
    </div>
    <button class="cobalto-close" aria-label="Fechar chat">${svgClose}</button>
  `;
  panel.appendChild(header);

  const body = document.createElement("div");
  body.className = "cobalto-body";
  panel.appendChild(body);

  const footer = document.createElement("div");
  footer.className = "cobalto-footer";
  footer.innerHTML = `
    <div class="cobalto-input-row">
      <input type="text" class="cobalto-input" placeholder="Digite sua mensagem..." maxlength="600" aria-label="Sua mensagem">
      <button class="cobalto-send" aria-label="Enviar" disabled>${svgSend}</button>
    </div>
    <div class="cobalto-footer-link">Prefere falar com uma pessoa? <a href="${wAppUrl}" target="_blank" rel="noopener noreferrer">WhatsApp</a></div>
  `;
  panel.appendChild(footer);
  document.body.appendChild(panel);

  const input = footer.querySelector(".cobalto-input");
  const btnSend = footer.querySelector(".cobalto-send");
  const btnClose = header.querySelector(".cobalto-close");

  function togglePanel(forceState) {
    panelOpen = forceState !== undefined ? forceState : !panelOpen;
    if (panelOpen) {
      panel.classList.add("cobalto-is-open");
      input.focus();
    } else {
      panel.classList.remove("cobalto-is-open");
    }
  }

  launcher.addEventListener("click", () => togglePanel(true));
  btnClose.addEventListener("click", () => togglePanel(false));

  function safeRender(text, container) {
    const parts = text.split(/(\{\{WHATSAPP\}\}|\*\*.*?\*\*)/g);
    parts.forEach(part => {
      if (!part) return;
      if (part === "{{WHATSAPP}}") {
        const a = document.createElement("a");
        a.href = wAppUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "WhatsApp";
        container.appendChild(a);
      } else if (part.startsWith("**") && part.endsWith("**")) {
        const strong = document.createElement("strong");
        strong.textContent = part.slice(2, -2);
        container.appendChild(strong);
      } else {
        const lines = part.split("\n");
        lines.forEach((line, i) => {
          if (i > 0) container.appendChild(document.createElement("br"));
          container.appendChild(document.createTextNode(line));
        });
      }
    });
  }

  function appendMessage(role, content) {
    if (role === "bot") {
      const row = document.createElement("div");
      row.className = "cobalto-msg-row cobalto-msg-row-bot";

      const avatarWrap = document.createElement("div");
      avatarWrap.className = "cobalto-msg-avatar-frame";
      avatarWrap.innerHTML = `<img src="${avatarSrc}" alt="Cobalto" class="cobalto-msg-avatar" />`;

      const msgDiv = document.createElement("div");
      msgDiv.className = "cobalto-msg cobalto-msg-bot";
      safeRender(content, msgDiv);

      row.appendChild(avatarWrap);
      row.appendChild(msgDiv);
      body.insertBefore(row, body.querySelector('.cobalto-disclaimer') || null);
    } else {
      const msgDiv = document.createElement("div");
      msgDiv.className = `cobalto-msg cobalto-msg-${role}`;
      safeRender(content, msgDiv);
      body.insertBefore(msgDiv, body.querySelector('.cobalto-disclaimer') || null);
    }
    scrollToBottom();
  }

  function appendDisclaimer() {
    const d = document.createElement("div");
    d.className = "cobalto-disclaimer";
    d.textContent = "O Cobalto é uma IA e pode errar. Não envie dados pessoais.";
    body.appendChild(d);
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function showTyping() {
    const row = document.createElement("div");
    row.className = "cobalto-msg-row cobalto-msg-row-bot cobalto-typing-row";
    row.id = "cobalto-typing";

    const avatarWrap = document.createElement("div");
    avatarWrap.className = "cobalto-msg-avatar-frame";
    avatarWrap.innerHTML = `<img src="${avatarSrc}" alt="Cobalto" class="cobalto-msg-avatar" />`;

    const t = document.createElement("div");
    t.className = "cobalto-msg cobalto-msg-bot cobalto-typing";
    t.innerHTML = `<div class="cobalto-dot"></div><div class="cobalto-dot"></div><div class="cobalto-dot"></div>`;

    row.appendChild(avatarWrap);
    row.appendChild(t);
    body.insertBefore(row, body.querySelector('.cobalto-disclaimer') || null);
    scrollToBottom();
  }

  function hideTyping() {
    const t = document.getElementById("cobalto-typing");
    if (t) t.remove();
  }

  function addSuggestions() {
    const cont = document.createElement("div");
    cont.className = "cobalto-suggestions";
    COBALTO_CONFIG.perguntasSugeridas.forEach(p => {
      const btn = document.createElement("button");
      btn.className = "cobalto-chip";
      btn.textContent = p;
      btn.onclick = () => {
        if (!isWaiting) {
          cont.remove();
          sendMessage(p);
        }
      };
      cont.appendChild(btn);
    });
    body.insertBefore(cont, body.querySelector('.cobalto-disclaimer') || null);
    scrollToBottom();
  }

  async function sendMessage(text) {
    const t = text.trim();
    if (!t) return;
    const now = Date.now();
    if (isWaiting || (now - lastSendTime < 1500) || t.length > 600) return;
    
    lastSendTime = now;
    isWaiting = true;
    input.value = "";
    input.disabled = true;
    btnSend.disabled = true;

    appendMessage("user", t);
    
    const suggs = body.querySelectorAll('.cobalto-suggestions');
    suggs.forEach(s => s.remove());

    messagesHistory.push({ role: "user", content: t });
    if (messagesHistory.length > 10) {
      messagesHistory = messagesHistory.slice(messagesHistory.length - 10);
    }

    showTyping();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesHistory })
      });

      hideTyping();
      if (!res.ok) {
        let errDetail = "";
        try {
          const errData = await res.json();
          errDetail = errData.error || "";
        } catch (_) {}
        console.error("Cobalto API Error:", res.status, errDetail);
        throw new Error(errDetail || "API falhou");
      }
      
      const data = await res.json();
      if (data.reply) {
        messagesHistory.push({ role: "assistant", content: data.reply });
        appendMessage("bot", data.reply);
      } else {
        throw new Error("Sem reply");
      }
    } catch (e) {
      hideTyping();
      console.error("Cobalto Error:", e.message || e);
      messagesHistory.pop(); // Remove user msg from history so they can retry
      appendMessage("bot", "Não consegui responder agora. Tente de novo ou fale com o Thales pelo WhatsApp.");
    } finally {
      isWaiting = false;
      input.disabled = false;
      btnSend.disabled = input.value.trim().length === 0;
      if (panelOpen) input.focus();
      scrollToBottom();
    }
  }

  // Init
  appendMessage("bot", COBALTO_CONFIG.boasVindas);
  addSuggestions();
  appendDisclaimer();

  input.addEventListener("input", () => {
    btnSend.disabled = input.value.trim().length === 0 || isWaiting;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !isWaiting && input.value.trim().length > 0) {
      sendMessage(input.value);
    }
    if (e.key === "Escape") {
      togglePanel(false);
    }
  });

  btnSend.addEventListener("click", () => {
    if (!isWaiting && input.value.trim().length > 0) sendMessage(input.value);
  });
});
