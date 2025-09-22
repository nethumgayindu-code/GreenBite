
gb.setupNav();
gb.enableReveal();
gb.registerSW();
document.getElementById('year').textContent = new Date().getFullYear();

const grid = document.getElementById('grid');
const q = document.getElementById('q');
const cat = document.getElementById('cat');
const clearBtn = document.getElementById('clear');


const IMG_BASE = 'assets/images/recipes/';


const chip = (t) => `<span class="tag" style="font-size:.78rem; background:#e2f6ea; color:#065f46; padding:.2rem .5rem; border-radius:999px; border:1px solid #bbf7d0">${t}</span>`;


const RECIPES = [
  {
    id: 'oats-berry',
    title: 'Overnight Oats with Berries',
    categories: ['Breakfast','Vegetarian','High-Protein'],
    desc: 'Creamy oats soaked overnight, topped with fresh berries and seeds.',
    img: IMG_BASE + 'oats.jpg',        
    ingredients: [
      '1/2 cup rolled oats','1/2 cup milk (or oat milk)','2 tbsp yogurt',
      '1 tsp chia seeds','Handful mixed berries','1 tsp honey (optional)'
    ],
    steps: [
      'Stir oats, milk, yogurt, and chia in a jar.',
      'Refrigerate overnight (or at least 4 hours).',
      'Top with berries and drizzle honey before serving.'
    ],
    nutrition: { Calories:'360 kcal', Protein:'16 g', Carbs:'55 g', Fat:'9 g', Fiber:'9 g' }
  },
  {
    id: 'quinoa-bowl',
    title: 'Quinoa Power Bowl',
    categories: ['Lunch','Vegan','High-Protein','Low-Carb'],
    desc: 'Fluffy quinoa with roasted veg, chickpeas, and lemon-tahini.',
    img: IMG_BASE + 'quinoa-bowl.jpg', 
    ingredients: [
      '1 cup cooked quinoa','1 cup roasted vegetables','1/2 cup chickpeas',
      '2 tbsp tahini','1 tbsp lemon juice','Salt & pepper'
    ],
    steps: [
      'Whisk tahini with lemon and a splash of water.',
      'Combine quinoa, veg, and chickpeas.',
      'Dress, season, and toss.'
    ],
    nutrition: { Calories:'420 kcal', Protein:'18 g', Carbs:'58 g', Fat:'12 g', Fiber:'10 g' }
  },
  {
    id: 'salmon-tray',
    title: 'Lemon Herb Salmon Traybake',
    categories: ['Dinner','High-Protein','Low-Carb'],
    desc: 'One-pan salmon with potatoes and green beans — zesty and simple.',
    img: IMG_BASE + 'salmon-tray.jpg',
    ingredients: [
      '2 salmon fillets','200 g baby potatoes','150 g green beans',
      '1 lemon (zest & slices)','1 tbsp olive oil','Salt, pepper, herbs'
    ],
    steps: [
      'Roast potatoes 15 min at 200°C.',
      'Add beans, salmon, oil, lemon; roast 12–14 min.',
      'Finish with herbs and zest.'
    ],
    nutrition: { Calories:'510 kcal', Protein:'35 g', Carbs:'34 g', Fat:'24 g', Fiber:'6 g' }
  },
  {
    id: 'hummus-wrap',
    title: 'Crunchy Hummus Wrap',
    categories: ['Lunch','Vegetarian'],
    desc: 'Wholegrain wrap with hummus, cucumber, carrot and greens.',
    img: IMG_BASE + 'hummus-wrap.jpg',
    ingredients: [
      '1 wholegrain wrap','3 tbsp hummus','1/2 cucumber (sliced)',
      '1 carrot (ribbons)','Handful spinach','Pinch of salt'
    ],
    steps: [
      'Spread hummus over the wrap.',
      'Layer veg and roll tightly.',
      'Halve and serve.'
    ],
    nutrition: { Calories:'390 kcal', Protein:'12 g', Carbs:'55 g', Fat:'12 g', Fiber:'9 g' }
  }
];

