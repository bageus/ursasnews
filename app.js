const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const tabId = tab.dataset.tab;

    tabs.forEach((t) => t.classList.remove('is-active'));
    panels.forEach((p) => p.classList.remove('is-active'));

    tab.classList.add('is-active');
    document.getElementById(tabId).classList.add('is-active');
  });
});

const manualNewsForm = document.getElementById('manual-news-form');
const newsList = document.getElementById('news-list');
const scriptOutput = document.getElementById('script-output');
const mouthLayer = document.getElementById('mouth-layer');
const speechTextInput = document.getElementById('speech-text');
const speechModeInput = document.getElementById('speech-mode');
const speechDurationInput = document.getElementById('speech-duration');
const speechWpmInput = document.getElementById('speech-wpm');
const durationField = document.getElementById('duration-field');
const wpmField = document.getElementById('wpm-field');
const speechCharCount = document.getElementById('speech-char-count');
const speechWordCount = document.getElementById('speech-word-count');
const mouthPreviewButton = document.getElementById('mouth-preview');
const mouthStopButton = document.getElementById('mouth-stop');

const manualNewsQueue = [];
let mouthPreviewTimerIds = [];

const mouthSprites = {
  closed: {
    path: 'public/mounth/рот закрыт нейтральный.webp',
    frames: 10,
  },
  open: {
    path: 'public/mounth/рот улыбка с языком.webp',
    frames: 8,
  },
};

function getWordsCount(text) {
  return (text.match(/[^\s]+/g) || []).length;
}

function updateSpeechCounters() {
  const text = speechTextInput.value;
  speechCharCount.textContent = String(text.length);
  speechWordCount.textContent = String(getWordsCount(text));
}

function setMouthFrame(type, frameIndex) {
  const sprite = mouthSprites[type];
  const boundedFrame = Math.min(Math.max(frameIndex, 0), sprite.frames - 1);

  mouthLayer.style.backgroundImage = `url("${sprite.path}")`;
  mouthLayer.style.backgroundPosition = `${-100 * boundedFrame}px 0`;
}

function setNeutralMouth() {
  const randomClosed = Math.floor(Math.random() * mouthSprites.closed.frames);
  setMouthFrame('closed', randomClosed);
}

function estimateSyllables(word) {
  const vowels = word.match(/[ауоыиэяюёеaeiouy]/gi);
  return Math.max(1, vowels ? vowels.length : 1);
}

function pickOpenFrame(word, forceLarge = false) {
  if (forceLarge) {
    return Math.floor(Math.random() * 2);
  }

  if (word.length <= 4) {
    return 6 + Math.floor(Math.random() * 2);
  }

  if (word.length >= 10) {
    return 1 + Math.floor(Math.random() * 3);
  }

  return 3 + Math.floor(Math.random() * 3);
}

function buildSpeechEvents(text) {
  const tokens = (text || '').match(/[\p{L}\p{N}-]+|[.,!?;:]/gu) || [];
  const events = [];

  tokens.forEach((token, index) => {
    const isPunctuation = /^[.,!?;:]$/.test(token);
    if (isPunctuation) {
      const pauseUnits = token === ',' ? 2 : token === '!' ? 4 : 3;
      events.push({ type: 'pause', units: pauseUnits, punctuation: token });
      return;
    }

    const nextToken = tokens[index + 1];
    const forceLarge = nextToken === '!';
    const syllables = estimateSyllables(token);

    for (let i = 0; i < syllables; i += 1) {
      events.push({
        type: 'open',
        units: 2,
        frameIndex: pickOpenFrame(token, forceLarge),
      });
      events.push({
        type: 'close',
        units: 1,
        frameIndex: Math.floor(Math.random() * mouthSprites.closed.frames),
      });
    }
  });

  return events;
}

function getSpeechTimelineConfig() {
  const mode = speechModeInput.value;
  const text = speechTextInput.value.trim();
  const words = getWordsCount(text);
  const durationSeconds = Number(speechDurationInput.value || 10);
  const wpm = Number(speechWpmInput.value || 150);

  const totalMs =
    mode === 'duration'
      ? Math.max(1000, durationSeconds * 1000)
      : Math.max(1000, Math.round((words / Math.max(1, wpm)) * 60000));

  return {
    mode,
    total_ms: totalMs,
    duration_seconds: durationSeconds,
    words_per_minute: wpm,
    text,
    words_count: words,
    chars_count: text.length,
  };
}

