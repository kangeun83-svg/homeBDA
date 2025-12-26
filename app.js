/* ============================================================
   APP.JS - Portfolio Functionality
   - Theme Toggle (Dark/Light)
   - Scroll Spy Navigation
   - Scroll Progress Bar
   - Skill Filter (Highlight/Reorder)
   - Smooth Scroll Animations
   - Chart.js Initialization
   - Form Validation & Submission
   - Scroll to Top Button
   ============================================================ */

(function() {
  'use strict';

  // ============ THEME TOGGLE ============
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const THEME_KEY = 'portfolio-theme';

  function setTheme(theme) {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
      themeToggle.textContent = '☀️';
    } else {
      html.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  });

  // ============ SCROLL SPY NAVIGATION ============
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('[id]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  // ============ SCROLL PROGRESS BAR ============
  const progressBar = document.querySelector('.scroll-progress');

  function updateProgressBar() {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }

  // ============ SCROLL TO TOP BUTTON ============
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function toggleScrollTopBtn() {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============ SKILL FILTER ============
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-skill-filter');
      
      // Update button states
      skillFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      // Filter and reorder cards
      skillCards.forEach(card => {
        const category = card.getAttribute('data-skill-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 300ms ease forwards';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ============ CHART.JS INITIALIZATION ============
  function initCharts() {
    const chartColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim();
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-cyan').trim();
    const purpleColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-purple').trim();

    // Chart 1: Revenue Trend (Line Chart)
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'],
          datasets: [{
            label: '분기별 매출',
            data: [1050000, 1200000, 1350000, 1650000],
            borderColor: accentColor,
            backgroundColor: 'rgba(0, 229, 255, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: accentColor,
            pointBorderColor: 'rgba(10, 14, 39, 1)',
            pointBorderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: chartColor,
                font: { size: 14, weight: 600 }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(10, 14, 39, 0.9)',
              titleColor: accentColor,
              bodyColor: chartColor,
              borderColor: accentColor,
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return '$' + context.parsed.y.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
              },
              ticks: {
                color: chartColor,
                callback: function(value) {
                  return '$' + (value / 1000000).toFixed(1) + 'M';
                }
              }
            },
            x: {
              grid: { display: false },
              ticks: { color: chartColor }
            }
          }
        }
      });
    }

    // Chart 2: Channel Performance (Bar Chart)
    const conversionCtx = document.getElementById('conversionChart');
    if (conversionCtx) {
      new Chart(conversionCtx, {
        type: 'bar',
        data: {
          labels: ['이메일', '소셜 미디어', '유기 검색', '광고', '직접 방문'],
          datasets: [{
            label: '전환율 (%)',
            data: [4.2, 1.8, 3.1, 2.5, 2.9],
            backgroundColor: [
              accentColor,
              purpleColor,
              'rgba(122, 92, 255, 0.6)',
              'rgba(0, 229, 255, 0.6)',
              'rgba(122, 92, 255, 0.8)'
            ],
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: chartColor,
                font: { size: 14, weight: 600 }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(10, 14, 39, 0.9)',
              titleColor: accentColor,
              bodyColor: chartColor,
              borderColor: accentColor,
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return context.parsed.x.toFixed(1) + '%';
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 5,
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
              },
              ticks: {
                color: chartColor,
                callback: function(value) {
                  return value.toFixed(1) + '%';
                }
              }
            },
            y: {
              grid: { display: false },
              ticks: { color: chartColor }
            }
          }
        }
      });
    }

    // Chart 3: Customer Segmentation (Doughnut Chart)
    const segmentCtx = document.getElementById('segmentChart');
    if (segmentCtx) {
      new Chart(segmentCtx, {
        type: 'doughnut',
        data: {
          labels: ['VIP 고객', '활성 고객', '이탈 위험'],
          datasets: [{
            data: [55, 35, 10],
            backgroundColor: [
              accentColor,
              purpleColor,
              'rgba(255, 0, 110, 0.6)'
            ],
            borderColor: 'rgba(10, 14, 39, 1)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: chartColor,
                font: { size: 14, weight: 600 },
                padding: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(10, 14, 39, 0.9)',
              titleColor: accentColor,
              bodyColor: chartColor,
              borderColor: accentColor,
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        }
      });
    }
  }

  // ============ CONTACT FORM VALIDATION & SUBMISSION ============
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.querySelector('.form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      // Validation
      let isValid = true;
      const errors = {};

      if (!name) {
        errors.name = '이름을 입력해주세요';
        isValid = false;
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = '유효한 이메일을 입력해주세요';
        isValid = false;
      }

      if (!message || message.length < 10) {
        errors.message = '메시지는 최소 10자 이상이어야 합니다';
        isValid = false;
      }

      // Display errors
      document.querySelectorAll('.form-error').forEach(err => err.textContent = '');
      Object.keys(errors).forEach(field => {
        const input = document.getElementById('contact' + field.charAt(0).toUpperCase() + field.slice(1));
        const errorSpan = input.parentElement.querySelector('.form-error');
        if (errorSpan) errorSpan.textContent = errors[field];
      });

      if (!isValid) return;

      // Simulate form submission
      contactForm.style.opacity = '0.6';
      contactForm.style.pointerEvents = 'none';
      
      formStatus.textContent = '전송 중...';
      formStatus.className = 'form-status';

      setTimeout(() => {
        // Success
        formStatus.textContent = '✓ 메시지가 전송되었습니다! 감사합니다.';
        formStatus.classList.add('success');
        contactForm.reset();
        
        contactForm.style.opacity = '1';
        contactForm.style.pointerEvents = 'auto';

        // Clear message after 3 seconds
        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 3000);
      }, 800);
    });
  }

  // ============ SCROLL EVENT LISTENERS ============
  window.addEventListener('scroll', () => {
    updateActiveNav();
    updateProgressBar();
    toggleScrollTopBtn();
  });

  // ============ INTERSECTION OBSERVER FOR ANIMATIONS ============
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.animation = 'fadeInUp 600ms ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll(
    '.project-card, .skill-card, .process-step, .impact-card, .chart-container, .timeline-item'
  ).forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // ============ INITIALIZATION ============
  function init() {
    initTheme();
    updateActiveNav();
    updateProgressBar();
    toggleScrollTopBtn();
    initCharts();
  }

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Reinit charts on theme change to update colors
  const observer_theme = new MutationObserver(() => {
    initCharts();
  });

  observer_theme.observe(html, { attributes: true });

})();

          x:{ticks:{color:getComputedStyle(document.documentElement).getPropertyValue('--text').trim()}}
        }
      }
    });
  }
  setupChart();

  // IntersectionObserver for reveal animations
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('inview'); });
  },{threshold:0.12});
  document.querySelectorAll('.card, .project-card, .viz-card').forEach(el=>obs.observe(el));

  // Back to top
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', ()=>{ if(window.scrollY>300) backTop.style.display='block'; else backTop.style.display='none'; });
  backTop.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

})();
