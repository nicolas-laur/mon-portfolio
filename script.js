// ============================================
// 1. NAVBAR — Changer l'apparence au scroll
// ============================================

// On récupère l'élément <header> dans une variable
const header = document.querySelector('header');

// "scroll" = événement déclenché chaque fois que l'utilisateur scrolle
window.addEventListener('scroll', () => {
  // window.scrollY = nombre de pixels scrollés depuis le haut

  if (window.scrollY > 50) {
    // Si on a scrollé de plus de 50px → on ajoute la classe "scrolled"
    header.classList.add('scrolled');
  } else {
    // Sinon on la retire
    header.classList.remove('scrolled');
  }
});


// ============================================
// 2. MENU MOBILE — Hamburger (pour les petits écrans)
// ============================================

// On crée le bouton hamburger directement depuis JS
const nav = document.querySelector('nav');
const navUl = document.querySelector('nav ul');

// createElement = crée un nouvel élément HTML (pas encore visible)
const burger = document.createElement('button');
burger.classList.add('burger');
burger.innerHTML = '☰'; // Le symbole hamburger
burger.setAttribute('aria-label', 'Menu'); // Accessibilité

// appendChild = ajoute l'élément comme enfant dans le DOM
nav.appendChild(burger);

// Au clic sur le burger → on toggle (ajoute/retire) la classe 'ouvert'
burger.addEventListener('click', () => {
  navUl.classList.toggle('ouvert');
  burger.innerHTML = navUl.classList.contains('ouvert') ? '✕' : '☰';

  // Positionnement dynamique : le dropdown s'accroche juste sous le header réel
  // Évite les problèmes de hardcoding selon la hauteur du header
  navUl.style.top = header.offsetHeight + 'px';
});

