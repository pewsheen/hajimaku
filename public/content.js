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
  console.log('Speech recognition ended');
  setTimeout(() => {
    recognition.abort();
    recognition.start();
  }, 100);
};

/* Inject record button */

const recordBtn = createRecordButtonElement();
recordBtn.addEventListener('click', () => {
  console.log('Start recording...');
  recognition.start();
});
document.body.appendChild(recordBtn);

function createTranscripElement() {
  const transcriptEl = document.createElement('div');
  transcriptEl.id = 'hajimaru-jimaku';
  transcriptEl.style.position = 'absolute';
  transcriptEl.style.bottom = '51px'; // above the video's controls
  transcriptEl.style.left = '0';
  transcriptEl.style.textAlign = 'center';
  transcriptEl.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
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
  recordBtn.style.position = 'fixed';
  recordBtn.style.bottom = '20px';
  recordBtn.style.right = '20px';
  recordBtn.style.zIndex = '9999';
  recordBtn.style.padding = '10px 20px';
  recordBtn.style.background = '#1976d2';
  recordBtn.style.color = '#fff';
  recordBtn.style.border = 'none';
  recordBtn.style.borderRadius = '5px';
  recordBtn.style.cursor = 'pointer';
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
