const matildaData = [
  {
    name: "Matilda Joslyn Gage",
    date: "1883",
    img: "../assets/img/MatildaJoslynGage.webp",
    label: "Feminist activist, coined the Matilda Effect"
  },
  {
    name: "Rosalind Franklin",
    date: "1952",
    img: "../assets/img/rosalindfranklin.webp",
    label: "DNA structure, X-ray crystallography"
  },
  {
    name: "Lise Meitner",
    date: "1938",
    img: "../assets/img/lise.avif",
    label: "Nuclear fission, physics pioneer"
  },
  {
    name: "Nettie Stevens",
    date: "1905",
    img: "../assets/img/nettiestevens.webp",
    label: "Discovered X and Y chromosomes"
  },
  {
    name: "Jocelyn Bell Burnell",
    date: "1967",
    img: "../assets/img/Jocelyn-Bell-Burnell.webp",
    label: "Discovered pulsars, astrophysics"
  }
];

const track = document.getElementById('matilda-carousel-track');
const datesBar = document.getElementById('matilda-carousel-dates');
let current = 2; 

function renderCarousel() {
  const oldItems = track.querySelectorAll('.timeline-carousel-item');
  oldItems.forEach(item => item.remove());

  const prev = (current - 1 + matildaData.length) % matildaData.length;
  const next = (current + 1) % matildaData.length;

  const prevItem = createItem(prev, false, 'prev');
  track.insertBefore(prevItem, track.children[1]);
  const currentItem = createItem(current, true, 'current');
  track.insertBefore(currentItem, track.children[2]);
  const nextItem = createItem(next, false, 'next');
  track.insertBefore(nextItem, track.children[3]);

  prevItem.onclick = () => { goPrev(); };
  nextItem.onclick = () => { goNext(); };
  prevItem.tabIndex = 0;
  nextItem.tabIndex = 0;
  prevItem.setAttribute('aria-label', 'Show previous Matilda');
  nextItem.setAttribute('aria-label', 'Show next Matilda');
  prevItem.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') goPrev(); });
  nextItem.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') goNext(); });
}

function createItem(idx, active, pos) {
  const data = matildaData[idx];
  const div = document.createElement('div');
  div.className = 'timeline-carousel-item' + (active ? ' active' : '') + (pos ? ' ' + pos : '');
  div.innerHTML = `
    <img class="timeline-carousel-img" src="${data.img}" alt="${data.name}">
    ${active ? `<div class=\"timeline-carousel-date\">${data.date}</div><div class=\"timeline-carousel-label\">${data.name}</div><div class=\"timeline-carousel-desc\">${data.label}</div>` : ''}
  `;
  return div;
}

function goPrev() {
  current = (current - 1 + matildaData.length) % matildaData.length;
  renderCarousel();
  renderDates();
}
function goNext() {
  current = (current + 1) % matildaData.length;
  renderCarousel();
  renderDates();
}

function renderDates() {
  datesBar.innerHTML = '';
  matildaData.forEach((d, i) => {
    const dot = document.createElement('div');
    dot.className = 'timeline-carousel-date-dot';
    if (i === current) dot.style.background = '#0a3a66';
    datesBar.appendChild(dot);
  });
}

document.getElementById('matilda-next').onclick = () => { goNext(); };
document.getElementById('matilda-prev').onclick = () => { goPrev(); };
document.getElementById('matilda-prev').tabIndex = 0;
document.getElementById('matilda-next').tabIndex = 0;
document.getElementById('matilda-prev').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') goPrev(); });
document.getElementById('matilda-next').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') goNext(); });

renderCarousel();
renderDates();
