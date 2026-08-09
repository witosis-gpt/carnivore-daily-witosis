(() => {
  const style = document.createElement('style');
  style.textContent = '.mp-day small{display:none!important}';
  document.head.appendChild(style);

  const script = document.createElement('script');
  script.src = 'meal-planner.js?v=2';
  script.defer = true;
  document.body.appendChild(script);
})();
