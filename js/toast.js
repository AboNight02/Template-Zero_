/**
 * ChairStudio AI — Toast notifications
 * Uses setTimeout for reliable dismissal (animationend is fallback only).
 */
(function (global) {
	'use strict';

	var TOAST_DURATION_MS = 4000;
	var TOAST_EXIT_MS = 300;

	function dismissToast(toast) {
		if (!toast || !toast.parentNode) return;
		toast.classList.add('is-leaving');

		setTimeout(function () {
			if (toast.parentNode) toast.remove();
		}, TOAST_EXIT_MS);
	}

	function showToast(message, type) {
		var container = document.getElementById('toast-container');
		if (!container) return;

		// Replace stacked toasts — show only the latest message
		container.querySelectorAll('.toast').forEach(function (existing) {
			existing.remove();
		});

		var toast = document.createElement('div');
		toast.className = 'toast toast--' + (type || 'success');
		toast.setAttribute('role', 'alert');
		toast.textContent = message;
		container.appendChild(toast);

		var dismissTimer = setTimeout(function () {
			dismissToast(toast);
		}, TOAST_DURATION_MS);

		// Allow click to dismiss early
		toast.addEventListener('click', function () {
			clearTimeout(dismissTimer);
			dismissToast(toast);
		});
	}

	global.showToast = showToast;
})(window);