function stopMouthPreview() {
  mouthPreviewTimerIds.forEach((id) => clearTimeout(id));
  mouthPreviewTimerIds = [];
  setNeutralMouth();
}

function startMouthPreview() {
  stopMouthPreview();

  const speech = getSpeechTimelineConfig();
  if (!speech.text) {
    setNeutralMouth();
    return;
  }

  const events = buildSpeechEvents(speech.text);
  if (events.length === 0) {
    setNeutralMouth();
    return;
  }

  const totalUnits = events.reduce((sum, event) => sum + event.units, 0);
  const unitDurationMs = Math.max(50, speech.total_ms / Math.max(1, totalUnits));

  let cursor = 0;
  events.forEach((event) => {
    const id = setTimeout(() => {
      if (event.type === 'open') {
        setMouthFrame('open', event.frameIndex);
      } else {
        setMouthFrame('closed', event.frameIndex || 0);
      }
    }, cursor);
    mouthPreviewTimerIds.push(id);
    cursor += event.units * unitDurationMs;
  });

  const finishId = setTimeout(setNeutralMouth, cursor);
  mouthPreviewTimerIds.push(finishId);
}

function updateSpeechMode() {
  const durationMode = speechModeInput.value === 'duration';
  durationField.classList.toggle('is-hidden', !durationMode);
  wpmField.classList.toggle('is-hidden', durationMode);
}

manualNewsForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const item = {
    id: Date.now(),
    title: document.getElementById('news-title').value.trim(),
    summary: document.getElementById('news-summary').value.trim(),
    source: document.getElementById('news-source').value.trim() || 'manual',
    tag: document.getElementById('news-tag').value,
  };

  if (!item.title || !item.summary) {
    return;
  }

  manualNewsQueue.push(item);
  renderNewsQueue();
  manualNewsForm.reset();
  document.getElementById('news-source').value = 'manual';
});

function renderNewsQueue() {
  newsList.innerHTML = '';

  if (manualNewsQueue.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'Пока нет новостей в очереди.';
    newsList.appendChild(empty);
    return;
  }

  manualNewsQueue.forEach((news, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. [${news.tag}] ${news.title} — ${news.summary}`;
    newsList.appendChild(li);
  });
}

function buildEpisodeScript(mode = 'preview') {
  const episodeTitle = document.getElementById('episode-title').value.trim();
  const format = document.getElementById('episode-format').value;
  const fps = Number(document.getElementById('episode-fps').value || 30);
  const subtitles = document.getElementById('episode-subtitles').value === 'true';
  const intro = document.getElementById('intro-text').value.trim();
  const speechText = speechTextInput.value.trim();
  const outro = document.getElementById('outro-text').value.trim();
  const speechTimeline = getSpeechTimelineConfig();

  const script = {
    episode_title: episodeTitle || 'Ursas Daily',
    render_mode: mode,
    scene_template: 'studio_bear_anchor_v1',
    scene_animation: {
      mouth_speech: {
        closed_sprite: mouthSprites.closed,
        open_sprite: mouthSprites.open,
        timeline: speechTimeline,
      },
    },
    render: { format, fps, subtitles },
    intro,
    anchor_speech_text: speechText,
    segments: manualNewsQueue.map((news, idx) => ({
      order: idx + 1,
      type: 'news',
      board_title: news.title,
      narration_text: news.summary,
      source: news.source,
      tag: news.tag,
    })),
    rubrics: [
      { type: 'ursas_index', enabled: true },
      { type: 'number_of_day', enabled: true },
      { type: 'top_fallers', enabled: true },
    ],
    outro,
  };

  scriptOutput.textContent = JSON.stringify(script, null, 2);
}

document.getElementById('build-script').addEventListener('click', () => {
  buildEpisodeScript('preview');
});

document.getElementById('preview-render').addEventListener('click', () => {
  buildEpisodeScript('preview');
});

document.getElementById('final-render').addEventListener('click', () => {
  buildEpisodeScript('final');
});

mouthPreviewButton.addEventListener('click', startMouthPreview);
mouthStopButton.addEventListener('click', stopMouthPreview);
speechTextInput.addEventListener('input', updateSpeechCounters);
speechModeInput.addEventListener('change', updateSpeechMode);

setNeutralMouth();
updateSpeechCounters();
updateSpeechMode();

renderNewsQueue();
