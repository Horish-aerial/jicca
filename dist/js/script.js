'use strict';

/* ハンバーガーメニュー開閉 */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.c-hamburger');
  const header = document.querySelector('.l-header');
  const nav = document.querySelector('#global-nav');

  if (!hamburger || !header || !nav) return;

  const openNav = () => {
    header.classList.add('is-nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'メニューを閉じる');
    nav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-menu-open');
  };

  const closeNav = () => {
    header.classList.remove('is-nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
    nav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-menu-open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = header.classList.contains('is-nav-open');
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });
});

/* FAQ アコーディオン */

document.addEventListener('DOMContentLoaded', () => {
  const faqButtons = document.querySelectorAll('.p-faq__question');
  if (!faqButtons.length) return;

  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      const answerId = button.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      if (!answer) return;

      button.setAttribute('aria-expanded', String(!isOpen));
      answer.setAttribute('aria-hidden', String(isOpen));
    });
  });
});

/* ギャラリー サムネイル切り替え */

document.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('.p-room__item-gallery');
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const mainImg = gallery.querySelector('.p-room__item-gallery-main img');
    const thumbs = gallery.querySelectorAll('.p-room__item-gallery-thumbs img');
    if (!mainImg || !thumbs.length) return;

    thumbs.forEach((thumb) => {
      thumb.style.cursor = 'pointer';
      thumb.addEventListener('click', () => {
        if (mainImg.src === thumb.src) return;
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = thumb.src;
          mainImg.alt = thumb.alt;
          mainImg.style.opacity = '1';
        }, 300);
      });
    });
  });
});

/* ヘッダー スクロール切り替え */

gsap.ticker.add(() => {
  const header = document.querySelector('.l-header');
  if (!header) return;

  if (window.scrollY > 100) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
});

/* 間取り図 画像拡大 */

document.addEventListener('DOMContentLoaded', () => {
  const planImages = document.querySelectorAll('.p-room__item-plan img');
  if (!planImages.length) return;

  const overlay = document.createElement('div');
  overlay.classList.add('c-lightbox');
  const enlargedImg = document.createElement('img');
  overlay.appendChild(enlargedImg);
  document.body.appendChild(overlay);

  planImages.forEach((img) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      enlargedImg.src = img.src;
      enlargedImg.alt = img.alt;
      overlay.classList.add('is-active');
    });
  });

  overlay.addEventListener('click', () => {
    overlay.classList.remove('is-active');
  });
});

/* Lenis スムーススクロール */

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
  smooth: true,
});

/* GSAP + ScrollTrigger + Lenis 連携 */

gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
  img.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});

/* ヒーロー オープニングアニメーション */

window.addEventListener('load', () => {
  const header = document.querySelector('.l-header');
  const heroImage = document.querySelector('.p-hero__image');
  const heroCatchMain = document.querySelector('.p-hero__catch-main');
  const heroCatchSub = document.querySelector('.p-hero__catch-sub');

  if (!heroImage || !heroCatchMain) return;

  const mainChars = splitText(heroCatchMain);
  const heroTl = gsap.timeline({
    delay: 0.8,
    onComplete: () => {
      const conceptTitle = document.querySelector('.p-concept__title');
      if (conceptTitle) {
        observeCharReveal(conceptTitle, { stagger: 0.04 });
        gsap.set(conceptTitle, { opacity: 1 });
      }
    },
  });

  const main = document.querySelector('.l-main');
  if (main) {
    heroTl.set(main, { opacity: 1 });
  }

  heroTl.to(heroImage, {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
  });

  if (header) {
    heroTl.to(
      header,
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      },
      '<',
    );
  }

  heroTl.fromTo(
    mainChars,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.04,
      ease: 'power2.out',
    },
  );

  if (heroCatchSub) {
    heroTl.to(
      heroCatchSub,
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.3',
    );
  }
});

/* テキスト文字送りアニメーション */

function splitText(el) {
  const nodes = [...el.childNodes];
  el.innerHTML = '';

  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      el.appendChild(node);
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      [...text].forEach((char) => {
        if (char.trim() === '') return;
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        el.appendChild(span);
      });
    }
  });

  return el.querySelectorAll('span');
}

function observeCharReveal(el, options = {}) {
  const chars = splitText(el);
  if (!chars.length) return;

  const stagger = options.stagger || 0.04;

  gsap.set(chars, { y: 60, opacity: 0 });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        gsap.to(chars, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: stagger,
          ease: 'power2.out',
        });

        observer.unobserve(entry.target);
      });
    },

    { rootMargin: '-20% 0px' },
  );

  observer.observe(el);
}

const conceptText = document.querySelector('.p-concept__text');
if (conceptText) {
  const textObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        gsap.to(conceptText, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        });
        textObserver.unobserve(entry.target);
      });
    },
    { rootMargin: '-20% 0px' },
  );
  textObserver.observe(conceptText);
}

document.querySelectorAll('.c-title__en').forEach((el) => {
  observeCharReveal(el, { stagger: 0.08 });
});

/* パララックス（PC のみ） */

if (window.matchMedia('(min-width: 769px)').matches) {
  document.querySelectorAll('.p-value__item-image img').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.p-value__item'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });

  document.querySelectorAll('.p-service__item-image img').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: 0, scale: 1.3 },
      {
        yPercent: 8,
        scale: 1.3,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.p-service__item'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

/* アンカーリンク スムーススクロール */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#' || href === '#top') {
      e.preventDefault();
      lenis.scrollTo(0);
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    lenis.scrollTo(target);
  });
});
