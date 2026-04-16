/* ══════════════════════════════════════════
   GridSense — app.js
   AI Event Intelligence Platform
   ══════════════════════════════════════════ */

'use strict';

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initScrollAnimations();
  initCounters();
  initChatDemo();
  initArena();
  initQueueAnimation();
  initDashboardAnimation();
  initLiveAlerts();
  initSafetyVoice();
});

// ════════════════════════════════════════
// 1. NAVBAR
// ════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger?.querySelectorAll('span') || [];
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ════════════════════════════════════════
// 2. PARTICLES
// ════════════════════════════════════════
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#3b82f6', '#06b6d4', '#a855f7', '#f59e0b'];
  const count = 25;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1.5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: -${Math.random() * 20}s;
      opacity: ${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }
}

// ════════════════════════════════════════
// 3. SCROLL ANIMATIONS
// ════════════════════════════════════════
function initScrollAnimations() {
  const revealEls = [
    ...document.querySelectorAll('.feature-card'),
    ...document.querySelectorAll('.pipeline-step'),
    ...document.querySelectorAll('.module-row'),
    ...document.querySelectorAll('.tech-card'),
    ...document.querySelectorAll('.section-header'),
    document.querySelector('.arena-layout'),
    document.querySelector('.tech-quote'),
    document.querySelector('.cta-inner'),
  ].filter(Boolean);

  revealEls.forEach(el => el.classList.add('reveal'));

  // Feature cards stagger
  document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
  document.querySelectorAll('.tech-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });
  document.querySelectorAll('.pipeline-step').forEach((step, i) => {
    step.style.transitionDelay = `${i * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// ════════════════════════════════════════
// 4. HERO STAT COUNTERS
// ════════════════════════════════════════
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const targets = [4, 99];
  let done = false;

  const startCounters = () => {
    if (done) return;
    done = true;
    counters.forEach((el, i) => {
      const target = targets[i] ?? 0;
      if (!target) return;
      let current = 0;
      const duration = 1500;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, 16);
    });
  };

  // Start after a short delay (hero is always visible)
  setTimeout(startCounters, 600);
}

// ════════════════════════════════════════
// 5. EVENT ASSISTANT CHAT DEMO
// ════════════════════════════════════════
function initChatDemo() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const messages = document.getElementById('chat-messages');
  if (!input || !sendBtn || !messages) return;

  const aiResponses = {
    default: "Great question! Let me check the event schedule and venue map for you.",
    stage: "The Main Stage (Hall A) is located in the North wing, Level 1. Take the East corridor from the main entrance — it's about a 3-minute walk, currently clear of congestion!",
    food: "The Food Court is in the South Pavilion (Level 2). Best route right now: North Corridor → Escalator → East Bridge. Estimated wait: 5 min.",
    parking: "Parking Lot C is the closest with spaces available. Exit via Gate B, turn right — Lot C is 200m on your left.",
    schedule: "Here's a quick schedule summary: 2:00 PM — Opening session (Hall A), 3:30 PM — Keynote (Hall A), 5:00 PM — Panel discussions (Rooms 3-7), 7:00 PM — Networking dinner.",
    help: "I can help with: navigation, schedules, facilities, emergency info, and event updates! I'm powered by Claude AI for instant, accurate answers.",
    restroom: "The nearest restrooms are at both ends of the main corridor (Level 1) and next to the food court (Level 2). Currently no congestion at either location.",
    wifi: "Event WiFi: Network: GridSense_Event | Password: SENSE2024. For the best signal, boosters are located in all session halls.",
    first: "First Aid station is near Gate A on Level 1. For emergencies, contact event staff (wearing orange vests) or call the emergency hotline: 1800-GRID-911.",
  };

  function getResponse(text) {
    const t = text.toLowerCase();
    if (t.includes('stage') || t.includes('hall') || t.includes('main')) return aiResponses.stage;
    if (t.includes('food') || t.includes('eat') || t.includes('court') || t.includes('hunger')) return aiResponses.food;
    if (t.includes('park')) return aiResponses.parking;
    if (t.includes('schedule') || t.includes('keynote') || t.includes('session') || t.includes('time')) return aiResponses.schedule;
    if (t.includes('restroom') || t.includes('toilet') || t.includes('bathroom')) return aiResponses.restroom;
    if (t.includes('wifi') || t.includes('internet') || t.includes('network')) return aiResponses.wifi;
    if (t.includes('first aid') || t.includes('medical') || t.includes('emergency') || t.includes('help')) return t.includes('emergency') ? aiResponses.first : aiResponses.help;
    return aiResponses.default + ` Based on your message "${text.slice(0, 30)}...", I'd recommend checking with event staff or heading to the Info Desk in the main lobby.`;
  }

  function addMessage(text, type) {
    const el = document.createElement('div');
    el.className = `chat-msg ${type}`;
    if (type === 'bot') {
      el.innerHTML = `<span class="bot-icon">🤖</span><span>${text}</span>`;
    } else {
      el.textContent = text;
    }
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;

    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return el;
  }

  function addTypingIndicator() {
    const el = document.createElement('div');
    el.className = 'chat-msg bot';
    el.id = 'typing-indicator';
    el.innerHTML = `<span class="bot-icon">🤖</span><span style="display:flex;gap:4px;align-items:center;padding:4px 0">
      <span style="width:7px;height:7px;background:#3b82f6;border-radius:50%;animation:pulse 0.8s ease 0s infinite"></span>
      <span style="width:7px;height:7px;background:#3b82f6;border-radius:50%;animation:pulse 0.8s ease 0.2s infinite"></span>
      <span style="width:7px;height:7px;background:#3b82f6;border-radius:50%;animation:pulse 0.8s ease 0.4s infinite"></span>
    </span>`;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  let sending = false;
  function sendMessage() {
    if (sending) return;
    const text = input.value.trim();
    if (!text) return;

    sending = true;
    input.value = '';
    addMessage(text, 'user');

    const typing = addTypingIndicator();
    setTimeout(() => {
      typing.remove();
      addMessage(getResponse(text), 'bot');
      sending = false;
    }, 900 + Math.random() * 600);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
}

// ════════════════════════════════════════
// 6. ARENA / PROMPT BATTLE
// ════════════════════════════════════════
function initArena() {
  const nameInput = document.getElementById('player-name');
  const promptInput = document.getElementById('prompt-input');
  const charCount = document.getElementById('char-count');
  const submitBtn = document.getElementById('submit-prompt');
  const modal = document.getElementById('score-modal');
  const modalClose = document.getElementById('modal-close');
  const modalOk = document.getElementById('modal-ok');
  const lbList = document.getElementById('lb-list');
  const entryCount = document.getElementById('entry-count');
  const lbRefresh = document.getElementById('lb-refresh');
  const scoreRingFill = document.getElementById('score-ring-fill');
  const modalScore = document.getElementById('modal-score');
  const modalRankText = document.getElementById('modal-rank-text');

  let totalEntries = 127;

  promptInput?.addEventListener('input', () => {
    const len = promptInput.value.length;
    if (charCount) charCount.textContent = len;
  });

  // Fake leaderboard names/previews for demo entries
  const fakeNames = ['GridMaster', 'QuantumPen', 'NovaByte', 'SynthSage', 'EchoNode', 
                     'CipherMind', 'VectorAI', 'DataDruid', 'FluxWriter', 'NeuPath'];
  const fakePreviews = [
    '"When detecting crowd emergency, prioritize..."',
    '"Act as an event safety officer who must..."',
    '"Analyze the following crowd report and output..."',
    '"You are a crisis management AI. Given..."',
    '"Step 1: Parse reports. Step 2: Classify..."',
  ];

  submitBtn?.addEventListener('click', () => {
    const name = nameInput?.value.trim() || 'Anonymous';
    const prompt = promptInput?.value.trim();
    if (!prompt || prompt.length < 20) {
      shakeElement(promptInput);
      promptInput?.focus();
      return;
    }

    // Animate submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 0.8s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Analyzing with Claude AI...`;

    setTimeout(() => {
      const score = calculateScore(prompt);
      showScoreModal(name, score, prompt);
      addToLeaderboard(name, prompt, score);
      totalEntries++;
      if (entryCount) entryCount.textContent = `${totalEntries} entries submitted`;
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Submit to Arena`;
      if (promptInput) { promptInput.value = ''; charCount.textContent = '0'; }
      if (nameInput) nameInput.value = '';
    }, 2200);
  });

  function calculateScore(prompt) {
    let score = 40;
    const words = prompt.split(/\s+/).length;
    const hasContext = /context|background|you are|act as|imagine|role/i.test(prompt);
    const hasConstraints = /must|should|avoid|ensure|format|output|structure|step/i.test(prompt);
    const hasSpecific = /crowd|event|gate|emergency|panic|safety|density|redirect/i.test(prompt);
    const hasPunctuation = prompt.includes(',') || prompt.includes('.') || prompt.includes(':');
    const hasNumbers = /\d/.test(prompt);
    const hasQuotes = prompt.includes('"') || prompt.includes("'");

    score += Math.min(words * 0.5, 15); // up to 15 for word count
    if (hasContext) score += 12;
    if (hasConstraints) score += 10;
    if (hasSpecific) score += 8;
    if (hasPunctuation) score += 5;
    if (hasNumbers) score += 5;
    if (hasQuotes) score += 5;

    return Math.min(Math.round(score + Math.random() * 4 - 2), 100);
  }

  function showScoreModal(name, score, prompt) {
    if (!modal) return;
    modal.classList.remove('hidden');
    if (modalScore) modalScore.textContent = '0';

    // Animate score ring
    const circumference = 263.9;
    const offset = circumference - (score / 100) * circumference;
    if (scoreRingFill) {
      scoreRingFill.style.transition = 'none';
      scoreRingFill.style.strokeDashoffset = circumference;
      void scoreRingFill.offsetWidth;
      scoreRingFill.style.transition = 'stroke-dashoffset 1.5s ease';
      scoreRingFill.style.strokeDashoffset = offset;
    }

    // Animate score number
    let n = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      n = Math.min(n + step, score);
      if (modalScore) modalScore.textContent = Math.floor(n);
      if (n >= score) clearInterval(timer);
    }, 25);

    // Rank text
    const rankTexts = {
      90: `🔥 Amazing, ${name}! You're in the top tier!`,
      75: `⚡ Great work, ${name}! A very strong prompt.`,
      60: `👍 Good effort, ${name}! Room to grow.`,
      0: `💡 Keep practicing, ${name}! Specificity is key.`
    };
    const rankText = Object.entries(rankTexts).find(([min]) => score >= parseInt(min));
    if (modalRankText) modalRankText.textContent = rankText ? rankText[1] : rankTexts[0];

    // Breakdown
    const creativity = Math.min(Math.round(score * 0.33 + Math.random() * 5), 33);
    const specificity = Math.min(Math.round(score * 0.38 + Math.random() * 5), 38);
    const impact = score - creativity - specificity;

    setTimeout(() => {
      animateBar('bd-creativity', creativity / 33, 'bd-creativity-val', creativity);
      animateBar('bd-specificity', specificity / 38, 'bd-specificity-val', specificity);
      animateBar('bd-impact', impact / 29, 'bd-impact-val', Math.max(0, impact));
    }, 400);
  }

  function animateBar(barId, pct, valId, val) {
    const bar = document.getElementById(barId);
    const valEl = document.getElementById(valId);
    if (bar) bar.style.width = `${Math.max(0, Math.min(pct * 100, 100))}%`;
    if (valEl) valEl.textContent = Math.max(0, val);
  }

  function addToLeaderboard(name, prompt, score) {
    if (!lbList) return;
    const items = Array.from(lbList.querySelectorAll('.lb-item'));
    const previewText = `"${prompt.slice(0, 28)}..."`;

    // Find insertion point
    let insertBefore = null;
    for (const item of items) {
      const itemScore = parseInt(item.querySelector('.lb-score')?.textContent || '0');
      if (score > itemScore) { insertBefore = item; break; }
    }

    const el = document.createElement('div');
    el.className = 'lb-item';
    el.style.opacity = '0';
    el.style.transform = 'translateX(-20px)';
    el.innerHTML = `
      <span class="lb-rank" style="font-size:.85rem">NEW</span>
      <div class="lb-info">
        <span class="lb-name">${escapeHtml(name)}</span>
        <span class="lb-prompt-preview">${escapeHtml(previewText)}</span>
      </div>
      <div class="lb-score-wrap">
        <span class="lb-score" style="color:#22c55e">${score}</span>
        <div class="score-bar" style="--score:${score}%"></div>
      </div>`;

    if (insertBefore) {
      lbList.insertBefore(el, insertBefore);
    } else {
      lbList.appendChild(el);
    }

    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    // Re-number ranks
    updateLeaderboardRanks();

    // Flash new item
    setTimeout(() => {
      el.style.borderColor = 'rgba(34,197,94,0.4)';
      el.style.background = 'rgba(34,197,94,0.05)';
      setTimeout(() => {
        el.style.borderColor = '';
        el.style.background = '';
      }, 2000);
    }, 500);

    modal?.style.display === 'none' || null;
  }

  function updateLeaderboardRanks() {
    const emojis = ['🥇', '🥈', '🥉'];
    const items = lbList?.querySelectorAll('.lb-item');
    items?.forEach((item, i) => {
      const rankEl = item.querySelector('.lb-rank');
      if (rankEl) {
        rankEl.textContent = emojis[i] ?? (i + 1);
        rankEl.style.fontSize = i < 3 ? '1.1rem' : '.85rem';
      }
      item.className = 'lb-item';
      if (i === 0) item.classList.add('rank-1');
      if (i === 1) item.classList.add('rank-2');
      if (i === 2) item.classList.add('rank-3');
    });
  }

  modalClose?.addEventListener('click', () => { if (modal) modal.classList.add('hidden'); });
  modalOk?.addEventListener('click', () => {
    if (modal) modal.classList.add('hidden');
    document.getElementById('leaderboard-card')?.scrollIntoView({ behavior: 'smooth' });
  });
  modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

  lbRefresh?.addEventListener('click', () => {
    lbRefresh.textContent = '↻ Refreshing...';
    lbRefresh.disabled = true;
    setTimeout(() => {
      lbRefresh.textContent = '↻ Refresh';
      lbRefresh.disabled = false;
      totalEntries += Math.floor(Math.random() * 8 + 2);
      if (entryCount) entryCount.textContent = `${totalEntries} entries submitted`;
    }, 800);
  });
}

// ════════════════════════════════════════
// 7. QUEUE ANIMATION
// ════════════════════════════════════════
function initQueueAnimation() {
  const gates = [
    { barId: 'qb-a', min: 75, max: 96, critical: true },
    { barId: 'qb-b', min: 40, max: 68 },
    { barId: 'qb-c', min: 12, max: 35 },
  ];

  setInterval(() => {
    gates.forEach(gate => {
      const bar = document.getElementById(gate.barId);
      if (!bar) return;
      const val = gate.min + Math.random() * (gate.max - gate.min);
      bar.style.width = `${val.toFixed(0)}%`;
    });
  }, 3000);
}

// ════════════════════════════════════════
// 8. DASHBOARD ANIMATION
// ════════════════════════════════════════
function initDashboardAnimation() {
  const bars = [
    { id: null, el: document.querySelector('.bar-orange'), min: 55, max: 85 },
    { id: null, el: document.querySelector('.bar-red'), min: 78, max: 97 },
    { id: null, el: document.querySelector('.bar-green'), min: 20, max: 50 },
  ];

  const vals = document.querySelectorAll('.dp-metric-val');

  setInterval(() => {
    bars.forEach((bar, i) => {
      if (!bar.el) return;
      const val = Math.round(bar.min + Math.random() * (bar.max - bar.min));
      bar.el.style.width = `${val}%`;
      if (vals[i]) {
        if (i < 2) vals[i].textContent = `${val}%`;
      }
    });
  }, 2500);
}

// ════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════
function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.style.borderColor = 'rgba(239,68,68,0.6)';
  el.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)';
  setTimeout(() => {
    el.style.animation = '';
    el.style.borderColor = '';
    el.style.boxShadow = '';
  }, 1000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ════════════════════════════════════════
   9. LIVE ALERT TICKER
   ════════════════════════════════════════ */
function initLiveAlerts() {
  const ticker = document.getElementById('alert-ticker');
  if (!ticker) return;

  const alerts = [
    { type: 'yellow', icon: '⚠', text: '14s ago &mdash; Gate A overflow detected' },
    { type: 'green', icon: '🟢', text: '32s ago &mdash; Queue B normalized' },
    { type: 'red', icon: '🔴', text: '1m ago &mdash; Panic signal: Stage Left' },
    { type: 'yellow', icon: '⚠', text: '2m ago &mdash; High density near Food Court' }
  ];

  let currentIndex = 0;

  function renderAlert() {
    const alert = alerts[currentIndex];
    const el = document.createElement('div');
    el.className = `alert-item ${alert.type}`;
    el.innerHTML = `<span>${alert.icon}</span> <span>${alert.text}</span>`;
    
    ticker.innerHTML = '';
    ticker.appendChild(el);
    
    currentIndex = (currentIndex + 1) % alerts.length;
  }

  renderAlert();
  
  setInterval(() => {
    ticker.style.transform = 'translateY(-10px)';
    ticker.style.opacity = '0';
    
    setTimeout(() => {
      renderAlert();
      ticker.style.transform = 'translateY(10px)';
      
      requestAnimationFrame(() => {
        ticker.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        ticker.style.transform = 'translateY(0)';
        ticker.style.opacity = '1';
      });
    }, 500);
  }, 4000);
}

/* ════════════════════════════════════════
   10. SAFETY VOICE API + MAP UPDATE
   ════════════════════════════════════════ */
function initSafetyVoice() {
  const micBtn = document.getElementById('mic-btn');
  const transcriptEl = document.getElementById('voice-transcript');
  const safetyJson = document.getElementById('safety-json');
  if (!micBtn || !transcriptEl || !safetyJson) return;

  const fallbackPhrases = [
    "Help, there's a huge crowd pushing at Stage A!",
    "Food court is totally packed, can't move.",
    "Gate B is clear now, but Gate A is blocked.",
    "Someone fell near Stage B, we need help!"
  ];

  let isRecording = false;
  let recognition = null;
  
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      processVoiceReport(text);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error', event.error);
      simulateVoice();
    };

    recognition.onend = () => {
      if (isRecording && recognition) {
        // Did not process successfully via UI 
      }
    };
  }

  micBtn.addEventListener('click', () => {
    if (isRecording) {
      if (recognition) recognition.stop();
      isRecording = false;
      micBtn.classList.remove('recording');
      micBtn.querySelector('span').textContent = 'Live Voice';
      return;
    }

    isRecording = true;
    micBtn.classList.add('recording');
    micBtn.querySelector('span').textContent = 'Listening...';
    transcriptEl.innerHTML = `<span class="dim">Report:</span> [Listening...]`;
    
    document.querySelectorAll('.map-zone').forEach(z => z.classList.remove('zone-critical'));
    document.querySelectorAll('.hotspot').forEach(h => h.classList.add('map-hide'));

    if (recognition) {
      try { recognition.start(); }
      catch(e) { simulateVoice(); }
    } else {
      simulateVoice();
    }
  });

  function simulateVoice() {
    setTimeout(() => {
      if (!isRecording) return;
      isRecording = false;
      micBtn.classList.remove('recording');
      micBtn.querySelector('span').textContent = 'Live Voice';
      const fake = fallbackPhrases[Math.floor(Math.random() * fallbackPhrases.length)];
      processVoiceReport(fake);
    }, 2500);
  }

  function processVoiceReport(text) {
    isRecording = false;
    micBtn.classList.remove('recording');
    micBtn.querySelector('span').textContent = 'Live Voice';
    
    transcriptEl.innerHTML = `<span class="dim">Report:</span> "${text}"`;
    
    let loc = "Unknown Zone";
    let zoneId = null;
    let severity = 2;
    let action = "LOG_REPORT";

    const t = text.toLowerCase();
    if (t.includes('stage a')) { loc = "Stage A"; zoneId = "zone-stage-a"; }
    else if (t.includes('stage b')) { loc = "Stage B"; zoneId = "zone-stage-b"; }
    else if (t.includes('gate a')) { loc = "Gate A"; zoneId = "zone-gate-a"; }
    else if (t.includes('gate b')) { loc = "Gate B"; zoneId = "zone-gate-b"; }
    else if (t.includes('food')) { loc = "Food Court"; zoneId = "zone-food"; }
    else { loc = "Main Concourse"; }

    if (t.includes('pushing') || t.includes('help') || t.includes('fall') || t.includes('stampede') || t.includes('fight')) severity = 5;
    else if (t.includes('packed') || t.includes('crowd') || t.includes('stuck') || t.includes('full')) severity = 4;

    if (severity >= 4) action = "IMMEDIATE_REDIRECT";
    if (severity === 5) action = "EVACUATE_ZONE";

    if (zoneId) {
      const zone = document.getElementById(zoneId);
      if (zone) {
        zone.classList.add('zone-critical');
        zone.querySelector('.hotspot').classList.remove('map-hide');
      }
    }

    safetyJson.innerHTML = `{
  "<span class="jk">module</span>": "<span class="jv">crowd_safety</span>",
  "<span class="jk">location</span>": "<span class="jv">${loc}</span>",
  "<span class="jk">severity</span>": <span class="jn">${severity}</span>,
  "<span class="jk">panic_score</span>": <span class="jn">${(severity * 0.18 + 0.05).toFixed(2)}</span>,
  "<span class="jk">crowd_density</span>": "<span class="jv">${severity >= 4 ? 'critical' : 'elevated'}</span>",
  "<span class="jk">action</span>": "<span class="jv">${action}</span>"
}`;
  }
}
