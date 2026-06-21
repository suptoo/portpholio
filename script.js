/**
 * Umor Faruks Supto — Portfolio Interactions
 * Scroll reveal, counters, navigation, contact form
 */

(function () {
  "use strict";

  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const navLinkItems = document.querySelectorAll(".nav__link");
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const formSubmitBtn = document.getElementById("formSubmitBtn");
  const formToast = document.getElementById("formToast");
  const toastMessage = document.getElementById("toastMessage");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Hero animations — load sequence, word reveal, role cycle, parallax */
  const hero = document.getElementById("hero");
  const heroIntro = document.getElementById("heroIntro");
  const roleCycle = document.getElementById("roleCycle");

  function splitIntroWords() {
    if (!heroIntro || heroIntro.dataset.wordsSplit === "true") return;

    const text = heroIntro.textContent.replace(/\s+/g, " ").trim();
    heroIntro.textContent = "";
    heroIntro.dataset.wordsSplit = "true";

    text.split(" ").forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "hero-word";
      span.style.setProperty("--word-i", String(i));
      span.textContent = word;
      heroIntro.appendChild(span);
      if (i < text.split(" ").length - 1) {
        heroIntro.appendChild(document.createTextNode(" "));
      }
    });
  }

  function initHeroLoad() {
    if (!hero) return;

    if (prefersReducedMotion) {
      hero.classList.add("hero--loaded", "hero--reduced-motion");
      return;
    }

    splitIntroWords();

    requestAnimationFrame(() => {
      hero.classList.add("hero--loaded");
    });
  }

  function initRoleCycle() {
    if (!roleCycle || prefersReducedMotion) return;

    const items = roleCycle.querySelectorAll(".hero__role-item");
    if (items.length < 2) return;

    let current = 0;
    const cycleMs = 2800;

    function setRole(index) {
      items.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
      });
      current = index;
    }

    setInterval(() => {
      setRole((current + 1) % items.length);
    }, cycleMs);
  }

  function initHeroParallax() {
    if (!hero || prefersReducedMotion) return;

    const parallaxEls = hero.querySelectorAll("[data-parallax]");
    if (!parallaxEls.length) return;

    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    function applyParallax() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      parallaxEls.forEach((el) => {
        const factor = parseFloat(el.getAttribute("data-parallax")) || 10;
        const x = currentX * (factor / 18);
        const y = currentY * (factor / 18) + scrollY * (factor / 14);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      if (
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05
      ) {
        rafId = requestAnimationFrame(applyParallax);
      } else {
        rafId = null;
      }
    }

    function requestParallaxFrame() {
      if (!rafId) rafId = requestAnimationFrame(applyParallax);
    }

    function setTarget(clientX, clientY) {
      targetX = (clientX / window.innerWidth - 0.5) * 2;
      targetY = (clientY / window.innerHeight - 0.5) * 2;
      requestParallaxFrame();
    }

    hero.addEventListener("mousemove", (e) => setTarget(e.clientX, e.clientY), { passive: true });

    hero.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
      requestParallaxFrame();
    }, { passive: true });

    window.addEventListener("scroll", () => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      scrollY = Math.max(0, -rect.top) * 0.12;
      requestParallaxFrame();
    }, { passive: true });
  }

  initHeroLoad();
  initRoleCycle();
  initHeroParallax();

  /* Sticky header */
  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle("header--scrolled", window.scrollY > 32);
  }

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* Mobile nav */
  function closeNav() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("nav__links--open");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "true");
    navLinks.classList.add("nav__links--open");
    document.body.style.overflow = "hidden";
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeNav() : openNav();
    });
  }

  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => closeNav());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* Active nav link */
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      const link = document.querySelector(`.nav__link[href="#${id}"]`);

      if (!link) return;

      if (scrollPos >= top && scrollPos < top + height) {
        navLinkItems.forEach((l) => l.classList.remove("nav__link--active"));
        link.classList.add("nav__link--active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", targetId);
    });
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 5, 4) * 0.08}s`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("reveal--visible"));
  }

  /* Animated counters */
  function animateCounter(el, target, duration = 2200) {
    const start = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * easeOutQuart(progress));
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll("[data-count]");

  if ("IntersectionObserver" in window && counterEls.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-count"), 10);
            animateCounter(el, target);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    counterEls.forEach((el) => counterObserver.observe(el));
  }

  /* Card hover lift enhancement */
  if (window.matchMedia("(pointer: fine)").matches) {
    const liftCards = document.querySelectorAll(".role-card, .work-card, .hero__stat");

    liftCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease";
      });
    });
  }

  /* Contact form — Formspree AJAX */
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgdaagw";
  let toastTimeout = null;

  function showToast(message, type = "success") {
    if (!formToast || !toastMessage) return;

    formToast.classList.remove("toast--success", "toast--error", "toast--visible");
    formToast.classList.add(type === "error" ? "toast--error" : "toast--success");
    toastMessage.textContent = message;
    formToast.hidden = false;

    requestAnimationFrame(() => formToast.classList.add("toast--visible"));

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      formToast.classList.remove("toast--visible");
      setTimeout(() => { formToast.hidden = true; }, 400);
    }, 5000);
  }

  function setFormLoading(isLoading) {
    if (!contactForm || !formSubmitBtn) return;
    formSubmitBtn.classList.toggle("btn--loading", isLoading);
    formSubmitBtn.disabled = isLoading;
    formSubmitBtn.setAttribute("aria-busy", isLoading ? "true" : "false");
  }

  function validateContactForm(name, email, message) {
    formNote.className = "form-note";
    formNote.textContent = "";

    if (!name || !email || !message) {
      formNote.classList.add("form-note--error");
      formNote.textContent = "Please fill in all fields.";
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formNote.classList.add("form-note--error");
      formNote.textContent = "Please enter a valid email address.";
      return false;
    }

    if (message.length < 10) {
      formNote.classList.add("form-note--error");
      formNote.textContent = "Please write a message of at least 10 characters.";
      return false;
    }

    return true;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const honeypot = contactForm.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!validateContactForm(name, email, message)) return;

      setFormLoading(true);
      formNote.className = "form-note";
      formNote.textContent = "";

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          contactForm.reset();
          formNote.classList.add("form-note--success");
          formNote.textContent = "Message sent successfully.";
          showToast("Message sent successfully. I'll get back to you soon.");
        } else {
          const errorMsg =
            data.error ||
            (data.errors && data.errors.map((err) => err.message).join(" ")) ||
            "Something went wrong. Please try again or reach out via social links.";
          formNote.classList.add("form-note--error");
          formNote.textContent = errorMsg;
          showToast(errorMsg, "error");
        }
      } catch {
        const errorMsg = "Network error. Please check your connection and try again.";
        formNote.classList.add("form-note--error");
        formNote.textContent = errorMsg;
        showToast(errorMsg, "error");
      } finally {
        setFormLoading(false);
      }
    });
  }
})();
