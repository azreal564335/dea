/**
 * ============================================================================
 * 💬 IN-PAGE MODAL & TOAST DIALOG SYSTEM (js/ui-modal.js)
 * ============================================================================
 * Sandboxed iframe compatible replacement for window.alert, window.prompt,
 * and window.confirm. Designed specifically for kids with large readable text,
 * playful buttons, keyboard shortcuts (Enter to submit, Escape to close),
 * and non-blocking toast notifications.
 * ============================================================================
 */

(function () {
  'use strict';

  const UIModal = {
    overlayEl: null,
    toastContainerEl: null,
    activeResolver: null,

    init() {
      if (document.getElementById('ui-modal-overlay')) return;

      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.id = 'ui-modal-overlay';
      overlay.className = 'ui-modal-overlay';
      overlay.style.display = 'none';
      document.body.appendChild(overlay);
      this.overlayEl = overlay;

      // Create toast container
      const toasts = document.createElement('div');
      toasts.id = 'ui-toast-container';
      toasts.className = 'ui-toast-container';
      document.body.appendChild(toasts);
      this.toastContainerEl = toasts;

      // Global keyboard handler for modal
      document.addEventListener('keydown', (e) => {
        if (!this.overlayEl || this.overlayEl.style.display === 'none') return;

        if (e.key === 'Escape') {
          e.preventDefault();
          this.close(null);
        } else if (e.key === 'Enter') {
          // If in input, submit prompt
          const input = this.overlayEl.querySelector('.ui-modal-input');
          if (input && document.activeElement === input) {
            e.preventDefault();
            this.close(input.value);
          } else if (!input) {
            // For alert/confirm, Enter triggers OK
            e.preventDefault();
            this.close(true);
          }
        }
      });
    },

    ensureDom() {
      if (!this.overlayEl || !document.body.contains(this.overlayEl)) {
        this.init();
      }
    },

    close(result) {
      if (!this.overlayEl) return;
      this.overlayEl.style.display = 'none';
      this.overlayEl.innerHTML = '';
      if (typeof this.activeResolver === 'function') {
        const res = this.activeResolver;
        this.activeResolver = null;
        res(result);
      }
    },

    /**
     * Show custom alert dialog
     * @param {string} message
     * @param {string} [title]
     * @returns {Promise<void>}
     */
    alert(message, title = '💡 提示') {
      this.ensureDom();
      return new Promise((resolve) => {
        this.activeResolver = resolve;

        this.overlayEl.innerHTML = `
          <div class="ui-modal-card" role="dialog" aria-modal="true">
            <div class="ui-modal-header">
              <h3 class="ui-modal-title">${this.escapeHtml(title)}</h3>
              <button class="ui-modal-close" aria-label="關閉" onclick="window.UIModal.close(undefined)">✕</button>
            </div>
            <div class="ui-modal-body">
              <div class="ui-modal-message">${this.formatMessage(message)}</div>
            </div>
            <div class="ui-modal-footer">
              <button class="ui-modal-btn ui-modal-btn-primary" id="ui-modal-ok-btn" onclick="window.UIModal.close(undefined)">
                確定 (OK)
              </button>
            </div>
          </div>
        `;

        this.overlayEl.style.display = 'flex';
        const okBtn = document.getElementById('ui-modal-ok-btn');
        if (okBtn) okBtn.focus();
      });
    },

    /**
     * Show custom confirm dialog
     * @param {string} message
     * @param {string} [title]
     * @returns {Promise<boolean>}
     */
    confirm(message, title = '❓ 請確認') {
      this.ensureDom();
      return new Promise((resolve) => {
        this.activeResolver = resolve;

        this.overlayEl.innerHTML = `
          <div class="ui-modal-card" role="dialog" aria-modal="true">
            <div class="ui-modal-header">
              <h3 class="ui-modal-title">${this.escapeHtml(title)}</h3>
              <button class="ui-modal-close" aria-label="關閉" onclick="window.UIModal.close(false)">✕</button>
            </div>
            <div class="ui-modal-body">
              <div class="ui-modal-message">${this.formatMessage(message)}</div>
            </div>
            <div class="ui-modal-footer">
              <button class="ui-modal-btn ui-modal-btn-secondary" onclick="window.UIModal.close(false)">
                取消 (Cancel)
              </button>
              <button class="ui-modal-btn ui-modal-btn-primary" id="ui-modal-ok-btn" onclick="window.UIModal.close(true)">
                確定 (OK)
              </button>
            </div>
          </div>
        `;

        this.overlayEl.style.display = 'flex';
        const okBtn = document.getElementById('ui-modal-ok-btn');
        if (okBtn) okBtn.focus();
      });
    },

    /**
     * Show custom prompt dialog
     * @param {string} message
     * @param {string} [defaultValue]
     * @param {string} [title]
     * @returns {Promise<string|null>}
     */
    prompt(message, defaultValue = '', title = '✏️ 請輸入') {
      this.ensureDom();
      return new Promise((resolve) => {
        this.activeResolver = resolve;

        const val = defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : '';

        this.overlayEl.innerHTML = `
          <div class="ui-modal-card" role="dialog" aria-modal="true">
            <div class="ui-modal-header">
              <h3 class="ui-modal-title">${this.escapeHtml(title)}</h3>
              <button class="ui-modal-close" aria-label="關閉" onclick="window.UIModal.close(null)">✕</button>
            </div>
            <div class="ui-modal-body">
              <div class="ui-modal-message">${this.formatMessage(message)}</div>
              <input type="text"
                     class="ui-modal-input"
                     id="ui-modal-prompt-input"
                     value="${this.escapeHtml(val)}"
                     autocomplete="off" />
            </div>
            <div class="ui-modal-footer">
              <button class="ui-modal-btn ui-modal-btn-secondary" onclick="window.UIModal.close(null)">
                取消 (Cancel)
              </button>
              <button class="ui-modal-btn ui-modal-btn-primary" id="ui-modal-ok-btn"
                      onclick="window.UIModal.close(document.getElementById('ui-modal-prompt-input').value)">
                確定 (OK)
              </button>
            </div>
          </div>
        `;

        this.overlayEl.style.display = 'flex';
        const input = document.getElementById('ui-modal-prompt-input');
        if (input) {
          input.focus();
          input.select();
        }
      });
    },

    /**
     * Show friendly non-blocking toast notification
     * @param {string} message
     * @param {number} [duration]
     */
    toast(message, duration = 3200) {
      this.ensureDom();
      if (!this.toastContainerEl) return;

      const pill = document.createElement('div');
      pill.className = 'ui-toast-pill';
      pill.innerHTML = `<span>${this.escapeHtml(message)}</span>`;
      pill.onclick = () => pill.remove();

      this.toastContainerEl.appendChild(pill);

      setTimeout(() => {
        pill.style.opacity = '0';
        pill.style.transform = 'translateY(-10px)';
        pill.style.transition = 'all 0.25s ease';
        setTimeout(() => pill.remove(), 260);
      }, duration);
    },

    escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    formatMessage(str) {
      return this.escapeHtml(str).replace(/\n/g, '<br/>');
    }
  };

  // Expose to window
  window.UIModal = UIModal;

  // Polyfill native blocking dialogs safely for sandbox compatibility
  window.alert = function (msg) {
    return UIModal.alert(msg);
  };
  window.confirm = function (msg) {
    return UIModal.confirm(msg);
  };
  window.prompt = function (msg, def) {
    return UIModal.prompt(msg, def);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIModal.init());
  } else {
    UIModal.init();
  }
})();
