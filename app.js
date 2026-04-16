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
const speechModeInput = document.getElementById('speech-mode');
const speechDurationInput = document.getElementById('speech-duration');
const speechWpmInput = document.getElementById('speech-wpm');
const durationField = document.getElementById('duration-field');
const wpmField = document.getElementById('wpm-field');
const speechNewsItems = document.getElementById('speech-news-items');
const addNewsItemButton = document.getElementById('add-news-item');
const mouthPreviewButton = document.getElementById('mouth-preview');
const mouthStopButton = document.getElementById('mouth-stop');
const boardNewsTitle = document.getElementById('board-news-title');
const boardNewsImagePreview = document.getElementById('board-news-image-preview');
const selectedRubrics = document.getElementById('selected-rubrics');
const rubricSelect = document.getElementById('rubric-select');
const addRubricButton = document.getElementById('add-rubric');

const manualNewsQueue = [];
let mouthPreviewTimerIds = [];
let speechNewsIndex = 0;

const rubricCatalog = [
  { type: 'ursas_index', title: 'Ursas Index' },
  { type: 'number_of_day', title: 'Number of the day' },
  { type: 'top_10_faill', title: 'Top 10 faill' },
  { type: 'bear_world_news', title: 'Bear-world news' },
  { type: 'bear_language', title: 'Язык медведей' },
  { type: 'roadmap_news', title: 'Roadmap news' },
  { type: 'ursass_tube_leaderboard', title: 'Ursass Tube leaderboard' },
];

const mouthSprites = {
  idle: {
    path: 'public/mounth/улыбка зубами.webp',
    frames: 6,
    scale: 1,
    offset_x: 5,
    offset_y: -14,
  },
  closed: {
    path: 'public/mounth/рот закрыт нейтральный.webp',
    frames: 10,
    scale: 0.7,
    offset_x: 5,
    offset_y: -2,
  },
  open: {
    path: 'public/mounth/рот улыбка с языком.webp',
    frames: 8,
    scale: 1,
    offset_x: 5,
    offset_y: -4,
  },
};

function getWordsCount(text) {
  return (text.match(/[^\s]+/g) || []).length;
}

function isValidHttpUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function collectSpeechNewsItems() {
  const rows = speechNewsItems.querySelectorAll('.news-item-row');
  return Array.from(rows)
    .map((row) => {
      const title = row.querySelector('.speech-news-title').value.trim();
      const text = row.querySelector('.speech-news-text').value.trim();
      const rawLink = row.querySelector('.speech-news-link').value.trim();
      const link = isValidHttpUrl(rawLink) ? rawLink : '';
      const image_data = row.dataset.imageData || '';

      return { title, text, link, image_data };
    })
    .filter((item) => item.title || item.text || item.link || item.image_data);
}

function collectSpeechText() {
  return collectSpeechNewsItems()
    .map((item) => item.text)
    .filter(Boolean)
    .join(' ');
}

function updateNewsItemCounter(textarea, counterElement) {
  const text = textarea.value;
  const chars = text.length;
  const words = getWordsCount(text);
  counterElement.textContent = `${chars} симв / ${words} слов`;
}

function updateBoardPreview(row) {
  const title = row?.querySelector('.speech-news-title')?.value.trim();
  const imageData = row?.dataset?.imageData || '';

  boardNewsTitle.textContent = title || 'URSAS NEWS';
  if (imageData) {
    boardNewsImagePreview.src = imageData;
    boardNewsImagePreview.classList.add('is-visible');
  } else {
    boardNewsImagePreview.removeAttribute('src');
    boardNewsImagePreview.classList.remove('is-visible');
  }
}

