const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const logic = require('./bookLogic');

const CFG = 'rebookRainilyl';
const CMD = {
  openBook: 'rebookRainilyl.openBook',
  next: 'rebookRainilyl.next',
  prev: 'rebookRainilyl.prev',
  jump: 'rebookRainilyl.jump',
  nextChapter: 'rebookRainilyl.nextChapter',
  prevChapter: 'rebookRainilyl.prevChapter',
  toggle: 'rebookRainilyl.toggle',
};

const CHAPTER_RE = /第[零〇一二三四五六七八九十百千万两0-9]+章|Chapter\s*\d+/gi;

let context;
let statusBar;
let bookText = '';
let bookPath = '';
let chapterStarts = [];
let viewStart = 0;
let currentPage = 1;
let freezePosition = false;
let showingBook = true;
let loaded = false;
let writing = false;

function activate(ctx) {
  context = ctx;
  ensureStatusBar();

  context.subscriptions.push(
    vscode.commands.registerCommand(CMD.openBook, openBook),
    vscode.commands.registerCommand(CMD.next, () => turn(1)),
    vscode.commands.registerCommand(CMD.prev, () => turn(-1)),
    vscode.commands.registerCommand(CMD.jump, () => forceJumpFromSettings()),
    vscode.commands.registerCommand(CMD.nextChapter, () => chapter(1)),
    vscode.commands.registerCommand(CMD.prevChapter, () => chapter(-1)),
    vscode.commands.registerCommand(CMD.toggle, toggleBoss),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (!e.affectsConfiguration(CFG) || writing) {
        return;
      }
      if (e.affectsConfiguration(`${CFG}.statusBarPosition`)) {
        ensureStatusBar(true);
        paint();
      }
      if (e.affectsConfiguration(`${CFG}.bookPath`)) {
        const p = String(getCfg().get('bookPath', '') || '');
        if (p && p !== bookPath) {
          void loadBook(p, true);
          return;
        }
      }
      if (e.affectsConfiguration(`${CFG}.lineBreak`) && bookPath) {
        void loadBook(bookPath, true);
        return;
      }
      if (e.affectsConfiguration(`${CFG}.pageSize`)) {
        freezePosition = true;
        paint();
        if (readSettingPage() !== currentPage) {
          void writePage(currentPage);
        }
        return;
      }
      if (e.affectsConfiguration(`${CFG}.currentPage`)) {
        const p = readSettingPage();
        if (freezePosition && p === currentPage) {
          return;
        }
        if (freezePosition && p !== currentPage) {
          freezePosition = false;
        }
        void jumpToPage(p);
      }
    })
  );

  viewStart = Number(context.globalState.get('viewStart', 0)) || 0;
  currentPage = Number(context.globalState.get('currentPageMem', 1)) || 1;
  freezePosition = Boolean(context.globalState.get('freezePosition', false));
  const p = getCfg().get('bookPath', '') || context.globalState.get('bookPath', '');
  if (p) {
    void loadBook(String(p), true);
  }
}

function getCfg() {
  return vscode.workspace.getConfiguration(CFG);
}

function readSettingPage() {
  return Math.max(1, Math.floor(Number(getCfg().get('currentPage', 1)) || 1));
}

function readSize() {
  return Math.max(5, Math.floor(Number(getCfg().get('pageSize', 30)) || 30));
}

function clampStart() {
  if (!bookText.length) {
    viewStart = 0;
    return;
  }
  viewStart = Math.min(Math.max(0, viewStart), bookText.length - 1);
}

function paint() {
  if (!loaded || !statusBar) {
    return;
  }
  if (!showingBook) {
    statusBar.hide();
    return;
  }
  const size = readSize();
  statusBar.text = logic.sliceFromStart(bookText, viewStart, size);
  statusBar.tooltip = `rebook-rainilyl  页${currentPage}  显示${size}字  位置${viewStart}${
    freezePosition ? '  (改字数后位置已冻结)' : ''
  }`;
  statusBar.show();
}

async function persist() {
  await context.globalState.update('viewStart', viewStart);
  await context.globalState.update('currentPageMem', currentPage);
  await context.globalState.update('freezePosition', freezePosition);
}

async function writePage(page) {
  writing = true;
  try {
    await getCfg().update('currentPage', page, vscode.ConfigurationTarget.Global);
  } finally {
    writing = false;
  }
}

async function writePath(filePath) {
  writing = true;
  try {
    await getCfg().update('bookPath', filePath, vscode.ConfigurationTarget.Global);
  } finally {
    writing = false;
  }
}

function ensureStatusBar(force) {
  const pos = getCfg().get('statusBarPosition', 'right');
  const alignment =
    pos === 'left' ? vscode.StatusBarAlignment.Left : vscode.StatusBarAlignment.Right;
  const priority = pos === 'left' ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
  if (statusBar && !force) {
    return;
  }
  if (statusBar) {
    statusBar.dispose();
  }
  statusBar = vscode.window.createStatusBarItem(alignment, priority);
  statusBar.command = CMD.next;
  context.subscriptions.push(statusBar);
}

