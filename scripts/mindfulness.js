/* section */
gb.setupNav();
gb.enableReveal();
gb.registerSW();
document.getElementById('year').textContent = new Date().getFullYear();

/* section */
const display = document.getElementById('display');
const minsInput = document.getElementById('minutes');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const chime = document.getElementById('chime');
let timer = null;
let remaining = 0;

/* section */
function format(sec){
  const m = String(Math.floor(sec/60)).padStart(2,'0');
  const s = String(sec%60).padStart(2,'0');
  return `${m}:${s}`;
}

/* section */
function tick(){
  if(remaining <= 0){
    clearInterval(timer);
    timer = null;
    display.textContent = '00:00';
    chime.currentTime = 0;
    chime.play().catch(()=>{});
    gb.toast("Time's up 🧘");
    return;
  }
  display.textContent = format(remaining);
  remaining--;
}

/* section */
startBtn.addEventListener('click', ()=>{
  if(timer){ gb.toast('Timer already running'); return; }
  const mins = Number(minsInput.value);
  if(!mins || mins<1){ gb.toast('Enter minutes ≥1'); return; }
  remaining = mins*60;
  tick();
  timer = setInterval(tick, 1000);
});

/* section */
resetBtn.addEventListener('click', ()=>{
  clearInterval(timer);
  timer = null;
  display.textContent = '00:00';
});
