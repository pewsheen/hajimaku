/* recognition settings */

let isRecording = false;

if (recognition === undefined) {
  var recognition = new SpeechRecognition() || new webkitSpeechRecognition();
}
recognition.lang = 'ja';
recognition.interimResults = true;
// continuous mode will keep all transcripts, need to trim manually
recognition.continuous = false;

/* recognition events */

recognition.onresult = async function (event) {
  clearScript();

  let transcript = event.results[0][0].transcript;
  const isFinal = event.results[0].isFinal;
  if (!isFinal) {
    transcript = `"${transcript}"`;
  }

  // console.log(transcript, isFinal);
  removeTranscriptElement();
  insertTranscriptElement(transcript);
};

recognition.onend = function () {
  // console.log('[Hajimaku] Speech recognition ended');
  if (isRecording) {
    recognition.start();
  }
};

/* Inject record button */

const toggleBtn = createToggleButtonElement();
toggleBtn.addEventListener('click', () => {
  isRecording = !isRecording;
  if (isRecording) {
    // console.log('[Hajimaku] Start recognizing...');
    toggleBtn.style.color = 'rgba(255, 255, 255, 1)';
    startRecognition();
  } else {
    // console.log('[Hajimaku] Stopping recognition...');
    toggleBtn.style.color = 'rgba(255, 255, 255, .4)';
    stopRecognition();
  }
});

const controlPanelEl = document.getElementsByClassName(
  'ytp-chrome-controls'
)[0];
if (controlPanelEl) {
  controlPanelEl.appendChild(toggleBtn);
} else {
  document.body.appendChild(toggleBtn);
}

function insertTranscriptElement(transcript) {
  const playerEl = document.getElementById('movie_player');
  if (playerEl) {
    const containerEl = createTranscriptElement(transcript);
    const playerBottomEl =
      document.getElementsByClassName('ytp-chrome-bottom')[0];
    if (playerBottomEl) {
      playerEl.insertBefore(containerEl, playerBottomEl);
    } else {
      playerEl.appendChild(containerEl);
    }
  }
}

function removeTranscriptElement() {
  const containerEl = document.getElementById('hajimaru-jimaku-container');
  if (containerEl) {
    containerEl.remove();
  }
}

function createTranscriptElement(transcript) {
  const containerEl = document.createElement('div');
  containerEl.id = 'hajimaru-jimaku-container';
  containerEl.style.position = 'absolute';
  containerEl.style.display = 'flex';
  containerEl.style.alignItems = 'center';
  containerEl.style.justifyContent = 'center';
  containerEl.style.bottom = '56px'; // above the video's controls
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
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'hajimaku-toggle';
  toggleBtn.style.position = 'relative';
  toggleBtn.style.height = '100%';
  toggleBtn.style.width = '48px';
  toggleBtn.style.zIndex = '9999';
  toggleBtn.style.padding = '0 2px';
  toggleBtn.style.background = 'transparent';
  toggleBtn.style.color = 'rgba(255, 255, 255, .6)';
  toggleBtn.style.border = 'none';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.boxSizing = 'border-box';
  toggleBtn.style.display = 'flex';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.innerHTML = `<svg width="24px" height="24px" viewbox="0 0 24 24" fill="none" transform="rotate(0)"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H14C17.7712 20 19.6569 20 20.8284 18.8284C22 17.6569 22 15.7712 22 12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2.51839 5.82475 2.22937 6.69989 2.10149 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M10 16H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M14 13H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M14 16H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M9.5 13H11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M18 16H16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> <path d="M6 13H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/> </g></svg>`;
  return toggleBtn;
}

const debouncer = function (fn, delay = 1000) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

const clearScript = debouncer(() => {
  removeTranscriptElement();
}, 3000);

function startRecognition() {
  isRecording = true;
  setTimeout(() => {
    recognition.start();
  }, 100);
}

function stopRecognition() {
  isRecording = false;
  recognition.abort();
  removeTranscriptElement();
}
