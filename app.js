const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const tabId = tab.dataset.tab;

    tabs.forEach((t) => t.classList.remove('is-active'));
    panels.forEach((p) => p.classList.remove('is-active'));

    tab.classList.add('is-active');
    document.getElementById(tabId).classList.add('is-active');

    if (tabId === 'rubrics') {
      loadTubeLeaderboard();
    }
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
const episodeFormatInput = document.getElementById('episode-format');
const selectedRubrics = document.getElementById('selected-rubrics');
const rubricSelect = document.getElementById('rubric-select');
const addRubricButton = document.getElementById('add-rubric');
const sceneSubtitles = document.getElementById('scene-subtitles');
const sceneStage = document.getElementById('scene-stage');
const sceneBackwallLayer = document.getElementById('scene-backwall-layer');
const sceneTableLayer = document.getElementById('scene-table-layer');
const subtitleBoldInput = document.getElementById('subtitle-bold');
const subtitleJoystick = document.getElementById('subtitle-joystick');
const subtitlePositionReadout = document.getElementById('subtitle-position-readout');
const boardLayer = document.getElementById('board-layer');
const boardDefaultLayer = document.getElementById('board-default-layer');
const boardNewsMode = document.getElementById('board-news-mode');
const boardHeadBaseLayer = document.getElementById('board-head-base-layer');
const boardImageBaseLayer = document.getElementById('board-image-base-layer');
const boardNewsTitle = document.getElementById('board-news-title');
const boardNewsImagePreview = document.getElementById('board-news-image-preview');
const tubeLeaderboardList = document.getElementById('tube-leaderboard-list');
const tubeLeaderboardStatus = document.getElementById('tube-lb-status');
const tubeLeaderboardReload = document.getElementById('tube-lb-reload');
const commandsOverlay = document.getElementById('commands-overlay');
const commandsClose = document.getElementById('commands-close');
const commandsList = document.getElementById('commands-list');
const helpButtons = document.querySelectorAll('[data-help="commands"]');

const manualNewsQueue = [];
let mouthPreviewTimerIds = [];
let subtitleTimerIds = [];
let speechNewsIndex = 0;
let tubeLeaderboardLoaded = false;
const subtitlePosition = { x: 0, y: 0 };

const TUBE_BACKEND_URL = 'https://api.ursasstube.fun';

const commandHelpItems = [
  ['*speak_pause 100', 'Пауза в речи на 100 мс.'],
  ['*left_arm_low', 'Поднять левую руку немного (ассеты позже).'],
  ['*left_arm_mid', 'Поднять левую руку средне (ассеты позже).'],
  ['*left_arm_high', 'Поднять левую руку выше (ассеты позже).'],
  ['*left_arm_down', 'Опустить левую руку на стол (ассеты позже).'],
  ['*right_arm_low', 'Поднять правую руку немного (ассеты позже).'],
  ['*right_arm_mid', 'Поднять правую руку средне (ассеты позже).'],
  ['*right_arm_high', 'Поднять правую руку выше (ассеты позже).'],
  ['*right_arm_down', 'Опустить правую руку на стол (ассеты позже).'],
  ['*take_sheet', 'Взять листок (ассеты позже).'],
  ['*read_sheet', 'Читать листок (ассеты позже).'],
  ['*down_sheet', 'Положить листок на стол (ассеты позже).'],
  ['*left_turn_head_low', 'Поворот головы влево немного (ассеты позже).'],
  ['*left_turn_head_mid', 'Поворот головы влево средне (ассеты позже).'],
  ['*left_turn_head_high', 'Поворот головы влево сильно (ассеты позже).'],
  ['*right_turn_head_low', 'Поворот головы вправо немного (ассеты позже).'],
  ['*right_turn_head_mid', 'Поворот головы вправо средне (ассеты позже).'],
  ['*right_turn_head_high', 'Поворот головы вправо сильно (ассеты позже).'],
  ['*left_tilt_head_low', 'Наклон головы влево немного (ассеты позже).'],
  ['*left_tilt_head_mid', 'Наклон головы влево средне (ассеты позже).'],
  ['*left_tilt_head_high', 'Наклон головы влево сильно (ассеты позже).'],
  ['*right_tilt_head_low', 'Наклон головы вправо немного (ассеты позже).'],
  ['*right_tilt_head_mid', 'Наклон головы вправо средне (ассеты позже).'],
  ['*right_tilt_head_high', 'Наклон головы вправо сильно (ассеты позже).'],
  ['*emotion_smile', 'Эмоция улыбка (ассеты позже).'],
  ['*emotion_surprise', 'Эмоция удивление (ассеты позже).'],
  ['*emotion_doubt', 'Эмоция сомнение (ассеты позже).'],
  ['*board_news_front 0', 'Перенести доску с новостью вперед, 0 = без ограничения по времени.'],
  ['*board_news_back 0', 'Перенести доску с новостью назад, 0 = базовое состояние.'],
];

