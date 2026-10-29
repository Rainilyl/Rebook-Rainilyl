# rebook-rainilyl

VS Code / Cursor 状态栏小说阅读插件（类似 Thief-Book）。

Marketplace：搜索 `rebook-rainilyl`，或打开  
https://marketplace.visualstudio.com/items?itemName=Rainilyl.rebook-rainilyl

## 功能

- 在状态栏显示小说正文
- 可配置文件路径、每页字数、左右位置、换行符
- 快捷键翻页 / 跳转 / 章节 / 开关显示

## 快捷键（Mac / Windows 均为 Ctrl+Alt）

| 快捷键 | 作用 |
|--------|------|
| `,` | 上一页 |
| `.` | 下一页 |
| `;` | 跳转页码 |
| `[` / `]` | 上一章 / 下一章 |
| `\` | 开关显示 |

## 设置

在设置中搜索 `rebookRainilyl`：

- `bookPath`：小说文件路径（`.txt`）
- `pageSize`：状态栏一次显示字数
- `currentPage`：当前页
- `lineBreak`：换行替换字符（默认空格）
- `statusBarPosition`：`left` / `right`

## 本地安装（可选）

若不想从市场安装，可下载 Release 里的 `.vsix`，在扩展视图选择 **Install from VSIX…**。

## License

MIT
