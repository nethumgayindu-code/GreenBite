/* section */
gb.setupNav();
gb.enableReveal();
gb.registerSW();
document.getElementById('year').textContent = new Date().getFullYear();

/* section */
const levelSel = document.getElementById('level');
const focusSel = document.getElementById('focus');
const equipSel = document.getElementById('equipment');
const durSel   = document.getElementById('duration');
const genBtn   = document.getElementById('generate');
const clearBtn = document.getElementById('clear');
const wrap = document.getElementById('routineWrap');
const meta = document.getElementById('routineMeta');
const routineEl = document.getElementById('routine');

/* section */
const EXERCISES = [
  { id:'pushups',      name:'Push-ups',            focus:'upper', equip:'none',      diff:'any',          cues:'Hands under shoulders; body straight.' },
  { id:'incline-pu',   name:'Incline Push-ups',    focus:'upper', equip:'none',      diff:'beginner',     cues:'Hands on bench/wall, easier angle.' },
  { id:'db-row',       name:'Dumbbell Row',        focus:'upper', equip:'dumbbells', diff:'any',          cues:'Flat back; pull elbow to hip.' },
  { id:'shoulder-tap', name:'Shoulder Taps',       focus:'upper', equip:'none',      diff:'any',          cues:'Slow, hips steady.' },

  { id:'squats',       name:'Bodyweight Squat',    focus:'lower', equip:'none',      diff:'any',          cues:'Knees track toes; chest up.' },
  { id:'lunges',       name:'Alternating Lunge',   focus:'lower', equip:'none',      diff:'any',          cues:'Long step; light touch of back knee.' },
  { id:'glute-bridge', name:'Glute Bridge',        focus:'lower', equip:'mat',       diff:'any',          cues:'Squeeze at the top.' },
  { id:'db-squat',     name:'Goblet Squat',        focus:'lower', equip:'dumbbells', diff:'any',          cues:'Hold DB at chest.' },

  { id:'plank',        name:'Forearm Plank',       focus:'core',  equip:'mat',       diff:'any',          cues:'Neutral spine; squeeze glutes.' },
  { id:'deadbug',      name:'Dead Bug',            focus:'core',  equip:'mat',       diff:'beginner',     cues:'Low back pressed down.' },
  { id:'mountain',     name:'Mountain Climbers',   focus:'core',  equip:'none',      diff:'any',          cues:'Steady tempo; shoulders over hands.' },
  { id:'hollow',       name:'Hollow Hold',         focus:'core',  equip:'mat',       diff:'advanced',     cues:'Ribs down; lower back pressed.' },

  { id:'burpees',      name:'Burpees (no push-up)',focus:'full',  equip:'none',      diff:'advanced',     cues:'Land soft; keep a rhythm.' },
  { id:'jumping-jack', name:'Jumping Jacks',       focus:'full',  equip:'none',      diff:'any',          cues:'Light on feet; full range.' },
  { id:'db-clean',     name:'DB Clean & Press',    focus:'full',  equip:'dumbbells', diff:'intermediate', cues:'Core tight; use legs.' }
];

/* section */
function pickExercises({focus, equip, level, slots}){
  const allow = {
    beginner:     d => d==='beginner' || d==='any',
    intermediate: d => d!=='advanced',
    advanced:     d => true
  };
  let pool = EXERCISES.filter(e =>
    (focus==='full' ? true : e.focus === focus) &&
    (equip==='none' ? e.equip!=='dumbbells' : (equip==='mat' ? e.equip!=='dumbbells' : true)) &&
    allow[level](e.diff)
  );
  if(pool.length < slots){
    pool = EXERCISES.filter(e =>
      (equip==='dumbbells' ? true : (equip==='mat' ? e.equip!=='dumbbells' : e.equip!=='dumbbells')) &&
      allow[level](e.diff)
    );
  }
  if(pool.length < slots){
    pool = EXERCISES.filter(e => allow[level](e.diff));
  }
  const daySeed = (new Date()).getDay();
  pool.sort((a,b)=> ((a.id.charCodeAt(0)+daySeed)%7) - ((b.id.charCodeAt(0)+daySeed)%7));
  return pool.slice(0, slots);
}

/* section */
function prescription(level, duration, isTimed=false){
  const dur = Number(duration);
  if(isTimed){
    const sec = level==='advanced' ? 45 : level==='intermediate' ? 35 : 25;
    const rounds = dur>=30 ? 4 : dur>=20 ? 3 : 2;
    return { label:`${sec}s x ${rounds} rounds` };
  }else{
    const reps = level==='advanced' ? 15 : level==='intermediate' ? 12 : 10;
    const sets = dur>=30 ? 4 : dur>=20 ? 3 : 2;
    return { label:`${sets} x ${reps} reps` };
  }
}

/* section */
function renderRoutine(list, level, duration){
  routineEl.innerHTML = '';
  const timedIds = new Set(['plank','hollow','mountain','jumping-jack','burpees']);
  list.forEach(ex=>{
    const timed = timedIds.has(ex.id);
    const rx = prescription(level, duration, timed);
    const card = document.createElement('article');
    card.className = 'ex-card';
    card.innerHTML = `
      <div class="iconbox">🏃</div>
      <div style="display:flex; justify-content:space-between; align-items:center; gap:.5rem">
        <h3 style="margin:.25rem 0">${ex.name}</h3>
        <span class="pill">${ex.focus.replace(/^./,c=>c.toUpperCase())}</span>
      </div>
      <div class="muted">${ex.cues}</div>
      <div><strong>Prescription:</strong> ${rx.label}</div>
      <div style="display:flex; gap:.35rem; flex-wrap:wrap">
        <span class="tag">${ex.equip === 'none' ? 'No equipment' : ex.equip}</span>
        <span class="tag">${ex.diff === 'any' ? 'All levels' : ex.diff}</span>
      </div>
    `;
    routineEl.appendChild(card);
  });
}

/* section */
function generate(){
  const level = levelSel.value;
  const focus = focusSel.value;
  const equip = equipSel.value;
  const duration = durSel.value;
  const slots = duration >= 30 ? 8 : duration >= 20 ? 6 : 4;
  const picks = pickExercises({focus, equip, level, slots});
  renderRoutine(picks, level, duration);
  meta.textContent = `${level.replace(/^./,c=>c.toUpperCase())} • ${focus==='full'?'Full Body':focus.replace(/^./,c=>c.toUpperCase())} • ${equip==='none'?'No equipment':equip} • ~${duration} min`;
  wrap.style.display = 'block';
  gb.store.set('gb_workout_last', { level, focus, equip, duration });
  gb.toast('Routine generated 💪');
}

/* section */
genBtn.addEventListener('click', generate);
clearBtn.addEventListener('click', ()=>{
  wrap.style.display = 'none';
  routineEl.innerHTML = '';
  meta.textContent = '';
});

/* section */
(function restore(){
  const last = gb.store.get('gb_workout_last');
  if(!last) return;
  levelSel.value = last.level ?? 'beginner';
  focusSel.value = last.focus ?? 'full';
  equipSel.value = last.equip ?? 'none';
  durSel.value   = last.duration ?? '20';
})();