function openCommandsOverlay() {
  commandsOverlay.classList.add('is-open');
}

function closeCommandsOverlay() {
  commandsOverlay.classList.remove('is-open');
}

function renderCommandsHelp() {
  commandsList.innerHTML = '';
  commandHelpItems.forEach(([command, description]) => {
    const li = document.createElement('li');
    li.innerHTML = `<code>${command}</code> — ${description}`;
    commandsList.appendChild(li);
  });
}

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
    path: 'public/mounth/mounth_close_neitral.webp',
    frames: 10,
    scale: 0.6,
    offset_x: 20,
    offset_y: -12,
  },
  closed: {
    path: 'public/mounth/mounth_close_neitral.webp',
    frames: 10,
    scale: 0.6,
    offset_x: 20,
    offset_y: -12,
  },
  open: {
    path: 'public/mounth/mounth_open_beauty.webp',
    variants: [
      'public/mounth/mounth_open_beauty.webp',
      'public/mounth/mounth_open_round.webp',
      'public/mounth/mounth_open_trapecia.webp',
    ],
    frames: 8,
    scale: 0.6,
    offset_x: 20,
    offset_y: -14,
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

function collectFullSpeechText() {
  const intro = document.getElementById('intro-text').value.trim();
  const body = collectSpeechText();
  const outro = document.getElementById('outro-text').value.trim();
  return [intro, body, outro].filter(Boolean).join(' ');
}

function applySubtitlePosition() {
  sceneSubtitles.style.left = `calc(50% + ${subtitlePosition.x}px)`;
  sceneSubtitles.style.top = `calc(70% + 50px + ${subtitlePosition.y}px)`;
  subtitlePositionReadout.textContent = `x: ${subtitlePosition.x}, y: ${subtitlePosition.y}`;
}

function setBoardContent(title = '', imageData = '', isNewsReading = false) {
  boardDefaultLayer.classList.toggle('is-hidden', isNewsReading);
  boardNewsMode.classList.toggle('is-visible', isNewsReading);

  boardNewsTitle.textContent = title || 'URSAS NEWS';
  if (imageData) {
    boardNewsImagePreview.src = imageData;
    boardNewsImagePreview.classList.add('is-visible');
  } else {
    boardNewsImagePreview.removeAttribute('src');
    boardNewsImagePreview.classList.remove('is-visible');
  }
}

function resetBoardContent() {
  setBoardContent('URSAS NEWS', '', false);
}

function scheduleBoardNewsBySpeech(totalMs) {
  const intro = document.getElementById('intro-text').value.trim();
  const outro = document.getElementById('outro-text').value.trim();
  const newsItems = collectSpeechNewsItems();
  const parts = [
    { type: 'intro', text: intro },
    ...newsItems.map((item) => ({ type: 'news', ...item })),
    { type: 'outro', text: outro },
  ].filter((part) => (part.text || '').trim().length > 0);

  if (parts.length === 0) {
    resetBoardContent();
    return;
  }

  const wordCounts = parts.map((part) => Math.max(1, getWordsCount(part.text)));
  const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);

  let cursor = 180;
  parts.forEach((part, index) => {
    const duration = Math.max(500, Math.round((wordCounts[index] / totalWords) * totalMs));

    const startTimer = setTimeout(() => {
      if (part.type === 'news') {
        setBoardContent(part.title || 'URSAS NEWS', part.image_data || '', true);
      } else {
        resetBoardContent();
      }
    }, cursor);
    mouthPreviewTimerIds.push(startTimer);

    cursor += duration;
  });

  const finishTimer = setTimeout(resetBoardContent, cursor + 50);
  mouthPreviewTimerIds.push(finishTimer);
}

