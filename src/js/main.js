const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


function isInViewport(element) {
	const rect = element.getBoundingClientRect();
	return (
		rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.left <= (window.innerWidth || document.documentElement.clientWidth)
	);
}


function debounce(func, delay = 150) {
	let timeoutId;
	return function(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func.apply(this, args), delay);
	};
}


class LanguageSwitch {
	constructor() {
		this.langLinks = $$('.lang-switch a:not(.active)');
		this.initializeLanguageSwitch();
	}

	initializeLanguageSwitch() {
		this.langLinks.forEach((link) => {
			link.addEventListener('click', () => {
			});
		});
	}
}



class MobileMenu {
	constructor() {
		this.menuToggle = $('#menu-toggle');
		this.primaryNav = $('#primary-nav-main');
		this.body = document.body;
		this.isOpen = false;

		if (this.menuToggle) {
			this.menuToggle.addEventListener('click', () => this.toggle());
			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape' && this.isOpen) this.close();
			});

			const navLinks = this.primaryNav.querySelectorAll('a');
			navLinks.forEach((link) => {
				link.addEventListener('click', () => this.close());
			});
		}
	}

	toggle() {
		this.isOpen ? this.close() : this.open();
	}

	open() {
		this.isOpen = true;
		this.menuToggle.setAttribute('aria-expanded', 'true');
		this.menuToggle.classList.add('open');
		this.primaryNav.classList.add('open');
		this.body.classList.add('menu-open');
	}

	close() {
		this.isOpen = false;
		this.menuToggle.setAttribute('aria-expanded', 'false');
		this.menuToggle.classList.remove('open');
		this.primaryNav.classList.remove('open');
		this.body.classList.remove('menu-open');
	}
}

class Timeline {
	constructor() {
		this.currentIndex = 0;
		this.events = $$('.timeline-strip .event');
		this.prevBtn = $('#prev-btn');
		this.nextBtn = $('#next-btn');
		this.statusEl = $('#timeline-status');
		this.totalEvents = this.events.length;

		if (this.prevBtn && this.nextBtn) {
			this.prevBtn.addEventListener('click', () => this.previous());
			this.nextBtn.addEventListener('click', () => this.next());
			this.setupKeyboardNavigation();
			this.updateUI();
		}
	}

	next() {
		if (this.currentIndex < this.totalEvents - 1) {
			this.currentIndex++;
			this.updateUI();
		}
	}

	previous() {
		if (this.currentIndex > 0) {
			this.currentIndex--;
			this.updateUI();
		}
	}

	updateUI() {
		// Update active event styling
		this.events.forEach((event, index) => {
			if (index === this.currentIndex) {
				event.classList.remove('small', 'empty');
				event.classList.add('centre');
				event.focus();
			} else if (index < this.currentIndex) {
				event.classList.remove('centre', 'empty');
				event.classList.add('small');
			} else {
				event.classList.remove('centre', 'small');
				event.classList.add('empty');
			}
		});

		this.prevBtn.disabled = this.currentIndex === 0;
		this.nextBtn.disabled = this.currentIndex === this.totalEvents - 1;

		if (this.statusEl) {
			this.statusEl.textContent = `Élément ${this.currentIndex + 1} sur ${this.totalEvents}`;
		}
	}

	setupKeyboardNavigation() {
		this.events.forEach((event, index) => {
			event.setAttribute('tabindex', index === 0 ? '0' : '-1');
			event.addEventListener('click', () => {
				this.currentIndex = index;
				this.updateUI();
			});
		});
	}
}



class ArticleCards {
	constructor() {
		this.cards = $$('.article-list li');
		this.initializeCards();
	}

	initializeCards() {
		this.cards.forEach((card) => {
			card.setAttribute('tabindex', '0');
			card.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					const link = card.querySelector('.read-more');
					if (link) link.click();
				}
			});

			card.addEventListener('focus', () => {
				card.style.scrollMarginTop = '100px';
			});
		});
	}
}

