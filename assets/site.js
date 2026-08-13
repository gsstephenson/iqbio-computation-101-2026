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

  /* Helper to decode HTML entities */
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

  /* Robust clipboard copy handler with visual feedback */
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

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(clean).then(markDone).catch(function(){ fallback(clean); });
    } else {
      fallback(clean);
    }

    function fallback(val) {
      var ta = document.createElement('textarea');
      ta.value = val;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.left = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        var ok = document.execCommand('copy');
        if (ok) markDone();
      } catch(e) {}
      document.body.removeChild(ta);
    }
  }

  /* Extract clean text from a code container */
  function getCodeText(btn) {
    var attr = btn.getAttribute('data-copy');
    if (attr !== null && attr.trim() !== '') {
      return decodeEntities(attr);
    }
    var container = btn.closest('.snip') || btn.closest('.cell') || btn.parentElement;
    if (!container) return '';
    
    // If inside interactive python cell
    var textarea = container.querySelector('.cell-code');
    if (textarea) {
      return textarea.value;
    }

    var target = container.querySelector('pre') || container.querySelector('code') || container;
    if (!target) return '';
    
    var clone = target.cloneNode(true);
    clone.querySelectorAll('.copybtn, .linecopy, .p').forEach(function(n){ n.remove(); });
    
    var lines = clone.textContent.split('\n');
    var cleaned = lines.map(function(l){ return cleanCommand(l); }).join('\n').trim();
    return cleaned;
  }

  /* Initialize all copy buttons consistently across all code boxes */
  function setupCopyButtons() {
    // 1. Process all pre blocks
    document.querySelectorAll('.snip pre, pre').forEach(function(pre){
      if (pre.classList.contains('out') || pre.classList.contains('fex-receipt') || pre.dataset.perline) return;
      
      var snip = pre.closest('.snip');
      var lines = pre.innerHTML.split('\n');
      var hasPrompts = lines.some(function(h){ return /class=["']p["']|\$|\[you@/.test(h); });
      
      if (hasPrompts) {
        pre.dataset.perline = '1';
        pre.innerHTML = lines.map(function(h){
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
          b.setAttribute('aria-label', 'Copy this line');
          b.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            copyText(cmd, b);
          });
          line.appendChild(b);
        });

        if (snip) {
          snip.classList.add('perline');
          snip.querySelectorAll('.copybtn').forEach(function(cb){ cb.remove(); });
        }
      } else if (snip) {
        // Block-level code block without prompts (e.g. config file, python script, cheat sheet)
        if (!snip.querySelector('.copybtn')) {
          var btn = document.createElement('button');
          btn.className = 'copybtn';
          btn.type = 'button';
          btn.textContent = 'copy';
          snip.insertBefore(btn, snip.firstChild);
        }
      }
    });

    // 2. Add copy button to interactive python cells (.democell, .cell)
    document.querySelectorAll('.cell-bar').forEach(function(bar){
      if (bar.querySelector('.cell-copy')) return;
      var cell = bar.closest('.cell');
      if (!cell || !cell.querySelector('.cell-code')) return;

      var b = document.createElement('button');
      b.className = 'cell-copy';
      b.type = 'button';
      b.textContent = 'copy';
      b.setAttribute('aria-label', 'Copy Python code');
      b.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        var txt = getCodeText(b);
        copyText(txt, b);
      });
      // Insert before .run button
      var runBtn = bar.querySelector('.run');
      if (runBtn) {
        bar.insertBefore(b, runBtn);
      } else {
        bar.appendChild(b);
      }
    });

    // 3. Bind click events to all .copybtn elements
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
  }

  /* Global delegation for dynamic tabs and fold elements */
  document.addEventListener('click', function(e){
    var target = e.target;
    if (target.closest('.levels button') || target.closest('.os-tabs button') || target.closest('summary')) {
      setTimeout(setupCopyButtons, 40);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCopyButtons);
  } else {
    setupCopyButtons();
  }

  window.initCopyButtons = setupCopyButtons;
})();
