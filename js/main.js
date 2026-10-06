/**
 * J. THALES PINTURAS - LÓGICA DE INTERAÇÃO & INTEGRAÇÃO DE CONSTANTES
 * Execução leve, rápida e mobile-first.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Compatibilidade automática para visualização local (file:// vs servidor)
  if (window.location.protocol === "file:") {
    document.querySelectorAll("img[src^='/images/']").forEach((img) => {
      img.src = "." + img.getAttribute("src");
    });
  }

  // 2. Conexão das Constantes de Contato (SITE_CONFIG)
  if (typeof SITE_CONFIG !== "undefined") {
    aplicarConfiguracoes(SITE_CONFIG);
  }

  // 3. Menu Mobile Hambúrguer
  inicializarMenuMobile();

  // 3.1 Header que ganha destaque ao rolar a página
  inicializarHeaderScroll();

  // 3.2 Seção de mensagem com vídeo de fundo em loop
  inicializarMensagem(typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG.mensagem : null);

  // 4. Interatividade da Grade de Obras (Toque no Celular & Hover)
  inicializarGradeObras();

  // 5. Animação Suave de Scroll (Fade Curto e Leve)
  inicializarAnimacoesScroll();
});

/**
 * Aplica as constantes do arquivo config.js nos elementos do DOM
 */
function aplicarConfiguracoes(cfg) {
  const whatsappUrl = `https://wa.me/${cfg.whatsapp.numeroLink}?text=${encodeURIComponent(cfg.whatsapp.mensagemPadrao)}`;

  // Botão WhatsApp Header (1º do site)
  const btnHeader = document.getElementById("header-whatsapp-btn");
  if (btnHeader) {
    btnHeader.href = whatsappUrl;
  }

  // Botão WhatsApp Contato (2º e último do site)
  const btnContato = document.getElementById("contact-whatsapp-btn");
  if (btnContato) {
    btnContato.href = whatsappUrl;
    const btnTexto = btnContato.querySelector(".btn-text");
    if (btnTexto) {
      btnTexto.textContent = `${cfg.whatsapp.textoBotaoContato} — ${cfg.whatsapp.numeroExibicao}`;
    }
  }

  // Link WhatsApp Mobile Drawer
  const btnMobile = document.getElementById("mobile-whatsapp-btn");
  if (btnMobile) {
    btnMobile.href = whatsappUrl;
  }

  // Link direto de telefone/WhatsApp
  const linkTelefone = document.getElementById("direct-phone-link");
  if (linkTelefone) {
    linkTelefone.href = whatsappUrl;
    linkTelefone.textContent = cfg.whatsapp.numeroExibicao;
  }

  // Redes Sociais - Instagram
  const linkInstagram = document.getElementById("instagram-link");
  const footerInstagram = document.getElementById("footer-instagram");
  if (linkInstagram && cfg.redesSociais.instagram) {
    linkInstagram.href = cfg.redesSociais.instagram.url;
    linkInstagram.textContent = cfg.redesSociais.instagram.usuario;
  }
  if (footerInstagram && cfg.redesSociais.instagram) {
    footerInstagram.href = cfg.redesSociais.instagram.url;
  }

  // Redes Sociais - YouTube
  const canalYoutubeItem = document.getElementById("youtube-channel-item");
  const linkYoutube = document.getElementById("youtube-link");
  const footerYoutube = document.getElementById("footer-youtube");
  if (cfg.redesSociais.youtube && cfg.redesSociais.youtube.exibir) {
    if (linkYoutube) {
      linkYoutube.href = cfg.redesSociais.youtube.url;
      linkYoutube.textContent = cfg.redesSociais.youtube.usuario;
    }
    if (footerYoutube) {
      footerYoutube.href = cfg.redesSociais.youtube.url;
    }
  } else {
    if (canalYoutubeItem) canalYoutubeItem.style.display = "none";
    if (footerYoutube) footerYoutube.style.display = "none";
  }
}

/**
 * Header transparente no topo; ganha fundo destacado ao rolar a página
 */
function inicializarHeaderScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const LIMITE = 40;
  let aguardando = false;

  const atualizar = () => {
    header.classList.toggle("is-scrolled", window.scrollY > LIMITE);
    aguardando = false;
  };

  window.addEventListener("scroll", () => {
    if (!aguardando) {
      aguardando = true;
      requestAnimationFrame(atualizar);
    }
  }, { passive: true });

  atualizar();
}

