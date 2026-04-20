const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = Array.from(document.querySelectorAll('.panel'));

function activateTab(tabId) {
  const tab = tabs.find((candidate) => candidate.dataset.tab === tabId);
  const nextPanel = panels.find((panel) => panel.id === tabId);
  if (!tab || !nextPanel) {
    return;
  }

  tabs.forEach((item) => item.classList.remove('is-active'));
  panels.forEach((panel) => panel.classList.remove('is-active'));

  tab.classList.add('is-active');
  nextPanel.classList.add('is-active');

  if (tabId === 'rubrics') {
    loadTubeLeaderboard();
    loadMarketMovers();
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', (event) => {
    event.preventDefault();
    activateTab(tab.dataset.tab);
  });
});

if (window.location.hash) {
  const hashTabId = window.location.hash.replace('#', '');
  activateTab(hashTabId);
}

const manualNewsForm = document.getElementById('manual-news-form');
const newsList = document.getElementById('news-list');
const monitorProviderTabs = document.getElementById('monitor-provider-tabs');
const monitorTargetForm = document.getElementById('monitor-target-form');
const monitorTargetLabel = document.getElementById('monitor-target-label');
const monitorTargetInput = document.getElementById('monitor-target-input');
const monitorTargetList = document.getElementById('monitor-target-list');
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
const boardImageSlot = document.getElementById('board-image-slot');
const boardImageSlotHomeParent = boardImageSlot?.parentElement || null;
const boardNewsTitle = document.getElementById('board-news-title');
const boardNewsImagePreview = document.getElementById('board-news-image-preview');
const tubeLeaderboardList = document.getElementById('tube-leaderboard-list');
const tubeLeaderboardStatus = document.getElementById('tube-lb-status');
const tubeLeaderboardReload = document.getElementById('tube-lb-reload');
const commandsOverlay = document.getElementById('commands-overlay');
const commandsClose = document.getElementById('commands-close');
const commandsList = document.getElementById('commands-list');
const helpButtons = document.querySelectorAll('[data-help="commands"]');
const rubricsGrid = document.getElementById('rubrics-grid');
const moversVsCurrencyInput = document.getElementById('movers-vs-currency');
const moversStockApiKeyInput = document.getElementById('movers-stock-api-key');
const moversMinCoinCapInput = document.getElementById('movers-min-coin-cap');
const moversMaxCoinCapInput = document.getElementById('movers-max-coin-cap');
const moversMinCoinLiquidityInput = document.getElementById('movers-min-coin-liquidity');
const moversMinStockCapInput = document.getElementById('movers-min-stock-cap');
const moversMaxStockCapInput = document.getElementById('movers-max-stock-cap');
const moversMinStockVolumeInput = document.getElementById('movers-min-stock-volume');
const moversRefreshButton = document.getElementById('movers-refresh');
const moversSaveSettingsButton = document.getElementById('movers-save-settings');
const moversStatus = document.getElementById('movers-status');
const coinMoversGrid = document.getElementById('coin-movers-grid');
const coinMoversStatus = document.getElementById('coin-movers-status');
const stockMoversGrid = document.getElementById('stock-movers-grid');
const stockMoversStatus = document.getElementById('stock-movers-status');
const cryptoBubblesLink = document.getElementById('crypto-bubbles-link');
const rubricEditorOverlay = document.getElementById('rubric-editor-overlay');
const rubricEditorTitle = document.getElementById('rubric-editor-title');
const rubricEditorText = document.getElementById('rubric-editor-text');
const rubricEditorSave = document.getElementById('rubric-editor-save');
const rubricEditorClose = document.getElementById('rubric-editor-close');
const rubricViewOverlay = document.getElementById('rubric-view-overlay');
const rubricViewTitle = document.getElementById('rubric-view-title');
const rubricViewContent = document.getElementById('rubric-view-content');
const rubricViewClose = document.getElementById('rubric-view-close');

const manualNewsQueue = [];
let mouthPreviewTimerIds = [];
let subtitleTimerIds = [];
let speechNewsIndex = 0;
let tubeLeaderboardLoaded = false;
let activeRubricType = '';
const subtitlePosition = { x: 0, y: 0 };
const RUBRIC_DESCRIPTIONS_KEY = 'ursasnews_rubric_descriptions_v1';
const MARKET_MOVERS_FILTERS_KEY = 'ursasnews_market_movers_filters_v1';
let rubricDescriptions = {};
const monitoringProviders = [
  { id: 'x', title: 'X', mode: 'account', hint: 'Добавьте @аккаунт или ссылку на профиль.' },
  { id: 'reddit', title: 'Reddit', mode: 'account', hint: 'Добавьте сабреддит или профиль, например r/cryptocurrency.' },
  { id: 'telegram', title: 'Telegram', mode: 'account', hint: 'Добавьте @канал или invite-ссылку.' },
  { id: 'instagram', title: 'Instagram', mode: 'account', hint: 'Добавьте @аккаунт источника.' },
  { id: 'reuters', title: 'Reuters', mode: 'account', hint: 'Добавьте профиль, ленту или раздел редакции.' },
  { id: 'bloomberg', title: 'Bloomberg', mode: 'account', hint: 'Добавьте автора, раздел или профиль.' },
  { id: 'coindesk', title: 'CoinDesk', mode: 'account', hint: 'Добавьте рубрику или страницу автора.' },
  { id: 'grok', title: 'Grok', mode: 'prompt', hint: 'Введите промпт для поиска новостей через Grok.' },
  { id: 'gemini', title: 'Gemini', mode: 'prompt', hint: 'Введите промпт для поиска новостей через Gemini.' },
];
const monitoringTargets = {};
let activeMonitoringProvider = monitoringProviders[0].id;
const BOARD_NEWS_IMAGE_RECT = { x: 164, y: 276, width: 696, height: 937 };
const boardSlotConfig = {
  '1080x1920': {
    asset: { width: 1024, height: 1536 },
    imageRect: BOARD_NEWS_IMAGE_RECT,
    width: BOARD_NEWS_IMAGE_RECT.width,
    height: BOARD_NEWS_IMAGE_RECT.height,
    title: { top: '34%', left: '51%', width: '36%', size: '40px' },
  },
  '1920x1080': {
    asset: { width: 1536, height: 1024 },
    imageRect: {
      x: Math.round((BOARD_NEWS_IMAGE_RECT.x / 1024) * 1536),
      y: Math.round((BOARD_NEWS_IMAGE_RECT.y / 1536) * 1024),
      width: Math.round((BOARD_NEWS_IMAGE_RECT.width / 1024) * 1536),
      height: Math.round((BOARD_NEWS_IMAGE_RECT.height / 1536) * 1024),
    },
    width: Math.round((BOARD_NEWS_IMAGE_RECT.width / 1024) * 1536),
    height: Math.round((BOARD_NEWS_IMAGE_RECT.height / 1536) * 1024),
    title: { top: '34%', left: '51%', width: '36%', size: '40px' },
  },
};

