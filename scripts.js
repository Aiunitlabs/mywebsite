// scripts.js
// Handles: 1) footer year; 2) mobile nav toggle; 3) accessible flyout submenu behavior & keyboard navigation.

(function () {
  // FOOTER YEAR
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // NAV TOGGLE (mobile)
  const nav = document.getElementById('main-nav');
  const btn = document.getElementById('navToggle');
  if (nav && btn) {
    function setNavVisibility(visible) {
      nav.dataset.visible = visible ? 'true' : 'false';
      nav.setAttribute('aria-hidden', String(!visible));
      btn.setAttribute('aria-expanded', String(visible));
      if (visible) {
        // move focus into first menuitem for keyboard users
        const first = nav.querySelector('[role="menuitem"], .submenu-toggle');
        if (first) first.focus();
      }
    }
    btn.addEventListener('click', function () {
      setNavVisibility(nav.dataset.visible !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.dataset.visible === 'true') {
        setNavVisibility(false);
        btn.focus();
      }
    });
  }

  // SUBMENU TOGGLING + KEYBOARD NAV
  // - .submenu-toggle buttons open/close their immediate submenu
  // - clicking outside closes open menus
  const submenuToggles = Array.from(document.querySelectorAll('.submenu-toggle'));

  submenuToggles.forEach(toggle => {
    const parentLi = toggle.closest('.has-submenu');
    const submenuId = toggle.getAttribute('aria-controls');
    const submenu = submenuId ? document.getElementById(submenuId) : toggle.nextElementSibling;

    // click toggles
    toggle.addEventListener('click', function (e) {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      // close any sibling open submenus at same level
      const siblings = parentLi.parentElement ? Array.from(parentLi.parentElement.children) : [];
      siblings.forEach(sib => {
        if (sib !== parentLi && sib.classList.contains('has-submenu')) {
          sib.classList.remove('open');
          const sibBtn = sib.querySelector('.submenu-toggle');
          if (sibBtn) sibBtn.setAttribute('aria-expanded', 'false');
        }
      });

      parentLi.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        // move focus to first item in submenu
        const firstItem = submenu ? submenu.querySelector('[role="menuitem"], .submenu-toggle, a') : null;
        if (firstItem) firstItem.focus();
      }
      e.stopPropagation();
    });

    // keyboard handling for each toggle
    toggle.addEventListener('keydown', function (e) {
      const key = e.key;
      if (key === 'ArrowDown') {
        // open submenu and focus first item
        toggle.click();
        e.preventDefault();
      } else if (key === 'ArrowRight') {
        // if has nested submenu and it's closed, open it
        if (parentLi.classList.contains('has-submenu') && submenu && submenu.classList.contains('level-2')) {
          toggle.click();
          e.preventDefault();
        }
      } else if (key === 'Escape') {
        // close this submenu
        parentLi.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
        e.stopPropagation();
      }
    });
  });

  // Keyboard navigation among menuitems (ArrowUp/ArrowDown)
  document.querySelectorAll('[role="menubar"], [role="menu"]').forEach(menu => {
    menu.addEventListener('keydown', function (e) {
      const key = e.key;
      const items = Array.from(menu.querySelectorAll('[role="menuitem"], .submenu-toggle'));
      const active = document.activeElement;
      const idx = items.indexOf(active);
      if (key === 'ArrowDown') {
        e.preventDefault();
        const next = items[(idx + 1) % items.length] || items[0];
        next.focus();
      } else if (key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[(idx - 1 + items.length) % items.length] || items[items.length - 1];
        prev.focus();
      }
    });
  });

  // Close menus when clicking outside
  document.addEventListener('click', function (e) {
    // close all open submenu parents
    document.querySelectorAll('.has-submenu.open').forEach(li => {
      if (!li.contains(e.target)) {
        li.classList.remove('open');
        const btn = li.querySelector('.submenu-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close submenus on Escape (global)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-submenu.open').forEach(li => {
        li.classList.remove('open');
        const btn = li.querySelector('.submenu-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });
})();
