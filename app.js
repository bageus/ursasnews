const manualNewsForm = document.getElementById('manual-news-form');
const newsList = document.getElementById('news-list');
const manualNewsSubmitButton = manualNewsForm?.querySelector('button[type="submit"]');
const manualNewsImageInput = document.getElementById('news-image');
const manualNewsImageFileStatus = document.getElementById('news-image-file-status');
const monitorProviderTabs = document.getElementById('monitor-provider-tabs');
const monitorTargetForm = document.getElementById('monitor-target-form');
const monitorTargetLabel = document.getElementById('monitor-target-label');
const monitorTargetInput = document.getElementById('monitor-target-input');
const monitorTargetList = document.getElementById('monitor-target-list');
const providerNegativeParseButton = document.getElementById('provider-negative-parse');
const providerNegativeStatus = document.getElementById('provider-negative-status');
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
const coinGainersGrid = document.getElementById('coin-gainers-grid');
const coinGainersStatus = document.getElementById('coin-gainers-status');
const coinGainersRefreshButton = document.getElementById('coin-gainers-refresh');
const coinLosersGrid = document.getElementById('coin-losers-grid');
const coinLosersStatus = document.getElementById('coin-losers-status');
const coinLosersRefreshButton = document.getElementById('coin-losers-refresh');
const stockMoversGrid = document.getElementById('stock-movers-grid');
const stockMoversStatus = document.getElementById('stock-movers-status');
const cryptoBubblesLink = document.getElementById('crypto-bubbles-link');
const cryptoBubblesFrameCap = document.getElementById('crypto-bubbles-frame-cap');
const cryptoBubblesFrameDay = document.getElementById('crypto-bubbles-frame-day');
const cryptoBubblesStatus = document.getElementById('crypto-bubbles-status');
const ursasIndexValue = document.getElementById('ursas-index');
const ursasIndexState = document.getElementById('ursas-index-state');
const ursasIndexFill = document.getElementById('ursas-index-fill');
const ursasIndexBreakdown = document.getElementById('ursas-index-breakdown');
const ursasIndexRefreshButton = document.getElementById('ursas-index-refresh');
const ursasIndexRefreshStatus = document.getElementById('ursas-index-refresh-status');
const rubricEditorOverlay = document.getElementById('rubric-editor-overlay');
const rubricEditorTitle = document.getElementById('rubric-editor-title');
const rubricEditorText = document.getElementById('rubric-editor-text');
const rubricEditorSave = document.getElementById('rubric-editor-save');
const rubricEditorClose = document.getElementById('rubric-editor-close');
const rubricViewOverlay = document.getElementById('rubric-view-overlay');
const rubricViewContent = document.getElementById('rubric-view-content');
const numberOfDayFlip = document.getElementById('number-of-day-flip');
const numberOfDaySpinButton = document.getElementById('spin-number-of-day');
const numberOfDayStatus = document.getElementById('number-of-day-status');

const manualNewsQueue = [];
let editingManualNewsId = null;
let mouthPreviewTimerIds = [];
let subtitleTimerIds = [];
let speechNewsIndex = 0;
let tubeLeaderboardLoaded = false;
let activeRubricType = '';
const subtitlePosition = { x: 0, y: 0 };
const RUBRIC_DESCRIPTIONS_KEY = 'ursasnews_rubric_descriptions_v1';
let rubricDescriptions = {};
let marketMoversController = null;
let numberOfDayController = null;
let providerParserInFlight = false;
let ursasIndexRefreshInFlight = false;

const providerNegativeParsers = {
  coindesk: {
    id: 'coindesk',
    title: 'CoinDesk',
    sourcePrefix: 'CoinDesk',
    rssUrl: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
  },
  bloomberg: {
    id: 'bloomberg',
    title: 'Bloomberg',
    sourcePrefix: 'Bloomberg',
    rssUrl: 'https://feeds.bloomberg.com/markets/news.rss',
  },
  reuters: {
    id: 'reuters',
    title: 'Reuters',
    sourcePrefix: 'Reuters',
    rssUrl: 'https://feeds.reuters.com/reuters/businessNews',
  },
};