const defaultNewsSceneSettings = {
  fitMode: 'cover',
  imageAlign: 'center',
  offsetX: 0,
  offsetY: 0,
  zoom: 100,
  imageX: 16,
  imageY: 18,
  imageWidth: 68,
  imageHeight: 61,
  titleX: 51,
  titleY: 34,
  titleWidth: 36,
  titleSize: 40,
};

const TUBE_BACKEND_URL = 'https://api.ursasstube.fun';
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const FMP_API_URL = 'https://financialmodelingprep.com/api/v3';

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
  ['*board_news_front 0', 'Перенести слой изображения новости впереди всех остальных слоев, 0 = без ограничения по времени.'],
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
  { type: 'top_10_coins', title: 'Top 10 coins movers' },
  { type: 'top_10_stocks', title: 'Top 10 stocks movers' },
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

      return {
        title,
        text,
        link,
        image_data,
        scene_settings: row._sceneSettings || { ...defaultNewsSceneSettings },
        scene_frames: Array.isArray(row._sceneFrames) ? row._sceneFrames : [],
        approved_scene_index: Number.isInteger(row._approvedSceneIndex) ? row._approvedSceneIndex : null,
      };
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

  boardNewsTitle.textContent = normalizeBoardTitle(title || 'URSAS NEWS');
  if (imageData) {
    boardNewsImagePreview.src = imageData;
    boardNewsImagePreview.classList.add('is-visible');
  } else {
    boardNewsImagePreview.removeAttribute('src');
    boardNewsImagePreview.classList.remove('is-visible');
  }
}

function applySceneLayoutVariables(node, settings, titleScale = 1) {
  if (!node || !settings) {
    return;
  }
  const { imageX, imageY, imageWidth, imageHeight, titleX, titleY, titleWidth, titleSize } = settings;
  const imageRight = Math.max(0, 100 - imageX - imageWidth);
  const imageBottom = Math.max(0, 100 - imageY - imageHeight);
  const imageInset = `${imageY}% ${imageRight}% ${imageBottom}% ${imageX}%`;
  node.style.setProperty('--board-image-slot-inset', imageInset);
  node.style.setProperty('--board-title-top', `${titleY}%`);
  node.style.setProperty('--board-title-left', `${titleX}%`);
  node.style.setProperty('--board-title-width', `${titleWidth}%`);
  node.style.setProperty('--board-title-size', `${Math.max(8, Math.round(titleSize * titleScale))}px`);
}

function applySceneSettingsToMainStage(settings = defaultNewsSceneSettings) {
  applyImageRenderToNode(boardNewsImagePreview, settings);
  applySceneLayoutVariables(boardLayer, settings, 0.5);
}

function transliterateRuToEn(value) {
  const map = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  return String(value || '')
    .split('')
    .map((char) => {
      const lower = char.toLowerCase();
      if (!(lower in map)) return char;
      const translit = map[lower];
      return char === lower ? translit : translit.toUpperCase();
    })
    .join('');
}

function normalizeBoardTitle(value) {
  const transliterated = transliterateRuToEn(value);
  const englishSafe = transliterated.replace(/[^a-z0-9 .,!?:&'"/+-]/gi, ' ');
  const compact = englishSafe.replace(/\s+/g, ' ').trim();
  if (!compact) {
    return 'URSAS NEWS';
  }
  return compact.toUpperCase().slice(0, 48);
}

function applyImageRenderToNode(node, settings = defaultNewsSceneSettings) {
  if (!node) {
    return;
  }
  const { fitMode, imageAlign, offsetX, offsetY, zoom } = settings;
  const xBase = imageAlign === 'left' ? '0%' : '50%';
  node.style.objectFit = fitMode;
  node.style.objectPosition = `calc(${xBase} + ${offsetX}%) calc(50% + ${offsetY}%)`;
  node.style.transformOrigin = imageAlign === 'left' ? 'left center' : 'center center';
  node.style.transform = `scale(${Math.max(10, Number(zoom) || 100) / 100})`;
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, numeric));
}

function applySceneLayoutToPreviewNode(preview, settings) {
  applySceneLayoutVariables(preview, settings, 0.35);
}

function updateOffsetByDragDelta(startValue, deltaPixels, sizePixels) {
  if (!sizePixels) {
    return startValue;
  }
  const deltaPercent = (deltaPixels / sizePixels) * 200;
  return Math.max(-100, Math.min(100, Math.round(startValue + deltaPercent)));
}

function bindRealtimeImageDrag(areaNode, settings, onChange) {
  if (!areaNode) {
    return;
  }

  areaNode.addEventListener('pointerdown', (event) => {
    const imageNode = areaNode.querySelector('.news-scene-preview-image');
    if (!imageNode?.classList.contains('is-visible')) {
      return;
    }
    const pointerId = event.pointerId;
    const bounds = areaNode.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startOffsetX = Number(settings.offsetX || 0);
    const startOffsetY = Number(settings.offsetY || 0);

    areaNode.setPointerCapture(pointerId);
    event.preventDefault();

    const onMove = (moveEvent) => {
      const nextOffsetX = updateOffsetByDragDelta(startOffsetX, moveEvent.clientX - startX, bounds.width);
      const nextOffsetY = updateOffsetByDragDelta(startOffsetY, moveEvent.clientY - startY, bounds.height);
      settings.offsetX = nextOffsetX;
      settings.offsetY = nextOffsetY;
      onChange();
    };

    const onUp = () => {
      areaNode.removeEventListener('pointermove', onMove);
      areaNode.removeEventListener('pointerup', onUp);
      areaNode.removeEventListener('pointercancel', onUp);
    };

    areaNode.addEventListener('pointermove', onMove);
    areaNode.addEventListener('pointerup', onUp);
    areaNode.addEventListener('pointercancel', onUp);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Не удалось прочитать изображение'));
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Не удалось загрузить изображение'));
    image.src = dataUrl;
  });
}

