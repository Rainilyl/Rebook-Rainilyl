function normalizeText(raw, lineBreak) {
  const sep = lineBreak == null ? ' ' : String(lineBreak);
  return String(raw)
    .replace(/\n/g, sep)
    .replace(/\r/g, ' ')
    .replace(/　　/g, ' ')
    .replace(/ /g, ' ');
}

function pageToStart(page, pageSize) {
  const p = Math.max(1, Math.floor(Number(page)) || 1);
  const size = Math.max(1, Math.floor(Number(pageSize)) || 1);
  return (p - 1) * size;
}

function sliceFromStart(text, viewStart, pageSize) {
  const size = Math.max(1, Math.floor(Number(pageSize)) || 1);
  const start = Math.max(0, Math.floor(Number(viewStart)) || 0);
  return String(text).substring(start, start + size);
}

function jumpToPage(page, pageSize) {
  const p = Math.max(1, Math.floor(Number(page)) || 1);
  const size = Math.max(1, Math.floor(Number(pageSize)) || 1);
  return { viewStart: pageToStart(p, size), currentPage: p };
}

function resizeDisplay(viewStart, currentPage, newSize) {
  return {
    viewStart,
    currentPage,
    pageSize: Math.max(1, Math.floor(Number(newSize)) || 1),
  };
}

function turnPage(viewStart, currentPage, pageSize, textLen, delta) {
  const size = Math.max(1, Math.floor(Number(pageSize)) || 1);
  const textLenN = Math.max(0, Number(textLen) || 0);
  let start = Math.max(0, Math.floor(Number(viewStart)) || 0);
  let page = Math.max(1, Math.floor(Number(currentPage)) || 1);
  const d = Number(delta) || 0;

  if (d > 0 && textLenN > 0 && start + size >= textLenN) {
    return { viewStart: start, currentPage: page, atEnd: true };
  }

  start = Math.max(0, start + d * size);
  if (textLenN > 0) {
    start = Math.min(start, Math.max(0, textLenN - 1));
  }
  page = Math.max(1, page + d);
  return { viewStart: start, currentPage: page, atEnd: false };
}

function wrongPageFromStart(viewStart, pageSize) {
  const size = Math.max(1, Math.floor(Number(pageSize)) || 1);
  const start = Math.max(0, Math.floor(Number(viewStart)) || 0);
  return Math.floor(start / size) + 1;
}

module.exports = {
  normalizeText,
  pageToStart,
  sliceFromStart,
  jumpToPage,
  resizeDisplay,
  turnPage,
  wrongPageFromStart,
};