function parseSpeechCommands(rawText) {
  const normalized = (rawText || '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return { cleanText: '', actions: [], pauses: [] };
  }

  const actions = [];
  const pauses = [];
  const tokens = normalized.match(/\*[a-z_]+|\d+|[^\s]+/gi) || [];
  const cleanTokens = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (!token.startsWith('*')) {
      cleanTokens.push(token);
      continue;
    }

    const command = token.slice(1).toLowerCase();
    if (command === 'speak_pause') {
      const next = tokens[i + 1];
      const durationMs = Number(next);
      if (Number.isFinite(durationMs) && durationMs > 0) {
        pauses.push({ type: 'speak_pause', duration_ms: durationMs });
        i += 1;
      }
      continue;
    }

    const maybeDuration = Number(tokens[i + 1]);
    if (Number.isFinite(maybeDuration) && maybeDuration >= 0) {
      actions.push({ type: command, duration_ms: maybeDuration });
      i += 1;
    } else {
      actions.push({ type: command, duration_ms: 0 });
    }
  }

  return {
    cleanText: cleanTokens.join(' ').replace(/\s+/g, ' ').trim(),
    actions,
    pauses,
  };
}

function updateSceneSubtitles(currentText = '', nextText = '', forceClear = false) {
  const subtitlesEnabled = document.getElementById('episode-subtitles').value === 'true';
  if (!subtitlesEnabled || forceClear) {
    sceneSubtitles.classList.remove('is-visible');
    sceneSubtitles.innerHTML = '';
    sceneSubtitles.dataset.current = '';
    sceneSubtitles.dataset.next = '';
    return;
  }

  const subtitleFontFamily = document.getElementById('subtitle-font-family').value.trim() || 'Inter';
  const subtitleFontWeight = subtitleBoldInput.value === 'true' ? 700 : 400;
  const subtitleFontSize = Number(document.getElementById('subtitle-font-size').value || 16);

  sceneSubtitles.style.fontFamily = subtitleFontFamily;
  sceneSubtitles.style.fontWeight = String(subtitleFontWeight);
  sceneSubtitles.style.fontSize = `${subtitleFontSize}px`;
  applySubtitlePosition();

  if (!currentText && !nextText && sceneSubtitles.dataset.current) {
    currentText = sceneSubtitles.dataset.current;
    nextText = sceneSubtitles.dataset.next || '';
  }

  if (!currentText) {
    sceneSubtitles.classList.remove('is-visible');
    return;
  }

  sceneSubtitles.dataset.current = currentText;
  sceneSubtitles.dataset.next = nextText;
  sceneSubtitles.innerHTML = `<div>${currentText}</div>${nextText ? `<div class="subtitle-next">${nextText}</div>` : ''}`;
  sceneSubtitles.classList.add('is-visible');
}

function setBoardFront() {
  boardLayer.classList.add('is-front');
}

function setBoardBack() {
  boardLayer.classList.remove('is-front');
}

function clearSubtitleTimers() {
  subtitleTimerIds.forEach((id) => clearTimeout(id));
  subtitleTimerIds = [];
}

function splitSentences(text) {
  return (text.match(/[^.!?]+[.!?]?/g) || []).map((s) => s.trim()).filter(Boolean);
}

function scheduleSubtitles(text, totalMs) {
  clearSubtitleTimers();

  const sentences = splitSentences(text);
  if (sentences.length === 0) {
    updateSceneSubtitles('', '');
    return;
  }

  const wordCounts = sentences.map((sentence) => Math.max(1, getWordsCount(sentence)));
  const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);
  let cursor = 0;

  sentences.forEach((sentence, index) => {
    const nextSentence = sentences[index + 1] || '';
    const id = setTimeout(() => {
      updateSceneSubtitles(sentence, nextSentence);
    }, cursor);
    subtitleTimerIds.push(id);

    const duration = Math.max(700, Math.round((wordCounts[index] / totalWords) * totalMs));
    cursor += duration;
  });
}

function updateNewsItemCounter(textarea, counterElement) {
  const text = textarea.value;
  const chars = text.length;
  const words = getWordsCount(text);
  counterElement.textContent = `${chars} симв / ${words} слов`;
}