// Fermer le menu quand on clique sur un lien et naviguer vers la section
navUl.querySelectorAll('a').forEach(lien => {
  lien.addEventListener('click', (e) => {
    const href = lien.getAttribute('href');
    navUl.classList.remove('ouvert');
    burger.innerHTML = '☰';
    if (href && href.startsWith('#')) {
      e.preventDefault();
      // On attend 50ms que le menu se ferme avant de scroller
      setTimeout(() => {
        const cible = document.querySelector(href);
        if (cible) cible.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  });
});


// ============================================
// 3. ANIMATIONS AU SCROLL — Apparition des sections
// ============================================

// IntersectionObserver = surveille quand un élément entre dans le champ de vision
const observateur = new IntersectionObserver((entrees) => {
  entrees.forEach(entree => {
    if (entree.isIntersecting) {
      // isIntersecting = true quand l'élément est visible à l'écran
      entree.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
  // threshold: 0.1 = déclenche quand 10% de l'élément est visible
});

// On observe tous les éléments qui doivent apparaître
const elementsAnimes = document.querySelectorAll(
  '.competence-carte, .projet-carte, .apropos-contenu, .info-item'
);

elementsAnimes.forEach(el => {
  el.classList.add('a-animer'); // État initial : invisible
  observateur.observe(el);      // On commence à surveiller cet élément
});


// ============================================
// 4. LIEN ACTIF dans la navbar au scroll
// ============================================

const sections = document.querySelectorAll('section[id]');
const liensNav = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let sectionActuelle = '';

  sections.forEach(section => {
    const haut = section.offsetTop - 100;
    // offsetTop = distance entre le haut de l'élément et le haut de la page

    if (window.scrollY >= haut) {
      sectionActuelle = section.getAttribute('id');
      // getAttribute('id') = récupère la valeur de l'attribut id
    }
  });

  liensNav.forEach(lien => {
    lien.classList.remove('actif');
    if (lien.getAttribute('href') === `#${sectionActuelle}`) {
      lien.classList.add('actif');
      // Les backticks `` permettent d'insérer une variable dans une chaîne
      // C'est ce qu'on appelle un "template literal"
    }
  });
});


// ============================================
// 5. ANNÉE AUTOMATIQUE dans le footer
// ============================================

// Date() = objet JavaScript qui représente la date et l'heure actuelles
const annee = new Date().getFullYear();

// On cherche l'élément footer et on remplace le texte
const footer = document.querySelector('footer p');
footer.innerHTML = footer.innerHTML.replace('2026', annee);
// Si tu mets ce site en ligne en 2027, ça se met à jour tout seul
// ============================================
// EFFET 1 — TYPEWRITER
// Affiche le texte lettre par lettre
// ============================================

const elementTypewriter = document.querySelector('.hero-titre');
// On cible le sous-titre du Hero

const textes = [
  'Business Analyst IA et Cloud',
  'Passionné de nouvelles technologies',
  'En quête d\'un nouveaux défi',
];
// Tableau de textes qui vont défiler
// Modifie ces phrases avec tes vraies accroches !

let indexTexte = 0;    // Quel texte on affiche en ce moment
let indexLettre = 0;   // Jusqu'à quelle lettre on est arrivé
let enTrain = true;    // true = on écrit, false = on efface

function typewriter() {
  const texteCourant = textes[indexTexte];

  if (enTrain) {
    // Phase d'écriture : on ajoute une lettre
    indexLettre++;
    elementTypewriter.textContent = texteCourant.substring(0, indexLettre);
    // substring(0, n) = les n premiers caractères du texte

    if (indexLettre === texteCourant.length) {
      // On a fini d'écrire → on attend 2s puis on efface
      enTrain = false;
      setTimeout(() => {
        effacer = setInterval(typewriter, 40);
        // On efface plus vite qu'on écrit — effet naturel
      }, 2000);
      clearInterval(ecrire);
      return;
    }
  } else {
    // Phase d'effacement : on retire une lettre
    indexLettre--;
    elementTypewriter.textContent = texteCourant.substring(0, indexLettre);

    if (indexLettre === 0) {
      // On a tout effacé → on passe au texte suivant
      enTrain = true;
      indexTexte = (indexTexte + 1) % textes.length;
      // % = modulo — revient à 0 quand on dépasse le dernier texte
      clearInterval(effacer);
      ecrire = setInterval(typewriter, 80);
    }
  }
}

let ecrire = setInterval(typewriter, 80);
// Démarre l'effet — une lettre toutes les 80ms
// ============================================
// EFFET 2 — BARRE DE PROGRESSION
// ============================================

// On crée la barre directement en JS
const barreProgression = document.createElement('div');
barreProgression.classList.add('barre-progression');
document.body.appendChild(barreProgression);

window.addEventListener('scroll', () => {
  const hauteurTotale = document.documentElement.scrollHeight;
  // scrollHeight = hauteur totale de la page (incluant ce qui est hors écran)

  const hauteurFenetre = window.innerHeight;
  // innerHeight = hauteur visible de la fenêtre

  const progression = (window.scrollY / (hauteurTotale - hauteurFenetre)) * 100;

  barreProgression.style.width = progression + '%';
  // On met à jour la largeur de la barre en temps réel
});
// ============================================
// EFFET 3 — CURSEUR PERSONNALISÉ
// ============================================

// ============================================
// EFFET 3 — CURSEUR PERSONNALISÉ
// Désactivé sur les appareils tactiles
// ============================================

// On détecte si l'appareil est tactile
const estTactile = window.matchMedia('(hover: none)').matches;
// hover: none = l'appareil principal est tactile (pas de souris)

if (!estTactile) {
  // On n'active le curseur que sur desktop
  const curseur = document.createElement('div');
  const curseurPoint = document.createElement('div');
  curseur.classList.add('curseur');
  curseurPoint.classList.add('curseur-point');
  document.body.appendChild(curseur);
  document.body.appendChild(curseurPoint);

  let sourisX = 0, sourisY = 0;
  let curseurX = 0, curseurY = 0;

  document.addEventListener('mousemove', (e) => {
    sourisX = e.clientX;
    sourisY = e.clientY;
    curseurPoint.style.left = sourisX + 'px';
    curseurPoint.style.top  = sourisY + 'px';
  });

  function animerCurseur() {
    curseurX += (sourisX - curseurX) * 0.12;
    curseurY += (sourisY - curseurY) * 0.12;
    curseur.style.left = curseurX + 'px';
    curseur.style.top  = curseurY + 'px';
    requestAnimationFrame(animerCurseur);
  }
  animerCurseur();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => curseur.classList.add('curseur-actif'));
    el.addEventListener('mouseleave', () => curseur.classList.remove('curseur-actif'));
  });
}

// Note : le survol des éléments cliquables est déjà géré
// à l'intérieur du bloc if (!estTactile) ci-dessus.
// ============================================
// FORMULAIRE DE CONTACT — Confirmation d'envoi
// ============================================

const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // preventDefault = empêche le rechargement de page par défaut

    const bouton = form.querySelector('.form-bouton');
    bouton.textContent = 'Envoi en cours...';
    bouton.disabled = true;
    // disabled = désactive le bouton pendant l'envoi (évite les doublons)

    const donnees = new FormData(form);
    // FormData = collecte automatiquement tous les champs du formulaire

    try {
      const reponse = await fetch(form.action, {
        method: 'POST',
        body: donnees,
        headers: { 'Accept': 'application/json' }
      });
      // fetch = envoie les données à Formspree sans recharger la page
      // await = attend la réponse avant de continuer

      if (reponse.ok) {
        // Succès — on remplace le formulaire par un message
        form.innerHTML = `
          <div class="form-succes">
            <span class="succes-icone">✅</span>
            <h3>Message envoyé !</h3>
            <p>Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
          </div>
        `;
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (erreur) {
      bouton.textContent = 'Erreur — Réessayer';
      bouton.disabled = false;
    }
  });
}
// ============================================
// PARALLAX — Effet de profondeur au scroll
// ============================================