// Render grid
function render(recipes){
  grid.innerHTML = '';
  if(!recipes.length){
    grid.innerHTML = `<p class="lead">No recipes found. Try clearing filters.</p>`;
    return;
  }
  recipes.forEach(r=>{
    const card = document.createElement('article');
    card.className = 'card reveal';
    card.tabIndex = 0;
    card.setAttribute('role','button');
    card.setAttribute('aria-label', `Open recipe ${r.title}`);
    card.innerHTML = `
      <img src="${r.img}" alt="${r.title}" style="width:100%; height:160px; object-fit:cover; border-radius:10px">
      <h3 style="margin:.5rem 0 0">${r.title}</h3>
      <small style="color:var(--muted)">${r.desc}</small>
      <div class="tags" style="display:flex; flex-wrap:wrap; gap:.35rem; margin-top:.4rem">${r.categories.map(chip).join('')}</div>
    `;
    card.addEventListener('click', ()=> openModal(r));
    card.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openModal(r); }});
    grid.appendChild(card);
  });
  gb.enableReveal();
}

// Filtering
function applyFilters(){
  const term = q.value.trim().toLowerCase();
  const catVal = cat.value;
  const out = RECIPES.filter(r=>{
    const matchesText = !term || r.title.toLowerCase().includes(term);
    const matchesCat = catVal === 'all' || r.categories.includes(catVal);
    return matchesText && matchesCat;
  });
  render(out);
}

q.addEventListener('input', applyFilters);
cat.addEventListener('change', applyFilters);
clearBtn.addEventListener('click', ()=>{
  q.value = ''; cat.value = 'all'; applyFilters();
});

// Modal logic
const backdrop = document.getElementById('backdrop');
const closeBtn = document.getElementById('close');
const dlgTitle = document.getElementById('dlg-title');
const dlgCats = document.getElementById('dlg-cats');
const dlgImg = document.getElementById('dlg-img');
const dlgDesc = document.getElementById('dlg-desc');
const dlgTags = document.getElementById('dlg-tags');
const dlgIngs = document.getElementById('dlg-ings');
const dlgSteps = document.getElementById('dlg-steps');
const dlgNutrition = document.getElementById('dlg-nutrition');

let lastFocus = null;

function openModal(r){
  lastFocus = document.activeElement;
  dlgTitle.textContent = r.title;
  dlgCats.textContent = r.categories.join(' · ');
  dlgImg.src = r.img; dlgImg.alt = r.title;
  dlgDesc.textContent = r.desc;
  dlgTags.innerHTML = r.categories.map(chip).join('');
  dlgIngs.innerHTML = r.ingredients.map(i=>`<li>${i}</li>`).join('');
  dlgSteps.innerHTML = r.steps.map(s=>`<li>${s}</li>`).join('');
  dlgNutrition.innerHTML = Object.entries(r.nutrition).map(([k,v])=>`<tr>
      <td style="border:1px solid #e2e8f0; padding:.5rem">${k}</td>
      <td style="border:1px solid #e2e8f0; padding:.5rem">${v}</td>
    </tr>`).join('');

  backdrop.style.display = 'flex';
  backdrop.setAttribute('aria-hidden','false');
  closeBtn.focus();
  document.addEventListener('keydown', onEsc);
}

function closeModal(){
  backdrop.style.display = 'none';
  backdrop.setAttribute('aria-hidden','true');
  document.removeEventListener('keydown', onEsc);
  if(lastFocus) lastFocus.focus();
}

function onEsc(e){
  if(e.key === 'Escape') closeModal();
}

backdrop.addEventListener('click', (e)=>{ if(e.target === backdrop) closeModal(); });
closeBtn.addEventListener('click', closeModal);

// initial render
render(RECIPES);
applyFilters();
