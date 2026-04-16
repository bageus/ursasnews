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
const mouthPathInput = document.getElementById('mouth-path');
const mouthStartInput = document.getElementById('mouth-start');
const mouthEndInput = document.getElementById('mouth-end');
const mouthPadInput = document.getElementById('mouth-pad');
const mouthFpsInput = document.getElementById('mouth-fps');
const mouthPreviewButton = document.getElementById('mouth-preview');
const mouthStopButton = document.getElementById('mouth-stop');

const manualNewsQueue = [];
let mouthPreviewTimer = null;

function getMouthSequenceConfig() {
  const pathTemplate = mouthPathInput.value.trim();
  const startFrame = Number(mouthStartInput.value || 0);
  const endFrame = Number(mouthEndInput.value || 0);
  const framePadding = Number(mouthPadInput.value || 4);
  const fps = Number(mouthFpsInput.value || 12);

  return {
    path_template: pathTemplate,
    start_frame: startFrame,
    end_frame: endFrame,
    frame_padding: framePadding,
    fps,
  };
}

function buildMouthFrameUrls(config) {
  const from = Math.min(config.start_frame, config.end_frame);
  const to = Math.max(config.start_frame, config.end_frame);
  const frames = [];

  for (let frame = from; frame <= to; frame += 1) {
    const padded = String(frame).padStart(config.frame_padding, '0');
    frames.push(config.path_template.replace('{frame}', padded));
  }

  return frames;
}

function stopMouthPreview() {
  if (mouthPreviewTimer) {
    clearInterval(mouthPreviewTimer);
    mouthPreviewTimer = null;
  }
}

function startMouthPreview() {
  stopMouthPreview();

  const config = getMouthSequenceConfig();
  const frameUrls = buildMouthFrameUrls(config);

  if (frameUrls.length === 0 || !config.path_template.includes('{frame}')) {
    mouthLayer.removeAttribute('src');
    return;
  }

  let currentFrame = 0;
  mouthLayer.src = frameUrls[currentFrame];

  const intervalMs = Math.max(50, Math.round(1000 / Math.max(1, config.fps)));
  mouthPreviewTimer = setInterval(() => {
    currentFrame = (currentFrame + 1) % frameUrls.length;
    mouthLayer.src = frameUrls[currentFrame];
  }, intervalMs);
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
  const outro = document.getElementById('outro-text').value.trim();
  const mouthSequence = getMouthSequenceConfig();

  const script = {
    episode_title: episodeTitle || 'Ursas Daily',
    render_mode: mode,
    scene_template: 'studio_bear_anchor_v1',
    scene_animation: {
      mouth_sequence: mouthSequence,
    },
    render: { format, fps, subtitles },
    intro,
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

renderNewsQueue();
