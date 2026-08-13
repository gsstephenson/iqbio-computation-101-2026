/* shared site utilities & universal copy button handlers */
(function(){
  /* scroll-reveal for .reveal elements */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.12});
    revealEls.forEach(function(el){ io.observe(el); });
  }

  /* Helper to decode HTML entities in data-copy attributes */
  function decodeEntities(str) {
    if (!str) return '';
    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  /* Helper to clean command strings by removing leading shell prompts */
  function cleanCommand(text) {
    if (!text) return '';
    return text.replace(/^\s*(?:\[you@[^\]]+\]\$|\$|>|#|%)\s*/, '')
               .replace(/\s+$/, '');
  }

  /* Helper to copy text to clipboard with feedback */
  function copyText(text, btn) {
    if (!text) return;
    var clean = decodeEntities(text);
    function markDone() {
      var orig = btn.textContent;
      btn.textContent = 'copied!';
      btn.classList.add('done');
      setTimeout(function(){
        btn.textContent = orig;
        btn.classList.remove('done');
      }, 1400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(clean).then(markDone).catch(function(){ fallback(clean); });
    } else {
      fallback(clean);
    }
    function fallback(val) {
      var ta = document.createElement('textarea');
      ta.value = val;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); markDone(); } catch(e) {}
      document.body.removeChild(ta);
    }
  }

  /* Extract text from element data-copy attribute or target code block */
  function getCodeText(btn) {
    var attr = btn.getAttribute('data-copy');
    if (attr !== null && attr.trim() !== '') {
      return decodeEntities(attr);
    }
    var container = btn.closest('.snip') || btn.parentElement;
    var target = container ? (container.querySelector('pre') || container.querySelector('code') || container) : null;
    if (!target) return '';
    
    var clone = target.cloneNode(true);
    clone.querySelectorAll('.copybtn, .linecopy, .p, .c').forEach(function(n){ n.remove(); });
    
    var lines = clone.textContent.split('\n');
    var cleaned = lines.map(function(l){ return cleanCommand(l); }).join('\n').trim();
    return cleaned;
  }

  /* Attach event handlers to copy buttons and code blocks */
  function setupCopyButtons() {
    document.querySelectorAll('.copybtn').forEach(function(btn){
      if (btn.dataset.boundCopy) return;
      btn.dataset.boundCopy = '1';
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        var txt = getCodeText(btn);
        copyText(txt, btn);
      });
    });

    document.querySelectorAll('.snip pre, pre').forEach(function(pre){
      if (pre.dataset.perline) return;
      
      var snip = pre.closest('.snip');
      var htmlContent = pre.innerHTML.split('\n');
      
      // Process any pre block with prompt markers or commands (single-line or multi-line)
      var hasPrompts = htmlContent.some(function(h){ return /class=["']p["']|\$|\[you@/.test(h); });
      if (!hasPrompts || htmlContent.length < 1) return;
      
      pre.dataset.perline = '1';
      
      pre.innerHTML = htmlContent.map(function(h){
        if (/class=["']p["']|\$|\[you@/.test(h)) {
          return '<span class="cmdline">' + h + '</span>';
        }
        return h;
      }).join('\n');

      pre.querySelectorAll('.cmdline').forEach(function(line){
        if (line.querySelector('.linecopy')) return;
        var c = line.cloneNode(true);
        c.querySelectorAll('.p, .c, .linecopy').forEach(function(n){ n.remove(); });
        var cmd = cleanCommand(c.textContent);
        if (!cmd) return;

        var b = document.createElement('button');
        b.className = 'linecopy';
        b.type = 'button';
        b.textContent = 'copy';
        b.setAttribute('aria-label', 'Copy this line: ' + cmd.slice(0, 60));
        b.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          copyText(cmd, b);
        });
        line.appendChild(b);
      });

      if (snip) {
        snip.classList.add('perline');
        snip.querySelectorAll('.copybtn').forEach(function(cb){
          if (!cb.classList.contains('linecopy')) {
            cb.remove();
          }
        });
      }
    });

    document.querySelectorAll('.snip').forEach(function(snip){
      if (!snip.querySelector('.copybtn') && !snip.querySelector('.linecopy')) {
        var btn = document.createElement('button');
        btn.className = 'copybtn';
        btn.type = 'button';
        btn.textContent = 'copy';
        snip.insertBefore(btn, snip.firstChild);
        btn.dataset.boundCopy = '1';
        btn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var txt = getCodeText(btn);
          copyText(txt, btn);
        });
      }
    });
  }

  /* Global event delegation for dynamic tabs and details elements */
  document.addEventListener('click', function(e){
    var target = e.target;
    if (target.closest('.levels button') || target.closest('.os-tabs button') || target.closest('summary') || target.classList.contains('copybtn') || target.classList.contains('linecopy')) {
      setTimeout(setupCopyButtons, 30);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCopyButtons);
  } else {
    setupCopyButtons();
  }

  window.initCopyButtons = setupCopyButtons;
})();
