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
  function render() {
    listEl.innerHTML = '';
    if (!boxes.length) {
      var empty = document.createElement('div');
      empty.className = 'box';
      empty.textContent = isAdmin ? 'No text boxes yet. Tap "+ Add text box".' : 'Nothing here yet.';
      listEl.appendChild(empty);
      return;
    }
    boxes.forEach(function (b, i) {
      var card = document.createElement('div');
      card.className = 'box';
      var okImg = typeof b.img === 'string' && b.img.indexOf('data:image/') === 0;
      if (isAdmin) {
        var t = document.createElement('input');
        t.value = b.title || ''; t.placeholder = 'Title';
        t.oninput = function () { b.title = t.value; };
        var l = document.createElement('input');
        l.value = b.link || ''; l.placeholder = 'Link (optional, https://...)';
        l.oninput = function () { b.link = l.value; };
        var x = document.createElement('textarea');
        x.value = b.text || ''; x.placeholder = 'Text';
        x.oninput = function () { b.text = x.value; };
        var pic = document.createElement('input');
        pic.type = 'file'; pic.accept = 'image/*';
        pic.onchange = function () {
          if (!pic.files[0]) return;
          resizeImage(pic.files[0], function (d) { b.img = d; render(); });
        };
        var row = document.createElement('div'); row.className = 'row';
        var up = document.createElement('button'); up.className = 'ghost'; up.textContent = '↑';
        up.onclick = function () { if (i > 0) { boxes.splice(i - 1, 0, boxes.splice(i, 1)[0]); render(); } };
        var down = document.createElement('button'); down.className = 'ghost'; down.textContent = '↓';
        down.onclick = function () { if (i < boxes.length - 1) { boxes.splice(i + 1, 0, boxes.splice(i, 1)[0]); render(); } };
        var del = document.createElement('button'); del.className = 'danger'; del.textContent = 'Delete';
        del.onclick = function () { if (confirm('Delete this box?')) { boxes.splice(i, 1); render(); } };
        row.appendChild(up); row.appendChild(down); row.appendChild(del);
        if (okImg) {
          var rm = document.createElement('button'); rm.className = 'ghost'; rm.textContent = 'Remove image';
          rm.onclick = function () { b.img = ''; render(); };
          row.appendChild(rm);
        }
        card.appendChild(t); card.appendChild(l);
        if (okImg) card.appendChild(imgEl(b.img));
        card.appendChild(pic); card.appendChild(x); card.appendChild(row);
      } else {
        if (okImg) card.appendChild(imgEl(b.img));
        var h = document.createElement('h2'); h.textContent = b.title || 'Untitled';
        card.appendChild(h);
        var link = /^https?:\/\//i.test(b.link || '') ? b.link : '';
        if (link) {
          var go = document.createElement('button'); go.textContent = 'Get script';
          go.onclick = function () { window.location.href = link; };
          card.appendChild(go);
        } else {
          var pre = document.createElement('pre'); pre.textContent = b.text || '';
          var copy = document.createElement('button'); copy.textContent = 'Copy';
          copy.onclick = function () {
            function done() { copy.textContent = 'Copied!'; setTimeout(function () { copy.textContent = 'Copy'; }, 1500); }
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(b.text || '').then(done, function () { fallbackCopy(b.text || ''); done(); });
            } else { fallbackCopy(b.text || ''); done(); }
          };
          var get = document.createElement('button'); get.className = 'ghost'; get.style.marginLeft = '8px'; get.textContent = 'Get script';
          get.onclick = function () {
            var blob = new Blob([b.text || ''], { type: 'text/plain' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = ((b.title || 'script').replace(/[^a-z0-9_-]+/gi, '_')) + '.txt';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
          };
          card.appendChild(pre); card.appendChild(copy); card.appendChild(get);
        }
      }
      listEl.appendChild(card);
    });
 }