class SmoothScroll {
	constructor() {
		this.links = $$('a[href^="#"]');
		this.logo = $('.logo');
		this.initializeLinks();
		this.initializeLogo();
	}

	initializeLogo() {
		if (this.logo) {
			const href = this.logo.getAttribute('href') || '';
			if (href.startsWith('#')) {
				this.logo.addEventListener('click', (e) => {
					e.preventDefault();
					const target = $(href);
					if (target) {
						target.scrollIntoView({ behavior: 'smooth', block: 'start' });
					} else {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					}
				});
			}
		}
	}

	initializeLinks() {
		this.links.forEach((link) => {
			link.addEventListener('click', (e) => {
				const href = link.getAttribute('href');
				if (href === '#') return;

				const target = $(href);
				if (target) {
					e.preventDefault();
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });

					if (target.tabIndex === -1) {
						target.setAttribute('tabindex', '-1');
					}
					target.focus();
				}
			});
		});
	}
}


class Carousel {
	constructor(container) {
		this.container = container;
		this.track = container.querySelector('.carousel-track');
		this.items = [...container.querySelectorAll('.carousel-item')];
		this.prevBtn = container.querySelector('.carousel-prev');
		this.nextBtn = container.querySelector('.carousel-next');
		this.indicatorsContainer = container.querySelector('.carousel-indicators');
		
		this.currentIndex = 0;
		this.visibleCount = parseInt(container.getAttribute('data-visible') || '1');
		this.totalItems = this.items.length;
		this.maxIndex = Math.max(0, this.totalItems - this.visibleCount);
		
		this.init();
	}
	
	init() {
		this.createIndicators();
		this.updateUI();
		this.attachEvents();
		this.setupKeyboardNavigation();
		this.setupSwipeGestures();
	}
	
	createIndicators() {
		if (!this.indicatorsContainer) return;
		
		const indicatorCount = this.maxIndex + 1;
		for (let i = 0; i < indicatorCount; i++) {
			const btn = document.createElement('button');
			btn.setAttribute('type', 'button');
			btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
			btn.addEventListener('click', () => this.goToSlide(i));
			this.indicatorsContainer.appendChild(btn);
		}
	}
	
	attachEvents() {
		if (this.prevBtn) {
			this.prevBtn.addEventListener('click', () => this.previous());
		}
		if (this.nextBtn) {
			this.nextBtn.addEventListener('click', () => this.next());
		}
	}
	
	setupKeyboardNavigation() {
		this.container.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				this.previous();
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				this.next();
			}
		});
	}
	
	setupSwipeGestures() {
		let startX = 0;
		let currentX = 0;
		let isDragging = false;
		
		this.track.addEventListener('touchstart', (e) => {
			startX = e.touches[0].clientX;
			isDragging = true;
		}, { passive: true });
		
		this.track.addEventListener('touchmove', (e) => {
			if (!isDragging) return;
			currentX = e.touches[0].clientX;
		}, { passive: true });
		
		this.track.addEventListener('touchend', () => {
			if (!isDragging) return;
			isDragging = false;
			
			const diff = startX - currentX;
			if (Math.abs(diff) > 50) {
				if (diff > 0) {
					this.next();
				} else {
					this.previous();
				}
			}
		}, { passive: true });
	}
	
	next() {
		if (this.currentIndex < this.maxIndex) {
			this.currentIndex++;
			this.updateUI();
		}
	}
	
	previous() {
		if (this.currentIndex > 0) {
			this.currentIndex--;
			this.updateUI();
		}
	}
	
	goToSlide(index) {
		this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
		this.updateUI();
	}
	
	updateUI() {
		// Calculate transform (no gap for photo carousel)
		const itemWidth = this.items[0]?.offsetWidth || 0;
		const offset = -(this.currentIndex * itemWidth);
		this.track.style.transform = `translateX(${offset}px)`;
		
		// Update button states
		if (this.prevBtn) {
			this.prevBtn.disabled = this.currentIndex === 0;
		}
		if (this.nextBtn) {
			this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
		}
		
		// Update indicators
		if (this.indicatorsContainer) {
			const indicators = this.indicatorsContainer.querySelectorAll('button');
			indicators.forEach((btn, index) => {
				btn.classList.toggle('active', index === this.currentIndex);
			});
		}
	}
	
	// Handle window resize
	handleResize() {
		this.updateUI();
	}
}

