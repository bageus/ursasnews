(function attachTabNavigation(globalScope) {
  function createTabNavigator({ onRubricsTabActivated } = {}) {
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const panels = Array.from(document.querySelectorAll('.panel'));

    function activateTab(tabId) {
      const tab = tabs.find((candidate) => candidate.dataset.tab === tabId);
      const nextPanel = panels.find((panel) => panel.id === tabId);
      if (!tab || !nextPanel) return;

      tabs.forEach((item) => item.classList.remove('is-active'));
      panels.forEach((panel) => panel.classList.remove('is-active'));
      tab.classList.add('is-active');
      nextPanel.classList.add('is-active');

      if (tabId === 'rubrics') {
        onRubricsTabActivated?.();
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        activateTab(tab.dataset.tab);
      });
    });

    if (globalScope.location.hash) {
      activateTab(globalScope.location.hash.replace('#', ''));
    }

    return { activateTab };
  }

  globalScope.UrsasTabs = { createTabNavigator };
})(window);
