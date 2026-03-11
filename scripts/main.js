(function() {
  'use strict';

  // ========================
  // UTILITY FUNCTIONS
  // ========================
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ========================
  // 1. PAGE LOADER
  // ========================
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = $('#pageLoader');
      if (loader) loader.classList.add('hidden');
    }, 1200);
  });

  // ========================
  // 2. CUSTOM CURSOR
  // ========================
  const cursorDot = $('#cursorDot');
  const cursorRing = $('#cursorRing');

  if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effect
    $$('a, button, .clickable').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width = '50px';
        cursorRing.style.height = '50px';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '35px';
        cursorRing.style.height = '35px';
      });
    });
  }

  // ========================
  // 3. SCROLL PROGRESS BAR
  // ========================
  const scrollProgress = $('#scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ========================
  // 4. HEADER SCROLL BEHAVIOR
  // ========================
  const header = $('#mainHeader');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 80) {
      header.classList.remove('transparent');
      header.classList.add('scrolled');
    } else {
      header.classList.add('transparent');
      header.classList.remove('scrolled');
    }
  }

  // ========================
  // 5. BACK TO TOP
  // ========================
  const backToTop = $('#backToTop');
  function updateBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Combined scroll handler
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateHeader();
    updateBackToTop();
  }, { passive: true });

  // Init header state
  updateHeader();

  // ========================
  // 6. HAMBURGER / MOBILE NAV
  // ========================
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });
  }

  // ========================
  // 7. HERO CAROUSEL (only on home page)
  // ========================
  const heroCarousel = $('#heroCarousel');
  if (heroCarousel) {
    const slides = $$('.hero-slide');
    const dots = $$('.carousel-dot');
    let currentSlide = 0;
    let carouselInterval;
    let isCarouselPaused = false;

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startCarousel() {
      carouselInterval = setInterval(() => {
        if (!isCarouselPaused) nextSlide();
      }, 5000);
    }

    function resetCarousel() {
      clearInterval(carouselInterval);
      startCarousel();
    }

    const carouselNext = $('#carouselNext');
    const carouselPrev = $('#carouselPrev');
    if (carouselNext) carouselNext.addEventListener('click', () => { nextSlide(); resetCarousel(); });
    if (carouselPrev) carouselPrev.addEventListener('click', () => { prevSlide(); resetCarousel(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.slide));
        resetCarousel();
      });
    });

    heroCarousel.addEventListener('mouseenter', () => { isCarouselPaused = true; });
    heroCarousel.addEventListener('mouseleave', () => { isCarouselPaused = false; });

    startCarousel();

    // Parallax on hero
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      $$('.hero-slide-bg').forEach(bg => {
        bg.style.transform = `scale(${1 + scrollY * 0.0001}) translateY(${scrollY * 0.3}px)`;
      });
    }, { passive: true });
  }

  // ========================
  // 8. ABOUT TABS (only on about page)
  // ========================
  const aboutTabs = $$('.about-tab');
  if (aboutTabs.length > 0) {
    aboutTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.about-tab').forEach(t => t.classList.remove('active'));
        $$('.about-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = $(`#panel-${tab.dataset.tab}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ========================
  // 9. ACADEMICS TABS (only on academics page)
  // ========================
  const academicsTabs = $$('.academics-tab');
  if (academicsTabs.length > 0) {
    academicsTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.academics-tab').forEach(t => t.classList.remove('active'));
        $$('.academics-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');

        const tabName = tab.dataset.tab;
        const panel = $(`#acad-${tabName}`);
        if (panel) {
          panel.classList.add('active');
          if (tabName === 'performance') {
            setTimeout(animatePerformanceBars, 300);
          }
        }
      });
    });
  }

  // ========================
  // 10. TEACHER SEARCH (only on academics page)
  // ========================
  // 9b. PATHWAY SUB-TABS (inside departments panel)
  // ========================
  const pathwayBtns = $$('.pathway-filter-btn');
  if (pathwayBtns.length > 0) {
    pathwayBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.pathway-filter-btn').forEach(b => b.classList.remove('active'));
        $$('.pathway-detail').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = $(`#pathway-${btn.dataset.pathway}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ========================
  // 10. TEACHER SEARCH (only on academics page)
  // ========================
  const teacherSearch = $('#teacherSearch');
  if (teacherSearch) {
    teacherSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      $$('.teacher-card').forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        const subject = card.querySelector('.teacher-subject').textContent.toLowerCase();
        card.style.display = (name.includes(query) || subject.includes(query)) ? '' : 'none';
      });
    });
  }

  // ========================
  // 11. GALLERY FILTER (only on gallery page)
  // ========================
  const galleryFilters = $$('.gallery-filter');
  if (galleryFilters.length > 0) {
    galleryFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.gallery-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        $$('.gallery-item').forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
              item.style.transition = 'all 0.4s ease';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ========================
  // 12. LIGHTBOX (only on gallery page)
  // ========================
  const lightbox = $('#lightbox');
  if (lightbox) {
    const lightboxImg = $('#lightboxImg');
    let galleryImages = [];
    let currentLightboxIndex = 0;

    function openLightbox(index) {
      galleryImages = $$('.gallery-item:not([style*="display: none"]) img');
      currentLightboxIndex = index;
      if (galleryImages[currentLightboxIndex]) {
        lightboxImg.src = galleryImages[currentLightboxIndex].src;
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    $$('.gallery-item').forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    const lightboxClose = $('#lightboxClose');
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    const lightboxPrev = $('#lightboxPrev');
    const lightboxNext = $('#lightboxNext');

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex].src;
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex].src;
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex].src;
      }
      if (e.key === 'ArrowRight') {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex].src;
      }
    });
  }

  // ========================
  // 13. COUNTER ANIMATION (Intersection Observer)
  // ========================
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    $$('.stat-number').forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const suffix = target >= 1000 ? '+' : (target === 95 ? '%' : '+');
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current).toLocaleString() + suffix;
      }, 25);
    });
  }

  // ========================
  // 14. PERFORMANCE BAR ANIMATION
  // ========================
  function animatePerformanceBars() {
    $$('.chart-bar').forEach(bar => {
      const width = bar.dataset.width;
      bar.style.width = width + '%';
      bar.classList.add('animated');
    });
  }

  // ========================
  // 15. SCROLL REVEAL (Intersection Observer)
  // ========================
  function triggerReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    $$('.reveal:not(.revealed)').forEach(el => observer.observe(el));
  }

  // Stats observer
  const statsSection = $('#statsSection');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // Performance bars observer
  const perfChart = $('#perfChart');
  if (perfChart) {
    const perfObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animatePerformanceBars();
          perfObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    perfObserver.observe(perfChart);
  }

  // Initial trigger
  triggerReveals();

  // ── Inspiration Carousel ──────────────────────────
  const inspireSlides = document.querySelectorAll('.inspire-slide');
  const inspireDots = document.querySelectorAll('.inspire-dot');
  if (inspireSlides.length > 0) {
    let inspireIndex = 0;
    const inspireCount = inspireSlides.length;

    function showInspireSlide(idx) {
      inspireSlides.forEach(s => s.classList.remove('active'));
      inspireDots.forEach(d => d.classList.remove('active'));
      inspireSlides[idx].classList.add('active');
      if (inspireDots[idx]) inspireDots[idx].classList.add('active');
      inspireIndex = idx;
    }

    inspireDots.forEach(dot => {
      dot.addEventListener('click', () => {
        showInspireSlide(parseInt(dot.dataset.inspireDot));
      });
    });

    setInterval(() => {
      showInspireSlide((inspireIndex + 1) % inspireCount);
    }, 5000);
  }

  // ── Pathway Gallery Slideshows ──────────────────────────
  document.querySelectorAll('.pathway-slideshow').forEach(slideshow => {
    const container = slideshow.querySelector('.pathway-slideshow-container');
    const slides = slideshow.querySelectorAll('.pathway-slide');
    const dotsContainer = slideshow.querySelector('.pathway-slideshow-dots');
    const prevBtn = slideshow.querySelector('.pathway-slideshow-arrow--prev');
    const nextBtn = slideshow.querySelector('.pathway-slideshow-arrow--next');
    const counterCurrent = slideshow.querySelector('.pathway-slideshow-counter .current');
    const counterTotal = slideshow.querySelector('.pathway-slideshow-counter .total');
    
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    let autoPlayInterval;
    let isPaused = false;
    const slideCount = slides.length;
    
    // Update counter total
    if (counterTotal) counterTotal.textContent = slideCount;
    
    // Create dots
    if (dotsContainer) {
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'pathway-slideshow-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    }
    
    const dots = slideshow.querySelectorAll('.pathway-slideshow-dot');
    
    function goToSlide(index) {
      // Handle wrapping
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;
      
      // Update slides
      slides.forEach(slide => slide.classList.remove('active'));
      slides[index].classList.add('active');
      
      // Update dots
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
      
      // Update counter
      if (counterCurrent) counterCurrent.textContent = index + 1;
      
      currentIndex = index;
    }
    
    function nextSlide() {
      goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
      goToSlide(currentIndex - 1);
    }
    
    function startAutoPlay() {
      autoPlayInterval = setInterval(() => {
        if (!isPaused) nextSlide();
      }, 4000);
    }
    
    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }
    
    // Event listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }
    
    // Pause on hover
    slideshow.addEventListener('mouseenter', () => { isPaused = true; });
    slideshow.addEventListener('mouseleave', () => { isPaused = false; });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        resetAutoPlay();
      }
    }, { passive: true });
    
    // Keyboard navigation
    slideshow.setAttribute('tabindex', '0');
    slideshow.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoPlay();
      }
    });
    
    // Start auto-play
    startAutoPlay();
  });

})();