const appConfig = window.UrsasAppConfig || {};
const monitoringProviders = appConfig.monitoringProviders || [
  { id: 'x', title: 'X', mode: 'account', hint: 'Добавьте @аккаунт или ссылку на профиль.' },
];
const BOARD_NEWS_IMAGE_RECT = appConfig.boardNewsImageRect || { x: 164, y: 276, width: 696, height: 937 };
const boardSlotConfig = appConfig.boardSlotConfig || {};
const defaultNewsSceneSettings = appConfig.defaultNewsSceneSettings || {
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
const commandHelpItems = appConfig.commandHelpItems || [];
const rubricCatalog = appConfig.rubricCatalog || [];
const mouthSprites = appConfig.mouthSprites || {};

const TUBE_BACKEND_URL = 'https://api.ursasstube.fun';
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const FMP_API_URL = 'https://financialmodelingprep.com/api/v3';
const monitoringTargets = {};
let activeMonitoringProvider = monitoringProviders[0].id;

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
  return wrapper;
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
  if (!card || !rubricViewContent) return;
  const viewCard = card.cloneNode(true);
  viewCard.classList.remove('card');
  viewCard.classList.add('rubric-card-preview');
  rubricViewContent.innerHTML = '';
  rubricViewContent.appendChild(viewCard);
  rubricViewOverlay.classList.add('is-open');
}

function closeRubricView() {
  rubricViewContent.innerHTML = '';
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

function calculateUrsasIndex(newsItems = []) {
  const totals = newsItems.reduce(
    (acc, item) => {
      const strength = Math.min(10, Math.max(1, Number(item.strength) || 1));
      const sentiment = item.sentiment || 'neutral';
      if (sentiment === 'bearish') acc.bear += strength;
      if (sentiment === 'bullish') acc.bull += strength;
      if (sentiment === 'neutral') acc.neutral += strength;
      return acc;
    },
    { bear: 0, bull: 0, neutral: 0 },
  );

  const directionalTotal = totals.bear + totals.bull;
  if (directionalTotal === 0) {
    return { score: 50, state: 'Нейтрально', ...totals };
  }

  const directionalBias = (totals.bear - totals.bull) / directionalTotal;
  const score = Math.round(Math.min(100, Math.max(0, 50 + directionalBias * 50)));

  let state = 'Нейтрально';
  if (score >= 70) state = 'Сильный медвежий режим';
  else if (score >= 55) state = 'Умеренно медвежий режим';
  else if (score <= 30) state = 'Сильный бычий режим (медвежий индекс низкий)';
  else if (score <= 45) state = 'Умеренно бычий режим (медвежий индекс низкий)';

  return { score, state, ...totals };
}

function renderUrsasIndex() {
  if (!ursasIndexValue || !ursasIndexState || !ursasIndexFill || !ursasIndexBreakdown) return;
  const indexData = calculateUrsasIndex(manualNewsQueue);
  ursasIndexValue.textContent = String(indexData.score);
  ursasIndexState.textContent = indexData.state;
  ursasIndexFill.style.width = `${indexData.score}%`;
  ursasIndexBreakdown.textContent = `Bear: ${indexData.bear} vs Bull: ${indexData.bull} (Neutral: ${indexData.neutral})`;
}

async function refreshUrsasIndexFromCoinDesk() {
  if (!ursasIndexRefreshButton || !ursasIndexRefreshStatus || ursasIndexRefreshInFlight) return;
  ursasIndexRefreshInFlight = true;
  ursasIndexRefreshButton.disabled = true;
  ursasIndexRefreshStatus.textContent = 'Обновляю индекс: загружаю CoinDesk RSS...';

  try {
    const { xmlText, proxyLabel } = await fetchRssXmlThroughProxy(providerNegativeParsers.coindesk.rssUrl);
    const xmlDoc = new DOMParser().parseFromString(xmlText, 'application/xml');
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) throw new Error('XML parse error');

    const nowTs = Date.now();
    const cutoffTs = nowTs - 24 * 60 * 60 * 1000;
    const items = Array.from(xmlDoc.querySelectorAll('item'));
    const stats = {
      bearish: { count: 0, strength: 0 },
      bullish: { count: 0, strength: 0 },
      neutral: { count: 0, strength: 0 },
    };

    items.forEach((itemNode) => {
      const title = (itemNode.querySelector('title')?.textContent || '').trim();
      const descriptionHtml = itemNode.querySelector('description')?.textContent || '';
      const description = extractTextFromHtml(descriptionHtml);
      const pubDateRaw = itemNode.querySelector('pubDate')?.textContent || '';
      const pubTs = Date.parse(pubDateRaw);
      if (!title || !Number.isFinite(pubTs) || pubTs < cutoffTs) return;

      const sentimentData = detectCoinDeskSentiment(`${title} ${description}`);
      stats[sentimentData.sentiment].count += 1;
      stats[sentimentData.sentiment].strength += sentimentData.strength;
    });

    const totalCount = stats.bearish.count + stats.bullish.count + stats.neutral.count;
    if (totalCount === 0) {
      ursasIndexRefreshStatus.textContent = 'CoinDesk: за последние 24ч новостей не найдено.';
      return;
    }

    const indexData = calculateUrsasIndex([
      { sentiment: 'bearish', strength: stats.bearish.strength || 1 },
      { sentiment: 'bullish', strength: stats.bullish.strength || 1 },
      { sentiment: 'neutral', strength: stats.neutral.strength || 1 },
    ]);
    ursasIndexValue.textContent = String(indexData.score);
    ursasIndexState.textContent = indexData.state;
    ursasIndexFill.style.width = `${indexData.score}%`;
    ursasIndexBreakdown.textContent = `CoinDesk 24ч → Bear: ${stats.bearish.strength} (${stats.bearish.count}) vs Bull: ${stats.bullish.strength} (${stats.bullish.count}) (Neutral: ${stats.neutral.strength}, ${stats.neutral.count})`;
    ursasIndexRefreshStatus.textContent = `Индекс обновлён по CoinDesk за 24ч через ${proxyLabel}.`;
  } catch (error) {
    const details = error?.message ? ` (${error.message})` : '';
    ursasIndexRefreshStatus.textContent = `Не удалось обновить индекс CoinDesk${details}.`;
  } finally {
    ursasIndexRefreshInFlight = false;
    ursasIndexRefreshButton.disabled = false;
  }
}

