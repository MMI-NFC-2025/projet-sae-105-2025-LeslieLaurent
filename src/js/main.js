function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

var menuBtn = document.getElementById('menu-toggle');
var nav = document.getElementById('primary-nav-main');
if (menuBtn && nav) {
	function updateMenuIcon() {
		var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
		menuBtn.textContent = expanded ? '✕' : '☰';
	}
	menuBtn.addEventListener('click', function() {
		var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
		menuBtn.setAttribute('aria-expanded', !expanded);
		menuBtn.classList.toggle('open');
		nav.classList.toggle('open');
		document.body.classList.toggle('menu-open');
		updateMenuIcon();
	});
	nav.querySelectorAll('a').forEach(function(link) {
		link.addEventListener('click', function() {
			menuBtn.setAttribute('aria-expanded', 'false');
			menuBtn.classList.remove('open');
			nav.classList.remove('open');
			document.body.classList.remove('menu-open');
			updateMenuIcon();
		});
	});
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			menuBtn.setAttribute('aria-expanded', 'false');
			menuBtn.classList.remove('open');
			nav.classList.remove('open');
			document.body.classList.remove('menu-open');
			updateMenuIcon();
		}
	});
	updateMenuIcon();
}

document.querySelectorAll('a[href^="#"]').forEach(function(link) {
	link.addEventListener('click', function(e) {
		var href = link.getAttribute('href');
		if (href.length > 1 && document.querySelector(href)) {
			e.preventDefault();
			document.querySelector(href).scrollIntoView({behavior: 'smooth'});
		}
	});
});

if ('IntersectionObserver' in window) {
	var images = document.querySelectorAll('img[loading="lazy"]');
	var observer = new IntersectionObserver(function(entries, obs) {
		entries.forEach(function(entry) {
			if (entry.isIntersecting) {
				var img = entry.target;
				img.src = img.getAttribute('data-src') || img.src;
				img.classList.add('loaded');
				obs.unobserve(img);
			}
		});
	});
	images.forEach(function(img) { observer.observe(img); });
}

if ('IntersectionObserver' in window) {
	var elements = document.querySelectorAll('.article-list li, .hero-figure');
	var animObs = new IntersectionObserver(function(entries, obs) {
		entries.forEach(function(entry) {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
				obs.unobserve(entry.target);
			}
		});
	}, { threshold: 0.1 });
	elements.forEach(function(el) {
		el.style.opacity = '0';
		el.style.transform = 'translateY(20px)';
		el.style.transition = 'opacity 0.6s, transform 0.6s';
		animObs.observe(el);
	});
}
document.querySelectorAll('.article-list li').forEach(function(card) {
	card.setAttribute('tabindex', '0');
	card.addEventListener('keydown', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			var link = card.querySelector('.read-more');
			if (link) link.click();
		}
	});
});
document.documentElement.classList.add('js-loaded');
console.log('✓ JS simplifié chargé');

document.querySelectorAll('.carousel-container').forEach(function(container) {
	const track = container.querySelector('.carousel-track');
	const items = Array.from(track.children);
	const prevBtn = container.querySelector('.carousel-prev');
	const nextBtn = container.querySelector('.carousel-next');
	const indicators = container.querySelector('.carousel-indicators');
	let current = 0;

	function update() {
		items.forEach((item, i) => {
			item.style.display = (i === current) ? '' : 'none';
		});
		if (indicators) {
			indicators.innerHTML = '';
			items.forEach((_, i) => {
				const dot = document.createElement('button');
				dot.className = 'carousel-dot' + (i === current ? ' active' : '');
				dot.type = 'button';
				dot.setAttribute('aria-label', 'Aller à la photo ' + (i+1));
				dot.addEventListener('click', () => { current = i; update(); });
				indicators.appendChild(dot);
			});
		}
	}

	if (prevBtn) prevBtn.addEventListener('click', function() {
		current = (current - 1 + items.length) % items.length;
		update();
	});
	if (nextBtn) nextBtn.addEventListener('click', function() {
		current = (current + 1) % items.length;
		update();
	});
	if (prevBtn) prevBtn.addEventListener('keydown', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			current = (current - 1 + items.length) % items.length;
			update();
		}
	});
	if (nextBtn) nextBtn.addEventListener('keydown', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			current = (current + 1) % items.length;
			update();
		}
	});
	update();
});
