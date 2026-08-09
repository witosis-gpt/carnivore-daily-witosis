(() => {
  if (document.getElementById('generateOutputBtn')) return;

  const style = document.createElement('style');
  style.textContent = `
    .generate-output-btn{border:0;cursor:pointer;border-radius:999px;background:#172634;color:#fff;font:inherit;font-weight:800;padding:8px 13px;white-space:nowrap}
    .generate-output-wrap{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .gantt-overlay{position:fixed;inset:0;z-index:99999;background:rgba(10,18,14,.78);display:none;padding:12px}
    .gantt-overlay.open{display:flex;flex-direction:column}
    .gantt-toolbar{display:flex;justify-content:space-between;align-items:center;gap:10px;background:#fff;padding:10px 12px;border-radius:14px 14px 0 0}
    .gantt-toolbar strong{font-size:.95rem}.gantt-close{border:0;border-radius:9px;background:#edf0ea;color:#1c2420;padding:9px 12px;font-weight:800;cursor:pointer}
    .gantt-frame{width:100%;height:calc(100vh - 70px);border:0;background:#fff;border-radius:0 0 14px 14px}
    @media(max-width:460px){.generate-output-wrap{width:100%;justify-content:space-between}.generate-output-btn{flex:1}.gantt-overlay{padding:5px}.gantt-frame{height:calc(100vh - 58px)}}
  `;
  document.head.appendChild(style);

  const header = document.querySelector('header');
  const streak = document.getElementById('streak');
  if (!header || !streak) return;

  const wrap = document.createElement('div');
  wrap.className = 'generate-output-wrap';
  streak.parentNode.insertBefore(wrap, streak);
  wrap.appendChild(streak);

  const button = document.createElement('button');
  button.id = 'generateOutputBtn';
  button.className = 'generate-output-btn';
  button.type = 'button';
  button.textContent = 'Generate Output';
  wrap.appendChild(button);

  const overlay = document.createElement('div');
  overlay.className = 'gantt-overlay';
  overlay.id = 'ganttOverlay';
  overlay.innerHTML = `
    <div class="gantt-toolbar"><strong>30-Day Carnivore Diet · Gantt Output</strong><button class="gantt-close" type="button" id="closeGantt">✕ Tutup</button></div>
    <iframe class="gantt-frame" id="ganttFrame" title="Generate Output Carnivore Daily"></iframe>`;
  document.body.appendChild(overlay);

  const frame = document.getElementById('ganttFrame');
  const open = () => {
    frame.src = `output.html?v=${Date.now()}`;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  button.addEventListener('click', open);
  document.getElementById('closeGantt').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

  const plannerScript = document.createElement('script');
  plannerScript.src = `meal-planner-loader.js?v=1`;
  plannerScript.defer = true;
  document.body.appendChild(plannerScript);
})();
