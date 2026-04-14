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

const manualNewsQueue = [];

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

  const script = {
    episode_title: episodeTitle || 'Ursas Daily',
    render_mode: mode,
    scene_template: 'studio_bear_anchor_v1',
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

renderNewsQueue();