function addSpeechNewsItem(initialValue = '') {
  speechNewsIndex += 1;

  const wrapper = document.createElement('div');
  wrapper.className = 'news-item-row';

  const label = document.createElement('label');
  label.className = 'news-item-label';
  const labelText = document.createElement('span');
  labelText.className = 'news-item-label-text';
  labelText.textContent = `Новость ${speechNewsIndex}`;
  const helpButton = document.createElement('button');
  helpButton.type = 'button';
  helpButton.className = 'help-btn';
  helpButton.textContent = '?';
  helpButton.addEventListener('click', openCommandsOverlay);
  label.append(labelText, helpButton);

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

  textarea.addEventListener('input', () => {
    updateNewsItemCounter(textarea, counter);
    updateSceneSubtitles();
  });
  linkInput.addEventListener('input', () => {
    linkInput.setCustomValidity(isValidHttpUrl(linkInput.value.trim()) ? '' : 'Введите ссылку http/https');
  });
  imageInput.addEventListener('change', () => {
    const [file] = imageInput.files || [];
    if (!file) {
      wrapper.dataset.imageData = '';
      imagePreview.removeAttribute('src');
      imagePreview.classList.remove('is-visible');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      wrapper.dataset.imageData = result;
      imagePreview.src = result;
      imagePreview.classList.add('is-visible');
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
  });

  moveDownButton.addEventListener('click', () => {
    const next = wrapper.nextElementSibling;
    if (!next) {
      return;
    }
    speechNewsItems.insertBefore(next, wrapper);
    renumberSpeechNews();
  });

  deleteButton.addEventListener('click', () => {
    wrapper.remove();
    renumberSpeechNews();
    const first = speechNewsItems.querySelector('.news-item-row');
    if (!first) {
      addSpeechNewsItem();
      return;
    }
    updateSceneSubtitles();
  });

  renumberSpeechNews();
}

function renumberSpeechNews() {
  const rows = speechNewsItems.querySelectorAll('.news-item-row');
  rows.forEach((row, index) => {
    row.querySelector('.news-item-label-text').textContent = `Новость ${index + 1}`;
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

function formatWallet(wallet) {
  if (!wallet || wallet.length < 10) {
    return wallet || '—';
  }

  return `${wallet.slice(0, 6)}…${wallet.slice(-4)}`;
}

function renderTubeLeaderboardRows(entries) {
  tubeLeaderboardList.innerHTML = '';

  entries.forEach((entry, index) => {
    const row = document.createElement('div');
    row.className = 'tube-lb-row';

    const rank = document.createElement('span');
    rank.className = 'tube-lb-rank';
    rank.textContent = `#${index + 1}`;
    if (index === 0) rank.classList.add('is-gold');
    if (index === 1) rank.classList.add('is-silver');
    if (index === 2) rank.classList.add('is-bronze');

    const wallet = document.createElement('span');
    wallet.className = 'tube-lb-wallet';
    wallet.textContent = formatWallet(String(entry.wallet || entry.userWallet || ''));

    const score = document.createElement('span');
    score.className = 'tube-lb-score';
    score.textContent = String(Math.floor(Number(entry.bestScore ?? entry.score ?? 0)));

    row.append(rank, wallet, score);
    tubeLeaderboardList.appendChild(row);
  });
}

async function loadTubeLeaderboard() {
  if (!tubeLeaderboardList || !tubeLeaderboardStatus) {
    return;
  }

  tubeLeaderboardStatus.textContent = 'Загрузка leaderboard...';

  try {
    const response = await fetch(`${TUBE_BACKEND_URL}/api/leaderboard/top`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const leaderboard = Array.isArray(data?.leaderboard) ? data.leaderboard : [];
    renderTubeLeaderboardRows(leaderboard.slice(0, 10));
    tubeLeaderboardStatus.textContent =
      leaderboard.length > 0
        ? `Топ-${Math.min(10, leaderboard.length)} игроков Ursass Tube`
        : 'Нет данных leaderboard';
    tubeLeaderboardLoaded = true;
  } catch (error) {
    tubeLeaderboardStatus.textContent = `Ошибка загрузки leaderboard: ${error}`;
    tubeLeaderboardList.innerHTML = '';
  }
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
  const spritePath =
    Array.isArray(sprite.variants) && sprite.variants.length > 0
      ? sprite.variants[Math.floor(Math.random() * sprite.variants.length)]
      : sprite.path;

  mouthLayer.style.backgroundImage = `url("${spritePath}")`;
  mouthLayer.style.backgroundPosition = `${-100 * boundedFrame}px 0`;
  mouthLayer.style.left = `calc(50% + ${sprite.offset_x}px)`;
  mouthLayer.style.top = `calc(49% + ${sprite.offset_y}px)`;
  mouthLayer.style.transform = `translate(-50%, -50%) scale(${sprite.scale})`;
}

function applySceneLayout(format) {
  const isHorizontal = format === '1920x1080';
  sceneStage.classList.toggle('is-horizontal', isHorizontal);

  sceneBackwallLayer.src = isHorizontal
    ? 'public/base scene/backwall (horizontal).webp'
    : 'public/base scene/backwall.webp';
  sceneTableLayer.src = isHorizontal
    ? 'public/base scene/table (horizontal).webp'
    : 'public/base scene/table.webp';
  boardDefaultLayer.src = isHorizontal
    ? 'public/base scene/board_head ursas (horizontal).webp'
    : 'public/base scene/board_head_ursas.webp';
  boardHeadBaseLayer.src = isHorizontal
    ? 'public/base scene/board_head_empty (horizontal).webp'
    : 'public/base scene/board_head_empty.webp';
  boardImageBaseLayer.src = isHorizontal
    ? 'public/base scene/board_news (horizont).webp'
    : 'public/base scene/board_news.webp';
  boardNewsImagePreview.style.setProperty('--board-image-mask', `url("${boardImageBaseLayer.src}")`);
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

function buildSpeechEvents(rawText) {
  const scriptTokens = (rawText || '').match(/\*[a-z_]+|\d+|[^\s]+/gi) || [];
  const tokens = [];
  for (let i = 0; i < scriptTokens.length; i += 1) {
    const token = scriptTokens[i];
    if (token.startsWith('*')) {
      const command = token.slice(1).toLowerCase();
      if (command === 'speak_pause') {
        const duration = Number(scriptTokens[i + 1]);
        if (Number.isFinite(duration) && duration > 0) {
          tokens.push({ type: 'pause_ms', duration_ms: duration });
          i += 1;
        }
      } else {
        const duration = Number(scriptTokens[i + 1]);
        if (Number.isFinite(duration) && duration >= 0) {
          tokens.push({ type: 'action', command, duration_ms: duration });
          i += 1;
        } else {
          tokens.push({ type: 'action', command, duration_ms: 0 });
        }
      }
      continue;
    }

    const parts = token.match(/[\p{L}\p{N}-]+|[.,!?;:]/gu) || [];
    parts.forEach((part) => tokens.push({ type: 'speech', value: part }));
  }

  const events = [];

  tokens.forEach((token, index) => {
    if (token.type === 'pause_ms') {
      events.push({ type: 'pause_ms', duration_ms: token.duration_ms });
      return;
    }

    if (token.type === 'action') {
      events.push({ type: 'action', command: token.command, duration_ms: token.duration_ms || 0 });
      return;
    }

    const value = token.value;
    const isPunctuation = /^[.,!?;:]$/.test(value);
    if (isPunctuation) {
      const pauseUnits = value === ',' ? 2 : value === '!' ? 4 : 3;
      events.push({ type: 'pause', units: pauseUnits, punctuation: value });
      return;
    }

    const nextToken = tokens[index + 1];
    const forceLarge = nextToken?.type === 'speech' && nextToken.value === '!';
    const syllables = estimateSyllables(value);

    for (let i = 0; i < syllables; i += 1) {
      events.push({
        type: 'open',
        units: 2,
        frameIndex: pickOpenFrame(value, forceLarge),
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
  const rawText = collectFullSpeechText();
  const parsed = parseSpeechCommands(rawText);
  const text = parsed.cleanText;
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
    raw_text: rawText,
    words_count: words,
    chars_count: text.length,
    actions: parsed.actions,
    pauses: parsed.pauses,
  };
}

function stopMouthPreview() {
  mouthPreviewTimerIds.forEach((id) => clearTimeout(id));
  mouthPreviewTimerIds = [];
  clearSubtitleTimers();
  setNeutralMouth();
  setBoardBack();
  resetBoardContent();
  updateSceneSubtitles('', '', true);
}

function startMouthPreview() {
  stopMouthPreview();

  const speech = getSpeechTimelineConfig();
  if (!speech.text) {
    setNeutralMouth();
    updateSceneSubtitles('', '', true);
    return;
  }
  scheduleSubtitles(speech.text, speech.total_ms);
  scheduleBoardNewsBySpeech(speech.total_ms);

  const events = buildSpeechEvents(speech.raw_text);
  if (events.length === 0) {
    setNeutralMouth();
    return;
  }

  const fixedPauseMs = events
    .filter((event) => event.type === 'pause_ms')
    .reduce((sum, event) => sum + event.duration_ms, 0);
  const variableUnits = events
    .filter((event) => event.type !== 'pause_ms')
    .reduce((sum, event) => sum + (event.units || 0), 0);
  const variableTotalMs = Math.max(300, speech.total_ms - fixedPauseMs);
  const unitDurationMs = Math.max(50, variableTotalMs / Math.max(1, variableUnits));

  let cursor = 0;
  const startIdleMs = 180;
  cursor += startIdleMs;
  events.forEach((event) => {
    const id = setTimeout(() => {
      if (event.type === 'open') {
        setMouthFrame('open', event.frameIndex);
      } else if (event.type === 'close') {
        setMouthFrame('closed', event.frameIndex || 0);
      } else if (event.type === 'pause_ms') {
        setMouthFrame('closed', Math.floor(Math.random() * mouthSprites.closed.frames));
      } else if (event.type === 'action') {
        if (event.command === 'board_news_front') {
          setBoardFront();
          if (event.duration_ms > 0) {
            const backTimer = setTimeout(setBoardBack, event.duration_ms);
            mouthPreviewTimerIds.push(backTimer);
          }
        }
        if (event.command === 'board_news_back') {
          setBoardBack();
        }
      }
    }, cursor);
    mouthPreviewTimerIds.push(id);
    if (event.type === 'pause_ms') {
      cursor += event.duration_ms;
    } else {
      cursor += (event.units || 0) * unitDurationMs;
    }
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
  const subtitleFontWeight = subtitleBoldInput.value === 'true' ? 700 : 400;
  const intro = document.getElementById('intro-text').value.trim();
  const speechText = collectFullSpeechText();
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
        bold: subtitleBoldInput.value === 'true',
        font_size: Number(document.getElementById('subtitle-font-size').value || 16),
        position: { x: subtitlePosition.x, y: subtitlePosition.y },
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
episodeFormatInput.addEventListener('change', () => applySceneLayout(episodeFormatInput.value));
addNewsItemButton.addEventListener('click', () => addSpeechNewsItem());
addRubricButton.addEventListener('click', addSelectedRubric);
rubricSelect.addEventListener('change', () => {
  addRubricButton.disabled = !rubricSelect.value;
});
helpButtons.forEach((button) => button.addEventListener('click', openCommandsOverlay));
commandsClose.addEventListener('click', closeCommandsOverlay);
commandsOverlay.addEventListener('click', (event) => {
  if (event.target === commandsOverlay) {
    closeCommandsOverlay();
  }
});
document.getElementById('episode-subtitles').addEventListener('change', () => updateSceneSubtitles());
document.getElementById('subtitle-font-family').addEventListener('input', () => updateSceneSubtitles());
subtitleBoldInput.addEventListener('change', () => updateSceneSubtitles());
document.getElementById('subtitle-font-size').addEventListener('input', () => updateSceneSubtitles());
document.getElementById('intro-text').addEventListener('input', () => updateSceneSubtitles());
document.getElementById('outro-text').addEventListener('input', () => updateSceneSubtitles());
subtitleJoystick.addEventListener('click', (event) => {
  const button = event.target.closest('[data-move]');
  if (!button) return;
  const step = 5;
  const move = button.dataset.move;
  if (move === 'up') subtitlePosition.y -= step;
  if (move === 'down') subtitlePosition.y += step;
  if (move === 'left') subtitlePosition.x -= step;
  if (move === 'right') subtitlePosition.x += step;
  if (move === 'reset') {
    subtitlePosition.x = 0;
    subtitlePosition.y = 0;
  }
  applySubtitlePosition();
});
tubeLeaderboardReload.addEventListener('click', loadTubeLeaderboard);

setNeutralMouth();
updateSpeechMode();
applySceneLayout(episodeFormatInput.value);
addSpeechNewsItem();
fillRubricSelect();
addRubricButton.disabled = true;
renderCommandsHelp();
applySubtitlePosition();
if (document.getElementById('rubrics').classList.contains('is-active') || !tubeLeaderboardLoaded) {
  loadTubeLeaderboard();
}

renderNewsQueue();