function setActiveMonitoringProvider(providerId) {
  const provider = getProviderConfig(providerId);
  activeMonitoringProvider = provider.id;
  monitorTargetLabel.textContent = provider.mode === 'prompt' ? 'Промпт для поиска' : 'Аккаунт для отслеживания';
  monitorTargetInput.placeholder = provider.hint;
  updateProviderParserUi();
  renderMonitoringProviderTabs();
  renderMonitoringTargets();
}

function setProviderParserStatus(text, isError = false) {
  if (!providerNegativeStatus) return;
  providerNegativeStatus.textContent = text;
  providerNegativeStatus.style.color = isError ? '#fda4af' : '';
}

function getActiveProviderParserConfig() {
  return providerNegativeParsers[activeMonitoringProvider] || null;
}

function updateProviderParserUi() {
  const parserConfig = getActiveProviderParserConfig();
  if (!providerNegativeParseButton) {
    return;
  }

  if (!parserConfig) {
    providerNegativeParseButton.hidden = true;
    setProviderParserStatus('Выберите Reuters, Bloomberg или CoinDesk для парсинга.');
    return;
  }

  providerNegativeParseButton.hidden = false;
  providerNegativeParseButton.textContent = `Парсить негатив ${parserConfig.title} (24ч)`;
  providerNegativeParseButton.disabled = providerParserInFlight;
  setProviderParserStatus(`Готово к запуску парсинга ${parserConfig.title}.`);
}

function extractTextFromHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html || '', 'text/html');
  return (doc.body?.textContent || '').trim();
}

function isNegativeCoinDeskItem(text = '') {
  const normalized = text.toLowerCase();
  const negativeKeywords = [
    'hack', 'hacked', 'exploit', 'breach', 'lawsuit', 'sued', 'charge', 'charged', 'fraud', 'scam',
    'liquidation', 'bankrupt', 'bankruptcy', 'insolv', 'collapse', 'crash', 'plunge', 'drop', 'down',
    'decline', 'selloff', 'bearish', 'outflow', 'sanction', 'ban', 'banned', 'fine', 'fined', 'penalty',
    'investigation', 'probe', 'warning', 'default', 'delist', 'delisting', 'loss', 'losses', 'stolen',
  ];
  const hits = negativeKeywords.reduce((acc, word) => (normalized.includes(word) ? acc + 1 : acc), 0);
  return { isNegative: hits > 0, hits };
}