async function fitImageToBoardSlot(file, settings = defaultNewsSceneSettings) {
  const dataUrl = await readFileAsDataUrl(file);
  const sourceImage = await loadImageFromDataUrl(dataUrl);
  const format = episodeFormatInput.value === '1920x1080' ? '1920x1080' : '1080x1920';
  const slot = boardSlotConfig[format];
  const { fitMode, offsetX, offsetY } = settings;
  const targetWidth = slot?.width || 900;
  const targetHeight = slot?.height || 520;

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return dataUrl;
  }

  const srcWidth = sourceImage.width;
  const srcHeight = sourceImage.height;
  ctx.drawImage(sourceImage, 0, 0, srcWidth, srcHeight, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL('image/webp', 0.92);
}

function resetBoardContent() {
  setBoardContent('URSAS NEWS', '', false);
  applySceneSettingsToMainStage(defaultNewsSceneSettings);
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
        const approvedFrame = Array.isArray(part.scene_frames) ? part.scene_frames[part.approved_scene_index] : null;
        const activeSceneSettings = approvedFrame?.settings || part.scene_settings || defaultNewsSceneSettings;
        setBoardContent(part.title || 'URSAS NEWS', part.image_data || '', true);
        applySceneSettingsToMainStage(activeSceneSettings);
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
  if (boardImageSlot.parentElement !== boardNewsMode) {
    boardNewsMode.appendChild(boardImageSlot);
  }
  boardImageSlot.classList.add('is-front');
}

function setBoardBack() {
  boardLayer.classList.remove('is-front');
  if (boardImageSlotHomeParent && boardImageSlot.parentElement !== boardImageSlotHomeParent) {
    boardImageSlotHomeParent.insertBefore(boardImageSlot, boardImageBaseLayer);
  }
  boardImageSlot.classList.remove('is-front');
}

function clearSubtitleTimers() {
  subtitleTimerIds.forEach((id) => clearTimeout(id));
  subtitleTimerIds = [];
}

function showBaseSubtitlePreview() {
  const intro = document.getElementById('intro-text').value.trim();
  updateSceneSubtitles(intro || 'Текст субтитров', '');
}

function splitSentences(text) {
  return (text.match(/[^.!?]+[.!?]?/g) || []).map((s) => s.trim()).filter(Boolean);
}

function splitSubtitleChunks(text, maxWords = 10) {
  const tokens = (text || '').match(/[\p{L}\p{N}-]+|[.,!?;:]/gu) || [];
  const chunks = [];
  let current = [];
  let wordsCount = 0;

  tokens.forEach((token) => {
    const isPunctuation = /^[.,!?;:]$/.test(token);
    if (isPunctuation) {
      if (current.length > 0) {
        current[current.length - 1] = `${current[current.length - 1]}${token}`;
        chunks.push(current.join(' '));
        current = [];
        wordsCount = 0;
      }
      return;
    }

    current.push(token);
    wordsCount += 1;
    if (wordsCount >= maxWords) {
      chunks.push(current.join(' '));
      current = [];
      wordsCount = 0;
    }
  });

  if (current.length > 0) {
    chunks.push(current.join(' '));
  }

  return chunks;
}