// ============================================
// Lazy Loading Images
// ============================================

class LazyLoader {
	constructor() {
		if ('IntersectionObserver' in window) {
			this.initializeIntersectionObserver();
		}
	}

	initializeIntersectionObserver() {
		const images = $$('img[loading="lazy"]');
		const imageObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.getAttribute('data-src') || img.src;
					img.classList.add('loaded');
					imageObserver.unobserve(img);
				}
			});
		});

		images.forEach((img) => imageObserver.observe(img));
	}
}

// ============================================
// Animation on Scroll
// ============================================

class ScrollAnimation {
	constructor() {
		if ('IntersectionObserver' in window) {
			this.initializeAnimations();
		}
	}

	initializeAnimations() {
		const elements = $$('.article-list li, .hero-figure');
		const elementObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.style.opacity = '1';
					entry.target.style.transform = 'translateY(0)';
					elementObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.1 });

		elements.forEach((el) => {
			el.style.opacity = '0';
			el.style.transform = 'translateY(20px)';
			el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
			elementObserver.observe(el);
		});
	}
}

// ============================================
// Form Validation Helper
// ============================================

class FormValidator {
	static validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	static validatePhone(phone) {
		const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
		return phoneRegex.test(phone);
	}

	static validateForm(form) {
		const inputs = form.querySelectorAll('input, textarea');
		let isValid = true;

		inputs.forEach((input) => {
			if (!input.value.trim()) {
				input.setAttribute('aria-invalid', 'true');
				isValid = false;
			} else {
				input.removeAttribute('aria-invalid');
			}
		});

		return isValid;
	}
}

// ============================================
// Analytics Helper
// ============================================

class Analytics {
	static trackEvent(category, action, label = '') {
		if (window.gtag) {
			gtag('event', action, {
				event_category: category,
				event_label: label
			});
		}
	}

	static trackPageView(path, title) {
		if (window.gtag) {
			gtag('config', 'GA_MEASUREMENT_ID', {
				page_path: path,
				page_title: title
			});
		}
	}
}

// ============================================
// Performance Monitor
// ============================================

class PerformanceMonitor {
	static logMetrics() {
		if (window.performance && window.performance.timing) {
			const timing = performance.timing;
			const metrics = {
				domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
				loadComplete: timing.loadEventEnd - timing.navigationStart,
				domInteractive: timing.domInteractive - timing.navigationStart
			};
			console.log('Performance Metrics:', metrics);
		}
	}
}

// ============================================
// Initialize All Features
// ============================================

document.addEventListener('DOMContentLoaded', () => {
	// Initialize all components
	new LanguageSwitch();
	new MobileMenu();
	new Timeline();
	new ArticleCards();
	new SmoothScroll();
	new LazyLoader();
	new ScrollAnimation();

	// Initialize all carousels
	const carousels = [];
	$$('.carousel-container').forEach((container) => {
		const carousel = new Carousel(container);
		carousels.push(carousel);
	});

	// Handle window resize for carousels
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			carousels.forEach(carousel => carousel.handleResize());
		}, 150);
	});

	// Log performance metrics
	if (process.env.NODE_ENV === 'development') {
		PerformanceMonitor.logMetrics();
	}

	// Add loading complete indicator
	document.documentElement.classList.add('js-loaded');
	console.log('✓ Application initialized successfully');
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
	if (document.hidden) {
		// Pause animations if needed
	} else {
		// Resume animations if needed
	}
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		LanguageSwitch,
		MobileMenu,
		Timeline,
		ArticleCards,
		SmoothScroll,
		Carousel,
		LazyLoader,
		ScrollAnimation,
		FormValidator,
		Analytics,
		PerformanceMonitor
	};
}
