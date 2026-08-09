(() => {
  document.title = 'Witosis Carnivore Journey';
  const header = document.querySelector('main > header > div');
  if (!header) return;
  const title = header.querySelector('h1');
  const subtitle = header.querySelector('p');
  if (title) title.textContent = 'Witosis Carnivore Journey';
  if (subtitle) subtitle.textContent = 'My daily carnivore log — berat, menu, protein, progress, dan perjalanan 30 hari.';
})();