function buildStrengthFromHits(hits = 1) {
  if (hits >= 5) return 9;
  if (hits >= 4) return 7;
  if (hits >= 3) return 5;
  if (hits >= 2) return 3;
  return 2;
}

function detectCoinDeskSentiment(text = '') {
  const normalized = text.toLowerCase();
  const bearishMatches = [
    'hack', 'hacked', 'exploit', 'breach', 'lawsuit', 'sued', 'fraud', 'scam',
    'liquidation', 'bankrupt', 'bankruptcy', 'insolv', 'collapse', 'crash', 'plunge', 'drop',
    'decline', 'selloff', 'bearish', 'outflow', 'sanction', 'ban', 'fined', 'investigation', 'loss',
  ].reduce((acc, token) => (normalized.includes(token) ? acc + 1 : acc), 0);
  const bullishMatches = [
    'approval', 'approved', 'etf inflow', 'record high', 'all-time high', 'surge', 'rally', 'breakout',
    'partnership', 'adoption', 'upgrade', 'profit', 'buyback', 'funding', 'bullish', 'inflow',
  ].reduce((acc, token) => (normalized.includes(token) ? acc + 1 : acc), 0);

  if (bearishMatches > bullishMatches && bearishMatches > 0) {
    return { sentiment: 'bearish', strength: Math.min(10, 1 + bearishMatches * 2) };
  }
  if (bullishMatches > bearishMatches && bullishMatches > 0) {
    return { sentiment: 'bullish', strength: Math.min(10, 1 + bullishMatches * 2) };
  }
  return { sentiment: 'neutral', strength: 1 };
}

