/**
 * ChairStudio AI — Main JavaScript
 * CRO-focused: scroll nav, active sections, lead form, toasts, analytics
 */

(function () {
	'use strict';

	var SCROLL_THRESHOLD = 60;
	var SUBMIT_DELAY_MS = 1500;
	var TOAST_DURATION_MS = 5000;

	/* ------------------------------------------------------------------ */
	/* Mock analytics                                                       */
	/* ------------------------------------------------------------------ */
	function trackEvent(name, data) {
		console.log('[Analytics]', name, data || {});
	}

	function initAnalytics() {
		document.querySelectorAll('[data-track]').forEach(function (el) {
			el.addEventListener('click', function () {
				trackEvent('cta_click', {
					id: el.getAttribute('data-track'),
					label: el.textContent.trim(),
					href: el.getAttribute('href') || null
				});
			});
		});
	}

	/* ------------------------------------------------------------------ */
	/* Toast system                                                         */
	/* ------------------------------------------------------------------ */
	function showToast(message, type) {
		var container = document.getElementById('toast-container');
		if (!container) return;

		var toast = document.createElement('div');
		toast.className = 'toast toast--' + (type || 'success');
		toast.setAttribute('role', 'alert');
		toast.textContent = message;
		container.appendChild(toast);

		setTimeout(function () {
			toast.classList.add('is-leaving');
			toast.addEventListener('animationend', function () {
				toast.remove();
			});
		}, TOAST_DURATION_MS);
	}

	/* ------------------------------------------------------------------ */
	/* Smooth scrolling                                                     */
	/* ------------------------------------------------------------------ */
	var navToggle = document.querySelector('.site-nav__toggle');
	var navMenu = document.querySelector('.site-nav__menu');

	function closeMobileMenu() {
		if (!navToggle || !navMenu) return;
		navToggle.setAttribute('aria-expanded', 'false');
		navMenu.classList.remove('is-open');
	}

	function initSmoothScroll() {
		document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
			anchor.addEventListener('click', function (event) {
				var targetId = this.getAttribute('href');
				if (targetId === '#') return;

				var target = document.querySelector(targetId);
				if (!target) return;

				event.preventDefault();
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
				closeMobileMenu();

				if (!target.hasAttribute('tabindex')) {
					target.setAttribute('tabindex', '-1');
				}
				target.focus({ preventScroll: true });
			});
		});
	}

	/* ------------------------------------------------------------------ */
	/* Mobile navigation                                                    */
	/* ------------------------------------------------------------------ */
	function initMobileNav() {
		if (!navToggle || !navMenu) return;

		navToggle.addEventListener('click', function () {
			var isOpen = navMenu.classList.toggle('is-open');
			navToggle.setAttribute('aria-expanded', String(isOpen));
		});

		document.addEventListener('click', function (event) {
			if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
				closeMobileMenu();
			}
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') closeMobileMenu();
		});
	}

	/* ------------------------------------------------------------------ */
	/* Scroll-based navbar + sticky CTA                                     */
	/* ------------------------------------------------------------------ */
	function initScrollEffects() {
		var siteNav = document.getElementById('site-nav');
		var stickyCta = document.getElementById('sticky-cta');
		var hero = document.getElementById('main-header');

		function onScroll() {
			var scrollY = window.scrollY;

			if (siteNav) {
				siteNav.classList.toggle('is-scrolled', scrollY > SCROLL_THRESHOLD);
			}

			if (stickyCta && hero) {
				var heroBottom = hero.offsetTop + hero.offsetHeight;
				var showSticky = scrollY > heroBottom && window.innerWidth > 600;
				stickyCta.classList.toggle('is-visible', showSticky);
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
	}

	/* ------------------------------------------------------------------ */
	/* Active nav link on scroll                                            */
	/* ------------------------------------------------------------------ */
	function initActiveNav() {
		var navLinks = document.querySelectorAll('.nav-link[data-section]');
		var sections = [];

		navLinks.forEach(function (link) {
			var id = link.getAttribute('data-section');
			var section = document.getElementById(id);
			if (section) sections.push({ id: id, el: section });
		});

		if (!sections.length) return;

		function updateActiveLink() {
			var scrollPos = window.scrollY + 120;
			var current = sections[0].id;

			sections.forEach(function (item) {
				if (scrollPos >= item.el.offsetTop) {
					current = item.id;
				}
			});

			navLinks.forEach(function (link) {
				var isActive = link.getAttribute('data-section') === current;
				link.classList.toggle('is-active', isActive);
				if (isActive) {
					link.setAttribute('aria-current', 'true');
				} else {
					link.removeAttribute('aria-current');
				}
			});
		}

		window.addEventListener('scroll', updateActiveLink, { passive: true });
		updateActiveLink();
	}

	/* ------------------------------------------------------------------ */
	/* Lead form validation + loading UX                                    */
	/* ------------------------------------------------------------------ */
	function showFieldError(input, message) {
		var errorEl = input.parentElement.querySelector('.form-error');
		input.classList.add('is-invalid');
		input.setAttribute('aria-invalid', 'true');
		if (errorEl) errorEl.textContent = message;
	}

	function clearFieldError(input) {
		var errorEl = input.parentElement.querySelector('.form-error');
		input.classList.remove('is-invalid');
		input.removeAttribute('aria-invalid');
		if (errorEl) errorEl.textContent = '';
	}

	function validateField(input) {
		if (input.hasAttribute('required') && input.validity.valueMissing) {
			showFieldError(input, 'This field is required.');
			return false;
		}
		if (input.type === 'email') {
			if (input.validity.typeMismatch) {
				showFieldError(input, 'Please enter a valid work email.');
				return false;
			}
			var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (input.value && !emailPattern.test(input.value)) {
				showFieldError(input, 'Please enter a valid work email.');
				return false;
			}
		}
		clearFieldError(input);
		return true;
	}

	function initLeadForm() {
		var form = document.getElementById('early-access-form');
		if (!form) return;

		var submitBtn = document.getElementById('submit-btn');
		var requiredFields = form.querySelectorAll('[required]');

		requiredFields.forEach(function (field) {
			field.addEventListener('blur', function () {
				if (field.value.trim() !== '') validateField(field);
			});
			field.addEventListener('input', function () {
				if (field.classList.contains('is-invalid')) validateField(field);
			});
		});

		form.addEventListener('submit', function (event) {
			event.preventDefault();

			var isValid = true;
			requiredFields.forEach(function (field) {
				if (!validateField(field)) isValid = false;
			});

			if (!isValid) {
				showToast('Please fix the errors before submitting.', 'error');
				var firstInvalid = form.querySelector('.is-invalid');
				if (firstInvalid) firstInvalid.focus();
				trackEvent('form_error', { reason: 'validation_failed' });
				return;
			}

			// Loading state
			if (submitBtn) {
				submitBtn.classList.add('is-loading');
				submitBtn.disabled = true;
			}

			trackEvent('form_submit_start', {
				email: form.querySelector('#lead-email').value
			});

			// Simulate API call
			setTimeout(function () {
				if (submitBtn) {
					submitBtn.classList.remove('is-loading');
					submitBtn.disabled = false;
				}

				form.reset();
				requiredFields.forEach(clearFieldError);

				showToast("You're on the list! We'll notify you when your spot is ready.", 'success');
				trackEvent('form_submit_success', { type: 'early_access' });
			}, SUBMIT_DELAY_MS);
		});
	}

	/* ------------------------------------------------------------------ */
	/* Init                                                                 */
	/* ------------------------------------------------------------------ */
	document.addEventListener('DOMContentLoaded', function () {
		initSmoothScroll();
		initMobileNav();
		initScrollEffects();
		initActiveNav();
		initLeadForm();
		initAnalytics();
	});
})();