function scheduleSubtitles(text, totalMs) {
  clearSubtitleTimers();

  const chunks = splitSubtitleChunks(text, 10);
  if (chunks.length === 0) {
    updateSceneSubtitles('', '');
    return;
  }

  const wordCounts = chunks.map((chunk) => Math.max(1, getWordsCount(chunk)));
  const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);
  let cursor = 0;

  chunks.forEach((chunk, index) => {
    const nextChunk = chunks[index + 1] || '';
    const id = setTimeout(() => {
      updateSceneSubtitles(chunk, nextChunk);
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

function getSceneActionsForNews(text) {
  const actions = parseSpeechCommands(text).actions || [];
  let cursorMs = 0;
  return actions
    .filter((action) => action.type !== 'speak_pause')
    .map((action) => {
      const point = { ...action, atMs: cursorMs };
      cursorMs += Math.max(0, Number(action.duration_ms) || 0);
      return point;
    })
    .filter((action) => action.type !== 'mouth_open' && action.type !== 'mouth_close');
}

function addSpeechNewsItem(initialValue = '') {
  speechNewsIndex += 1;

  const wrapper = document.createElement('div');
  wrapper.className = 'news-item-row';
  wrapper._sceneFrames = [];
  wrapper._selectedSceneIndex = 0;

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

  function buildScenePreviewNode(settings) {
    const preview = document.createElement('div');
    preview.className = 'news-scene-preview';

    const backwall = document.createElement('img');
    backwall.className = 'news-scene-preview-layer';
    backwall.src = sceneBackwallLayer.src;

    const table = document.createElement('img');
    table.className = 'news-scene-preview-layer';
    table.src = sceneTableLayer.src;

    const board = document.createElement('div');
    board.className = 'news-scene-preview-board';

    const boardBase = document.createElement('img');
    boardBase.className = 'news-scene-preview-board-base';
    boardBase.src = boardImageBaseLayer.src;

    const imageWrap = document.createElement('div');
    imageWrap.className = 'news-scene-preview-image-wrap';

    const image = document.createElement('img');
    image.className = 'news-scene-preview-image';
    image.alt = 'Превью сцены новости';
    if (wrapper.dataset.imageData) {
      image.src = wrapper.dataset.imageData;
      image.classList.add('is-visible');
    }
    applyImageRenderToNode(image, settings);
    imageWrap.appendChild(image);

    const headBase = document.createElement('img');
    headBase.className = 'news-scene-preview-head-base';
    headBase.src = boardHeadBaseLayer.src;

    const title = document.createElement('div');
    title.className = 'news-scene-preview-title';
    title.textContent = normalizeBoardTitle(titleInput.value.trim());

    board.append(boardBase, imageWrap, headBase, title);
    preview.append(backwall, table, board);
    applySceneLayoutToPreviewNode(preview, settings);
    return { preview, image, imageWrap, title };
  }

  const selectedSceneWrap = document.createElement('div');
  selectedSceneWrap.className = 'news-scene-selected-wrap';
  const selectedSceneLabel = document.createElement('div');
  selectedSceneLabel.className = 'hint';
  const selectedSceneBuilt = buildScenePreviewNode({ ...defaultNewsSceneSettings });
  const selectedScenePreview = selectedSceneBuilt.preview;
  const selectedSceneImage = selectedSceneBuilt.image;
  const selectedSceneImageWrap = selectedSceneBuilt.imageWrap;
  const selectedSceneTitle = selectedSceneBuilt.title;
  selectedSceneWrap.append(selectedSceneLabel, selectedScenePreview);

  const sceneTimeline = document.createElement('div');
  sceneTimeline.className = 'news-scene-timeline';

  const sceneSettingsPanel = document.createElement('div');
  sceneSettingsPanel.className = 'settings-block news-item-settings';
  sceneSettingsPanel.innerHTML = `
    <h4>Параметры выбранной сцены новости</h4>
    <div class="settings-grid">
      <label>Режим подгонки
        <select class="row-fit-mode"><option value="cover">Cover</option><option value="contain">Contain</option></select>
      </label>
      <label>Выравнивание изображения
        <select class="row-image-align"><option value="center">По центру</option><option value="left">По левому краю</option></select>
      </label>
      <label>Смещение X (−100..100)<input type="number" class="row-offset-x" min="-100" max="100" step="1" value="0" /></label>
      <label>Смещение Y (−100..100)<input type="number" class="row-offset-y" min="-100" max="100" step="1" value="0" /></label>
      <label>Zoom изображения (%)<input type="number" class="row-zoom" min="10" max="300" step="1" value="100" /></label>
      <label>Image X (%)<input type="number" class="row-image-x" min="-100" max="100" step="0.1" value="16" /></label>
      <label>Image Y (%)<input type="number" class="row-image-y" min="-100" max="100" step="0.1" value="18" /></label>
      <label>Image width (%)<input type="number" class="row-image-w" min="1" max="100" step="0.1" value="68" /></label>
      <label>Image height (%)<input type="number" class="row-image-h" min="1" max="100" step="0.1" value="61" /></label>
      <label>Title X (%)<input type="number" class="row-title-x" min="-100" max="100" step="0.1" value="51" /></label>
      <label>Title Y (%)<input type="number" class="row-title-y" min="-100" max="100" step="0.1" value="34" /></label>
      <label>Title width (%)<input type="number" class="row-title-w" min="1" max="100" step="0.1" value="36" /></label>
      <label>Title size (px)<input type="number" class="row-title-size" min="8" max="120" step="1" value="40" /></label>
      <div class="board-image-position-readout-wrap"><button type="button" class="row-approve-scene">Approve сцену</button></div>
      <div class="board-image-position-readout-wrap"><span class="hint row-scene-readout"></span></div>
      <div class="board-image-position-readout-wrap"><span class="hint row-approve-status"></span></div>
    </div>
  `;
  const getControl = (selector) => sceneSettingsPanel.querySelector(selector);

  function getSelectedFrame() {
    return wrapper._sceneFrames[wrapper._selectedSceneIndex] || wrapper._sceneFrames[0];
  }

  function setControlsFromSettings(settings) {
    getControl('.row-fit-mode').value = settings.fitMode || 'cover';
    getControl('.row-image-align').value = settings.imageAlign === 'left' ? 'left' : 'center';
    getControl('.row-offset-x').value = String(settings.offsetX ?? 0);
    getControl('.row-offset-y').value = String(settings.offsetY ?? 0);
    getControl('.row-zoom').value = String(settings.zoom ?? 100);
    getControl('.row-image-x').value = String(settings.imageX ?? 16);
    getControl('.row-image-y').value = String(settings.imageY ?? 18);
    getControl('.row-image-w').value = String(settings.imageWidth ?? 68);
    getControl('.row-image-h').value = String(settings.imageHeight ?? 61);
    getControl('.row-title-x').value = String(settings.titleX ?? 51);
    getControl('.row-title-y').value = String(settings.titleY ?? 34);
    getControl('.row-title-w').value = String(settings.titleWidth ?? 36);
    getControl('.row-title-size').value = String(settings.titleSize ?? 40);
  }

  function readSettingsFromControls() {
    return {
      fitMode: getControl('.row-fit-mode').value === 'contain' ? 'contain' : 'cover',
      imageAlign: getControl('.row-image-align').value === 'left' ? 'left' : 'center',
      offsetX: clampNumber(getControl('.row-offset-x').value, -100, 100, 0),
      offsetY: clampNumber(getControl('.row-offset-y').value, -100, 100, 0),
      zoom: clampNumber(getControl('.row-zoom').value, 10, 300, 100),
      imageX: clampNumber(getControl('.row-image-x').value, -100, 100, 16),
      imageY: clampNumber(getControl('.row-image-y').value, -100, 100, 18),
      imageWidth: clampNumber(getControl('.row-image-w').value, 1, 100, 68),
      imageHeight: clampNumber(getControl('.row-image-h').value, 1, 100, 61),
      titleX: clampNumber(getControl('.row-title-x').value, -100, 100, 51),
      titleY: clampNumber(getControl('.row-title-y').value, -100, 100, 34),
      titleWidth: clampNumber(getControl('.row-title-w').value, 1, 100, 36),
      titleSize: clampNumber(getControl('.row-title-size').value, 8, 120, 40),
    };
  }

  function applySelectedFrameToMainPreview() {
    const frame = getSelectedFrame();
    if (!frame) return;
    const settings = frame.settings;
    applyImageRenderToNode(selectedSceneImage, settings);
    applySceneLayoutToPreviewNode(selectedScenePreview, settings);
    selectedSceneTitle.textContent = normalizeBoardTitle(titleInput.value.trim());
    if (wrapper.dataset.imageData) {
      selectedSceneImage.src = wrapper.dataset.imageData;
      selectedSceneImage.classList.add('is-visible');
    } else {
      selectedSceneImage.removeAttribute('src');
      selectedSceneImage.classList.remove('is-visible');
    }
    selectedSceneLabel.textContent = `Выбрана сцена: t=${(frame.atMs / 1000).toFixed(frame.atMs % 1000 === 0 ? 0 : 1)}s`;
    const sceneReadoutElement = sceneSettingsPanel.querySelector('.row-scene-readout');
    if (sceneReadoutElement) {
      sceneReadoutElement.textContent = `align:${settings.imageAlign || 'center'}, x:${settings.offsetX}, y:${settings.offsetY}, zoom:${settings.zoom || 100}%`;
    }
    const approveStatusElement = sceneSettingsPanel.querySelector('.row-approve-status');
    const approveButton = sceneSettingsPanel.querySelector('.row-approve-scene');
    if (approveStatusElement) {
      if (!Number.isInteger(wrapper._approvedSceneIndex)) {
        approveStatusElement.textContent = 'Сцена не согласована.';
      } else if (wrapper._approvedSceneIndex === wrapper._selectedSceneIndex) {
        approveStatusElement.textContent = 'Сцена согласована и будет использована в итоговом рендере.';
      } else {
        approveStatusElement.textContent = `Согласована сцена: t=${((wrapper._sceneFrames[wrapper._approvedSceneIndex]?.atMs || 0) / 1000).toFixed(1)}s`;
      }
    }
    if (approveButton) {
      const isSelectedApproved = wrapper._approvedSceneIndex === wrapper._selectedSceneIndex;
      approveButton.textContent = isSelectedApproved ? 'Unapprove сцену' : 'Approve сцену';
      approveButton.classList.toggle('is-active', isSelectedApproved);
    }
    wrapper._sceneSettings = { ...settings };
  }

  function rebuildSceneFrames() {
    const previousFrame = getSelectedFrame();
    const actions = getSceneActionsForNews(textarea.value);
    const baseSettings = wrapper._sceneFrames[0]?.settings
      ? { ...wrapper._sceneFrames[0].settings }
      : { ...defaultNewsSceneSettings };
    const nextFrames = [{ atMs: 0, type: 'start' }, ...actions].map((frame) => {
      const found = wrapper._sceneFrames.find((item) => item.atMs === frame.atMs && item.type === frame.type);
      return { ...frame, settings: found?.settings ? { ...found.settings } : { ...baseSettings } };
    });
    wrapper._sceneFrames = nextFrames;
    const prevIndex = nextFrames.findIndex((frame) => frame.atMs === previousFrame?.atMs && frame.type === previousFrame?.type);
    wrapper._selectedSceneIndex = prevIndex >= 0 ? prevIndex : 0;
    if (Number.isInteger(wrapper._approvedSceneIndex) && wrapper._approvedSceneIndex >= nextFrames.length) {
      wrapper._approvedSceneIndex = null;
    }
  }

  function renderNewsSceneTimeline() {
    sceneTimeline.innerHTML = '';
    wrapper._sceneFrames.forEach((frame, index) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'news-scene-timeline-item';
      if (index === wrapper._selectedSceneIndex) item.classList.add('is-selected');
      const sec = (frame.atMs / 1000).toFixed(frame.atMs % 1000 === 0 ? 0 : 1);
      item.innerHTML = `<strong>t=${sec}s</strong><span>${frame.type === 'start' ? 'Базовая сцена' : frame.type}</span>`;
      item.addEventListener('click', () => {
        wrapper._selectedSceneIndex = index;
        setControlsFromSettings(frame.settings);
        applySelectedFrameToMainPreview();
        renderNewsSceneTimeline();
      });
      sceneTimeline.appendChild(item);
    });
  }

  const counter = document.createElement('div');
  counter.className = 'news-item-counter';
  wrapper._approvedSceneIndex = null;

  const actionsRow = document.createElement('div');
  actionsRow.className = 'news-item-actions';
  const moveUpButton = document.createElement('button');
  moveUpButton.type = 'button';
  moveUpButton.textContent = '↑ Поднять выше';
  const moveDownButton = document.createElement('button');
  moveDownButton.type = 'button';
  moveDownButton.textContent = '↓ Опустить ниже';
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = '✕ Удалить новость';
  actionsRow.append(moveUpButton, moveDownButton, deleteButton);

  textarea.addEventListener('input', () => {
    updateNewsItemCounter(textarea, counter);
    updateSceneSubtitles();
    rebuildSceneFrames();
    renderNewsSceneTimeline();
    setControlsFromSettings(getSelectedFrame().settings);
    applySelectedFrameToMainPreview();
  });
  titleInput.addEventListener('input', () => {
    applySelectedFrameToMainPreview();
  });
  linkInput.addEventListener('input', () => {
    linkInput.setCustomValidity(isValidHttpUrl(linkInput.value.trim()) ? '' : 'Введите ссылку http/https');
  });
  imageInput.addEventListener('change', () => {
    imageInput.setCustomValidity('');
    const [file] = imageInput.files || [];
    if (!file) {
      wrapper.dataset.imageData = '';
      imagePreview.removeAttribute('src');
      imagePreview.classList.remove('is-visible');
      applySelectedFrameToMainPreview();
      return;
    }
    fitImageToBoardSlot(file, getSelectedFrame().settings)
      .then((result) => {
        wrapper.dataset.imageData = result;
        imagePreview.src = result;
        imagePreview.classList.add('is-visible');
        applySelectedFrameToMainPreview();
      })
      .catch(() => {
        wrapper.dataset.imageData = '';
        imagePreview.removeAttribute('src');
        imagePreview.classList.remove('is-visible');
        imageInput.setCustomValidity('Не удалось обработать изображение. Попробуйте другой файл.');
        imageInput.reportValidity();
      });
  });

  sceneSettingsPanel.querySelectorAll('input,select').forEach((input) => {
    input.addEventListener('input', () => {
      const frame = getSelectedFrame();
      if (!frame) return;
      frame.settings = readSettingsFromControls();
      applySelectedFrameToMainPreview();
      renderNewsSceneTimeline();
    });
  });
  getControl('.row-approve-scene').addEventListener('click', () => {
    if (wrapper._approvedSceneIndex === wrapper._selectedSceneIndex) {
      wrapper._approvedSceneIndex = null;
    } else {
      wrapper._approvedSceneIndex = wrapper._selectedSceneIndex;
    }
    applySelectedFrameToMainPreview();
    renderNewsSceneTimeline();
  });

  wrapper.append(label, titleInput, selectedSceneWrap, sceneTimeline, sceneSettingsPanel, textarea, counter, linkInput, imageInput, imagePreview, actionsRow);
  speechNewsItems.appendChild(wrapper);

  moveUpButton.addEventListener('click', () => {
    const prev = wrapper.previousElementSibling;
    if (!prev) return;
    speechNewsItems.insertBefore(wrapper, prev);
    renumberSpeechNews();
  });
  moveDownButton.addEventListener('click', () => {
    const next = wrapper.nextElementSibling;
    if (!next) return;
    speechNewsItems.insertBefore(next, wrapper);
    renumberSpeechNews();
  });
  deleteButton.addEventListener('click', () => {
    wrapper.remove();
    renumberSpeechNews();
    if (!speechNewsItems.querySelector('.news-item-row')) addSpeechNewsItem();
    updateSceneSubtitles();
  });

  updateNewsItemCounter(textarea, counter);
  rebuildSceneFrames();
  setControlsFromSettings(getSelectedFrame().settings);
  renderNewsSceneTimeline();
  applySelectedFrameToMainPreview();
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

function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCompactUsd(value) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(value);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return '—';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function getMoversFilters() {
  return {
    vsCurrency: (moversVsCurrencyInput?.value || 'usd').trim().toLowerCase() || 'usd',
    stockApiKey: (moversStockApiKeyInput?.value || 'demo').trim() || 'demo',
    minCoinCap: toNumberOrNull(moversMinCoinCapInput?.value),
    maxCoinCap: toNumberOrNull(moversMaxCoinCapInput?.value),
    minCoinLiquidity: Math.max(0, toNumberOrNull(moversMinCoinLiquidityInput?.value) ?? 0),
    minStockCap: toNumberOrNull(moversMinStockCapInput?.value),
    maxStockCap: toNumberOrNull(moversMaxStockCapInput?.value),
    minStockVolume: Math.max(0, toNumberOrNull(moversMinStockVolumeInput?.value) ?? 0),
  };
}

function applyMoversFilters(filters = {}) {
  if (!moversVsCurrencyInput) return;
  moversVsCurrencyInput.value = filters.vsCurrency || 'usd';
  moversStockApiKeyInput.value = filters.stockApiKey || '';
  moversMinCoinCapInput.value = Number.isFinite(filters.minCoinCap) ? filters.minCoinCap : '';
  moversMaxCoinCapInput.value = Number.isFinite(filters.maxCoinCap) ? filters.maxCoinCap : '';
  moversMinCoinLiquidityInput.value = Number.isFinite(filters.minCoinLiquidity) ? filters.minCoinLiquidity : 0.01;
  moversMinStockCapInput.value = Number.isFinite(filters.minStockCap) ? filters.minStockCap : '';
  moversMaxStockCapInput.value = Number.isFinite(filters.maxStockCap) ? filters.maxStockCap : '';
  moversMinStockVolumeInput.value = Number.isFinite(filters.minStockVolume) ? filters.minStockVolume : '';
}

function saveMoversFilters() {
  const filters = getMoversFilters();
  localStorage.setItem(MARKET_MOVERS_FILTERS_KEY, JSON.stringify(filters));
  moversStatus.textContent = 'Фильтры сохранены в localStorage.';
  const bubblesCurrency = (filters.vsCurrency || 'usd').toUpperCase();
  if (cryptoBubblesLink) {
    cryptoBubblesLink.href = `https://cryptobubbles.net/?theme=dark&currency=${encodeURIComponent(bubblesCurrency)}&size=marketcap`;
  }
}

function loadMoversFilters() {
  try {
    const raw = JSON.parse(localStorage.getItem(MARKET_MOVERS_FILTERS_KEY) || '{}') || {};
    applyMoversFilters(raw);
  } catch {
    applyMoversFilters();
  }
  saveMoversFilters();
}

function renderMoversList(root, title, items, type) {
  const group = document.createElement('div');
  group.className = 'movers-group';
  const heading = document.createElement('h4');
  heading.textContent = title;
  const list = document.createElement('ol');
  list.className = 'movers-list';

  items.forEach((item) => {
    const li = document.createElement('li');
    const moveClass = item.change >= 0 ? 'up' : 'down';
    li.innerHTML = `<strong>${item.symbol}</strong> ${item.name ? `(${item.name})` : ''} — <span class="${moveClass}">${formatPercent(item.change)}</span> · cap ${formatCompactUsd(item.marketCap)}`;
    if (type === 'stock' && Number.isFinite(item.volume)) {
      li.innerHTML += ` · vol ${new Intl.NumberFormat('ru-RU').format(item.volume)}`;
    }
    list.appendChild(li);
  });

  group.append(heading, list);
  root.appendChild(group);
}

function parseFmpChangePercent(rawValue) {
  if (typeof rawValue === 'number') return rawValue;
  if (typeof rawValue !== 'string') return NaN;
  return Number(rawValue.replace(/[()%+\s]/g, ''));
}

async function fetchCoinMovers(filters) {
  const url = new URL(`${COINGECKO_API_URL}/coins/markets`);
  url.searchParams.set('vs_currency', filters.vsCurrency || 'usd');
  url.searchParams.set('order', 'market_cap_desc');
  url.searchParams.set('per_page', '250');
  url.searchParams.set('page', '1');
  url.searchParams.set('sparkline', 'false');
  url.searchParams.set('price_change_percentage', '24h');
  const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`CoinGecko HTTP ${response.status}`);
  const data = await response.json();
  const filtered = (Array.isArray(data) ? data : []).filter((coin) => {
    const cap = Number(coin.market_cap || 0);
    const volume = Number(coin.total_volume || 0);
    const liquidity = cap > 0 ? volume / cap : 0;
    if (Number.isFinite(filters.minCoinCap) && cap < filters.minCoinCap) return false;
    if (Number.isFinite(filters.maxCoinCap) && cap > filters.maxCoinCap) return false;
    if (Number.isFinite(filters.minCoinLiquidity) && liquidity < filters.minCoinLiquidity) return false;
    return Number.isFinite(Number(coin.price_change_percentage_24h));
  });

  const mapped = filtered.map((coin) => ({
    symbol: String(coin.symbol || '').toUpperCase(),
    name: coin.name || '',
    change: Number(coin.price_change_percentage_24h || 0),
    marketCap: Number(coin.market_cap || 0),
  }));

  return {
    gainers: [...mapped].sort((a, b) => b.change - a.change).slice(0, 10),
    losers: [...mapped].sort((a, b) => a.change - b.change).slice(0, 10),
  };
}

async function fetchStockMovers(filters) {
  const apiKey = filters.stockApiKey || 'demo';
  const [gainersResp, losersResp] = await Promise.all([
    fetch(`${FMP_API_URL}/stock_market/gainers?apikey=${encodeURIComponent(apiKey)}`),
    fetch(`${FMP_API_URL}/stock_market/losers?apikey=${encodeURIComponent(apiKey)}`),
  ]);
  if (!gainersResp.ok || !losersResp.ok) {
    throw new Error(`FMP HTTP ${gainersResp.status}/${losersResp.status}`);
  }
  const gainersRaw = await gainersResp.json();
  const losersRaw = await losersResp.json();

  const baseList = [...(Array.isArray(gainersRaw) ? gainersRaw : []), ...(Array.isArray(losersRaw) ? losersRaw : [])];
  const uniqueSymbols = [...new Set(baseList.map((item) => item.symbol).filter(Boolean))].slice(0, 80);
  let quoteBySymbol = {};
  if (uniqueSymbols.length > 0) {
    const quoteResp = await fetch(`${FMP_API_URL}/quote/${uniqueSymbols.join(',')}?apikey=${encodeURIComponent(apiKey)}`);
    if (quoteResp.ok) {
      const quotes = await quoteResp.json();
      quoteBySymbol = Object.fromEntries((Array.isArray(quotes) ? quotes : []).map((quote) => [quote.symbol, quote]));
    }
  }

  const normalize = (entry) => {
    const quote = quoteBySymbol[entry.symbol] || {};
    return {
      symbol: entry.symbol,
      name: entry.name || quote.name || '',
      change: parseFmpChangePercent(entry.changesPercentage),
      marketCap: Number(quote.marketCap || entry.marketCap || 0),
      volume: Number(quote.volume || entry.volume || 0),
    };
  };

  const filtered = baseList
    .map(normalize)
    .filter((item) => Number.isFinite(item.change))
    .filter((item) => {
      if (Number.isFinite(filters.minStockCap) && item.marketCap < filters.minStockCap) return false;
      if (Number.isFinite(filters.maxStockCap) && item.marketCap > filters.maxStockCap) return false;
      if (Number.isFinite(filters.minStockVolume) && item.volume < filters.minStockVolume) return false;
      return true;
    });

  return {
    gainers: filtered.filter((item) => item.change >= 0).sort((a, b) => b.change - a.change).slice(0, 10),
    losers: filtered.filter((item) => item.change < 0).sort((a, b) => a.change - b.change).slice(0, 10),
  };
}

async function loadMarketMovers() {
  if (!coinMoversGrid || !stockMoversGrid) return;
  const filters = getMoversFilters();
  moversStatus.textContent = 'Загружаю топы монет и акций...';
  coinMoversStatus.textContent = 'Загрузка монет...';
  stockMoversStatus.textContent = 'Загрузка акций...';
  coinMoversGrid.innerHTML = '';
  stockMoversGrid.innerHTML = '';

  const [coinsResult, stocksResult] = await Promise.allSettled([fetchCoinMovers(filters), fetchStockMovers(filters)]);
  if (coinsResult.status === 'fulfilled') {
    renderMoversList(coinMoversGrid, '🚀 Топ-10 растущих монет', coinsResult.value.gainers, 'coin');
    renderMoversList(coinMoversGrid, '🔻 Топ-10 падающих монет', coinsResult.value.losers, 'coin');
    coinMoversStatus.textContent = `Монеты обновлены (${new Date().toLocaleTimeString('ru-RU')}).`;
  } else {
    coinMoversStatus.textContent = `Ошибка монет: ${coinsResult.reason?.message || coinsResult.reason}`;
  }

  if (stocksResult.status === 'fulfilled') {
    renderMoversList(stockMoversGrid, '📈 Топ-10 растущих акций', stocksResult.value.gainers, 'stock');
    renderMoversList(stockMoversGrid, '📉 Топ-10 падающих акций', stocksResult.value.losers, 'stock');
    stockMoversStatus.textContent = `Акции обновлены (${new Date().toLocaleTimeString('ru-RU')}).`;
  } else {
    stockMoversStatus.textContent = `Ошибка акций: ${stocksResult.reason?.message || stocksResult.reason}`;
  }

  moversStatus.textContent = 'Обновление завершено. Если акции не загрузились — проверьте FMP API key.';
}

function getSelectedRubrics() {
  const links = selectedRubrics.querySelectorAll('a[data-rubric-type]');
  return Array.from(links).map((link) => ({
    type: link.dataset.rubricType,
    title: link.textContent.trim(),
    description: rubricDescriptions[link.dataset.rubricType] || '',
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

function loadRubricDescriptions() {
  try {
    rubricDescriptions = JSON.parse(localStorage.getItem(RUBRIC_DESCRIPTIONS_KEY) || '{}') || {};
  } catch {
    rubricDescriptions = {};
  }
}

function saveRubricDescriptions() {
  localStorage.setItem(RUBRIC_DESCRIPTIONS_KEY, JSON.stringify(rubricDescriptions));
}

function renderRubricDescriptions() {
  if (!rubricsGrid) return;
  rubricsGrid.querySelectorAll('.rubric-card').forEach((card) => {
    const type = card.dataset.rubricType;
    const descriptionNode = card.querySelector('[data-rubric-description]');
    if (!descriptionNode || !type) return;
    const text = rubricDescriptions[type] || '';
    descriptionNode.textContent = text || 'Описание не задано';
    descriptionNode.classList.toggle('is-empty', !text);
  });
}

function openRubricEditor(card) {
  const type = card?.dataset.rubricType;
  if (!type) return;
  const title = card.dataset.rubricTitle || 'Рубрика';
  activeRubricType = type;
  rubricEditorTitle.textContent = `Описание: ${title}`;
  rubricEditorText.value = rubricDescriptions[type] || '';
  rubricEditorOverlay.classList.add('is-open');
  rubricEditorText.focus();
}

function closeRubricEditor() {
  activeRubricType = '';
  rubricEditorOverlay.classList.remove('is-open');
}

function saveActiveRubricDescription() {
  if (!activeRubricType) return;
  rubricDescriptions[activeRubricType] = rubricEditorText.value.trim();
  saveRubricDescriptions();
  renderRubricDescriptions();
  closeRubricEditor();
}

function openRubricView(card) {
  const type = card?.dataset.rubricType;
  if (!type) return;
  const title = card.dataset.rubricTitle || 'Рубрика';
  rubricViewTitle.textContent = title;
  rubricViewContent.textContent = rubricDescriptions[type] || 'Описание не задано';
  rubricViewOverlay.classList.add('is-open');
}

function closeRubricView() {
  rubricViewOverlay.classList.remove('is-open');
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
  const slot = boardSlotConfig[format] || boardSlotConfig['1080x1920'];

  const rows = speechNewsItems.querySelectorAll('.news-item-row');
  rows.forEach((row) => {
    row.querySelectorAll('.news-scene-preview').forEach((preview) => preview.classList.toggle('is-horizontal', isHorizontal));
    row.querySelectorAll('.news-scene-preview-layer').forEach((layer, index) => {
      if (index % 2 === 0) layer.src = sceneBackwallLayer.src;
      if (index % 2 === 1) layer.src = sceneTableLayer.src;
    });
    row.querySelectorAll('.news-scene-preview-board-base').forEach((node) => { node.src = boardImageBaseLayer.src; });
    row.querySelectorAll('.news-scene-preview-head-base').forEach((node) => { node.src = boardHeadBaseLayer.src; });
    if (Array.isArray(row._sceneFrames)) {
      row._sceneFrames.forEach((frame) => {
        frame.settings.imageX = Number(((slot.imageRect.x / slot.asset.width) * 100).toFixed(1));
        frame.settings.imageY = Number(((slot.imageRect.y / slot.asset.height) * 100).toFixed(1));
        frame.settings.imageWidth = Number(((slot.imageRect.width / slot.asset.width) * 100).toFixed(1));
        frame.settings.imageHeight = Number(((slot.imageRect.height / slot.asset.height) * 100).toFixed(1));
      });
    }
  });
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
  showBaseSubtitlePreview();
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

function getProviderConfig(providerId) {
  return monitoringProviders.find((provider) => provider.id === providerId) || monitoringProviders[0];
}

function renderMonitoringProviderTabs() {
  monitorProviderTabs.innerHTML = '';
  monitoringProviders.forEach((provider) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `provider-tab${provider.id === activeMonitoringProvider ? ' is-active' : ''}`;
    button.dataset.provider = provider.id;
    button.textContent = provider.title;
    monitorProviderTabs.appendChild(button);
  });
}

function renderMonitoringTargets() {
  const provider = getProviderConfig(activeMonitoringProvider);
  const targets = monitoringTargets[provider.id] || [];
  monitorTargetList.innerHTML = '';

  if (targets.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = provider.mode === 'prompt' ? 'Пока нет промптов для поиска.' : 'Пока нет аккаунтов для отслеживания.';
    monitorTargetList.appendChild(empty);
    return;
  }

  targets.forEach((target, index) => {
    const row = document.createElement('li');
    row.textContent = `${index + 1}. ${target}`;
    monitorTargetList.appendChild(row);
  });
}

function setActiveMonitoringProvider(providerId) {
  const provider = getProviderConfig(providerId);
  activeMonitoringProvider = provider.id;
  monitorTargetLabel.textContent = provider.mode === 'prompt' ? 'Промпт для поиска' : 'Аккаунт для отслеживания';
  monitorTargetInput.placeholder = provider.hint;
  renderMonitoringProviderTabs();
  renderMonitoringTargets();
}

manualNewsForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const item = {
    id: Date.now(),
    title: document.getElementById('news-title').value.trim(),
    link: document.getElementById('news-link').value.trim(),
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
    const linkSuffix = news.link ? ` (ссылка: ${news.link})` : '';
    li.textContent = `${index + 1}. [${news.tag}] ${news.title}${linkSuffix} — ${news.summary}`;
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
    anchor_speech_news: speechNews.map((item) => {
      const approvedFrame = Array.isArray(item.scene_frames) ? item.scene_frames[item.approved_scene_index] : null;
      const sceneSettings = item.scene_settings || { ...defaultNewsSceneSettings };
      const finalSceneSettings = mode === 'final' && approvedFrame?.settings ? approvedFrame.settings : sceneSettings;
      return {
        ...item,
        title: mode === 'preview' ? '' : item.title,
        scene_settings: finalSceneSettings,
        approved_scene: approvedFrame
          ? {
              index: item.approved_scene_index || 0,
              at_ms: approvedFrame.atMs || 0,
              type: approvedFrame.type || 'start',
              settings: approvedFrame.settings || { ...defaultNewsSceneSettings },
            }
          : null,
        scene_keyframes: (mode === 'final' && approvedFrame ? [approvedFrame] : (item.scene_frames || [])).map((frame) => ({
          at_ms: frame.atMs || 0,
          type: frame.type || 'start',
          duration_ms: frame.duration_ms || 0,
          settings: frame.settings || { ...defaultNewsSceneSettings },
        })),
      };
    }),
    segments: manualNewsQueue.map((news, idx) => ({
      order: idx + 1,
      type: 'news',
      board_title: news.title,
      source_url: news.link || '',
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

monitorProviderTabs.addEventListener('click', (event) => {
  const button = event.target.closest('[data-provider]');
  if (!button) {
    return;
  }

  setActiveMonitoringProvider(button.dataset.provider);
});

monitorTargetForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const value = monitorTargetInput.value.trim();
  if (!value) {
    return;
  }

  if (!monitoringTargets[activeMonitoringProvider]) {
    monitoringTargets[activeMonitoringProvider] = [];
  }

  monitoringTargets[activeMonitoringProvider].push(value);
  monitorTargetForm.reset();
  renderMonitoringTargets();
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
document.getElementById('episode-subtitles').addEventListener('change', showBaseSubtitlePreview);
document.getElementById('subtitle-font-family').addEventListener('input', showBaseSubtitlePreview);
subtitleBoldInput.addEventListener('change', showBaseSubtitlePreview);
document.getElementById('subtitle-font-size').addEventListener('input', showBaseSubtitlePreview);
document.getElementById('intro-text').addEventListener('input', showBaseSubtitlePreview);
document.getElementById('outro-text').addEventListener('input', showBaseSubtitlePreview);
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
moversSaveSettingsButton?.addEventListener('click', () => {
  saveMoversFilters();
  loadMarketMovers();
});
moversRefreshButton?.addEventListener('click', loadMarketMovers);
rubricEditorSave.addEventListener('click', saveActiveRubricDescription);
rubricEditorClose.addEventListener('click', closeRubricEditor);
rubricEditorOverlay.addEventListener('click', (event) => {
  if (event.target === rubricEditorOverlay) closeRubricEditor();
});
rubricViewClose.addEventListener('click', closeRubricView);
rubricViewOverlay.addEventListener('click', (event) => {
  if (event.target === rubricViewOverlay) closeRubricView();
});
rubricsGrid.addEventListener('click', (event) => {
  if (event.target.closest('[data-rubric-action]')) {
    return;
  }
  const editButton = event.target.closest('[data-rubric-edit]');
  if (editButton) {
    event.preventDefault();
    event.stopPropagation();
    openRubricEditor(editButton.closest('.rubric-card'));
    return;
  }
  const card = event.target.closest('.rubric-card');
  if (!card) return;
  openRubricView(card);
});

setNeutralMouth();
updateSpeechMode();
applySceneLayout(episodeFormatInput.value);
addSpeechNewsItem();
fillRubricSelect();
loadMoversFilters();
loadRubricDescriptions();
renderRubricDescriptions();
addRubricButton.disabled = true;
renderCommandsHelp();
applySubtitlePosition();
applySceneSettingsToMainStage(defaultNewsSceneSettings);
showBaseSubtitlePreview();
if (document.getElementById('rubrics').classList.contains('is-active') || !tubeLeaderboardLoaded) {
  loadTubeLeaderboard();
  loadMarketMovers();
}

setActiveMonitoringProvider(activeMonitoringProvider);
renderNewsQueue();
