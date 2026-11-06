(function () {
  var GATE_LINK = 'https://link-center.net/9477529/rcDHpdsAPsud';
  var WAIT = 10;
  var KEY = 'vaultUnlockedAt';
  if (location.hash === '#admin') return;
  if (location.hash === '#done') { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} return; }
  try { if (Date.now() - parseInt(localStorage.getItem(KEY) || '0', 10) < 30 * 60 * 1000) return; } catch (e) {}
  if (!/^https?:\/\//i.test(GATE_LINK)) return;

  var o = document.createElement('div');
  o.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#0f1117;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif;color:#e8eaf0;';
  var btn = 'display:block;width:100%;border:0;border-radius:8px;padding:12px;font-size:1rem;color:#fff;margin-top:10px;';
  o.innerHTML = '<div style="max-width:420px;width:100%;background:#1a1d27;border-radius:12px;padding:20px;text-align:center">' +
    '<h2 style="margin:0 0 8px">Unlock the Vault</h2>' +
    '<p style="color:#8b90a0;margin:0 0 8px;font-size:.95rem">Complete the step below to continue.</p>' +
    '<button id="gStep" style="' + btn + 'background:#6c8cff">Step 1: Open link</button>' +
    '<button id="gGo" disabled style="' + btn + 'background:#2a2e3d;opacity:.6">Continue</button></div>';
  document.body.appendChild(o);

  var step = document.getElementById('gStep'), go = document.getElementById('gGo'), started = false;
  step.onclick = function () {
    window.open(GATE_LINK, '_blank');
    if (started) return;
    started = true;
    var n = WAIT;
    go.textContent = 'Continue (' + n + ')';
    var iv = setInterval(function () {
      n--;
      if (n > 0) { go.textContent = 'Continue (' + n + ')'; return; }
      clearInterval(iv);
      go.textContent = 'Continue';
      go.disabled = false;
      go.style.opacity = '1';
      go.style.background = '#6c8cff';
    }, 1000);
  };
  go.onclick = func