async function fetchRssXmlThroughProxy(rssUrl) {
  const proxyCandidates = [
    { label: 'allorigins', buildUrl: (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` },
    { label: 'corsproxy', buildUrl: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}` },
  ];

  let lastProxyError = null;
  for (const candidate of proxyCandidates) {
    try {
      const response = await fetch(candidate.buildUrl(rssUrl), {
        method: 'GET',
        headers: { Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8' },
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const xmlText = await response.text();
      if (!xmlText || !xmlText.includes('<rss')) {
        throw new Error('Invalid RSS payload');
      }
      return { xmlText, proxyLabel: candidate.label };
    } catch (proxyError) {
      lastProxyError = `${candidate.label}: ${proxyError.message}`;
    }
  }

  throw new Error(lastProxyError || 'No proxy available');
}

async function parseProviderNegativeNewsLast24h() {
  const parserConfig = getActiveProviderParserConfig();
  if (!parserConfig) {
    setProviderParserStatus('Для парсинга выберите Reuters, Bloomberg или CoinDesk.', true);
    return;
  }
  if (providerParserInFlight) return;

  providerParserInFlight = true;
  if (providerNegativeParseButton) {
    providerNegativeParseButton.disabled = true;
  }
  setProviderParserStatus(`Загрузка новостей ${parserConfig.title}...`);

  try {
    const { xmlText, proxyLabel } = await fetchRssXmlThroughProxy(parserConfig.rssUrl);
    setProviderParserStatus(`RSS ${parserConfig.title} загружен через ${proxyLabel}. Анализ...`);

    const xmlDoc = new DOMParser().parseFromString(xmlText, 'application/xml');
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('XML parse error');
    }

    const nowTs = Date.now();
    const cutoffTs = nowTs - 24 * 60 * 60 * 1000;
    const items = Array.from(xmlDoc.querySelectorAll('item'));
    const existingLinks = new Set(manualNewsQueue.map((item) => item.link).filter(Boolean));
    const existingTitles = new Set(manualNewsQueue.map((item) => item.title.toLowerCase()));
    let added = 0;

    items.forEach((itemNode) => {
      const title = (itemNode.querySelector('title')?.textContent || '').trim();
      const link = (itemNode.querySelector('link')?.textContent || '').trim();
      const descriptionHtml = itemNode.querySelector('description')?.textContent || '';
      const description = extractTextFromHtml(descriptionHtml);
      const pubDateRaw = itemNode.querySelector('pubDate')?.textContent || '';
      const pubTs = Date.parse(pubDateRaw);

      if (!title || !Number.isFinite(pubTs) || pubTs < cutoffTs) return;

      const sentimentCheck = isNegativeCoinDeskItem(`${title} ${description}`);
      if (!sentimentCheck.isNegative) return;
      if (link && existingLinks.has(link)) return;
      if (existingTitles.has(title.toLowerCase())) return;

      const summary = description || title;
      const prefixedTitle = `[${parserConfig.sourcePrefix}] ${title}`;
      manualNewsQueue.unshift({
        id: Date.now() + added,
        title: prefixedTitle,
        link,
        summary,
        source: parserConfig.id,
        tag: 'рынок',
        sentiment: 'bearish',
        strength: buildStrengthFromHits(sentimentCheck.hits),
        approved_for_video: false,
      });
      added += 1;
      if (link) existingLinks.add(link);
      existingTitles.add(title.toLowerCase());
    });

    renderNewsQueue();
    renderUrsasIndex();
    setProviderParserStatus(
      added > 0
        ? `Готово: добавлено ${added} негативных новостей ${parserConfig.title} за 24ч.`
        : `За 24ч не найдено новых негативных новостей ${parserConfig.title}.`,
    );
  } catch (error) {
    const errorDetails = error?.message ? ` (${error.message})` : '';
    setProviderParserStatus(`Не удалось загрузить RSS ${parserConfig.title}. Проверьте сеть / CORS-прокси${errorDetails}.`, true);
  } finally {
    providerParserInFlight = false;
    updateProviderParserUi();
  }
}

function setManualNewsImageStatus(text = 'Файл не выбран') {
  if (manualNewsImageFileStatus) {
    manualNewsImageFileStatus.textContent = text;
  }
}

function resetManualNewsFormToCreateMode() {
  editingManualNewsId = null;
  manualNewsForm.reset();
  document.getElementById('news-source').value = 'manual';
  document.getElementById('news-sentiment').value = 'bearish';
  document.getElementById('news-strength').value = '1';
  if (manualNewsSubmitButton) {
    manualNewsSubmitButton.textContent = 'Добавить новость';
  }
  setManualNewsImageStatus();
}

function openManualNewsInEditMode(newsId) {
  const item = manualNewsQueue.find((news) => news.id === newsId);
  if (!item) {
    return;
  }

  editingManualNewsId = newsId;
  document.getElementById('news-title').value = item.title || '';
  document.getElementById('news-link').value = item.link || '';
  document.getElementById('news-summary').value = item.summary || '';
  document.getElementById('news-source').value = item.source || 'manual';
  document.getElementById('news-tag').value = item.tag || 'рынок';
  document.getElementById('news-sentiment').value = item.sentiment || 'neutral';
  document.getElementById('news-strength').value = String(item.strength || 1);
  if (manualNewsImageInput) {
    manualNewsImageInput.value = '';
  }
  setManualNewsImageStatus(item.image_name ? `Текущий файл: ${item.image_name}` : 'Текущий файл: не выбран');
  if (manualNewsSubmitButton) {
    manualNewsSubmitButton.textContent = 'Сохранить изменения';
  }
  manualNewsForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function approveManualNewsForVideo(newsId) {
  const item = manualNewsQueue.find((news) => news.id === newsId);
  if (!item) {
    return;
  }

  const targetRow = addSpeechNewsItem(item.summary || '');
  if (!targetRow) {
    return;
  }

  const titleInput = targetRow.querySelector('.speech-news-title');
  const textInput = targetRow.querySelector('.speech-news-text');
  const linkInput = targetRow.querySelector('.speech-news-link');
  const imagePreview = targetRow.querySelector('.news-image-preview');

  if (titleInput) titleInput.value = item.title || '';
  if (textInput) {
    textInput.value = item.summary || '';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  if (linkInput) linkInput.value = item.link || '';
  if (item.image_data) {
    targetRow.dataset.imageData = item.image_data;
    if (imagePreview) {
      imagePreview.src = item.image_data;
      imagePreview.classList.add('is-visible');
    }
  }

  item.approved_for_video = true;
  renderNewsQueue();
}

manualNewsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nextItem = {
    id: editingManualNewsId || Date.now(),
    title: document.getElementById('news-title').value.trim(),
    link: document.getElementById('news-link').value.trim(),
    summary: document.getElementById('news-summary').value.trim(),
    source: document.getElementById('news-source').value.trim() || 'manual',
    tag: document.getElementById('news-tag').value,
    sentiment: document.getElementById('news-sentiment').value,
    strength: Math.min(10, Math.max(1, Number(document.getElementById('news-strength').value) || 1)),
    approved_for_video: false,
  };

  if (!nextItem.title || !nextItem.summary) {
    return;
  }

  const [selectedImage] = manualNewsImageInput?.files || [];
  if (selectedImage) {
    try {
      nextItem.image_data = await fitImageToBoardSlot(selectedImage, defaultNewsSceneSettings);
      nextItem.image_name = selectedImage.name;
    } catch {
      nextItem.image_data = '';
      nextItem.image_name = '';
      if (manualNewsImageInput) {
        manualNewsImageInput.setCustomValidity('Не удалось обработать изображение. Попробуйте другой файл.');
        manualNewsImageInput.reportValidity();
      }
      return;
    }
  }

  if (editingManualNewsId) {
    const index = manualNewsQueue.findIndex((item) => item.id === editingManualNewsId);
    if (index >= 0) {
      const previousItem = manualNewsQueue[index];
      manualNewsQueue[index] = {
        ...previousItem,
        ...nextItem,
        image_data: selectedImage ? nextItem.image_data : (previousItem.image_data || ''),
        image_name: selectedImage ? nextItem.image_name : (previousItem.image_name || ''),
      };
    }
  } else {
    manualNewsQueue.push(nextItem);
  }

  renderNewsQueue();
  renderUrsasIndex();
  resetManualNewsFormToCreateMode();
});

manualNewsImageInput?.addEventListener('change', () => {
  manualNewsImageInput.setCustomValidity('');
  const [selectedImage] = manualNewsImageInput.files || [];
  setManualNewsImageStatus(selectedImage ? `Выбран файл: ${selectedImage.name}` : 'Файл не выбран');
});

function renderNewsQueue() {
  newsList.innerHTML = '';

  if (manualNewsQueue.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'Пока нет новостей в очереди.';
    newsList.appendChild(empty);
    renderUrsasIndex();
    return;
  }

  manualNewsQueue.forEach((news, index) => {
    const li = document.createElement('li');
    li.className = 'news-queue-item';

    const text = document.createElement('div');
    text.className = 'news-queue-text';
    const imageSuffix = news.image_name ? ` [файл: ${news.image_name}]` : '';
    const sentimentLabel =
      news.sentiment === 'bearish' ? '🐻 bearish' : news.sentiment === 'bullish' ? '🐂 bullish' : '😐 neutral';
    const strengthSuffix = ` [сила: ${news.strength || 1}, ${sentimentLabel}]`;
    const approvedSuffix = news.approved_for_video ? ' ✅ Одобрено и добавлено в «Генерация ролика».' : '';
    text.textContent = `${index + 1}. [${news.tag}] ${news.title}${imageSuffix}${strengthSuffix} — ${news.summary}${approvedSuffix}`;

    const actions = document.createElement('div');
    actions.className = 'news-queue-actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Редактировать';
    editButton.dataset.newsAction = 'edit';
    editButton.dataset.newsId = String(news.id);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Удалить';
    deleteButton.dataset.newsAction = 'delete';
    deleteButton.dataset.newsId = String(news.id);

    const approveButton = document.createElement('button');
    approveButton.type = 'button';
    approveButton.textContent = news.approved_for_video ? 'Уже одобрено' : 'Одобрить для публикации';
    approveButton.disabled = !!news.approved_for_video;
    approveButton.dataset.newsAction = 'approve';
    approveButton.dataset.newsId = String(news.id);

    actions.append(editButton, deleteButton, approveButton);

    if (news.link && isValidHttpUrl(news.link)) {
      const sourceLink = document.createElement('a');
      sourceLink.href = news.link;
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.className = 'button-link';
      sourceLink.textContent = 'Первоисточник';
      actions.appendChild(sourceLink);
    }
    li.append(text, actions);
    newsList.appendChild(li);
  });
  renderUrsasIndex();
}

newsList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-news-action]');
  if (!button) {
    return;
  }

  const action = button.dataset.newsAction;
  const newsId = Number(button.dataset.newsId);
  if (!Number.isFinite(newsId)) {
    return;
  }

  if (action === 'edit') {
    openManualNewsInEditMode(newsId);
    return;
  }

  if (action === 'delete') {
    const index = manualNewsQueue.findIndex((item) => item.id === newsId);
    if (index >= 0) {
      manualNewsQueue.splice(index, 1);
      if (editingManualNewsId === newsId) {
        resetManualNewsFormToCreateMode();
      }
      renderNewsQueue();
      renderUrsasIndex();
    }
    return;
  }

  if (action === 'approve') {
    approveManualNewsForVideo(newsId);
  }
});

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
      sentiment: news.sentiment || 'neutral',
      sentiment_strength: Number(news.strength) || 1,
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

