// Inject blur CSS once
const injectBlurStyle = () => {
  if (document.getElementById('blur-style')) return;
  const style = document.createElement('style');
  style.id = 'blur-style';
  style.innerHTML = `
    .blurred-comment {
      filter: blur(4px);
      transition: filter 0.3s ease;
    }
  `;
  document.head.appendChild(style);
};

chrome.storage.local.get(['enabled'], (result) => {
  if (result.enabled === false) {
    // Feature is disabled, skip processing
    return;
  }

  // existing code...
  chrome.runtime.sendMessage(
    { type: 'SEND_POST_DATA', data: payload },
    (response) => {
      // ... rest of the handler
    }
  );
});

// Utility to apply blur to comments being sent
const applyBlurToComments = (comments) => {
  document.querySelectorAll('div._a9zr span._ap3a._aaco._aacu._aacx._aad7._aade')
    .forEach(span => {
      const text = span.innerText.trim();
      if (comments.includes(text)) {
        span.classList.add('blurred-comment');
      }
    });
};

// Utility to remove blur after processing
const removeBlurFromComments = (comments) => {
  document.querySelectorAll('div._a9zr span._ap3a._aaco._aacu._aacx._aad7._aade')
    .forEach(span => {
      const original = span.getAttribute('data-original-text');
      if (original && comments.includes(original)) {
        span.classList.remove('blurred-comment');
      }
    });
};

// Store original text in data attribute before editing
const storeOriginalText = (span) => {
  if (!span.hasAttribute('data-original-text')) {
    span.setAttribute('data-original-text', span.innerText.trim());
  }
};

// Global variables
let lastUrl = location.href;
let sentComments = new Set();
let currentPostTitle = '';
let currentPostTags = [];

// Extract title and tags
const extractTitleAndTags = () => {
  const titleElement = document.querySelector('h1._ap3a._aaco._aacu._aacx._aad7._aade');
  if (!titleElement) return { title: '', tags: [] };

  const clone = titleElement.cloneNode(true);
  clone.querySelectorAll('a').forEach(a => a.remove());
  const title = clone.innerText.replace(/\n+/g, ' ').trim();
  const tags = Array.from(titleElement.querySelectorAll('a'))
    .map(a => a.innerText.trim().replace(/^#/, ''));
  return { title, tags };
};

// Send data via background script, apply blur and handle response
const sendPostData = (comments) => {
  injectBlurStyle();
  document.querySelectorAll('div._a9zr span._ap3a._aaco._aacu._aacx._aad7._aade')
    .forEach(storeOriginalText);
  applyBlurToComments(comments);

  const payload = {
    title: currentPostTitle,
    tags: JSON.stringify(currentPostTags),
    comments: JSON.stringify(comments)
  };

  chrome.runtime.sendMessage(
    { type: 'SEND_POST_DATA', data: payload },
    (response) => {
      const results = Array.isArray(response.results) ? response.results : [];
            comments.forEach((originalText, index) => {
        const span = Array.from(
          document.querySelectorAll('div._a9zr span._ap3a._aaco._aacu._aacx._aad7._aade')
        ).find(s => s.getAttribute('data-original-text') === originalText);
        if (!span) return;

        // If result is not 'NO', update the comment text
        if (results[index] && results[index] !== 'NO') {
          const newText = 'Edited by 0-H8 : Peace & Love ✌️❤️';
          span.innerText = newText;

          // 1. Un‐blur immediately
          span.classList.remove('blurred-comment');

          // 2. Update the data‐original‐text so we don't pick it up as "new" later
          span.setAttribute('data-original-text', newText);

          // --- ADD THIS TO INCREMENT COUNT ---
          chrome.storage.local.get('blockedCount', (result) => {
          const count = (result.blockedCount || 0) + 1;
          chrome.storage.local.set({ blockedCount: count });
          });
        }
      });
      // You can still call removeBlurFromComments for any that weren't edited,
      // but now all edited ones are already un‐blurred above.
      removeBlurFromComments(comments);
    }
  );
};

// Get currently visible comments
const getVisibleComments = () => {
  return Array.from(
    document.querySelectorAll('div._a9zr span._ap3a._aaco._aacu._aacx._aad7._aade')
  )
    .map(span => span.innerText.trim())
    .filter(text => text.length > 0);
};

// Observe URL changes to detect new posts
const observeUrlChange = () => {
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      sentComments.clear();
      onUrlChange();
    }
  });
  observer.observe(document, { subtree: true, childList: true });
};

// Handle new post opened
const onUrlChange = () => {
  if (/\/(p|reel)\//.test(location.pathname)) {
    const { title, tags } = extractTitleAndTags();
    if (title) {
      currentPostTitle = title;
      currentPostTags = tags;
      observeAndSendComments();
      setupLoadMoreButtonObserver();
    } else {
      const titleObserver = new MutationObserver((mutations, obs) => {
        const { title, tags } = extractTitleAndTags();
        if (title) {
          currentPostTitle = title;
          currentPostTags = tags;
          obs.disconnect();
          observeAndSendComments();
          setupLoadMoreButtonObserver();
        }
      });
      titleObserver.observe(document.body, { childList: true, subtree: true });
    }
  }
};

// Observe new comments loading and send only new ones
const observeAndSendComments = () => {
  const observer = new MutationObserver(() => {
    const comments = getVisibleComments();
    const newComments = comments.filter(c => !sentComments.has(c));
    if (newComments.length > 0 && currentPostTitle) {
      newComments.forEach(c => sentComments.add(c));
      sendPostData(newComments);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

// Setup observer for 'Load more comments' button
const setupLoadMoreButtonObserver = () => {
  const btnObserver = new MutationObserver((mutations, obs) => {
    const btn = document.querySelector('button._abl-');
    if (btn) {
      btn.addEventListener('click', () => setTimeout(observeAndSendComments, 1000));
      obs.disconnect();
    }
  });
  btnObserver.observe(document.body, { childList: true, subtree: true });
};

chrome.storage.local.get(['enabled'], (result) => {
  const enabled = result.enabled !== false; // default to true

  if (enabled) {
    injectBlurStyle();
    observeUrlChange();
    onUrlChange();
  } else {
    console.log('0-H8 extension is OFF.');
  }
});
