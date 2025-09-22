// Home page only
gb.setupNav();
gb.enableReveal();
gb.registerSW();

$('#year').textContent = new Date().getFullYear();

// Rotating slogans
const slogans = [
  "Feel good, live better.",
  "Small habits. Big change.",
  "Eat bright. Move daily. Breathe deeply.",
  "Healthy can be simple."
];
gb.rotateText($('#rotating-text'), slogans, 2800);

// Tip of the Day
const tips = [
  "Add a handful of leafy greens to one meal.",
  "Drink a full glass of water right after waking.",
  "Take a 10-minute walk after lunch.",
  "Swap sugary drinks for sparkling water + lemon.",
  "Stretch your hips and chest for 5 minutes.",
  "Aim for a colorful plate: 3+ colors.",
  "Go to bed 20 minutes earlier tonight.",
  "Do 3 rounds of 10 squats, 10 pushups, 10 breaths.",
  "Keep fruit visible on your counter.",
  "Breathe 4-7-8 four times when stressed.",
  "Schedule tomorrow’s workout before dinner.",
  "Add protein to breakfast for steady energy.",
  "Stand up once every hour.",
  "Prep a snack: nuts + fruit."
];
$('#daily-tip').textContent = gb.tipOfDay(tips);

// Newsletter (localStorage)
$('#newsletter-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = $('#email').value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!ok){ gb.toast("Please enter a valid email"); return; }

  const list = gb.store.get('gb_newsletter', []);
  if(!list.includes(email)) list.push(email);
  gb.store.set('gb_newsletter', list);
  e.target.reset();
  gb.toast("You're on the list! ✅");
});
