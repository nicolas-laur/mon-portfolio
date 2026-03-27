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
  // toggle = si la classe est là → la retire, si elle est absente → l'ajoute
  burger.innerHTML = navUl.classList.contains('ouvert') ? '✕' : '☰';
  // L'opérateur ternaire : condition ? valeur_si_vrai : valeur_si_faux
});

// Fermer le menu quand on clique sur un lien
navUl.querySelectorAll('a').forEach(lien => {
  // forEach = exécute une fonction pour chaque élément du tableau
  lien.addEventListener('click', () => {
    navUl.classList.remove('ouvert');
    burger.innerHTML = '☰';
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
  'En quête de nouveaux défis',
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

// Effet au survol des éléments cliquables
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    curseur.classList.add('curseur-actif');
  });
  el.addEventListener('mouseleave', () => {
    curseur.classList.remove('curseur-actif');
  });
});