const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  
  // Le contenu Hero remonte 2x moins vite que le scroll
  // Crée une illusion de profondeur
  if (heroSection) {
    heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
    // 0.3 = facteur de parallax — plus petit = effet plus subtil
    heroSection.style.opacity = 1 - scrolled * 0.002;
    // Le hero devient transparent progressivement au scroll
  }
});
// ============================================
// CANVAS — Réseau de particules interactif
// ============================================
const canvas = document.getElementById('canvas-particules');

if (canvas && window.innerWidth > 768) {
  const ctx = canvas.getContext('2d');

  function redimensionnerCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  redimensionnerCanvas();
  window.addEventListener('resize', redimensionnerCanvas);

  const CONFIG = {
    nombre: 80,
    vitesseMax: 0.4,
    rayon: 2,
    distanceMax: 150,
    couleur: '0, 113, 227',
    repulsion: 120,
  };

  const souris = { x: -999, y: -999 };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    souris.x = e.clientX - rect.left;
    souris.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    souris.x = -999;
    souris.y = -999;
  });

  class Particule {
    constructor() { this.reinitialiser(); }
    reinitialiser() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * CONFIG.vitesseMax * 2;
      this.vy = (Math.random() - 0.5) * CONFIG.vitesseMax * 2;
      this.rayon = Math.random() * CONFIG.rayon + 1;
    }
    deplacer() {
      const dx = this.x - souris.x;
      const dy = this.y - souris.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < CONFIG.repulsion) {
        const force = (CONFIG.repulsion - distance) / CONFIG.repulsion;
        this.x += dx / distance * force * 3;
        this.y += dy / distance * force * 3;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    dessiner() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.couleur}, 0.7)`;
      ctx.fill();
    }
  }

  const particules = Array.from({ length: CONFIG.nombre }, () => new Particule());

  function tracerConnexions() {
    for (let i = 0; i < particules.length; i++) {
      for (let j = i + 1; j < particules.length; j++) {
        const dx = particules[i].x - particules[j].x;
        const dy = particules[i].y - particules[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < CONFIG.distanceMax) {
          const opacite = 1 - distance / CONFIG.distanceMax;
          ctx.beginPath();
          ctx.moveTo(particules[i].x, particules[i].y);
          ctx.lineTo(particules[j].x, particules[j].y);
          ctx.strokeStyle = `rgba(${CONFIG.couleur}, ${opacite * 0.4})`;
          ctx.lineWidth = opacite * 1.5;
          ctx.stroke();
        }
      }
    }
  }

  function animer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particules.forEach(p => { p.deplacer(); p.dessiner(); });
    tracerConnexions();
    requestAnimationFrame(animer);
  }
  animer();
}
// ============================================
// MODAL — Workflows Make & IA
// ============================================

// ---- Palette couleurs nœuds ----
const MANIM_COULEURS = {
  gris:   { bg:'#F1EFE8', bd:'#888780', c:'#5F5E5A' },
  amber:  { bg:'#FAEEDA', bd:'#EF9F27', c:'#633806' },
  violet: { bg:'#EEEDFE', bd:'#7F77DD', c:'#3C3489' },
  corail: { bg:'#FAECE7', bd:'#D85A30', c:'#712B13' },
  rouge:  { bg:'#FCEBEB', bd:'#E24B4A', c:'#791F1F' },
  notion: { bg:'#D3D1C7', bd:'#5F5E5A', c:'#2C2C2A' },
  vert:   { bg:'#E1F5EE', bd:'#1D9E75', c:'#085041' },
  bleu:   { bg:'#E6F1FB', bd:'#378ADD', c:'#0C447C' }
};

// ---- Données & séquences des 4 workflows ----
const workflowsData = [
  {
    titre: 'Briefing Matin — Géopolitique & Finance',
    desc: 'Chaque matin, ce workflow agrège automatiquement des flux RSS de sources géopolitiques et financières, consolide les titres via un agrégateur, puis demande à Claude de rédiger un briefing synthétique structuré. Le résultat est envoyé directement par email — prêt à lire en moins d\'une minute.',
    tags: ['Make', 'RSS', 'Anthropic Claude', 'Gmail', 'Veille automatisée'],
    toast: 'Briefing du jour envoyé avec succès',
    noeuds: [
      { icone:'&#x25F7;', label:'Scheduler',    couleur:'gris'   },
      { icone:'RSS',       label:'Flux RSS ×3',  couleur:'amber'  },
      { icone:'&#x2261;T', label:'Agrégateur',   couleur:'violet' },
      { icone:'A\\',       label:'Claude',       couleur:'corail' },
      { icone:'M',         label:'Gmail',        couleur:'rouge'  }
    ],
    seq: [
      [0,    'n', 0, '07:00',      'Déclenchement du scheduler à 07:00'],
      [900,  'c', 0],
      [1700, 'n', 1, '3 articles', '3 flux RSS récupérés — Reuters, Bloomberg, Les Échos'],
      [2500, 'c', 1],
      [3300, 'n', 2, 'Consolidé',  'Texte brut agrégé — 1 240 mots consolidés'],
      [4100, 'c', 2],
      [4900, 'n', 3, 'Analyse...', 'Claude analyse les tendances et rédige le briefing...'],
      [6700, 'b', 3, 'Rédigé',     'Résumé structuré généré — 487 tokens, 3 thèmes identifiés'],
      [7400, 'c', 3],
      [8200, 'n', 4, 'Envoyé',     'Email envoyé — workflow terminé avec succès'],
      [9000, 't']
    ]
  },
  {
    titre: 'Rapport d\'activité quotidien — Business Analyst',
    desc: 'À heure fixe, le workflow interroge Notion pour récupérer les tickets actifs, les agrège et les soumet à Claude qui génère un rapport d\'activité structuré (avancement, blocages, priorités). Le rapport est envoyé par email pour un suivi quotidien sans effort manuel.',
    tags: ['Make', 'Notion', 'Anthropic Claude', 'Gmail', 'Reporting'],
    toast: 'Rapport d\'activité quotidien envoyé',
    noeuds: [
      { icone:'&#x25F7;', label:'Scheduler',    couleur:'gris'   },
      { icone:'N',         label:'Notion',       couleur:'notion' },
      { icone:'&#x2261;T', label:'Agrégateur',   couleur:'violet' },
      { icone:'A\\',       label:'Claude',       couleur:'corail' },
      { icone:'M',         label:'Gmail',        couleur:'rouge'  }
    ],
    seq: [
      [0,    'n', 0, '09:00',       'Déclenchement du scheduler — rapport quotidien'],
      [900,  'c', 0],
      [1700, 'n', 1, '12 tickets',  'Tickets actifs récupérés depuis la base Notion'],
      [2500, 'c', 1],
      [3300, 'n', 2, 'Agrégé',      'Données consolidées pour analyse'],
      [4100, 'c', 2],
      [4900, 'n', 3, 'Rédige...',   'Claude génère le rapport d\'activité structuré...'],
      [6700, 'b', 3, 'Rédigé',      'Rapport généré — avancement, blocages, priorités identifiés'],
      [7400, 'c', 3],
      [8200, 'n', 4, 'Envoyé',      'Rapport d\'activité envoyé — workflow terminé'],
      [9000, 't']
    ]
  },
  {
    titre: 'Génération de compte rendu de réunion',
    desc: 'Le workflow surveille en temps réel les emails Gmail contenant des notes de réunion. Dès réception, Claude analyse le contenu, génère un compte-rendu structuré (décisions, actions, participants), le formate en JSON, crée une entrée Notion et envoie le compte-rendu finalisé par email.',
    tags: ['Make', 'Gmail', 'Anthropic Claude', 'Notion', 'JSON', 'Automatisation'],
    toast: 'Compte-rendu transmis aux participants',
    noeuds: [
      { icone:'M',         label:'Gmail — veille', couleur:'rouge'  },
      { icone:'A\\',       label:'Claude',         couleur:'corail' },
      { icone:'{}',        label:'JSON',            couleur:'vert'   },
      { icone:'N',         label:'Notion',          couleur:'notion' },
      { icone:'M',         label:'Gmail — envoi',   couleur:'rouge'  }
    ],
    seq: [
      [0,    'n', 0, 'Email reçu',   'Nouveau email de notes de réunion détecté'],
      [900,  'c', 0],
      [1700, 'n', 1, 'Structure...', 'Claude analyse les notes et structure le compte-rendu...'],
      [3500, 'b', 1, 'Structuré',    'Compte-rendu rédigé — décisions, actions, participants'],
      [4200, 'c', 1],
      [5000, 'n', 2, 'Parsé',        'Réponse Claude parsée en JSON structuré'],
      [5800, 'c', 2],
      [6600, 'n', 3, 'Archivé',      'Compte-rendu archivé dans la base Notion'],
      [7400, 'c', 3],
      [8200, 'n', 4, 'Envoyé',       'Compte-rendu envoyé aux participants'],
      [9000, 't']
    ]
  },
  {
    titre: 'Mise à jour de spécifications techniques',
    desc: 'Ce workflow avancé interroge deux bases Notion pour récupérer les spécifications existantes et les nouvelles données. Un double passage Claude analyse les écarts, propose des mises à jour, structure la réponse en JSON et met à jour les pages Notion — avec notification email en fin de traitement.',
    tags: ['Make', 'Notion', 'Anthropic Claude', 'JSON', 'Text Parser', 'Specs'],
    toast: 'Spécifications mises à jour — notification envoyée',
    noeuds: [
      { icone:'&#x25F7;', label:'Scheduler',   couleur:'gris'   },
      { icone:'N',         label:'Notion ×2',  couleur:'notion' },
      { icone:'A\\',       label:'Claude 1',   couleur:'corail' },
      { icone:'{}',        label:'JSON',        couleur:'vert'   },
      { icone:'A\\',       label:'Claude 2',   couleur:'corail' },
      { icone:'M',         label:'Gmail',       couleur:'rouge'  }
    ],
    seq: [
      [0,     'n', 0, '08:00',      'Déclenchement — analyse des specs techniques'],
      [900,   'c', 0],
      [1700,  'n', 1, '5 pages',    '5 pages de spécifications récupérées depuis Notion'],
      [2500,  'c', 1],
      [3300,  'n', 2, 'Analyse...', 'Claude 1 — analyse des écarts et propositions...'],
      [5100,  'b', 2, 'Analysé',    'Première analyse terminée — 8 mises à jour identifiées'],
      [5800,  'c', 2],
      [6600,  'n', 3, 'Parsé',      'Réponse structurée en JSON'],
      [7400,  'c', 3],
      [8200,  'n', 4, 'Rédige...',  'Claude 2 — rédaction des nouvelles spécifications...'],
      [10000, 'b', 4, 'Rédigé',     'Spécifications mises à jour — prêtes à publier'],
      [10700, 'c', 4],
      [11500, 'n', 5, 'Notifié',    'Notification de mise à jour envoyée'],
      [12300, 't']
    ]
  }
];

// ---- Références DOM ----
const modal       = document.getElementById('workflow-modal');
const modalTitre  = document.getElementById('modal-titre');
const modalDesc   = document.getElementById('modal-desc');
const modalTagsEl = document.getElementById('modal-tags');
const modalFermer = modal ? modal.querySelector('.modal-fermer') : null;

// ---- Moteur d'animation modal ----
let manimTids = [], manimRun = false, manimEl = 0, manimEtimer, manimWfIdx = -1;

function manimConstruire(index) {
  manimWfIdx = index;
  const wf = workflowsData[index];
  const diag = document.getElementById('manim-diagram');
  if (!diag) return;
  diag.innerHTML = '';
  wf.noeuds.forEach((n, i) => {
    const col = document.createElement('div');
    col.className = 'manim-col';
    col.innerHTML = `<div class="manim-ico" id="mni${i}" data-c="${n.couleur}">${n.icone}</div><div class="manim-lbl">${n.label}</div><div class="manim-badge" id="mnb${i}"></div>`;
    diag.appendChild(col);
    if (i < wf.noeuds.length - 1) {
      const edge = document.createElement('div');
      edge.className = 'manim-edge';
      const dc = MANIM_COULEURS[wf.noeuds[i].couleur].bd;
      edge.innerHTML = `<div class="manim-line"><div class="manim-dot" id="mnd${i}" style="background:${dc}"></div></div>`;
      diag.appendChild(edge);
    }
  });
  const tEl = document.getElementById('manim-toast-ttl');
  if (tEl) tEl.textContent = wf.toast;
}

function manimActiver(i, badge) {
  const ico = document.getElementById('mni' + i);
  const bdg = document.getElementById('mnb' + i);
  const ld  = document.getElementById('manim-log-dot');
  if (!ico) return;
  const col = MANIM_COULEURS[ico.dataset.c];
  ico.style.background   = col.bg;
  ico.style.borderColor  = col.bd;
  ico.style.color        = col.c;
  ico.style.animation    = 'manim-pu .5s ease';
  setTimeout(() => { if (ico) ico.style.animation = ''; }, 500);
  if (ld) { ld.style.background = col.bd; ld.className = 'manim-log-dot run'; }
  if (badge && bdg) { bdg.textContent = badge; bdg.classList.add('vis'); }
}

function manimBadge(i, badge) {
  const bdg = document.getElementById('mnb' + i);
  if (bdg && badge) bdg.textContent = badge;
}

function manimCouler(i) {
  const d = document.getElementById('mnd' + i);
  if (!d) return;
  d.classList.remove('flow');
  void d.offsetWidth;
  d.classList.add('flow');
}

function manimLog(txt) {
  const el = document.getElementById('manim-log-txt');
  if (el) el.textContent = txt;
}

function manimReinit() {
  manimTids.forEach(clearTimeout);
  manimTids = [];
  clearInterval(manimEtimer);
  manimRun = false;
  manimEl  = 0;
  ['manim-btn', 'manim-etat-dot', 'manim-etat-lbl', 'manim-elapsed', 'manim-toast', 'manim-log-dot'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === 'manim-btn')      { el.textContent = 'Démarrer'; el.disabled = false; el.classList.remove('reset'); }
    if (id === 'manim-etat-dot') { el.className = 'manim-etat-dot'; }
    if (id === 'manim-etat-lbl') { el.textContent = 'En attente'; }
    if (id === 'manim-elapsed')  { el.textContent = ''; }
    if (id === 'manim-toast')    { el.classList.remove('vis'); }
    if (id === 'manim-log-dot')  { el.className = 'manim-log-dot'; el.style.background = ''; }
  });
  manimLog('Cliquez sur Démarrer pour simuler le workflow');
  for (let i = 0; i < 8; i++) {
    const ico = document.getElementById('mni' + i);
    const bdg = document.getElementById('mnb' + i);
    const dot = document.getElementById('mnd' + i);
    if (ico) { ico.style.background = ico.style.borderColor = ico.style.color = ico.style.animation = ''; }
    if (bdg) bdg.classList.remove('vis');
    if (dot) dot.classList.remove('flow');
  }
}

function manimLancer() {
  if (manimWfIdx < 0) return;
  const wf = workflowsData[manimWfIdx];
  manimRun = true;
  const btn = document.getElementById('manim-btn');
  const ed  = document.getElementById('manim-etat-dot');
  const el  = document.getElementById('manim-etat-lbl');
  if (btn) { btn.textContent = 'Recommencer'; btn.classList.add('reset'); }
  if (ed)  ed.className  = 'manim-etat-dot run';
  if (el)  el.textContent = 'En cours';
  manimEl = 0;
  manimEtimer = setInterval(() => {
    manimEl++;
    const elapsed = document.getElementById('manim-elapsed');
    if (elapsed) elapsed.textContent = manimEl + 's';
  }, 1000);
  wf.seq.forEach(([delai, type, ...args]) => {
    manimTids.push(setTimeout(() => {
      if      (type === 'n') { manimActiver(args[0], args[1]); manimLog(args[2]); }
      else if (type === 'c') { manimCouler(args[0]); }
      else if (type === 'b') { manimBadge(args[0], args[1]); manimLog(args[2]); }
      else if (type === 't') {
        const toast = document.getElementById('manim-toast');
        const ed2   = document.getElementById('manim-etat-dot');
        const el2   = document.getElementById('manim-etat-lbl');
        const ld    = document.getElementById('manim-log-dot');
        if (toast) toast.classList.add('vis');
        if (ed2)   { ed2.className = 'manim-etat-dot ok'; }
        if (el2)   el2.textContent = 'Terminé';
        if (ld)    { ld.className = 'manim-log-dot ok'; ld.style.background = '#639922'; }
        clearInterval(manimEtimer);
      }
    }, delai));
  });
}

function basculeAnim() {
  if (manimRun) { manimReinit(); } else { manimLancer(); }
}

// ---- Open / Close modal ----
function ouvrirWorkflow(index) {
  const w = workflowsData[index];
  if (!w || !modal) return;
  modalTitre.textContent = w.titre;
  modalDesc.textContent  = w.desc;
  modalTagsEl.innerHTML  = w.tags.map(t => `<span class="tag">${t}</span>`).join('');
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('ouverte');
  document.body.style.overflow = 'hidden';
  manimReinit();
  manimConstruire(index);
}

function fermerModal() {
  if (!modal) return;
  manimReinit();
  modal.classList.remove('ouverte');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Clic sur les cartes workflow
document.querySelectorAll('.workflow-carte').forEach(carte => {
  carte.addEventListener('click', () => ouvrirWorkflow(Number(carte.dataset.index)));
});

// Fermeture
if (modalFermer) modalFermer.addEventListener('click', fermerModal);
if (modal) {
  modal.addEventListener('click', e => { if (e.target === modal) fermerModal(); });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') fermerModal(); });

// ============================================
// CARROUSEL — Certifications
// ============================================

const piste       = document.querySelector('.carrousel-piste');
const viewport    = document.querySelector('.carrousel-viewport');
const cartes      = document.querySelectorAll('.cert-carte');
const points      = document.querySelectorAll('.carrousel-points .point');
const btnPrev     = document.querySelector('.carrousel-prev');
const btnSuivant  = document.querySelector('.carrousel-suivant');

if (piste && cartes.length > 0) {
  let indexCarrousel = 0;
  const total = cartes.length;

  function estMobile() {
    return window.innerWidth < 768;
  }

  function allerA(n) {
    // Clamp entre 0 et total - 1
    indexCarrousel = Math.max(0, Math.min(n, total - 1));

    if (estMobile()) {
      // Largeur d'une carte + gap (24px défini en CSS)
      const largeurCarte = cartes[0].offsetWidth + 24;
      piste.style.transform = `translateX(-${indexCarrousel * largeurCarte}px)`;
    } else {
      // Desktop : on montre tout, pas de déplacement
      piste.style.transform = 'translateX(0)';
    }

    // Mise à jour des boutons
    if (btnPrev)    btnPrev.disabled    = indexCarrousel === 0;
    if (btnSuivant) btnSuivant.disabled = indexCarrousel === total - 1;

    // Mise à jour des points
    points.forEach((pt, i) => {
      pt.classList.toggle('actif', i === indexCarrousel);
    });
  }

  // Boutons prev / suivant
  if (btnPrev)    btnPrev.addEventListener('click',    () => allerA(indexCarrousel - 1));
  if (btnSuivant) btnSuivant.addEventListener('click', () => allerA(indexCarrousel + 1));

  // Clics sur les points
  points.forEach((pt, i) => {
    pt.addEventListener('click', () => allerA(i));
  });

  // Recalcul au redimensionnement (ex. rotation tablette)
  window.addEventListener('resize', () => allerA(indexCarrousel));

  // Initialisation
  allerA(0);
}