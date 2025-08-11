/* recognition settings */

if (recognition === undefined) {
  var recognition = new SpeechRecognition();
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

  console.log(transcript, isFinal);

  const playerEl = document.getElementById('movie_player');
  if (playerEl) {
    const transcriptEl = document.getElementById('hajimaru-jimaku');
    if (transcriptEl) {
      transcriptEl.textContent = transcript;
    } else {
      const transcriptEl = createTranscripElement();
      transcriptEl.textContent = transcript;

      const playerBottomEl =
        document.getElementsByClassName('ytp-chrome-bottom')[0];
      if (playerBottomEl) {
        playerEl.insertBefore(transcriptEl, playerBottomEl);
      } else {
        playerEl.appendChild(transcriptEl);
      }
    }
  }
};

recognition.onend = function () {
  console.log('[Hajimaku] Speech recognition ended');
  setTimeout(() => {
    recognition.abort();
    recognition.start();
  }, 100);
};

/* Inject record button */

const recordBtn = createRecordButtonElement();
recordBtn.addEventListener('click', () => {
  console.log('[Hajimaku] Start regcognizing...');
  recognition.start();
});
const controlPanelEl = document.getElementsByClassName(
  'ytp-chrome-controls'
)[0];
if (controlPanelEl) {
  controlPanelEl.appendChild(recordBtn);
} else {
  document.body.appendChild(recordBtn);
}

function createTranscripElement() {
  const transcriptEl = document.createElement('div');
  transcriptEl.id = 'hajimaru-jimaku';
  transcriptEl.style.position = 'absolute';
  transcriptEl.style.bottom = '51px'; // above the video's controls
  transcriptEl.style.left = '0';
  transcriptEl.style.textAlign = 'center';
  transcriptEl.style.background = 'transparent';
  transcriptEl.style.color = 'white';
  transcriptEl.style.padding = '10px';
  transcriptEl.style.zIndex = '9999';
  transcriptEl.style.fontSize = '16px';
  transcriptEl.style.width = '100%';
  transcriptEl.style.boxSizing = 'border-box';

  return transcriptEl;
}

function createRecordButtonElement() {
  const recordBtn = document.createElement('button');
  recordBtn.textContent = 'Start Recording';
  recordBtn.style.position = 'relative';
  recordBtn.style.height = '100%';
  recordBtn.style.width = '48px';
  recordBtn.style.zIndex = '9999';
  recordBtn.style.padding = '0 2px';
  recordBtn.style.background = 'transparent';
  recordBtn.style.color = '#fff';
  recordBtn.style.border = 'none';
  recordBtn.style.cursor = 'pointer';
  recordBtn.style.boxSizing = 'border-box';
  recordBtn.style.display = 'flex';
  recordBtn.style.justifyContent = 'center';
  recordBtn.style.alignItems = 'center';
  recordBtn.innerHTML = `<svg width="24px" height="24px" viewbox="0 0 24 24" fill="none" transform="rotate(0)"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H14C17.7712 20 19.6569 20 20.8284 18.8284C22 17.6569 22 15.7712 22 12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2.51839 5.82475 2.22937 6.69989 2.10149 8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> <path d="M10 16H6" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> <path d="M14 13H18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> <path d="M14 16H12.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> <path d="M9.5 13H11.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> <path d="M18 16H16.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> <path d="M6 13H7" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> </g></svg>`;
  return recordBtn;
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
  const transcriptEl = document.getElementById('hajimaru-jimaku');
  if (transcriptEl) {
    transcriptEl.textContent = '';
  }
}, 5000);
