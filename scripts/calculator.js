// Calculator page only (Mifflin–St Jeor + TDEE + 50/20/30 macros)
gb.setupNav();
gb.enableReveal();
gb.registerSW();

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('calc-form');
const resetBtn = document.getElementById('reset');
const sex = document.getElementById('sex');
const age = document.getElementById('age');
const height = document.getElementById('height');
const heightUnit = document.getElementById('heightUnit');
const weight = document.getElementById('weight');
const weightUnit = document.getElementById('weightUnit');
const activity = document.getElementById('activity');
const goal = document.getElementById('goal');

const results = document.getElementById('results');
const bmrEl = document.getElementById('bmr');
const tdeeEl = document.getElementById('tdee');
const targetEl = document.getElementById('target');
const targetNote = document.getElementById('targetNote');

const carbKcal = document.getElementById('carbKcal');
const protKcal = document.getElementById('protKcal');
const fatKcal  = document.getElementById('fatKcal');
const carbG = document.getElementById('carbG');
const protG = document.getElementById('protG');
const fatG  = document.getElementById('fatG');

const barCarbs = document.getElementById('barCarbs');
const barProtein = document.getElementById('barProtein');
const barFat = document.getElementById('barFat');

// helpers
function toNumber(input){
  const v = Number(input.value);
  return Number.isFinite(v) ? v : NaN;
}
function cmValue(){
  const h = toNumber(height);
  return heightUnit.value === 'cm' ? h : h * 2.54;
}
function kgValue(){
  const w = toNumber(weight);
  return weightUnit.value === 'kg' ? w : w * 0.45359237;
}
function round(n, d=0){ const p = 10**d; return Math.round(n*p)/p; }
function showToast(msg){ gb.toast(msg); }

// BMR (Mifflin–St Jeor)
function calcBMR(sex, kg, cm, years){
  // male: 10W + 6.25H − 5A + 5
  // female: 10W + 6.25H − 5A − 161
  const base = 10*kg + 6.25*cm - 5*years;
  return sex === 'male' ? base + 5 : base - 161;
}

function updateBars(){
  // bars are fixed 50/20/30
  barCarbs.style.width = '50%';
  barProtein.style.width = '20%';
  barFat.style.width = '30%';
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();

  const years = toNumber(age);
  const kg = kgValue();
  const cm = cmValue();

  if(!years || !kg || !cm){
    showToast('Please fill valid numbers for age, height, and weight.');
    return;
  }

  const bmr = calcBMR(sex.value, kg, cm, years);
  const tdee = bmr * Number(activity.value);
  const delta = Number(goal.value); // ± kcal
  const target = tdee + delta;

  // Macros: 50/20/30 of target kcal (4/4/9 kcal per g)
  const carbsK = target * 0.50;
  const protK  = target * 0.20;
  const fatK   = target * 0.30;

  const carbsG = carbsK / 4;
  const protGm = protK / 4;
  const fatGm  = fatK / 9;

  // update UI
  bmrEl.textContent = round(bmr);
  tdeeEl.textContent = round(tdee);
  targetEl.textContent = round(target);
  targetNote.textContent = delta === 0 ? '(maintain)'
                        : (delta > 0 ? `(+${delta} kcal from TDEE)` : `(${delta} kcal from TDEE)`);

  carbKcal.textContent = round(carbsK);
  protKcal.textContent = round(protK);
  fatKcal.textContent  = round(fatK);

  carbG.textContent = round(carbsG);
  protG.textContent = round(protGm);
  fatG.textContent  = round(fatGm);

  updateBars();
  results.style.display = 'block';

  // persist last inputs (optional convenience)
  const snap = {
    sex: sex.value, age: years, height: toNumber(height), heightUnit: heightUnit.value,
    weight: toNumber(weight), weightUnit: weightUnit.value, activity: activity.value, goal: goal.value
  };
  gb.store.set('gb_calc_last', snap);
});

resetBtn.addEventListener('click', ()=>{
  form.reset();
  results.style.display = 'none';
  targetNote.textContent = '';
  // restore defaults
  activity.value = '1.55';
  heightUnit.value = 'cm';
  weightUnit.value = 'kg';
});

// restore last inputs if available
(function restore(){
  const last = gb.store.get('gb_calc_last');
  if(!last) return;
  sex.value = last.sex ?? 'male';
  age.value = last.age ?? '';
  height.value = last.height ?? '';
  heightUnit.value = last.heightUnit ?? 'cm';
  weight.value = last.weight ?? '';
  weightUnit.value = last.weightUnit ?? 'kg';
  activity.value = last.activity ?? '1.55';
  goal.value = last.goal ?? '0';
})();
