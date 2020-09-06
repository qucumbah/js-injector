const executeCodeOnCurrentPage = (code) => {
  const script = document.createElement('script');
  script.textContent = code;
  document.body.append(script);
};

chrome.storage?.sync.get(['injections'], ({ injections }) => {
  injections.forEach(({ regex, code }) => {
    if (RegExp(regex).test(window.location.href)) {
      executeCodeOnCurrentPage(code);
    }
  });
});
