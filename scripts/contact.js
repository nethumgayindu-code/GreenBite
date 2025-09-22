/* section */
gb.setupNav();
gb.enableReveal();
gb.registerSW();
document.getElementById('year').textContent = new Date().getFullYear();

/* section */
const form = document.getElementById('contact-form');
const clearBtn = document.getElementById('clear');
const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');
const subjectEl = document.getElementById('subject');
const msgEl = document.getElementById('message');
const savedBox = document.getElementById('saved');

/* section */
function loadMessages(){
  const list = gb.store.get('gb_contact_msgs', []);
  if(!list.length){ savedBox.textContent = 'No messages yet.'; return; }
  savedBox.innerHTML = list.map(m => {
    const d = new Date(m.ts).toLocaleString();
    return `<div style="margin:.5rem 0; padding:.5rem; border:1px solid #e2e8f0; border-radius:10px; background:#fff">
      <strong>${m.name}</strong> · <span class="muted">${m.email}</span><br>
      <em>${m.subject || 'No subject'}</em><br>
      <span>${m.message.replace(/</g,'&lt;')}</span><br>
      <small class="muted">${d}</small>
    </div>`;
  }).join('');
}

/* section */
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const subject = subjectEl.value.trim();
  const message = msgEl.value.trim();

  if(!name || !email || !message){
    gb.toast('Please fill name, email, and message.');
    return;
  }
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!ok){
    gb.toast('Please enter a valid email.');
    return;
  }

  const list = gb.store.get('gb_contact_msgs', []);
  list.unshift({ name, email, subject, message, ts: Date.now() });
  gb.store.set('gb_contact_msgs', list);

  form.reset();
  loadMessages();
  gb.toast('Message saved locally ✅');
});

/* section */
clearBtn.addEventListener('click', ()=>{
  form.reset();
});

/* section */
loadMessages();
