document.addEventListener('DOMContentLoaded', function () {
  const counterEl = document.getElementById('blockedCount');
  const toggleEl = document.getElementById('toggleBlur');

  chrome.storage.local.get(['blockedCount', 'enabled'], (result) => {
    const targetCount = result.blockedCount || 0;
    const enabled = result.enabled !== false;

    // Animate number
    let current = 0;
    const duration = 1000; // ms
    const steps = 30;
    const increment = targetCount / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        current = targetCount;
        clearInterval(timer);
      }
      counterEl.textContent = Math.floor(current);
    }, interval);

    toggleEl.checked = enabled;
  });

  toggleEl.addEventListener('change', function () {
    chrome.storage.local.set({ enabled: toggleEl.checked });
  });
});
