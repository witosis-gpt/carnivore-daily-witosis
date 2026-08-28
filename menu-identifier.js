(() => {
  const input = document.getElementById('food');
  const protein = document.getElementById('protein');
  const fat = document.getElementById('fat');
  const calories = document.getElementById('calories');
  const estimate = document.getElementById('foodEstimate');
  if (!input || !protein || !fat || !calories || !estimate) return;

  const DB = [
    ['ayam',['ayam','chicken'],298,18.2,25,0,200],
    ['bebek',['bebek','itik','duck'],321,16,28.6,0,180],
    ['kulit ayam',['kulit ayam','sate kulit','keripik kulit ayam'],454,20,40,0,80,'estimasi'],
    ['sapi daging kurus',['sapi daging kurus','daging sapi kurus'],174,19.6,10,0,200],
    ['sapi lemak sedang',['sapi lemak sedang'],201,18.8,14,0,200],
    ['sapi daging gemuk',['sapi daging gemuk','daging sapi gemuk'],273,17.5,22,0,180],
    ['daging kerbau',['daging kerbau','kerbau'],79,18.7,.5,0,220],
    ['daging kambing',['daging kambing','kambing'],149,16.6,9.2,0,200],
    ['daging domba',['daging domba','domba'],202,17.1,14.8,0,190],
    ['ikan kembung',['ikan kembung','kembung'],125,21.3,3.4,2.2,220],
    ['ikan kakap',['ikan kakap','kakap'],92,20,.7,0,220],
    ['ikan bandeng',['ikan bandeng','bandeng'],123,20,4.8,0,220],
    ['ikan bawal',['ikan bawal','bawal'],91,19,1.7,0,220],
    ['ikan mujair',['ikan mujair','mujair','nila'],89,18.7,1,0,220],
    ['ikan patin',['ikan patin','patin'],132,17,6.6,1.1,220],
    ['ikan lemuru',['ikan lemuru','lemuru'],112,20,3,0,220],
    ['ikan layang',['ikan layang','layang'],109,22,1.7,0,220],
    ['ikan tembang',['ikan tembang','tembang'],204,16,15,0,200],
    ['ikan segar',['ikan segar','tongkol','lele segar'],113,17,4.5,0,220],
    ['lele goreng',['lele goreng'],252,19.9,19.1,0,180],
    ['cakalang asap',['cakalang asap'],204,34.2,5.6,1.9,160],
    ['teri kering',['teri kering','ikan teri kering'],170,33.4,3,0,50],
    ['udang',['udang','shrimp'],91,21,.2,.1,200],
    ['cumi',['cumi','cumi-cumi','squid'],75,16.1,.7,.1,200],
    ['udang rebon',['udang rebon','rebon'],81,16.2,1.2,.7,120],
    ['udang kering',['udang kering'],295,62.4,2.3,1.8,60],
    ['telur ayam',['telur ayam','telur','egg'],154,12.4,10.8,.7,150],
    ['telur asin',['telur asin'],195,13.6,13.6,1.4,120],
    ['hati ayam',['hati ayam','ati ayam'],261,27.4,16.1,1.6,100],
    ['babat sapi',['babat sapi','babat'],108,17.6,4.2,0,150],
    ['usus sapi',['usus sapi'],126,14,7.2,1.5,150],
    ['otak sapi',['otak sapi'],123,10.4,8.6,.8,140],
    ['ginjal sapi',['ginjal sapi'],137,15,8.1,.9,150],
    ['cheddar singles',['cheddar singles','cheddar single','keju cheddar slice','cheddar slice','keju slice','single cheese'],403,24.9,33.1,1.3,20,'dairy-relaxed'],
    ['mozzarella',['mozzarella','keju mozzarella'],300,22.2,22.4,2.2,30,'dairy-relaxed'],
    ['sosis sapi',['sosis sapi','beef sausage','sosis worst','worst'],448,14.5,42.3,2.3,120,'processed'],
    ['sosis hati',['sosis hati','liver sausage','liverwurst','liverworst','leverworst'],448,14.5,42.3,2.3,100,'processed-estimasi'],
    ['kornet sapi',['kornet sapi','corned beef','kornet'],289,16,25,0,120,'processed'],
    ['sarden kaleng',['sarden kaleng','sardines kaleng'],338,21.1,27,1,150,'processed'],
    ['daging sapi asap',['daging sapi asap','daging asap','sapi asap'],182,32,6,0,160,'processed'],
    ['tempe',['tempe','tempe goreng'],193,19,11,8,100,'regular'],
    ['tempe orek',['tempe orek','orek tempe'],220,12,12,18,100,'warteg-estimasi'],
    ['tempe balado',['tempe balado'],225,12,14,14,100,'warteg-estimasi'],
    ['tempe bacem',['tempe bacem'],210,11,10,20,100,'warteg-estimasi'],
    ['tahu',['tahu','tahu goreng'],145,10,10,4,100,'regular'],
    ['tahu balado',['tahu balado'],160,9,11,7,100,'warteg-estimasi'],
    ['tahu kecap',['tahu kecap'],155,8,9,10,100,'warteg-estimasi'],
    ['tahu cabe garam',['tahu cabe garam'],175,9,12,9,100,'warteg-estimasi'],
    ['kikil',['kikil','kikil tumis'],145,17,8,3,100,'warteg-estimasi'],
    ['kikil balado',['kikil balado'],155,18,8,4,100,'warteg-estimasi'],
    ['kikil cabe ijo',['kikil cabe ijo','kikil cabe hijau'],150,18,8,3,100,'warteg-estimasi'],
    ['teri goreng warteg',['teri goreng warteg','teri goreng'],290,33,15,6,50,'warteg-estimasi'],
    ['teri kacang',['teri kacang'],360,25,24,15,60,'warteg-estimasi'],
    ['tongkol balado',['tongkol balado'],180,23,9,4,120,'warteg-estimasi'],
    ['kembung balado',['kembung balado'],205,22,12,4,150,'warteg-estimasi'],
    ['telur balado',['telur balado'],190,12,14,5,100,'warteg-estimasi'],
    ['ayam balado',['ayam balado'],220,24,12,6,150,'warteg-estimasi'],
    ['ayam kecap',['ayam kecap'],210,22,10,10,150,'warteg-estimasi'],
    ['ayam opor',['ayam opor','opor ayam'],215,20,14,6,150,'warteg-estimasi'],
    ['rendang sapi',['rendang sapi','rendang'],280,23,20,6,120,'warteg-estimasi'],
    ['semur daging',['semur daging','semur sapi'],220,20,12,12,120,'warteg-estimasi'],
    ['perkedel kentang',['perkedel kentang','perkedel'],210,5,12,22,80,'warteg-estimasi'],
    ['tumis kangkung',['tumis kangkung','kangkung'],95,3,6,8,100,'warteg-estimasi'],
    ['capcay',['capcay','cap cay'],85,4,4,9,120,'warteg-estimasi']
  ].map(([name,aliases,kcal,p,f,c,g,note='']) => ({name,aliases,kcal,p,f,c,g,note}));

  const normalize = value => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/\b(air fryer|air-fryer|pan seared|pan-seared|panggang|bakar|goreng tallow|tumis tallow|grill|oven|rebus|kukus|asap|crispy|garam)\b/g,' ')
    .replace(/\s+/g,' ')
    .trim();

  function findFood(text) {
    const n = normalize(text);
    const matches = DB.filter(item => item.aliases.some(alias => n.includes(normalize(alias))));
    return matches.sort((a,b) => Math.max(...b.aliases.map(x=>x.length)) - Math.max(...a.aliases.map(x=>x.length)))[0];
  }

  function parsePart(part) {
    const food = findFood(part);
    if (!food) return null;
    const raw = String(part).toLowerCase();
    const gram = raw.match(/(\d+(?:[.,]\d+)?)\s*(kg|gram|grams|gr|g)\b/);
    const count = raw.match(/(\d+(?:[.,]\d+)?)\s*(butir|pcs|potong|tusuk|ekor|porsi|slice|lembar)\b/);
    let grams = food.g;
    if (gram) {
      const amount = Number(gram[1].replace(',','.'));
      grams = gram[2] === 'kg' ? amount * 1000 : amount;
    } else if (count && food.name.includes('telur')) {
      grams = Number(count[1].replace(',','.')) * 50;
    } else if (count && food.name.includes('cheddar singles')) {
      grams = Number(count[1].replace(',','.')) * 20;
    }
    const k = grams / 100;
    return { food, grams, kcal:food.kcal*k, p:food.p*k, f:food.f*k, c:food.c*k };
  }

  function identify(text) {
    const parts = String(text || '').split(/\s*(?:\+|,|;|\/|\||\n|\bdan\b|\bsama\b|\bplus\b|\bwith\b)\s*/i).filter(Boolean);
    const items = parts.map(parsePart).filter(Boolean);
    if (!items.length) return null;
    return items.reduce((t,x) => {
      t.kcal += x.kcal; t.p += x.p; t.f += x.f; t.c += x.c;
      t.labels.push(`${x.food.name} ${Math.round(x.grams)} g`);
      if (x.food.note) t.notes.add(x.food.note);
      return t;
    }, {kcal:0,p:0,f:0,c:0,labels:[],notes:new Set()});
  }

  input.addEventListener('input', () => {
    const result = identify(input.value);
    if (!result) return;
    calories.value = Math.round(result.kcal);
    protein.value = Math.round(result.p);
    fat.value = Math.round(result.f);
    const note = result.notes.size ? ` · ${[...result.notes].join(', ')}` : '';
    estimate.textContent = `DB lokal: ${Math.round(result.kcal)} kkal · ${Math.round(result.p)} g protein · ${Math.round(result.f)} g lemak · ${result.c.toFixed(1)} g karbo (${result.labels.join(' + ')})${note}`;
  });

  const list = document.createElement('datalist');
  list.id = 'localMenuIdentifiers';
  DB.forEach(item => {
    const option = document.createElement('option');
    option.value = item.name.replace(/\b\w/g, c => c.toUpperCase());
    list.appendChild(option);
  });
  document.body.appendChild(list);
  input.setAttribute('list', list.id);
})();
