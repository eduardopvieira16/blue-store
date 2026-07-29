const BLOCKED_KEY_COMBINATIONS = new Set(['i', 'j', 'c', 'k']);
const DETECTION_THRESHOLD = 160;
const DETECTION_INTERVAL_MS = 1200;
const OVERLAY_ID = 'devtools-protection-overlay';
const TOAST_ID = 'devtools-protection-toast';

function createOverlay(): HTMLDivElement {
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.zIndex = '99999';
  overlay.style.display = 'none';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '24px';
  overlay.style.background = 'rgba(7, 10, 22, 0.72)';
  overlay.style.backdropFilter = 'blur(6px)';
  overlay.style.pointerEvents = 'none';
  overlay.innerHTML = `
    <div style="
      max-width: 420px;
      padding: 22px 24px;
      border-radius: 2px;
      background: #12162b;
      border: 1px solid rgba(255,255,255,0.08);
      color: #f6f7ff;
      font-family: Arial, Helvetica, sans-serif;
      text-align: center;
      pointer-events: auto;
    ">
      <strong style="display:block;font-size:1rem;margin-bottom:8px;">Ambiente protegido</strong>
      <p style="margin:0;color:#c0c6e5;font-size:0.86rem;line-height:1.55;">
        Este ambiente de demonstração restringe atalhos e inspeção da interface.
      </p>
    </div>
  `;
  return overlay;
}

function createToast(): HTMLDivElement {
  const toast = document.createElement('div');
  toast.id = TOAST_ID;
  toast.setAttribute('aria-live', 'polite');
  toast.style.position = 'fixed';
  toast.style.left = '50%';
  toast.style.bottom = '22px';
  toast.style.transform = 'translateX(-50%)';
  toast.style.zIndex = '100000';
  toast.style.display = 'none';
  toast.style.padding = '10px 14px';
  toast.style.borderRadius = '2px';
  toast.style.background = '#171b32';
  toast.style.color = '#f6f7ff';
  toast.style.fontFamily = 'Arial, Helvetica, sans-serif';
  toast.style.fontSize = '0.8rem';
  toast.style.pointerEvents = 'none';
  return toast;
}

export function enableDevToolsProtection(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => undefined;
  }

  const overlay = (document.getElementById(OVERLAY_ID) as HTMLDivElement | null) ?? createOverlay();
  const toast = (document.getElementById(TOAST_ID) as HTMLDivElement | null) ?? createToast();

  if (!overlay.isConnected) {
    document.body.appendChild(overlay);
  }

  if (!toast.isConnected) {
    document.body.appendChild(toast);
  }

  let toastTimeout: number | undefined;
  let detectionTimer: number | undefined;
  let lastDetectedState = false;

  const showToast = (message: string): void => {
    toast.textContent = message;
    toast.style.display = 'block';

    if (toastTimeout) {
      window.clearTimeout(toastTimeout);
    }

    toastTimeout = window.setTimeout(() => {
      toast.style.display = 'none';
    }, 1800);
  };

  const preventContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
    showToast('Menu de contexto desativado neste ambiente.');
  };

  const preventDeveloperShortcuts = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    const blocksF12 = event.key === 'F12';
    const blocksDevTools = (event.ctrlKey || event.metaKey) && event.shiftKey && BLOCKED_KEY_COMBINATIONS.has(key);
    const blocksSource = (event.ctrlKey || event.metaKey) && key === 'u';
    const blocksSave = (event.ctrlKey || event.metaKey) && key === 's';

    if (blocksF12 || blocksDevTools || blocksSource || blocksSave) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showToast('Atalho indisponível neste ambiente de demonstração.');
    }
  };

  const detectDevTools = (): void => {
    const widthGap = window.outerWidth - window.innerWidth;
    const heightGap = window.outerHeight - window.innerHeight;
    const isOpen = widthGap > DETECTION_THRESHOLD || heightGap > DETECTION_THRESHOLD;

    if (isOpen !== lastDetectedState) {
      overlay.style.display = isOpen ? 'flex' : 'none';
      lastDetectedState = isOpen;
    }

    detectionTimer = window.setTimeout(detectDevTools, DETECTION_INTERVAL_MS);
  };

  document.addEventListener('contextmenu', preventContextMenu, true);
  window.addEventListener('keydown', preventDeveloperShortcuts, true);
  detectDevTools();

  return () => {
    document.removeEventListener('contextmenu', preventContextMenu, true);
    window.removeEventListener('keydown', preventDeveloperShortcuts, true);

    if (toastTimeout) {
      window.clearTimeout(toastTimeout);
    }

    if (detectionTimer) {
      window.clearTimeout(detectionTimer);
    }

    overlay.remove();
    toast.remove();
  };
}
