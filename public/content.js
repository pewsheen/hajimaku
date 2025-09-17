(() => {
  // YouTube is SPA, we need prevent duplicated element injection
  if (document.documentElement.dataset.hajimakuInjected) return;
  document.documentElement.dataset.hajimakuInjected = '1';

  // --- SpeechRecognition setup ---
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    console.warn(
      '[Hajimaku] SpeechRecognition API not supported in this browser.'
    );
    return;
  }

  const recognition = new SpeechRec();
  recognition.lang = 'ja';
  recognition.interimResults = true;
  recognition.continuous = false;

  let isRecording = false;

  // Keep last-known options for UI/logic;
  let options = {
    language: 'ja',
  };

  // Load initial options from storage
  try {
    chrome.storage?.sync.get(['hajimakuOptions'], (res) => {
      if (chrome.runtime?.lastError) {
        console.warn('[Hajimaku] storage get error:', chrome.runtime.lastError);
        return;
      }
      const stored = res?.hajimakuOptions;
      if (stored && typeof stored === 'object') {
        options = { ...options, ...stored };
        recognition.lang = options.language;
      }
    });
  } catch (_) {}

  // --- URL change observer (YouTube SPA) ---
  window.addEventListener('yt-navigate-start', () => {
    if (isRecording) {
      stopRecognition();
    }
  });

  // Listen for messages from popup to update options or execute commands
  try {
    chrome.runtime?.onMessage.addListener((message, _sender, sendResponse) => {
      if (!message || typeof message !== 'object') return;

      const { type, payload } = message;
      switch (type) {
        case 'hajimaku:setOptions': {
          const next = { ...options, ...(payload || {}) };
          const prevLang = options.language;
          const nextLang = next.language;
          options = next;
          recognition.lang = nextLang;
          if (isRecording && prevLang !== nextLang) {
            console.debug(
              `[Hajimaku] Language changed: ${prevLang} -> ${nextLang}`
            );
            stopRecognition();
            setTimeout(() => startRecognition(), 500);
          }
          sendResponse?.({ ok: true });
          break;
        }
        default:
          break;
      }

      return true;
    });
  } catch (_) {}

  // --- Toggle creation ---
  const toggleBtn = createToggleButtonElement();
  toggleBtn.addEventListener('click', () => {
    if (isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  });
  attachToggle(toggleBtn);

  // --- Recognition events ---
  recognition.onresult = (event) => {
    scheduleClearTranscript();
    let transcript = event.results[0][0].transcript;
    if (!event.results[0].isFinal) transcript = `"${transcript}"`;
    removeTranscriptElement();
    insertTranscriptElement(transcript);
  };
  recognition.onend = () => {
    if (isRecording) recognition.start();
  };

  // --- Functions ---
  function startRecognition() {
    isRecording = true;
    recognition.start();
    toggleBtn.style.color = 'rgba(255, 255, 255, 1)';
  }

  function stopRecognition() {
    isRecording = false;
    recognition.abort();
    removeTranscriptElement();
    toggleBtn.style.color = 'rgba(255, 255, 255, .4)';
  }

  function attachToggle(btn) {
    const controlPanelEl = document.getElementsByClassName(
      'ytp-chrome-controls'
    )[0];
    if (controlPanelEl) controlPanelEl.appendChild(btn);
    else console.warn('[Hajimaku] Control panel not found.');
  }

  function insertTranscriptElement(transcript) {
    const playerEl = document.getElementById('movie_player');
    if (!playerEl) return;
    const containerEl = createTranscriptElement(transcript);
    const playerBottomEl =
      document.getElementsByClassName('ytp-chrome-bottom')[0];
    if (playerBottomEl) playerEl.insertBefore(containerEl, playerBottomEl);
    else playerEl.appendChild(containerEl);
  }

  function removeTranscriptElement() {
    const containerEl = document.getElementById('hajimaru-jimaku-container');
    if (containerEl) containerEl.remove();
  }

  function createTranscriptElement(transcript) {
    const containerEl = document.createElement('div');
    containerEl.id = 'hajimaru-jimaku-container';
    containerEl.style.position = 'absolute';
    containerEl.style.display = 'flex';
    containerEl.style.alignItems = 'center';
    containerEl.style.justifyContent = 'center';
    containerEl.style.bottom = '56px';
    containerEl.style.width = '100%';
    containerEl.style.zIndex = '9999';

    const transcriptEl = document.createElement('div');
    transcriptEl.id = 'hajimaru-jimaku';
    transcriptEl.style.boxSizing = 'border-box';
    transcriptEl.style.fontSize = '16px';
    transcriptEl.style.lineHeight = '16px';
    transcriptEl.style.padding = '6px 8px';
    transcriptEl.style.borderRadius = '4px';
    transcriptEl.style.color = 'white';
    transcriptEl.style.background = 'rgba(0, 0, 0, 0.5)';
    transcriptEl.textContent = transcript;
    containerEl.appendChild(transcriptEl);
    return containerEl;
  }

  function createToggleButtonElement() {
    const btn = document.createElement('button');
    btn.id = 'hajimaku-toggle';
    btn.style.position = 'relative';
    btn.style.height = '100%';
    btn.style.width = '48px';
    btn.style.zIndex = '9999';
    btn.style.padding = '0 2px';
    btn.style.background = 'transparent';
    btn.style.color = 'rgba(255, 255, 255, .6)';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.boxSizing = 'border-box';
    btn.style.display = 'flex';
    btn.style.justifyContent = 'center';
    btn.style.alignItems = 'center';
    btn.innerHTML = `<svg width="24px" height="24px" viewbox="0 0 24 24" fill="none" transform="rotate(0)"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H14C17.7712 20 19.6569 20 20.8284 18.8284C22 17.6569 22 15.7712 22 12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2.51839 5.82475 2.22937 6.69989 2.10149 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M10 16H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M14 13H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M14 16H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M9.5 13H11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M18 16H16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M6 13H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> </g></svg>`;
    return btn;
  }

  function debouncer(fn, delay = 1000) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(null, args), delay);
    };
  }

  const scheduleClearTranscript = debouncer(
    () => removeTranscriptElement(),
    3000
  );
})();