/**
 * Seção de mensagem: vídeo de fundo em sequência e ciclo infinito.
 * - Usa um único <video> trocando o src quando cada vídeo termina.
 * - Pausa fora da tela (IntersectionObserver) e retoma ao voltar.
 * - prefers-reduced-motion: mostra apenas o poster, sem tocar.
 * - Falha no vídeo: a seção continua legível com fundo verde sólido.
 */
function inicializarMensagem(cfg) {
  const secao = document.getElementById("mensagem");
  const video = document.getElementById("message-video");
  if (!secao || !video || !cfg) return;

  // Textos editáveis em config.js
  const titulo = secao.querySelector(".message-title");
  const texto = secao.querySelector(".message-text");
  if (titulo && cfg.titulo) titulo.textContent = cfg.titulo;
  if (texto && cfg.texto) texto.textContent = cfg.texto;

  const lista = Array.isArray(cfg.videos) ? cfg.videos : [];
  if (!lista.length) {
    secao.classList.add("is-video-failed");
    return;
  }

  // Compatível com abertura direta via file://
  const caminho = (p) => (window.location.protocol === "file:" ? "." + p : p);
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let indice = 0;
  let visivel = false;

  // Garante o muted (necessário para autoplay no celular)
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  const carregar = (i) => {
    indice = i;
    video.poster = caminho(lista[i].poster);
    video.src = caminho(lista[i].src);
  };

  const tocar = () => {
    if (reduzMovimento || !visivel || secao.classList.contains("is-video-failed")) return;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const falhou = () => secao.classList.add("is-video-failed");

  // Apenas poster quando o usuário prefere menos movimento
  if (reduzMovimento) {
    video.poster = caminho(lista[0].poster);
    video.removeAttribute("autoplay");
    video.preload = "none";
    return;
  }

  video.addEventListener("ended", () => {
    carregar((indice + 1) % lista.length);
    tocar();
  });
  video.addEventListener("error", falhou);

  carregar(0);

  if (!("IntersectionObserver" in window)) {
    visivel = true;
    tocar();
    return;
  }

  new IntersectionObserver((entradas) => {
    visivel = entradas[0].isIntersecting;
    if (visivel) {
      tocar();
    } else {
      video.pause();
    }
  }, { threshold: 0.15 }).observe(secao);
}

/**
 * Controle de Abertura/Fechamento do Menu Mobile
 */
function inicializarMenuMobile() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-drawer");
  const links = document.querySelectorAll(".nav-mobile-link");

  if (!toggleBtn || !drawer) return;

  const alternarMenu = (abrir) => {
    const estadoAtual = toggleBtn.getAttribute("aria-expanded") === "true";
    const novoEstado = typeof abrir === "boolean" ? abrir : !estadoAtual;

    toggleBtn.setAttribute("aria-expanded", String(novoEstado));
    document.getElementById("site-header")?.classList.toggle("menu-open", novoEstado);
    if (novoEstado) {
      drawer.classList.add("is-open");
      document.body.style.overflow = "hidden";
    } else {
      drawer.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  };

  toggleBtn.addEventListener("click", () => alternarMenu());

  // Fecha o menu ao clicar em qualquer âncora
  links.forEach((link) => {
    link.addEventListener("click", () => alternarMenu(false));
  });

  // Fecha se redimensionar para tela grande
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && drawer.classList.contains("is-open")) {
      alternarMenu(false);
    }
  });
}

/**
 * Controle de Cor das Fotos de Obras no Celular e Desktop
 * "As fotos aparecem em preto e branco leve e ganham cor ao passar o mouse ou tocar;
 * no celular a cor deve aparecer logo após o toque."
 */
function inicializarGradeObras() {
  const cards = document.querySelectorAll(".work-card");

  cards.forEach((card) => {
    // No toque em dispositivo móvel, revela a cor imediatamente
    card.addEventListener("touchstart", function () {
      cards.forEach((c) => {
        if (c !== card) c.classList.remove("active-color");
      });
      card.classList.add("active-color");
    }, { passive: true });

    // Clique também garante a ativação
    card.addEventListener("click", function () {
      cards.forEach((c) => {
        if (c !== card) c.classList.remove("active-color");
      });
      card.classList.toggle("active-color");
    });
  });

  // Remove a classe se tocar fora da grade em dispositivos móveis
  document.addEventListener("touchstart", (e) => {
    if (!e.target.closest(".work-card")) {
      cards.forEach((c) => c.classList.remove("active-color"));
    }
  }, { passive: true });
}

/**
 * Animação sutil de scroll com IntersectionObserver
 */
function inicializarAnimacoesScroll() {
  const elementos = document.querySelectorAll(".fade-in-scroll");
  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.1
    }
  );

  elementos.forEach((el) => observer.observe(el));
}