function addSpeechNewsItem(initialValue = '') {
  speechNewsIndex += 1;

  const wrapper = document.createElement('div');
  wrapper.className = 'news-item-row';

  const label = document.createElement('label');
  label.className = 'news-item-label';
  label.textContent = `Новость ${speechNewsIndex}`;

  const titleInput = document.createElement('input');
  titleInput.className = 'speech-news-title';
  titleInput.type = 'text';
  titleInput.maxLength = 30;
  titleInput.placeholder = 'Короткий заголовок (до 30 символов)';

  const textarea = document.createElement('textarea');
  textarea.className = 'speech-news-text';
  textarea.rows = 3;
  textarea.placeholder = 'Текст новости для озвучки...';
  textarea.value = initialValue;

  const linkInput = document.createElement('input');
  linkInput.className = 'speech-news-link';
  linkInput.type = 'url';
  linkInput.pattern = 'https?://.*';
  linkInput.placeholder = 'Ссылка на новость';
  linkInput.title = 'Разрешены только ссылки http/https';

  const imageInput = document.createElement('input');
  imageInput.className = 'speech-news-image';
  imageInput.type = 'file';
  imageInput.accept = 'image/*';

  const imagePreview = document.createElement('img');
  imagePreview.className = 'news-image-preview';
  imagePreview.alt = 'Превью изображения новости';

  const counter = document.createElement('div');
  counter.className = 'news-item-counter';

  const actions = document.createElement('div');
  actions.className = 'news-item-actions';

  const moveUpButton = document.createElement('button');
  moveUpButton.type = 'button';
  moveUpButton.textContent = '↑ Поднять выше';

  const moveDownButton = document.createElement('button');
  moveDownButton.type = 'button';
  moveDownButton.textContent = '↓ Опустить ниже';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = '✕ Удалить новость';

  titleInput.addEventListener('input', () => updateBoardPreview(wrapper));
  textarea.addEventListener('input', () => {
    updateNewsItemCounter(textarea, counter);
    updateBoardPreview(wrapper);
  });
  linkInput.addEventListener('input', () => {
    linkInput.setCustomValidity(isValidHttpUrl(linkInput.value.trim()) ? '' : 'Введите ссылку http/https');
    updateBoardPreview(wrapper);
  });
  imageInput.addEventListener('change', () => {
    const [file] = imageInput.files || [];
    if (!file) {
      wrapper.dataset.imageData = '';
      imagePreview.removeAttribute('src');
      imagePreview.classList.remove('is-visible');
      updateBoardPreview(wrapper);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      wrapper.dataset.imageData = result;
      imagePreview.src = result;
      imagePreview.classList.add('is-visible');
      updateBoardPreview(wrapper);
    };
    reader.readAsDataURL(file);
  });

  updateNewsItemCounter(textarea, counter);
  actions.append(moveUpButton, moveDownButton, deleteButton);
  wrapper.append(label, titleInput, textarea, counter, linkInput, imageInput, imagePreview, actions);
  speechNewsItems.appendChild(wrapper);

  moveUpButton.addEventListener('click', () => {
    const prev = wrapper.previousElementSibling;
    if (!prev) {
      return;
    }
    speechNewsItems.insertBefore(wrapper, prev);
    renumberSpeechNews();
    updateBoardPreview(wrapper);
  });

  moveDownButton.addEventListener('click', () => {
    const next = wrapper.nextElementSibling;
    if (!next) {
      return;
    }
    speechNewsItems.insertBefore(next, wrapper);
    renumberSpeechNews();
    updateBoardPreview(wrapper);
  });

  deleteButton.addEventListener('click', () => {
    wrapper.remove();
    renumberSpeechNews();
    const first = speechNewsItems.querySelector('.news-item-row');
    if (!first) {
      addSpeechNewsItem();
      return;
    }
    updateBoardPreview(first);
  });

  renumberSpeechNews();
  updateBoardPreview(wrapper);
}

function renumberSpeechNews() {
  const rows = speechNewsItems.querySelectorAll('.news-item-row');
  rows.forEach((row, index) => {
    row.querySelector('.news-item-label').textContent = `Новость ${index + 1}`;
  });
}

function fillRubricSelect() {
  rubricSelect.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'выбрать рубрику';
  placeholder.selected = true;
  rubricSelect.appendChild(placeholder);

  rubricCatalog.forEach((rubric) => {
    const option = document.createElement('option');
    option.value = rubric.type;
    option.textContent = rubric.title;
    rubricSelect.appendChild(option);
  });
}

