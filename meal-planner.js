(() => {
  if (document.getElementById('mealPlannerBtn')) return;

  const PLAN_KEY = 'carnivore-meal-planner-v1';
  const TRACKER_KEY = 'carnivore-daily-v1';
  const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const SLOT_META = {
    breakfast: ['Breakfast', '☀️'],
    lunch: ['Lunch', '🍽️'],
    dinner: ['Dinner', '🌙']
  };

  // Database lokal ringkas yang diambil dari master pangan Indonesia di project menu.
  // Kulit ayam belum punya row TKPI khusus, jadi ditandai sebagai estimasi generik.
  const FOODS = {
    'ayam': {name:'Ayam',cat:'Poultry',kcal:298,p:18.2,f:25,c:0,level:'Strict',verified:true,g:200},
    'bebek-itik': {name:'Bebek',cat:'Poultry',kcal:321,p:16,f:28.6,c:0,level:'Strict',verified:true,g:180},
    'kulit-ayam-est': {name:'Kulit Ayam',cat:'Poultry',kcal:454,p:20,f:40,c:0,level:'Relaxed',verified:false,g:80},
    'sapi-kurus': {name:'Sapi Daging Kurus',cat:'Beef',kcal:174,p:19.6,f:10,c:0,level:'Strict',verified:true,g:200},
    'sapi-sedang': {name:'Sapi Lemak Sedang',cat:'Beef',kcal:201,p:18.8,f:14,c:0,level:'Strict',verified:true,g:200},
    'sapi-gemuk': {name:'Sapi Daging Gemuk',cat:'Beef',kcal:273,p:17.5,f:22,c:0,level:'Strict',verified:true,g:180},
    'kerbau': {name:'Daging Kerbau',cat:'Beef',kcal:79,p:18.7,f:.5,c:0,level:'Strict',verified:true,g:220},
    'kambing': {name:'Daging Kambing',cat:'Goat/Lamb',kcal:149,p:16.6,f:9.2,c:0,level:'Strict',verified:true,g:200},
    'domba': {name:'Daging Domba',cat:'Goat/Lamb',kcal:202,p:17.1,f:14.8,c:0,level:'Strict',verified:true,g:190},
    'kembung': {name:'Ikan Kembung',cat:'Fish',kcal:125,p:21.3,f:3.4,c:2.2,level:'Strict',verified:true,g:220},
    'kakap': {name:'Ikan Kakap',cat:'Fish',kcal:92,p:20,f:.7,c:0,level:'Strict',verified:true,g:220},
    'bandeng': {name:'Ikan Bandeng',cat:'Fish',kcal:123,p:20,f:4.8,c:0,level:'Strict',verified:true,g:220},
    'bawal': {name:'Ikan Bawal',cat:'Fish',kcal:91,p:19,f:1.7,c:0,level:'Strict',verified:true,g:220},
    'mujair': {name:'Ikan Mujair',cat:'Fish',kcal:89,p:18.7,f:1,c:0,level:'Strict',verified:true,g:220},
    'patin': {name:'Ikan Patin',cat:'Fish',kcal:132,p:17,f:6.6,c:1.1,level:'Strict',verified:true,g:220},
    'lemuru': {name:'Ikan Lemuru',cat:'Fish',kcal:112,p:20,f:3,c:0,level:'Strict',verified:true,g:220},
    'layang': {name:'Ikan Layang',cat:'Fish',kcal:109,p:22,f:1.7,c:0,level:'Strict',verified:true,g:220},
    'tembang': {name:'Ikan Tembang',cat:'Fish',kcal:204,p:16,f:15,c:0,level:'Strict',verified:true,g:200},
    'ikan-segar': {name:'Ikan Segar',cat:'Fish',kcal:113,p:17,f:4.5,c:0,level:'Strict',verified:false,g:220},
    'lele-goreng': {name:'Lele Goreng',cat:'Fish',kcal:252,p:19.9,f:19.1,c:0,level:'Relaxed',verified:false,g:180},
    'cakalang-asap': {name:'Cakalang Asap',cat:'Fish',kcal:204,p:34.2,f:5.6,c:1.9,level:'Relaxed',verified:true,g:160},
    'teri-kering': {name:'Teri Kering',cat:'Fish',kcal:170,p:33.4,f:3,c:0,level:'Relaxed',verified:false,g:50},
    'udang': {name:'Udang',cat:'Seafood',kcal:91,p:21,f:.2,c:.1,level:'Strict',verified:true,g:200},
    'cumi': {name:'Cumi',cat:'Seafood',kcal:75,p:16.1,f:.7,c:.1,level:'Strict',verified:true,g:200},
    'rebon': {name:'Udang Rebon',cat:'Seafood',kcal:81,p:16.2,f:1.2,c:.7,level:'Strict',verified:true,g:120},
    'udang-kering': {name:'Udang Kering',cat:'Seafood',kcal:295,p:62.4,f:2.3,c:1.8,level:'Relaxed',verified:false,g:60},
    'telur': {name:'Telur Ayam',cat:'Egg',kcal:154,p:12.4,f:10.8,c:.7,level:'Strict',verified:true,g:150},
    'telur-asin': {name:'Telur Asin',cat:'Egg',kcal:195,p:13.6,f:13.6,c:1.4,level:'Relaxed',verified:false,g:120},
    'hati-ayam': {name:'Hati Ayam',cat:'Offal',kcal:261,p:27.4,f:16.1,c:1.6,level:'Strict',verified:true,g:100},
    'babat': {name:'Babat Sapi',cat:'Offal',kcal:108,p:17.6,f:4.2,c:0,level:'Strict',verified:true,g:150},
    'usus-sapi': {name:'Usus Sapi',cat:'Offal',kcal:126,p:14,f:7.2,c:1.5,level:'Strict',verified:true,g:150},
    'otak-sapi': {name:'Otak Sapi',cat:'Offal',kcal:123,p:10.4,f:8.6,c:.8,level:'Strict',verified:true,g:140},
    'ginjal-sapi': {name:'Ginjal Sapi',cat:'Offal',kcal:137,p:15,f:8.1,c:.9,level:'Strict',verified:true,g:150},
    'sosis-sapi': {name:'Sosis Sapi',cat:'Processed',kcal:448,p:14.5,f:42.3,c:2.3,level:'Relaxed',verified:false,g:120},
    'kornet-sapi': {name:'Kornet Sapi',cat:'Processed',kcal:289,p:16,f:25,c:0,level:'Relaxed',verified:false,g:120},
    'sarden-kaleng': {name:'Sarden Kaleng',cat:'Processed',kcal:338,p:21.1,f:27,c:1,level:'Relaxed',verified:false,g:150},
    'daging-asap': {name:'Daging Sapi Asap',cat:'Processed',kcal:182,p:32,f:6,c:0,level:'Relaxed',verified:false,g:160}
  };

  const PREPS = [
    {name:'Bakar',slug:'bakar'},
    {name:'Air Fryer',slug:'air-fryer'},
    {name:'Panggang',slug:'panggang'},
    {name:'Pan-Seared',slug:'pan-seared'}
  ];
  const SIDES = [
    {slug:'telur',g:100},
    {slug:'hati-ayam',g:80},
    {slug:'udang',g:100},
    {slug:'cumi',g:100},
    {slug:'babat',g:100}
  ];

  const slugify = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const combineLevel = (a,b) => a === 'Ketovore' || b === 'Ketovore' ? 'Ketovore' : (a === 'Relaxed' || b === 'Relaxed' ? 'Relaxed' : 'Strict');
  const component = (slug, grams) => ({slug, grams, food:FOODS[slug]});
  const nutrition = components => components.reduce((t,x) => {
    const k = x.grams / 100;
    t.kcal += x.food.kcal*k; t.p += x.food.p*k; t.f += x.food.f*k; t.c += x.food.c*k; t.g += x.grams;
    if (!x.food.verified) t.estimated = true;
    return t;
  }, {kcal:0,p:0,f:0,c:0,g:0,estimated:false});

  function compatible(main, side) {
    if (main === side) return false;
    const cat = FOODS[main].cat;
    if (side === 'telur') return true;
    if (side === 'hati-ayam') return ['Poultry','Beef','Goat/Lamb','Offal','Processed'].includes(cat);
    if (side === 'udang' || side === 'cumi') return ['Poultry','Beef','Fish','Seafood','Processed'].includes(cat);
    if (side === 'babat') return ['Beef','Goat/Lamb','Offal','Processed'].includes(cat);
    return false;
  }

  const MENUS = [];
  Object.entries(FOODS).forEach(([slug,food]) => {
    PREPS.forEach(prep => {
      const components = [component(slug, food.g)];
      MENUS.push({
        id:`single-${slug}-${prep.slug}`,
        name:`${food.name} ${prep.name}`,
        level:food.level,
        category:food.cat,
        prep:prep.name,
        components,
        nutrition:nutrition(components)
      });
    });
    if (food.cat === 'Egg') return;
    SIDES.forEach(side => {
      if (!compatible(slug, side.slug)) return;
      PREPS.forEach(prep => {
        const sideFood = FOODS[side.slug];
        const components = [component(slug, food.g), component(side.slug, side.g)];
        MENUS.push({
          id:`combo-${slug}-${side.slug}-${prep.slug}`,
          name:`${food.name} ${prep.name} + ${sideFood.name}`,
          level:combineLevel(food.level, sideFood.level),
          category:food.cat,
          prep:prep.name,
          components,
          nutrition:nutrition(components)
        });
      });
    });
  });

  const MENU_BY_ID = new Map(MENUS.map(m => [m.id,m]));
  const mealSlots = count => count === 2 ? ['lunch','dinner'] : ['breakfast','lunch','dinner'];
  const isBreakfast = menu => ['Egg','Poultry','Offal','Processed'].includes(menu.category) || /telur|sosis|kornet|hati|ampela/i.test(menu.name);
  const eligible = (level,slot) => MENUS.filter(m => (level === 'Semua' || m.level === level) && (slot !== 'breakfast' || isBreakfast(m)));
  const randomItem = arr => arr[Math.floor(Math.random()*arr.length)];

  function pick(level,slot,used,avoid) {
    const pool = eligible(level,slot);
    let candidates = pool.filter(m => !used.has(m.id) && m.id !== avoid);
    if (!candidates.length) candidates = pool.filter(m => m.id !== avoid);
    if (!candidates.length) candidates = pool;
    return randomItem(candidates);
  }

  function generateWeek(count,level) {
    const used = new Set();
    return DAYS.map(() => {
      const day = {};
      mealSlots(count).forEach(slot => {
        const menu = pick(level,slot,used);
        if (menu) { day[slot]=menu.id; used.add(menu.id); }
      });
      return day;
    });
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(PLAN_KEY)||'null');
      if (parsed && Array.isArray(parsed.plan) && parsed.plan.length === 7) return parsed;
    } catch {}
    return {count:3,level:'Semua',active:0,plan:generateWeek(3,'Semua')};
  }

  let state = loadState();
  state.count = state.count === 2 ? 2 : 3;
  if (!['Semua','Strict','Relaxed','Ketovore'].includes(state.level)) state.level='Semua';
  state.active = Math.min(6,Math.max(0,Number(state.active)||0));
  const saveState = () => localStorage.setItem(PLAN_KEY,JSON.stringify(state));

  const style = document.createElement('style');
  style.textContent = `
    .meal-planner-btn{border:0;cursor:pointer;border-radius:999px;background:#1e7a54;color:#fff;font:inherit;font-weight:800;padding:8px 13px;white-space:nowrap}
    .mp-overlay{position:fixed;inset:0;z-index:100001;background:rgba(10,18,14,.82);display:none;padding:12px;overflow:auto}.mp-overlay.open{display:block}
    .mp-shell{width:min(980px,100%);margin:0 auto;background:#f8f8f3;border-radius:18px;min-height:calc(100vh - 24px);overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.25)}
    .mp-top{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px 16px;background:#fff;border-bottom:1px solid #e2e7de}.mp-top strong{font-size:1rem}.mp-close{background:#edf0ea!important;color:#1c2420!important;padding:8px 11px!important}
    .mp-body{padding:20px}.mp-hero{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:15px}.mp-hero h2{font-size:clamp(1.55rem,4vw,2.3rem);letter-spacing:-.04em;margin:2px 0}.mp-kicker{font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#1e7a54}.mp-controls{display:grid;grid-template-columns:1fr 1fr auto;gap:10px;background:#fff;border:1px solid #e2e7de;border-radius:15px;padding:12px;margin-bottom:14px}.mp-controls label{font-size:.73rem}.mp-controls select{height:40px;border:1px solid #e2e7de;border-radius:9px;background:#fff;padding:0 10px;font:inherit;color:#1c2420}.mp-generate{align-self:end;height:40px}
    .mp-days{display:grid;grid-template-columns:repeat(7,1fr);background:#fff;border:1px solid #e2e7de;border-radius:15px;overflow:hidden;margin-bottom:14px}.mp-day{border:0!important;border-right:1px solid #e2e7de!important;border-radius:0!important;background:#fff!important;color:#65716a!important;padding:11px 3px!important;font-size:.78rem!important}.mp-day:last-child{border-right:0!important}.mp-day.active{background:#1e7a54!important;color:#fff!important}.mp-day small{display:block;font-size:.6rem;font-weight:500;opacity:.78;margin-top:2px}
    .mp-panel{background:#fff;border:1px solid #e2e7de;border-radius:16px;overflow:hidden}.mp-dayhead{padding:16px;border-bottom:1px solid #e2e7de;background:#f1f6f2}.mp-dayhead-row{display:flex;justify-content:space-between;align-items:center;gap:12px}.mp-dayhead h3{margin:0;font-size:1.25rem}.mp-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}.mp-macro{background:#fff;border:1px solid #e2e7de;border-radius:10px;text-align:center;padding:8px 5px}.mp-macro span{display:block;font-size:.61rem;text-transform:uppercase;color:#65716a}.mp-macro b{display:block;margin-top:2px;font-size:.92rem}.mp-goal{margin-top:9px;font-size:.75rem;color:#65716a}.mp-goal b{color:#1e7a54}
    .mp-meal{padding:15px 16px;border-bottom:1px solid #e2e7de}.mp-meal:last-child{border-bottom:0}.mp-meal-grid{display:grid;grid-template-columns:42px 1fr;gap:11px}.mp-icon{width:42px;height:42px;display:grid;place-items:center;background:#edf0ea;border-radius:11px;font-size:1.15rem}.mp-label{font-size:.65rem;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:#1e7a54}.mp-title-row{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.mp-title{font-weight:800;margin-top:2px}.mp-components{margin-top:3px;color:#65716a;font-size:.73rem}.mp-nutrients{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;color:#65716a;font-size:.72rem}.mp-nutrients b{color:#1c2420}.mp-actions{display:flex;gap:6px;flex-wrap:wrap}.mp-actions button{padding:6px 8px!important;font-size:.7rem!important}.mp-actions .mp-secondary{background:#edf0ea!important;color:#1c2420!important}.mp-warning{color:#a56824;font-weight:700}.mp-foot{margin:12px 2px 0;color:#65716a;font-size:.72rem;text-align:center}
    @media(max-width:650px){.mp-overlay{padding:5px}.mp-shell{min-height:calc(100vh - 10px);border-radius:13px}.mp-body{padding:13px}.mp-hero{align-items:flex-start;flex-direction:column}.mp-controls{grid-template-columns:1fr 1fr}.mp-generate{grid-column:1/-1}.mp-title-row{flex-direction:column}.mp-summary{gap:5px}.mp-macro{padding:7px 2px}.meal-planner-btn{flex:1}.mp-top{padding:10px 12px}}
  `;
  document.head.appendChild(style);

  const wrap = document.querySelector('.generate-output-wrap') || document.querySelector('header');
  if (!wrap) return;
  const button = document.createElement('button');
  button.id = 'mealPlannerBtn';
  button.type = 'button';
  button.className = 'meal-planner-btn';
  button.textContent = 'Meal Planner';
  wrap.appendChild(button);

  const overlay = document.createElement('div');
  overlay.className='mp-overlay';
  overlay.id='mealPlannerOverlay';
  overlay.innerHTML=`<div class="mp-shell"><div class="mp-top"><strong>7-Day Meal Planner · Indonesia</strong><button type="button" class="mp-close" id="mpClose">✕ Tutup</button></div><div class="mp-body" id="mpBody"></div></div>`;
  document.body.appendChild(overlay);
  const body = overlay.querySelector('#mpBody');

  function trackerGoal() {
    try { return Number(JSON.parse(localStorage.getItem(TRACKER_KEY)||'null')?.settings?.proteinGoal)||0; } catch { return 0; }
  }
  function mondayOfCurrentWeek() {
    const d=new Date(); d.setHours(12,0,0,0); const offset=(d.getDay()+6)%7; d.setDate(d.getDate()-offset); return d;
  }
  function dateForDay(index) {
    const d=mondayOfCurrentWeek(); d.setDate(d.getDate()+index); return d.toISOString().slice(0,10);
  }
  function dailyMeals() {
    const day=state.plan[state.active]||{};
    return mealSlots(state.count).map(slot=>({slot,menu:MENU_BY_ID.get(day[slot])})).filter(x=>x.menu);
  }
  function dailyTotal() {
    return dailyMeals().reduce((t,x)=>{t.kcal+=x.menu.nutrition.kcal;t.p+=x.menu.nutrition.p;t.f+=x.menu.nutrition.f;t.c+=x.menu.nutrition.c;return t;},{kcal:0,p:0,f:0,c:0});
  }
  const fmt = n => Math.round(n);

  function randomizeMeal(slot) {
    const day=state.plan[state.active]||{};
    const used=new Set(Object.values(day));
    if(day[slot])used.delete(day[slot]);
    const menu=pick(state.level,slot,used,day[slot]);
    if(menu){state.plan[state.active]={...day,[slot]:menu.id};saveState();render();}
  }
  function randomizeDay() {
    const used=new Set(state.plan.flatMap((d,i)=>i===state.active?[]:Object.values(d)));
    const next={};
    mealSlots(state.count).forEach(slot=>{const menu=pick(state.level,slot,used);if(menu){next[slot]=menu.id;used.add(menu.id);}});
    state.plan[state.active]=next;saveState();render();
  }
  function randomizeWeek() { state.plan=generateWeek(state.count,state.level);saveState();render(); }

  function logMenu(menu) {
    const food=document.getElementById('food');
    const protein=document.getElementById('protein');
    const fat=document.getElementById('fat');
    const calories=document.getElementById('calories');
    const date=document.getElementById('date');
    const prep=document.getElementById('preparation');
    const estimate=document.getElementById('foodEstimate');
    if(!food||!protein||!fat||!calories)return;
    food.value=menu.name;
    protein.value=fmt(menu.nutrition.p);
    fat.value=fmt(menu.nutrition.f);
    calories.value=fmt(menu.nutrition.kcal);
    if(date)date.value=dateForDay(state.active);
    if(prep)prep.value='cooked';
    if(estimate)estimate.textContent=`Dari Meal Planner: ${fmt(menu.nutrition.kcal)} kkal · ${fmt(menu.nutrition.p)} g protein · ${fmt(menu.nutrition.f)} g lemak${menu.nutrition.estimated?' · ada komponen estimasi':''}`;
    close();
    document.getElementById('logForm')?.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>food.focus(),350);
  }

  function macro(label,value,unit){return `<div class="mp-macro"><span>${label}</span><b>${value}${unit?` <small>${unit}</small>`:''}</b></div>`;}
  function render() {
    const total=dailyTotal();
    const goal=trackerGoal();
    const goalText=goal?`Target protein tracker: <b>${goal} g</b> · plan hari ini ${fmt(total.p)} g (${total.p>=goal?`+${fmt(total.p-goal)}`:`-${fmt(goal-total.p)}`} g).`:'Isi target protein di Carnivore Daily untuk membandingkan plan.';
    body.innerHTML=`
      <section class="mp-hero"><div><div class="mp-kicker">Local meal database</div><h2>7-Day Meal Plan</h2><p class="muted">${MENUS.length} pilihan menu lokal · ayam, bebek, sapi, ikan, seafood, jeroan, sosis, kornet, kulit, telur.</p></div></section>
      <section class="mp-controls">
        <label>Frekuensi makan<select id="mpCount"><option value="2" ${state.count===2?'selected':''}>2× / hari</option><option value="3" ${state.count===3?'selected':''}>3× / hari</option></select></label>
        <label>Level<select id="mpLevel"><option ${state.level==='Semua'?'selected':''}>Semua</option><option ${state.level==='Strict'?'selected':''}>Strict</option><option ${state.level==='Relaxed'?'selected':''}>Relaxed</option><option ${state.level==='Ketovore'?'selected':''}>Ketovore</option></select></label>
        <button type="button" class="mp-generate" id="mpWeek">🎲 Generate 7 Hari</button>
      </section>
      <div class="mp-days">${DAYS.map((d,i)=>`<button type="button" class="mp-day ${state.active===i?'active':''}" data-day="${i}">${d}<small>${dateForDay(i).slice(8,10)}</small></button>`).join('')}</div>
      <section class="mp-panel">
        <div class="mp-dayhead"><div class="mp-dayhead-row"><div><h3>${DAY_NAMES[state.active]}</h3><div class="muted" style="font-size:.75rem">${dateForDay(state.active)} · ${state.count} kali makan · ${state.level}</div></div><button type="button" class="secondary" id="mpDay">↻ Acak Hari</button></div><div class="mp-summary">${macro('Kalori',fmt(total.kcal),'kcal')}${macro('Protein',fmt(total.p),'g')}${macro('Lemak',fmt(total.f),'g')}${macro('Karbo',total.c.toFixed(1),'g')}</div><div class="mp-goal">${goalText}</div></div>
        <div>${dailyMeals().map(({slot,menu})=>{
          const meta=SLOT_META[slot];
          const comps=menu.components.map(x=>`${x.food.name} ${fmt(x.grams)} g`).join(' + ');
          return `<article class="mp-meal"><div class="mp-meal-grid"><div class="mp-icon">${meta[1]}</div><div><div class="mp-title-row"><div><div class="mp-label">${meta[0]}</div><div class="mp-title">${menu.name}</div><div class="mp-components">${comps}</div></div><div class="mp-actions"><button type="button" class="mp-secondary" data-reroll="${slot}">↻ Ganti</button><button type="button" data-log="${menu.id}">+ Daily Log</button></div></div><div class="mp-nutrients"><span><b>${fmt(menu.nutrition.kcal)}</b> kcal</span><span><b>${fmt(menu.nutrition.p)}</b> g protein</span><span><b>${fmt(menu.nutrition.f)}</b> g lemak</span><span>${menu.level}</span>${menu.nutrition.estimated?'<span class="mp-warning">⚠ ada estimasi</span>':''}</div></div></div></article>`;
        }).join('')}</div>
      </section>
      <div class="mp-foot">Planner tersimpan di browser. Angka menu kulit dan beberapa processed food ditandai estimasi/pending; nilai menu lainnya berasal dari database pangan lokal yang dipindahkan ke app ini.</div>`;

    body.querySelectorAll('[data-day]').forEach(x=>x.addEventListener('click',()=>{state.active=Number(x.dataset.day);saveState();render();}));
    body.querySelectorAll('[data-reroll]').forEach(x=>x.addEventListener('click',()=>randomizeMeal(x.dataset.reroll)));
    body.querySelectorAll('[data-log]').forEach(x=>x.addEventListener('click',()=>{const menu=MENU_BY_ID.get(x.dataset.log);if(menu)logMenu(menu);}));
    body.querySelector('#mpWeek').addEventListener('click',randomizeWeek);
    body.querySelector('#mpDay').addEventListener('click',randomizeDay);
    body.querySelector('#mpCount').addEventListener('change',e=>{state.count=Number(e.target.value)===2?2:3;state.plan=generateWeek(state.count,state.level);saveState();render();});
    body.querySelector('#mpLevel').addEventListener('change',e=>{state.level=e.target.value;state.plan=generateWeek(state.count,state.level);saveState();render();});
  }

  const open=()=>{render();overlay.classList.add('open');document.body.style.overflow='hidden';};
  const close=()=>{overlay.classList.remove('open');document.body.style.overflow='';};
  button.addEventListener('click',open);
  overlay.querySelector('#mpClose').addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close();});
})();
