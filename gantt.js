(() => {
  if (document.getElementById('generateOutputBtn')) return;

  const style = document.createElement('style');
  style.textContent = `
    .output-btn{background:#182733;color:#fff;border-radius:999px;padding:9px 14px;font-weight:800}
    .output-overlay{position:fixed;inset:0;background:rgba(8,15,12,.72);z-index:9999;display:none;padding:18px;overflow:auto}
    .output-overlay.open{display:block}.output-shell{width:min(1500px,100%);margin:auto;background