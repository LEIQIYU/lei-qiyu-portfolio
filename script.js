/* =========================================================
   LEI QIYU · Portfolio v3 — script.js
   - Global mouse particle trail (covers ALL pages)
   - Cover video autoplay fallback (MOV + MP4)
   - Folder click → smooth scroll
   - Photo group → lightbox (4 groups, prev/next, Esc, swipe)
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Cover video autoplay fallback ---------- */
  const cv = document.querySelector(".cover-video");
  if (cv) {
    cv.muted = true;
    cv.play().catch(() => {
      /* autoplay blocked; ignore */
    });
  }

  /* ---------- Mouse particle trail (GLOBAL — covers all pages) ---------- */
  (function setupGlobalParticles() {
    const canvas = document.getElementById("globalParticles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let w = 0, h = 0;
    let particles = [];
    let mouseX = -1000, mouseY = -1000;
    let lastX = -1000, lastY = -1000;
    let active = true;
    const MAX_PARTICLES = 70;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnParticle(x, y, vx, vy) {
      particles.push({
        x, y,
        vx,
        vy,
        life: 1.0,
        size: 1.5 + Math.random() * 1.5,
        hue: 195 + Math.random() * 30, // cyan-blue range
      });
    }

    function tick() {
      if (!active) {
        requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      // Distance from last spawn position
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const dist = Math.hypot(dx, dy);

      if (mouseX > 0 && mouseY > 0 && dist > 4) {
        const steps = Math.min(6, Math.floor(dist / 6));
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          spawnParticle(
            lastX + dx * t,
            lastY + dy * t,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4
          );
        }
        lastX = mouseX;
        lastY = mouseY;
      }

      // Cap total particles
      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }

      // Update + draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.018;
        p.vx *= 0.96;
        p.vy *= 0.96;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const alpha = p.life * 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${alpha})`;
        ctx.fill();

        // small glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${alpha * 0.15})`;
        ctx.fill();
      }

      requestAnimationFrame(tick);
    }

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (lastX < 0) {
        lastX = mouseX;
        lastY = mouseY;
      }
    }
    function onLeave() {
      mouseX = -1000;
      mouseY = -1000;
      lastX = -1000;
      lastY = -1000;
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    requestAnimationFrame(tick);

    // Pause animation when tab hidden (perf)
    document.addEventListener("visibilitychange", () => {
      active = !document.hidden;
    });
  })();

  /* ---------- Folder click → smooth scroll ---------- */
  document.querySelectorAll(".folder").forEach((f) => {
    f.addEventListener("click", (e) => {
      const target = f.dataset.target;
      if (!target) return;
      const el = document.getElementById(target);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", "#" + target);
    });
  });

  /* ---------- About me: pop-up window reveal (once) ---------- */
  (function setupAboutReveal() {
    const about = document.getElementById("about");
    if (!about) return;
    if (!("IntersectionObserver" in window)) {
      about.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target); // trigger once
          }
        });
      },
      { threshold: 0.18 }
    );
    io.observe(about);
  })();

  /* ---------- About me: language toggle (EN ↔ 한국어) ---------- */
  (function setupLangToggle() {
    const buttons = document.querySelectorAll("#about .lang-btn");
    const bioEn = document.querySelector("#about .about-bio-en");
    const bioKo = document.querySelector("#about .about-bio-ko");
    if (!buttons.length || !bioEn || !bioKo) return;

    function setLang(lang) {
      buttons.forEach((b) => {
        const active = b.dataset.lang === lang;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });
      bioEn.hidden = lang !== "en";
      bioKo.hidden = lang !== "ko";
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  })();

  /* ---------- Anchor smooth-scroll (other in-page links) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    if (a.classList.contains("folder")) return;
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });

  /* ---------- Lightbox for photo groups ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
  const lbCap = lightbox ? lightbox.querySelector(".lightbox-cap") : null;
  const lbClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  const lbPrev = lightbox ? lightbox.querySelector(".lightbox-prev") : null;
  const lbNext = lightbox ? lightbox.querySelector(".lightbox-next") : null;

  const GROUPS = {
    retro: [
      "assets/photos/retro-1.jpg",
      "assets/photos/retro-2.jpg",
      "assets/photos/retro-3.jpg",
      "assets/photos/retro-4.jpg",
      "assets/photos/retro-5.jpg",
      "assets/photos/retro-6.jpg",
      "assets/photos/retro-7.jpg",
    ],
    silk: [
      "assets/photos/silk-1.jpg",
      "assets/photos/silk-2.jpg",
      "assets/photos/silk-3.jpg",
      "assets/photos/silk-4.jpg",
      "assets/photos/silk-5.jpg",
      "assets/photos/silk-6.jpg",
    ],
    midnight: [
      "assets/photos/midnight-1.jpg",
      "assets/photos/midnight-2.jpg",
      "assets/photos/midnight-3.jpg",
      "assets/photos/midnight-4.jpg",
      "assets/photos/midnight-5.jpg",
      "assets/photos/midnight-6.jpg",
    ],
    friends: [
      "assets/photos/friends-1.jpg",
      "assets/photos/friends-2.jpg",
      "assets/photos/friends-3.jpg",
      "assets/photos/friends-4.jpg",
      "assets/photos/friends-5.jpg",
      "assets/photos/friends-6.jpg",
    ],
  };
  const GROUP_NAMES = {
    retro: "Retro Warm Tone",
    silk: "Silk & Classic",
    midnight: "Midnight Romance",
    friends: "Friends",
  };

  let lbList = [];
  let lbIndex = 0;

  function openLightbox(group) {
    if (!lightbox) return;
    lbList = GROUPS[group] || [];
    if (!lbList.length) return;
    lbIndex = 0;
    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function prevLightbox() {
    if (!lbList.length) return;
    lbIndex = (lbIndex - 1 + lbList.length) % lbList.length;
    renderLightbox();
  }
  function nextLightbox() {
    if (!lbList.length) return;
    lbIndex = (lbIndex + 1) % lbList.length;
    renderLightbox();
  }
  function renderLightbox() {
    const src = lbList[lbIndex];
    if (!src || !lbImg) return;
    lbImg.src = src;
    const groupKey = Object.keys(GROUPS).find((k) => GROUPS[k] === lbList);
    const caption = `${GROUP_NAMES[groupKey] || ""} — ${lbIndex + 1} / ${lbList.length}`;
    if (lbCap) lbCap.textContent = caption;
  }

  document.querySelectorAll(".photo-group").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.group;
      openLightbox(group);
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", prevLightbox);
  if (lbNext) lbNext.addEventListener("click", nextLightbox);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") prevLightbox();
    else if (e.key === "ArrowRight") nextLightbox();
  });

  /* Touch swipe */
  let touchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    lightbox.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) < 40) return;
        if (dx > 0) prevLightbox();
        else nextLightbox();
      },
      { passive: true }
    );
  }
})();