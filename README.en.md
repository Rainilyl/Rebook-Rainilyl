# rebook-rainilyl

[中文](README.md) | [English](README.en.md)

A **status-bar novel reader** for VS Code / Cursor (similar to Thief-Book). Shows fiction text in the status bar with paging, jump, and chapter navigation.

## Install

**Recommended: install inside VS Code / Cursor** (no need to open the Marketplace website):

1. Open the Extensions view (`Cmd+Shift+X` / `Ctrl+Shift+X`)
2. Search for **`rebook-rainilyl`**
3. Click Install

Or use the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) → `Extensions: Install Extensions`, then search the same name.

- Source: https://github.com/Rainilyl/Rebook-Rainilyl  
- Extension page (optional): https://marketplace.visualstudio.com/items?itemName=Rainilyl.rebook-rainilyl

## Features

- Read novel text in the status bar
- Configurable file path, page size, left/right position, line-break character
- Shortcuts for page turn / jump / chapter / boss key (hide)

## Shortcuts

**Ctrl+Alt** + key (macOS and Windows):

| Key | Action |
|-----|--------|
| `,` | Previous page |
| `.` | Next page |
| `;` | Jump to the page set in Settings |
| `[` / `]` | Previous / next chapter |
| `\` | Show / hide (boss key) |

You can also use the Command Palette (`rebookRainilyl`). Set `bookPath` first, or pick a file when pressing next page.

## Settings

Search `rebookRainilyl` in Settings:

| Setting | Description |
|---------|-------------|
| `bookPath` | Path to the novel `.txt` file |
| `pageSize` | Characters shown at once (changes display length only; does not move reading position) |
| `currentPage` | Current page (used for jump; page turns change it by ±1) |
| `lineBreak` | Replacement for newlines (default: space) |
| `statusBarPosition` | `left` or `right` |

## Tips

1. After install, set `bookPath`, or press next-page and choose a `.txt` file.  
2. Changing `pageSize` only changes how many characters are shown — it does **not** jump your place in the book.  
3. To change pages, edit `currentPage` or use the jump shortcut.

## Install from VSIX (optional)

Download a `.vsix` and choose **Install from VSIX…** in the Extensions view.

## License

[MIT](LICENSE)
