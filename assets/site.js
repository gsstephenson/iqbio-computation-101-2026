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

  /* Helper to clean command strings by removing leading shell prompts */
  
  /* Helper to decode HTML entities in data-copy attributes */
  function decodeEntities(str) {
    if (!str) return '';
    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  function cleanCommand(text) {
    if (!text) return '';
    return text.replace(/^\s*(?:\[you@[^\]]+\]\$|\$|>|#|%)\s*/, '')
               .replace(/\s+$/, '');
  }

  /* Helper to copy text to clipboard with feedback */
  function copyText(text, btn) {
    if (!text) return;
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
      navigator.clipboard.writeText(text).then(markDone).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
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
      var html = pre.innerHTML.split('\n');
      
      var hasPrompts = html.some(function(h){ return /class=["']p["']|\$|\[you@/.test(h); });
      if (!hasPrompts || html.length < 2) return;
      
      pre.dataset.perline = '1';
      
      pre.innerHTML = html.map(function(h){
        if (/class=["']p["']|\$|\[you@/.test(h)) {
          return '<span class="cmdline">' + h + '</span>';
        }
        return h;
      }).join('\n');

      pre.querySelectorAll('.cmdline').forEach(function(line){
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

      if (snip && pre.querySelectorAll('.linecopy').length > 1) {
        snip.classList.add('perline');
      }
    });

    document.querySelectorAll('.snip').forEach(function(snip){
      if (!snip.querySelector('.copybtn') && !snip.classList.contains('perline')) {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCopyButtons);
  } else {
    setupCopyButtons();
  }

  
    document.querySelectorAll('.levels button, summary, .os-tabs button').forEach(function(tb){
      if(tb.dataset.boundTabCopy) return;
      tb.dataset.boundTabCopy = '1';
      tb.addEventListener('click', function(){
        setTimeout(setupCopyButtons, 50);
      });
    });
    
  window.initCopyButtons = setupCopyButtons;
})();

