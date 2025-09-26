/* intro.js
   Controls the intro overlay: code stream + loader + sessionStorage logic
*/
(() => {
  const INTRO_KEY = 'intro_shown_v1'; // change key to reset behavior
  const introEl = document.getElementById('intro');
  const mainContent = document.getElementById('mainContent');
  const loaderProgress = document.getElementById('loaderProgress');
  const loaderText = document.getElementById('loaderText');
  const codeLines = document.getElementById('codeLines');
  const skipBtn = document.getElementById('skipBtn');

  // If intro has already been shown in this tab, skip it.
  if (sessionStorage.getItem(INTRO_KEY)) {
    showMainImmediately();
    return;
  }

  // Sample "code-like" snippets (colorized via spans)
  const snippets = [
    `// init app\nconst init = () => {\n  loadUser();\n  renderUI();\n};`,
    `function fetchProjects() {\n  return api.get('/projects').then(res => res.json());\n}`,
    `/* loading modules */\nimport React from 'react';\nimport Router from 'next/router';`,
    `for (let i = 0; i < 5; i++) {\n  console.log(\`build #\${i}\`);\n}`,
    `if (isAuthenticated) {\n  navigate('/dashboard');\n} else {\n  showWelcome();\n}`,
    `// pseudo-hacker stream\nlet token = "x9f3-..."; // secure`
  ];

  // A function to colorize pseudo-code (simple heuristics)
  function colorize(code) {
    return code
      .replace(/(\/\/.*$)/gm, '<span class="cm">$1</span>')
      .replace(/(["'`][^"'`]*["'`])/g, '<span class="str">$1</span>')
      .replace(/\b(function|const|let|var|return|if|else|for|while|import|from|new)\b/g, '<span class="kw">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="num">$1</span>')
      .replace(/([a-zA-Z_]\w*)(?=\s*\()/g, '<span class="fn">$1</span>');
  }

  // Animate code window: change snippet every 220ms to feel "scanning"
  let snippetIndex = 0;
  const changeInterval = 220;
  const codeInterval = setInterval(() => {
    snippetIndex = (snippetIndex + 1) % snippets.length;
    codeLines.innerHTML = colorize(snippets[snippetIndex] + '\n\n' + snippets[(snippetIndex + 1) % snippets.length]);
  }, changeInterval);

  // Loader logic: progress goes smoothly to 100% with small randomization
  let progress = 0;
  const step = () => {
    const now = Date.now();
    // non-linear increments
    const inc = Math.max(1, Math.round(Math.random() * (progress < 60 ? 6 : 2)));
    progress = Math.min(100, progress + inc);
    setProgress(progress);
    if (progress >= 100) {
      // finish
      clearInterval(loaderTimer);
      setTimeout(finishIntro, 300); // short pause at 100%
    }
  };
  let loaderTimer = setInterval(step, 30);

  function setProgress(p) {
    loaderProgress.style.width = p + '%';
    loaderText.textContent = 'Loading ' + p + '%';
    loaderProgress.parentElement.setAttribute('aria-valuenow', String(p));
  }

function finishIntro() {
  sessionStorage.setItem(INTRO_KEY, '1');
  clearInterval(codeInterval);

  // chạy hiệu ứng mờ dần
  introEl.classList.add('finish');

  // sau khi fade out thì xóa khỏi DOM
  setTimeout(() => {
    introEl.remove();
    mainContent.hidden = false;
  }, 1000); // 1000ms = thời gian transition opacity
}

  function showMainImmediately(){
    // reveal main content and ensure intro is hidden
    if (mainContent) {
      mainContent.hidden = false;
    }
    if (introEl) {
      introEl.style.display = 'none';
    }
  }

  // Skip behavior
  skipBtn.addEventListener('click', () => {
    clearInterval(loaderTimer);
    finishIntro();
  });

  /*/ Allow Esc to skip
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearInterval(loaderTimer);
      finishIntro();
    }
  });*/

  // Accessibility: if script loads and user prefers reduced motion, reduce animations
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    clearInterval(loaderTimer);
    setProgress(100);
    finishIntro();
  }

  // Ensure content hidden until intro finishes
  mainContent.hidden = true;

  // Safety: if something goes wrong, auto-finish after 8 seconds
  setTimeout(() => {
    if (!sessionStorage.getItem(INTRO_KEY)) {
      finishIntro();
    }
  }, 8000);
})();