providerNegativeParseButton?.addEventListener('click', parseProviderNegativeNewsLast24h);

mouthPreviewButton.addEventListener('click', startMouthPreview);
mouthStopButton.addEventListener('click', stopMouthPreview);
speechModeInput.addEventListener('change', updateSpeechMode);
marketMoversController = window.UrsasMarketMovers?.createController({
  refs: {
    moversVsCurrencyInput,
    moversStockApiKeyInput,
    moversMinCoinCapInput,
    moversMaxCoinCapInput,
    moversMinCoinLiquidityInput,
    moversMinStockCapInput,
    moversMaxStockCapInput,
    moversMinStockVolumeInput,
    moversStatus,
    coinGainersGrid,
    coinGainersStatus,
    coinLosersGrid,
    coinLosersStatus,
    stockMoversGrid,
    stockMoversStatus,
    cryptoBubblesLink,
    cryptoBubblesFrameCap,
    cryptoBubblesFrameDay,
    cryptoBubblesStatus,
  },
  api: {
    coingeckoBaseUrl: COINGECKO_API_URL,
    fmpBaseUrl: FMP_API_URL,
  },
  options: {
    enableCryptoBubblesEmbed: false,
  },
});
marketMoversController?.bindFrameStatusEvents();

numberOfDayController = window.UrsasNumberOfDay?.createController({
  flipRoot: numberOfDayFlip,
  spinButton: numberOfDaySpinButton,
  statusNode: numberOfDayStatus,
});

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
moversSaveSettingsButton?.addEventListener('click', () => marketMoversController?.saveAndReload());
moversRefreshButton?.addEventListener('click', () => marketMoversController?.load());
coinGainersRefreshButton?.addEventListener('click', () => marketMoversController?.loadCoinGainers());
coinLosersRefreshButton?.addEventListener('click', () => marketMoversController?.loadCoinLosers());
ursasIndexRefreshButton?.addEventListener('click', refreshUrsasIndexFromCoinDesk);
numberOfDaySpinButton?.addEventListener('click', () => numberOfDayController?.runFlip());
rubricEditorSave.addEventListener('click', saveActiveRubricDescription);
rubricEditorClose.addEventListener('click', closeRubricEditor);
rubricEditorOverlay.addEventListener('click', (event) => {
  if (event.target === rubricEditorOverlay) closeRubricEditor();
});
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
  const openButton = event.target.closest('[data-rubric-open]');
  if (openButton) {
    event.preventDefault();
    event.stopPropagation();
    openRubricView(openButton.closest('.rubric-card'));
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && rubricViewOverlay.classList.contains('is-open')) {
    closeRubricView();
  }
});

setNeutralMouth();
updateSpeechMode();
applySceneLayout(episodeFormatInput.value);
addSpeechNewsItem();
fillRubricSelect();
window.UrsasTabs?.createTabNavigator({
  onRubricsTabActivated: () => {
    loadTubeLeaderboard();
    marketMoversController?.load();
  },
});
marketMoversController?.loadFilters();
loadRubricDescriptions();
renderRubricDescriptions();
addRubricButton.disabled = true;
renderCommandsHelp();
applySubtitlePosition();
applySceneSettingsToMainStage(defaultNewsSceneSettings);
showBaseSubtitlePreview();
numberOfDayController?.init();
if (document.getElementById('rubrics').classList.contains('is-active') || !tubeLeaderboardLoaded) {
  loadTubeLeaderboard();
  marketMoversController?.load();
}

setActiveMonitoringProvider(activeMonitoringProvider);
resetManualNewsFormToCreateMode();
renderNewsQueue();
