(function () {
  var q = document.getElementById('q');
  var list = document.getElementById('list');
  var nores = document.getElementById('nores');
  if (!q || !list) return;

  function textOf(box) {
    var t = box.innerText || '';
    box.querySelectorAll('input,textarea').forEach(function (e) { t += ' ' + e.value; });
    return t.toLowerCase();
  }

  function filter() {
    var term = q.value.trim().toLowerCase();
    var shown = 0;
    Array.prototype.forEach.call(list.children, function (box) {
      var ok = !term || textOf(box).indexOf(term) !== -1;
      box.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    nores.style.display = (term && !shown) ? 'block' : 'none';
  }

  q.addEventListener('input', filter);
  new MutationObserver(function () { if (q.value) filter(); })
    .observe(list, { childList: true });
})();
