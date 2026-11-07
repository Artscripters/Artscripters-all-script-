(function () {
  var isAdmin = location.hash === '#admin';
  var boxes = [];
  var listEl = document.getElementById('list');
  var statusEl = document.getElementById('status');

  function setStatus(t) { statusEl.textContent = t; }

  function getPassword() {
    var p = null;
    try { p = sessionStorage.getItem('adminpw'); } catch (e) {}
    if (!p) {
      p = prompt('Admin password:');
      if (p) { try { sessionStorage.setItem('adminpw', p); } catch (e) {} }
    }
    return p;
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function resizeImage(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, 400 / Math.max(im.width, im.height));
        var c = document.createElement('canvas');
        c.width = Math.round(im.width * s);
        c.height = Math.round(im.height * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', 0.75));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  function imgEl(src) {
    var im = document.createElement('img');
    im.src = src; im.className = 'thumb';
    return im;
  }
