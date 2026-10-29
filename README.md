# rebook-rainilyl

[中文](README.md) | [English](README.en.md)

VS Code / Cursor **状态栏小说阅读**插件（类似 Thief-Book）。摸鱼时把正文显示在底部状态栏，支持翻页、跳转、章节切换。

## 安装

**推荐：直接在 VS Code / Cursor 里装**（不用打开网页）：

1. 打开扩展视图（快捷键 `Cmd+Shift+X` / `Ctrl+Shift+X`）
2. 搜索 **`rebook-rainilyl`**
3. 点击安装

也可在命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）输入 `Extensions: Install Extensions`，再搜同名安装。

- 源码：https://github.com/Rainilyl/Rebook-Rainilyl  
- 扩展页（可选）：https://marketplace.visualstudio.com/items?itemName=Rainilyl.rebook-rainilyl

## 功能

- 状态栏显示小说正文
- 可配置文件路径、每页字数、左右位置、换行符
- 快捷键：翻页 / 跳页 / 章节 / 老板键（隐藏）

## 快捷键

Mac / Windows 均为 **Ctrl+Alt** + 下表按键：

| 按键 | 作用 |
|------|------|
| `,` | 上一页 |
| `.` | 下一页 |
| `;` | 按设置中的页码跳转 |
| `[` / `]` | 上一章 / 下一章 |
| `\` | 显示 / 隐藏（老板键） |

也可在命令面板搜索 `rebookRainilyl` 相关命令（需先在设置里指定小说路径，或点下一页时选择文件）。

## 设置

设置中搜索 `rebookRainilyl`：

| 配置项 | 说明 |
|--------|------|
| `bookPath` | 小说文件路径（`.txt`） |
| `pageSize` | 状态栏一次显示的字数（只改显示长度，不移动阅读位置） |
| `currentPage` | 当前页（跳转用；翻页时 ±1） |
| `lineBreak` | 换行替换字符，默认空格 |
| `statusBarPosition` | `left` 或 `right` |

## 使用提示

1. 安装后打开设置，填入 `bookPath`，或按下一页快捷键选择 `.txt` 文件。  
2. 改 `pageSize` 只会改变一次显示多少字，**不会**把你挪到别的位置。  
3. 需要换页码时改 `currentPage`，或用跳转快捷键。

## 本地安装（可选）

下载 `.vsix` 后，在扩展视图选择 **Install from VSIX…**。

## License

[MIT](LICENSE)
