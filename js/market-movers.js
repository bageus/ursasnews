(function attachMarketMovers(globalScope) {
  const MARKET_MOVERS_FILTERS_KEY = 'ursasnews_market_movers_filters_v1';
  const STABLECOIN_SYMBOLS = new Set(['USDT', 'USDC', 'DAI', 'TUSD', 'FDUSD', 'USDE', 'PYUSD', 'USDS', 'BUSD', 'USDP', 'LUSD', 'GUSD']);

  function toNumberOrNull(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function formatCompactUsd(value) {
    if (!Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatPercent(value) {
    if (!Number.isFinite(value)) return '—';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  function parseFmpChangePercent(rawValue) {
    if (typeof rawValue === 'number') return rawValue;
    if (typeof rawValue !== 'string') return NaN;
    return Number(rawValue.replace(/[()%+\s]/g, ''));
  }

  function parseCoinChangePercent(coin) {
    const direct24h = Number(coin?.price_change_percentage_24h);
    if (Number.isFinite(direct24h)) return direct24h;

    const inCurrency24h = Number(coin?.price_change_percentage_24h_in_currency);
    if (Number.isFinite(inCurrency24h)) return inCurrency24h;

    const nested = Number(coin?.price_change_percentage?.['24h']);
    if (Number.isFinite(nested)) return nested;

    return NaN;
  }

  function buildCryptoBubblesUrl({ currency = 'USD', size = 'marketcap', period = 'day' } = {}) {
    const normalizedCurrency = String(currency || 'USD').toUpperCase();
    const url = new URL('https://cryptobubbles.net/');
    url.searchParams.set('theme', 'dark');
    url.searchParams.set('currency', normalizedCurrency);
    url.searchParams.set('size', size);
    url.searchParams.set('period', period);
    return url.toString();
  }

  function createController({
    refs,
    api,
    storage = globalScope.localStorage,
    options = {},
  }) {
    const {
      enableCryptoBubblesEmbed = false,
    } = options;
    let cachedFilters = {
      vsCurrency: 'usd',
      stockApiKey: 'demo',
      minCoinCap: null,
      maxCoinCap: null,
      minCoinLiquidity: 0,
      excludeStableCoins: false,
      minStockCap: null,
      maxStockCap: null,
      minStockVolume: 0,
    };
    const {
      moversVsCurrencyInput,
      moversStockApiKeyInput,
      moversMinCoinCapInput,
      moversMaxCoinCapInput,
      moversMinCoinLiquidityInput,
      moversExcludeStableInput,
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
    } = refs;

    function getFilters() {
      return {
        vsCurrency: (moversVsCurrencyInput?.value || cachedFilters.vsCurrency || 'usd').trim().toLowerCase() || 'usd',
        stockApiKey: (moversStockApiKeyInput?.value || cachedFilters.stockApiKey || 'demo').trim() || 'demo',
        minCoinCap: toNumberOrNull(moversMinCoinCapInput?.value) ?? cachedFilters.minCoinCap,
        maxCoinCap: toNumberOrNull(moversMaxCoinCapInput?.value) ?? cachedFilters.maxCoinCap,
        minCoinLiquidity: Math.max(0, toNumberOrNull(moversMinCoinLiquidityInput?.value) ?? cachedFilters.minCoinLiquidity ?? 0),
        excludeStableCoins: Boolean(moversExcludeStableInput?.checked ?? cachedFilters.excludeStableCoins),
        minStockCap: toNumberOrNull(moversMinStockCapInput?.value) ?? cachedFilters.minStockCap,
        maxStockCap: toNumberOrNull(moversMaxStockCapInput?.value) ?? cachedFilters.maxStockCap,
        minStockVolume: Math.max(0, toNumberOrNull(moversMinStockVolumeInput?.value) ?? cachedFilters.minStockVolume ?? 0),
      };
    }

    function applyFilters(filters = {}) {
      cachedFilters = {
        ...cachedFilters,
        ...filters,
      };
      if (moversVsCurrencyInput) moversVsCurrencyInput.value = cachedFilters.vsCurrency || 'usd';
      if (moversStockApiKeyInput) moversStockApiKeyInput.value = cachedFilters.stockApiKey || '';
      if (moversMinCoinCapInput) moversMinCoinCapInput.value = Number.isFinite(cachedFilters.minCoinCap) ? cachedFilters.minCoinCap : '';
      if (moversMaxCoinCapInput) moversMaxCoinCapInput.value = Number.isFinite(cachedFilters.maxCoinCap) ? cachedFilters.maxCoinCap : '';
      if (moversMinCoinLiquidityInput) moversMinCoinLiquidityInput.value = Number.isFinite(cachedFilters.minCoinLiquidity) ? cachedFilters.minCoinLiquidity : '';
      if (moversExcludeStableInput) moversExcludeStableInput.checked = Boolean(cachedFilters.excludeStableCoins);
      if (moversMinStockCapInput) moversMinStockCapInput.value = Number.isFinite(cachedFilters.minStockCap) ? cachedFilters.minStockCap : '';
      if (moversMaxStockCapInput) moversMaxStockCapInput.value = Number.isFinite(cachedFilters.maxStockCap) ? cachedFilters.maxStockCap : '';
      if (moversMinStockVolumeInput) moversMinStockVolumeInput.value = Number.isFinite(cachedFilters.minStockVolume) ? cachedFilters.minStockVolume : '';
    }

    function updateCryptoBubblesEmbeds(filters = {}) {
      const bubblesCurrency = (filters.vsCurrency || 'usd').toUpperCase();
      const marketCapUrl = buildCryptoBubblesUrl({ currency: bubblesCurrency, size: 'marketcap', period: 'day' });
      const performanceUrl = buildCryptoBubblesUrl({ currency: bubblesCurrency, size: 'performance', period: 'day' });

      if (cryptoBubblesLink) {
        cryptoBubblesLink.href = performanceUrl;
      }
      if (enableCryptoBubblesEmbed) {
        if (cryptoBubblesFrameCap) {
          cryptoBubblesFrameCap.src = marketCapUrl;
        }
        if (cryptoBubblesFrameDay) {
          cryptoBubblesFrameDay.src = performanceUrl;
        }
      } else {
        if (cryptoBubblesFrameCap) cryptoBubblesFrameCap.src = 'about:blank';
        if (cryptoBubblesFrameDay) cryptoBubblesFrameDay.src = 'about:blank';
      }
      if (cryptoBubblesStatus) {
        cryptoBubblesStatus.textContent = enableCryptoBubblesEmbed
          ? 'Встроенный iframe загружен. Если виден отказ соединения/пустой экран, это ограничение самого сайта по встраиванию — используйте кнопку «Открыть Crypto Bubbles».'
          : 'Crypto Bubbles обычно блокирует iframe (X-Frame-Options). Встроенный режим отключён: используйте кнопку «Открыть Crypto Bubbles».';
      }
    }

    function saveFilters() {
      const filters = getFilters();
      storage.setItem(MARKET_MOVERS_FILTERS_KEY, JSON.stringify(filters));
      if (moversStatus) moversStatus.textContent = 'Фильтры сохранены в localStorage.';
      updateCryptoBubblesEmbeds(filters);
      return filters;
    }

    function loadFilters() {
      try {
        const raw = JSON.parse(storage.getItem(MARKET_MOVERS_FILTERS_KEY) || '{}') || {};
        applyFilters(raw);
      } catch {
        applyFilters();
      }
      saveFilters();
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

    async function fetchCoinMovers(filters) {
      const url = new URL(`${api.coingeckoBaseUrl}/coins/markets`);
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
        const minCoinLiquidity = Number(filters.minCoinLiquidity || 0);
        if (Number.isFinite(filters.minCoinCap) && cap < filters.minCoinCap) return false;
        if (Number.isFinite(filters.maxCoinCap) && cap > filters.maxCoinCap) return false;
        if (Number.isFinite(minCoinLiquidity) && minCoinLiquidity > 0) {
          if (minCoinLiquidity > 1 && volume < minCoinLiquidity) return false;
          if (minCoinLiquidity <= 1 && liquidity < minCoinLiquidity) return false;
        }
        if (filters.excludeStableCoins) {
          const symbol = String(coin.symbol || '').toUpperCase();
          const name = String(coin.name || '').toLowerCase();
          const looksStableByName = /\bstable\b|\busd\b|\bdollar\b/.test(name);
          if (STABLECOIN_SYMBOLS.has(symbol) || looksStableByName) return false;
        }
        return Number.isFinite(parseCoinChangePercent(coin));
      });

      const mapped = filtered.map((coin) => ({
        symbol: String(coin.symbol || '').toUpperCase(),
        name: coin.name || '',
        change: parseCoinChangePercent(coin),
        marketCap: Number(coin.market_cap || 0),
      }));

      return {
        gainers: [...mapped].sort((a, b) => b.change - a.change).slice(0, 10),
        losers: [...mapped].sort((a, b) => a.change - b.change).slice(0, 10),
      };
    }

    async function fetchStockMovers(filters) {
      const apiKey = filters.stockApiKey || 'demo';
      const normalizedKey = String(apiKey || '').trim().toLowerCase();
      if (
        !normalizedKey
        || normalizedKey === 'demo'
        || normalizedKey === 'your_api_key'
        || normalizedKey === 'paste_here'
      ) {
        return {
          gainers: [],
          losers: [],
          skipped: true,
          reason: 'Для загрузки акций укажите рабочий FMP API key (demo ключ больше не поддерживается).',
        };
      }
      const [gainersResp, losersResp] = await Promise.all([
        fetch(`${api.fmpBaseUrl}/stock_market/gainers?apikey=${encodeURIComponent(apiKey)}`),
        fetch(`${api.fmpBaseUrl}/stock_market/losers?apikey=${encodeURIComponent(apiKey)}`),
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
        const quoteResp = await fetch(`${api.fmpBaseUrl}/quote/${uniqueSymbols.join(',')}?apikey=${encodeURIComponent(apiKey)}`);
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

    async function load() {
      if (!coinGainersGrid || !coinLosersGrid || !stockMoversGrid) return;
      const filters = getFilters();
      if (moversStatus) moversStatus.textContent = 'Загружаю топы монет и акций...';
      if (coinGainersStatus) coinGainersStatus.textContent = 'Загрузка монет роста...';
      if (coinLosersStatus) coinLosersStatus.textContent = 'Загрузка монет падения...';
      if (stockMoversStatus) stockMoversStatus.textContent = 'Загрузка акций...';
      coinGainersGrid.innerHTML = '';
      coinLosersGrid.innerHTML = '';
      stockMoversGrid.innerHTML = '';

      const [coinsResult, stocksResult] = await Promise.allSettled([fetchCoinMovers(filters), fetchStockMovers(filters)]);
      if (coinsResult.status === 'fulfilled') {
        renderMoversList(coinGainersGrid, '🚀 Топ-10 растущих монет', coinsResult.value.gainers, 'coin');
        renderMoversList(coinLosersGrid, '🔻 Топ-10 падающих монет', coinsResult.value.losers, 'coin');
        const updatedAt = new Date().toLocaleTimeString('ru-RU');
        if (coinGainersStatus) {
          coinGainersStatus.textContent = coinsResult.value.gainers.length > 0
            ? `Монеты роста обновлены (${updatedAt}).`
            : 'Монеты роста не найдены — ослабьте фильтры (капитализация/ликвидность/объём).';
        }
        if (coinLosersStatus) {
          coinLosersStatus.textContent = coinsResult.value.losers.length > 0
            ? `Монеты падения обновлены (${updatedAt}).`
            : 'Монеты падения не найдены — ослабьте фильтры (капитализация/ликвидность/объём).';
        }
      } else {
        const errorMessage = `Ошибка монет: ${coinsResult.reason?.message || coinsResult.reason}`;
        if (coinGainersStatus) coinGainersStatus.textContent = errorMessage;
        if (coinLosersStatus) coinLosersStatus.textContent = errorMessage;
      }

      if (stocksResult.status === 'fulfilled') {
        if (stocksResult.value.skipped) {
          if (stockMoversStatus) stockMoversStatus.textContent = stocksResult.value.reason;
        } else {
          renderMoversList(stockMoversGrid, '📈 Топ-10 растущих акций', stocksResult.value.gainers, 'stock');
          renderMoversList(stockMoversGrid, '📉 Топ-10 падающих акций', stocksResult.value.losers, 'stock');
          if (stockMoversStatus) stockMoversStatus.textContent = `Акции обновлены (${new Date().toLocaleTimeString('ru-RU')}).`;
        }
      } else if (stockMoversStatus) {
        stockMoversStatus.textContent = `Ошибка акций: ${stocksResult.reason?.message || stocksResult.reason}`;
      }

      if (moversStatus) moversStatus.textContent = 'Обновление завершено. Если акции не загрузились — проверьте FMP API key.';
    }

    async function loadCoinGainers() {
      if (!coinGainersGrid) return;
      const filters = getFilters();
      if (coinGainersStatus) coinGainersStatus.textContent = 'Загрузка монет роста...';
      coinGainersGrid.innerHTML = '';

      try {
        const coins = await fetchCoinMovers(filters);
        renderMoversList(coinGainersGrid, '🚀 Топ-10 растущих монет', coins.gainers, 'coin');
        const updatedAt = new Date().toLocaleTimeString('ru-RU');
        if (coinGainersStatus) {
          coinGainersStatus.textContent = coins.gainers.length > 0
            ? `Монеты роста обновлены (${updatedAt}).`
            : 'Монеты роста не найдены — ослабьте фильтры (капитализация/ликвидность/объём).';
        }
      } catch (error) {
        if (coinGainersStatus) coinGainersStatus.textContent = `Ошибка монет: ${error?.message || error}`;
      }
    }

    async function loadCoinLosers() {
      if (!coinLosersGrid) return;
      const filters = getFilters();
      if (coinLosersStatus) coinLosersStatus.textContent = 'Загрузка монет падения...';
      coinLosersGrid.innerHTML = '';

      try {
        const coins = await fetchCoinMovers(filters);
        renderMoversList(coinLosersGrid, '🔻 Топ-10 падающих монет', coins.losers, 'coin');
        const updatedAt = new Date().toLocaleTimeString('ru-RU');
        if (coinLosersStatus) {
          coinLosersStatus.textContent = coins.losers.length > 0
            ? `Монеты падения обновлены (${updatedAt}).`
            : 'Монеты падения не найдены — ослабьте фильтры (капитализация/ликвидность/объём).';
        }
      } catch (error) {
        if (coinLosersStatus) coinLosersStatus.textContent = `Ошибка монет: ${error?.message || error}`;
      }
    }

    function saveAndReload() {
      saveFilters();
      return load();
    }

    function bindFrameStatusEvents() {
      if (!enableCryptoBubblesEmbed) return;
      const onLoad = () => {
        if (!cryptoBubblesStatus) return;
        cryptoBubblesStatus.textContent = 'Crypto Bubbles iframe загружен.';
      };
      const onError = () => {
        if (!cryptoBubblesStatus) return;
        cryptoBubblesStatus.textContent = 'Не удалось загрузить iframe. Используйте кнопку «Открыть Crypto Bubbles».';
      };
      cryptoBubblesFrameCap?.addEventListener('load', onLoad);
      cryptoBubblesFrameDay?.addEventListener('load', onLoad);
      cryptoBubblesFrameCap?.addEventListener('error', onError);
      cryptoBubblesFrameDay?.addEventListener('error', onError);
    }

    return {
      load,
      loadCoinGainers,
      loadCoinLosers,
      loadFilters,
      saveFilters,
      saveAndReload,
      bindFrameStatusEvents,
    };
  }

  globalScope.UrsasMarketMovers = {
    createController,
  };
})(window);
