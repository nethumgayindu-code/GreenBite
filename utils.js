// ============== GreenBite Utilities (vanilla JS) ==============
const $  = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const store = {
  get(key, fallback = null){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback }catch{ return fallback } },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)) }
};

function rotateText(el, items, ms = 3000){
  if(!el || !items?.length) return;
  let i = 0;
  el.textContent = items[0];
  setInterval(() => {
    i = (i + 1) % items.length;
    el.style.opacity = 0;
    setTimeout(()=>{ el.textContent = items[i]; el.style.opacity = 1; }, 220);
  }, ms);
}

function tipOfDay(tips){
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - start) / 86400000);
  return tips[day % tips.length];
}

function enableReveal(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, {threshold: 0.12});
  $$('.reveal').forEach(el=>obs.observe(el));
}

function setupNav(){
  const btn = $('.hamburger');
  const links = $('.nav-links');
  if(!btn || !links) return;
  btn.addEventListener('click', ()=>{
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

function toast(msg, ms=2000){
  let t = $('.toast');
  if(!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=> t.classList.remove('show'), ms);
}

function registerSW(){
  if(location.protocol.startsWith('http') && 'serviceWorker' in navigator){
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  }
}

window.gb = { $, $$, store, rotateText, tipOfDay, enableReveal, setupNav, toast, registerSW };
