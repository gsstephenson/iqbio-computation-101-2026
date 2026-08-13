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
  function cleanPrompt(text) {
    if (!text) return '';
    return text.replace(/^\s*(?:\[[^\]]+\]\$|\$|>|%)\s*/, '')
               .replace(/\s+$/, '');
  }

  /* Helper to copy text to clipboard with animated feedback */
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
      ta.style.top = '0';
      ta.style.left = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); markDone(); } catch(e) {}
      document.body.removeChild(ta);
    }
  }

  /* Extract clean text from element data-copy attribute or target code block */
  function getCodeText(btn) {
    var attr = btn.getAttribute('data-copy');
    if (attr !== null && attr.trim() !== '') {
      return attr;
    }
    var container = btn.closest('.snip') || btn.parentElement;
    var target = container ? (container.querySelector('pre') || container.querySelector('code') || container) : null;
    if (!target) return '';
    
    var clone = target.cloneNode(true);
    clone.querySelectorAll('.copybtn, .linecopy').forEach(function(n){ n.remove(); });
    
    // Check if this block represents prompted shell commands
    var isShellPrompted = target.querySelector('.p') || /class=["']p["']|\$|\[you@/.test(target.innerHTML);
    
    if (isShellPrompted) {
      clone.querySelectorAll('.p, .c').forEach(function(n){ n.remove(); });
      var lines = clone.textContent.split('\n');
      var cleaned = lines.map(function(l){ return cleanPrompt(l); })
                         .filter(function(l){ return l.length > 0; })
                         .join('\n');
      return cleaned;
    }

    // Otherwise (Python code, YAML, config, text), preserve code comments & indentation
    return clone.textContent.replace(/^\n+/, '').replace(/\s+$/, '');
  }

  /* Extract command text for an individual shell command line */
  function getCommandLineText(lineEl) {
    var c = lineEl.cloneNode(true);
    c.querySelectorAll('.p, .c, .linecopy, .copybtn').forEach(function(n){ n.remove(); });
    return cleanPrompt(c.textContent);
  }

  /* Attach event handlers to copy buttons and code blocks across all pages */
  function setupCopyButtons() {
    // 1. Process all code blocks with multiple shell command lines
    document.querySelectorAll('.snip pre, pre').forEach(function(pre){
      if (pre.dataset.perline) return;
      if (pre.classList.contains('fex-receipt') || pre.classList.contains('out')) return;
      
      var snip = pre.closest('.snip');
      var html = pre.innerHTML.split('\n');
      
      var hasPrompts = html.filter(function(h){ return /class=["']p["']|^\s*(?:\$|\[you@)/.test(h); });
      if (hasPrompts.length < 2) return;
      
      pre.dataset.perline = '1';
      
      pre.innerHTML = html.map(function(h){
        if (/class=["']p["']|^\s*(?:\$|\[you@)/.test(h)) {
          return '<span class="cmdline">' + h + '</span>';
        }
        return h;
      }).join('\n');

      pre.querySelectorAll('.cmdline').forEach(function(line){
        var cmd = getCommandLineText(line);
        if (!cmd) return;

        var b = document.createElement('button');
        b.className = 'linecopy';
        b.type = 'button';
        b.textContent = 'copy';
        b.setAttribute('aria-label', 'Copy this line: ' + cmd.slice(0, 60));
        b.dataset.boundCopy = '1';
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

    // 2. Ensure all .snip containers have a copy button if not perline
    document.querySelectorAll('.snip').forEach(function(snip){
      var existingBtn = snip.querySelector('.copybtn');
      if (!existingBtn && !snip.classList.contains('perline')) {
        var btn = document.createElement('button');
        btn.className = 'copybtn';
        btn.type = 'button';
        btn.textContent = 'copy';
        snip.insertBefore(btn, snip.firstChild);
      }
    });

    // 3. Bind click handler to all block .copybtn elements
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCopyButtons);
  } else {
    setupCopyButtons();
  }

  window.initCopyButtons = setupCopyButtons;
})();
