// app.js
// - Theme toggle (prefers-color-scheme + localStorage)
// - Smooth nav behavior (CSS handles scroll) + active filter
// - Modal open/close with accessible attributes
// - Accordion behavior for project detail sections
// - Chart.js demo chart with synthetic data (see README-based sample)
// - IntersectionObserver for reveal animations

(function(){
  // Theme handling
  const root = document.documentElement;
  const THEME_KEY = 'theme-preference';
  const toggle = document.getElementById('theme-toggle');

  function applyTheme(theme){
    if(theme === 'light') document.documentElement.setAttribute('data-theme','light');
    else document.documentElement.removeAttribute('data-theme');
  }

  const saved = localStorage.getItem(THEME_KEY);
  if(saved) applyTheme(saved);
  else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  toggle.addEventListener('click', ()=>{
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY,next);
  });

  // Filters (tabs)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projects.forEach(p=>{
        const tech = p.dataset.tech;
        if(f === 'all' || tech.includes(f)) p.style.display = '';
        else p.style.display = 'none';
      });
    });
  });

  // Modal logic
  const openButtons = document.querySelectorAll('[data-open]');
  openButtons.forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.open;
      const modal = document.getElementById(id);
      if(!modal) return;
      modal.setAttribute('aria-hidden','false');
      const close = modal.querySelector('.modal-close');
      close && close.focus();
    });
  });
  const modalCloses = document.querySelectorAll('.modal-close');
  modalCloses.forEach(c=>{c.addEventListener('click', ()=>{c.closest('.modal').setAttribute('aria-hidden','true');});});
  // close on Esc
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ document.querySelectorAll('.modal').forEach(m=>m.setAttribute('aria-hidden','true')); }});

  // Accordion
  document.querySelectorAll('.acc-item').forEach(item=>{
    const btn = item.querySelector('.acc-toggle');
    btn.addEventListener('click', ()=>{
      const expanded = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });

  // Chart.js demo using synthetic data based on README insights
  function setupChart(){
    const ctx = document.getElementById('kpiChart');
    if(!ctx) return;
    // Synthetic monthly revenue and churn rate data
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const revenue = [120,140,150,170,160,180,190,210,200,230,240,260];
    const churn = [6.2,6.0,5.8,5.9,6.1,5.7,5.6,5.3,5.5,5.2,5.0,4.8];

    new Chart(ctx,{
      type:'bar',
      data:{
        labels:months,
        datasets:[
          {type:'line',label:'Churn Rate (%)',data:churn,yAxisID:'y1',borderColor:'#ffb86b',backgroundColor:'rgba(255,184,107,0.12)',tension:0.3},
          {type:'bar',label:'Revenue (k)',data:revenue,backgroundColor:'rgba(125,249,255,0.16)',borderColor:'#7df9ff'}
        ]
      },
      options:{
        responsive:true,maintainAspectRatio:false,
        interaction:{mode:'index',intersect:false},
        plugins:{tooltip:{enabled:true},legend:{labels:{color:getComputedStyle(document.documentElement).getPropertyValue('--text').trim()}}},
        scales:{
          y:{position:'left',title:{display:true,text:'Revenue (k)'},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue('--text').trim()}},
          y1:{position:'right',title:{display:true,text:'Churn Rate (%)'},grid:{display:false},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue('--text').trim()}},
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