async function openBook() {
  const uris = await vscode.window.showOpenDialog({
    canSelectMany: false,
    openLabel: '打开小说',
    filters: { Text: ['txt', 'text'], All: ['*'] },
  });
  if (!uris || !uris.length) {
    return;
  }
  await loadBook(uris[0].fsPath, false);
}

async function loadBook(filePath, silent) {
  try {
    if (!fs.existsSync(filePath)) {
      if (!silent) {
        vscode.window.showErrorMessage(`文件不存在: ${filePath}`);
      }
      return;
    }
    const raw = decodeText(fs.readFileSync(filePath));
    bookText = logic.normalizeText(raw, getCfg().get('lineBreak', ' '));
    bookPath = filePath;
    loaded = true;
    rebuildChapters();

    await context.globalState.update('bookPath', bookPath);
    await writePath(bookPath);

    if (!silent) {
      freezePosition = false;
      viewStart = 0;
      currentPage = 1;
      await writePage(1);
    } else {
      viewStart = Number(context.globalState.get('viewStart', 0)) || 0;
      currentPage =
        Number(context.globalState.get('currentPageMem', readSettingPage())) ||
        readSettingPage();
      freezePosition = Boolean(context.globalState.get('freezePosition', false));
      if (!freezePosition && currentPage > 1) {
        const r = logic.jumpToPage(currentPage, readSize());
        viewStart = r.viewStart;
        currentPage = r.currentPage;
      }
    }
    clampStart();
    await persist();
    showingBook = true;
    paint();
    if (!silent) {
      vscode.window.setStatusBarMessage(`已打开: ${path.basename(filePath)}`, 2000);
    }
  } catch (err) {
    vscode.window.showErrorMessage(`打开失败: ${err.message || err}`);
  }
}

function rebuildChapters() {
  chapterStarts = [0];
  CHAPTER_RE.lastIndex = 0;
  let m;
  while ((m = CHAPTER_RE.exec(bookText)) !== null) {
    if (m.index > 0) {
      chapterStarts.push(m.index);
    }
  }
  chapterStarts = [...new Set(chapterStarts)].sort((a, b) => a - b);
}

function decodeText(buf) {
  const utf8 = buf.toString('utf8');
  const bad = (utf8.match(/\uFFFD/g) || []).length;
  if (bad === 0 || bad / Math.max(utf8.length, 1) < 0.01) {
    return utf8;
  }
  try {
    return new TextDecoder('gb18030').decode(buf);
  } catch {
    return utf8;
  }
}

async function jumpToPage(page) {
  if (!loaded) {
    return;
  }
  const r = logic.jumpToPage(page, readSize());
  viewStart = r.viewStart;
  currentPage = r.currentPage;
  freezePosition = false;
  clampStart();
  await persist();
  await writePage(currentPage);
  showingBook = true;
  paint();
}

async function forceJumpFromSettings() {
  freezePosition = false;
  await jumpToPage(readSettingPage());
}

async function turn(delta) {
  if (!loaded) {
    if (delta > 0) {
      await openBook();
    }
    return;
  }
  showingBook = true;
  const size = readSize();
  const r = logic.turnPage(viewStart, currentPage, size, bookText.length, delta);
  if (r.atEnd) {
    vscode.window.setStatusBarMessage('已经是最后一页', 1500);
    return;
  }
  viewStart = r.viewStart;
  currentPage = r.currentPage;
  freezePosition = false;
  clampStart();
  await persist();
  await writePage(currentPage);
  paint();
}

async function chapter(delta) {
  if (!loaded) {
    return;
  }
  showingBook = true;
  const size = readSize();
  let idx = 0;
  for (let i = 0; i < chapterStarts.length; i++) {
    if (chapterStarts[i] <= viewStart) {
      idx = i;
    } else {
      break;
    }
  }
  if (delta > 0) {
    if (idx + 1 >= chapterStarts.length) {
      vscode.window.setStatusBarMessage('已经是最后一章', 1500);
      return;
    }
    viewStart = chapterStarts[idx + 1];
  } else if (viewStart > chapterStarts[idx] + size) {
    viewStart = chapterStarts[idx];
  } else if (idx > 0) {
    viewStart = chapterStarts[idx - 1];
  } else {
    viewStart = 0;
  }
  clampStart();
  currentPage = Math.max(1, currentPage + (delta > 0 ? 1 : -1));
  freezePosition = false;
  await persist();
  await writePage(currentPage);
  paint();
}

async function toggleBoss() {
  if (!loaded || !statusBar) {
    return;
  }
  showingBook = !showingBook;
  if (!showingBook) {
    statusBar.hide();
  } else {
    paint();
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