function getSelectedRubrics() {
  const links = selectedRubrics.querySelectorAll('a[data-rubric-type]');
  return Array.from(links).map((link) => ({
    type: link.dataset.rubricType,
    title: link.textContent.trim(),
    enabled: true,
  }));
}

function addSelectedRubric() {
  const type = rubricSelect.value;
  if (!type) {
    return;
  }
  const rubric = rubricCatalog.find((item) => item.type === type);
  if (!rubric) {
    return;
  }

  const exists = selectedRubrics.querySelector(`[data-rubric-type="${type}"]`);
  if (exists) {
    return;
  }

  const link = document.createElement('a');
  link.href = '#';
  link.dataset.rubricType = rubric.type;
  link.className = 'rubric-link';
  link.textContent = rubric.title;

  selectedRubrics.appendChild(link);
  rubricSelect.value = '';
  addRubricButton.disabled = true;
}

function setMouthFrame(type, frameIndex) {
  const sprite = mouthSprites[type];
  const boundedFrame = Math.min(Math.max(frameIndex, 0), sprite.frames - 1);

  mouthLayer.style.backgroundImage = `url("${sprite.path}")`;
  mouthLayer.style.backgroundPosition = `${-100 * boundedFrame}px 0`;
  mouthLayer.style.left = `calc(50% + ${sprite.offset_x}px)`;
  mouthLayer.style.top = `calc(49% + ${sprite.offset_y}px)`;
  mouthLayer.style.transform = `translate(-50%, -50%) scale(${sprite.scale})`;
}

function setNeutralMouth() {
  const randomIdle = Math.floor(Math.random() * mouthSprites.idle.frames);
  setMouthFrame('idle', randomIdle);
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
  const text = collectSpeechText();
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
  const startIdleMs = 180;
  cursor += startIdleMs;
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
  const subtitleLanguage = document.getElementById('subtitle-language').value;
  const subtitleFontFamily = document.getElementById('subtitle-font-family').value.trim() || 'Inter';
  const subtitleFontWeight = Number(document.getElementById('subtitle-font-weight').value || 700);
  const intro = document.getElementById('intro-text').value.trim();
  const speechText = collectSpeechText();
  const outro = document.getElementById('outro-text').value.trim();
  const speechTimeline = getSpeechTimelineConfig();
  const speechNews = collectSpeechNewsItems();
  const rubrics = getSelectedRubrics();

  const script = {
    episode_title: episodeTitle || 'Ursas Daily',
    render_mode: mode,
    scene_template: 'studio_bear_anchor_v1',
    scene_animation: {
      mouth_speech: {
        idle_sprite: mouthSprites.idle,
        closed_sprite: mouthSprites.closed,
        open_sprite: mouthSprites.open,
        timeline: speechTimeline,
      },
    },
    render: {
      format,
      fps,
      subtitles,
      subtitles_style: {
        language: subtitleLanguage,
        font_family: subtitleFontFamily,
        font_weight: subtitleFontWeight,
      },
    },
    intro,
    anchor_speech_text: speechText,
    anchor_speech_news: speechNews,
    segments: manualNewsQueue.map((news, idx) => ({
      order: idx + 1,
      type: 'news',
      board_title: news.title,
      narration_text: news.summary,
      source: news.source,
      tag: news.tag,
    })),
    rubrics: rubrics.length > 0 ? rubrics : [{ type: 'ursas_index', title: 'Ursas Index', enabled: true }],
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
speechModeInput.addEventListener('change', updateSpeechMode);
addNewsItemButton.addEventListener('click', () => addSpeechNewsItem());
addRubricButton.addEventListener('click', addSelectedRubric);
rubricSelect.addEventListener('change', () => {
  addRubricButton.disabled = !rubricSelect.value;
});

setNeutralMouth();
updateSpeechMode();
addSpeechNewsItem();
fillRubricSelect();
addRubricButton.disabled = true;

renderNewsQueue();
