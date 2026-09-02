(() => {
  if (document.getElementById('generateOutputBtn')) return;

  const style = document.createElement('style');
  style.textContent = `
    .generate-output-btn{border:0;cursor:pointer;border-radius:999px;background:#172634;color:#fff;font:inherit;font-weight:800;padding:8px 13px;white-space:nowrap}
    .generate-output-wrap{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .gantt-overlay{position:fixed;inset:0;z-index:99999;background:rgba(10,18,14,.78);display:none;padding:12px}
    .gantt-overlay.open{display:flex;flex-direction:column}
    .gantt-toolbar{display:flex;justify-content:space-between;align-items:center;gap:10px;background:#fff;padding:10px 12px;border-radius:14px 14px 0 0}
    .gantt-toolbar strong{font-size:.95rem}.gantt-toolbar-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.gantt-tool,.gantt-close{border:0;border-radius:9px;background:#edf0ea;color:#1c2420;padding:9px 11px;font-weight:800;cursor:pointer}.gantt-tool.primary{background:#1e7a54;color:#fff}
    .gantt-frame{width:100%;height:calc(100vh - 70px);border:0;background:#fff;border-radius:0 0 14px 14px}
    #chart .weight-value{fill:#1c2420;font-size:11px;font-weight:800;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round}
    @media(max-width:620px){.gantt-toolbar{align-items:flex-start;flex-direction:column}.gantt-toolbar-actions{width:100%;justify-content:flex-start}.gantt-tool,.gantt-close{flex:1}.gantt-frame{height:calc(100vh - 118px)}}
    @media(max-width:460px){.generate-output-wrap{width:100%;justify-content:space-between}.generate-output-btn{flex:1}.gantt-overlay{padding:5px}#chart .weight-value{font-size:10px}}
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
    <div class="gantt-toolbar">
      <strong>90-Day Nutrition Journey · Carnivore → Low Carb</strong>
      <div class="gantt-toolbar-actions">
        <button class="gantt-tool" type="button" id="refreshGantt">↻ Refresh</button>
        <button class="gantt-tool primary" type="button" id="downloadGanttPng">⬇ PNG</button>
        <button class="gantt-tool primary" type="button" id="printGanttPdf">🖨 PDF / Print</button>
        <button class="gantt-close" type="button" id="closeGantt">✕ Tutup</button>
      </div>
    </div>
    <iframe class="gantt-frame" id="ganttFrame" title="Generate Output Carnivore Daily"></iframe>`;
  document.body.appendChild(overlay);

  const frame = document.getElementById('ganttFrame');
  const refreshFrame = () => { frame.src = `output-v2.html?v=${Date.now()}`; };
  const open = () => {
    refreshFrame();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  async function ensureHtml2Canvas(doc) {
    if (doc.defaultView.html2canvas) return doc.defaultView.html2canvas;
    await new Promise((resolve, reject) => {
      const s = doc.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      s.onload = resolve;
      s.onerror = reject;
      doc.head.appendChild(s);
    });
    return doc.defaultView.html2canvas;
  }

  async function downloadPng() {
    try {
      const doc = frame.contentDocument;
      if (!doc) throw new Error('Output belum siap');
      const report = doc.getElementById('report');
      if (!report) throw new Error('Report belum ditemukan');
      const html2canvas = await ensureHtml2Canvas(doc);
      const canvas = await html2canvas(report, {scale:2, backgroundColor:'#ffffff', useCORS:true, logging:false});
      const link = document.createElement('a');
      link.download = `witosis-90day-nutrition-gantt-${new Date().toISOString().slice(0,10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Gagal membuat PNG. Coba Refresh lalu ulangi.');
    }
  }

  function printPdf() {
    try {
      if (!frame.contentWindow) throw new Error('Output belum siap');
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } catch (err) {
      console.error(err);
      alert('Gagal membuka Print/PDF. Coba Refresh lalu ulangi.');
    }
  }

  button.addEventListener('click', open);
  document.getElementById('refreshGantt').addEventListener('click', refreshFrame);
  document.getElementById('downloadGanttPng').addEventListener('click', downloadPng);
  document.getElementById('printGanttPdf').addEventListener('click', printPdf);
  document.getElementById('closeGantt').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

  const chart = document.getElementById('chart');
  function addWeightLabels() {
    if (!chart) return;
    chart.querySelectorAll('.weight-value').forEach(node => node.remove());
    chart.querySelectorAll('circle.dot').forEach(dot => {
      const title = dot.querySelector('title')?.textContent || '';
      const match = title.match(/:\s*([0-9]+(?:[.,][0-9]+)?)\s*kg/i);
      if (!match) return;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'weight-value');
      text.setAttribute('x', dot.getAttribute('cx'));
      text.setAttribute('y', String(Number(dot.getAttribute('cy')) - 10));
      text.setAttribute('text-anchor', 'middle');
      text.textContent = `${Number(match[1].replace(',', '.')).toFixed(1)}`;
      chart.appendChild(text);
    });
  }
  if (chart) {
    let labeling = false;
    const observer = new MutationObserver(() => {
      if (labeling) return;
      labeling = true;
      requestAnimationFrame(() => {
        addWeightLabels();
        labeling = false;
      });
    });
    observer.observe(chart, {childList:true, subtree:true});
    addWeightLabels();
  }

  ['branding.js?v=1','meal-planner-loader.js?v=1','menu-identifier.js?v=2'].forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  });
})();
