/* NAV transparence -> solide au scroll + bouton haut */
const snapContainer = document.querySelector('.snap-container');
const navbar = document.querySelector('.navbar');
const backToTop = document.getElementById('backToTop');

function onScroll(){
  const y = snapContainer.scrollTop;
  navbar.style.background = y > 30
    ? 'linear-gradient(to bottom, rgba(10,12,25,.95), rgba(10,12,25,.8))'
    : 'linear-gradient(to bottom, rgba(10,12,25,.85), rgba(10,12,25,.55))';
  if (y > 120){ backToTop.classList.add('show'); }
  else { backToTop.classList.remove('show'); }
}
snapContainer.addEventListener('scroll', onScroll);
backToTop.addEventListener('click', () => {
  snapContainer.scrollTo({top:0, behavior:'smooth'});
});

/* Défilement doux (force scroll dans le conteneur interne) */
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if(!target) return;
    target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* Effet machine à écrire pour la raison d’être */
const tw = document.querySelector('.typewriter');
if (tw){
  const text = tw.getAttribute('data-text').trim();
  tw.textContent = '';
  let i=0;
  const speed = 16; // ms par caractère
  function type(){
    if (i < text.length){
      tw.textContent += text[i];
      i++;
      requestAnimationFrame(type);
    }
  }
  // petit délai pour laisser charger la police
  setTimeout(type, 400);
}

/* Slider Réalisations (façon Tesla) */
const slider = document.getElementById('worksSlider');
const prevBtn = document.querySelector('.slider-controls .prev');
const nextBtn = document.querySelector('.slider-controls .next');

function slideBy(delta){
  slider.scrollBy({left: delta, behavior:'smooth'});
}
prevBtn.addEventListener('click', ()=> slideBy(-window.innerWidth*0.7));
nextBtn.addEventListener('click', ()=> slideBy(+window.innerWidth*0.7));

/* Drag to scroll (desktop) */
let isDown=false, startX=0, scrollLeft=0;
slider.addEventListener('mousedown', (e)=>{
  isDown=true; slider.classList.add('grabbing');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', ()=>{isDown=false; slider.classList.remove('grabbing');});
slider.addEventListener('mouseup', ()=>{isDown=false; slider.classList.remove('grabbing');});
slider.addEventListener('mousemove', (e)=>{
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.1;
  slider.scrollLeft = scrollLeft - walk;
});

/* CONTACT : envoi avec pièces jointes (nécessite un backend)
   – Remplace ENDPOINT par ton service (Formspree, Make, Zapier, API).
   – Exemple Formspree : https://formspree.io/f/xxxxxx  */
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  statusEl.textContent = 'Envoi en cours…';
  const ENDPOINT = ''; // ← à renseigner
  if(!ENDPOINT){
    statusEl.textContent = "Configuration requise : ajoute ton endpoint d’envoi (Formspree, API...).";
    return;
  }
  try{
    const formData = new FormData(form);
    const res = await fetch(ENDPOINT, {method:'POST', body: formData});
    if(res.ok){
      statusEl.textContent = 'Message envoyé. Merci !';
      form.reset();
    } else {
      statusEl.textContent = 'Échec de l’envoi (vérifie la configuration).';
    }
  }catch(err){
    statusEl.textContent = 'Erreur réseau. Réessaie plus tard.';
  }
});
