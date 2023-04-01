# 项目说明

VSCode 对 markdown 格式的支持很强大，内建支持了 KaTeX 数学公式，在各种插件的加持下还可以支持各种图表。

但是对思维导图（mindmap）的支持似乎比较弱。`Markdown Preview Enhanced 插件`虽然支持 mermaid 的各种格式，
但可能是版本问题，并不支持 mermaid mindmap。事实上，虽然 mermaid 本身支持 mindmap，但效果惨不忍睹，
所以即使采用 `Markdown Preview Mermaid Support 插件`也是意义不大。

`Markdown Preview Markmap Support 插件`支持对 markdown 文件里面的思维导图进行预览，但该插件采用了自己独立的预览窗口，
而不是 VSCode 内建的通用的 markdown preview 窗口，所以使用起来不是很方便。

本项目是一个 VSCode 插件程序，支持在 markdown preview 中显示思维导图内容。

# TODOs:

- 自适应 svg 的高度
- 打包
- 配置选项

# 效果检视

[效果检视.md](./效果检视.md)

# VSCode Markdown Preview 的尴尬

VSCode 内置了 Markdown Preview 功能，并支持插件开发者通过 markdown-it 框架进行扩展。

但是，可能是因为 markdown-it 的定制能力不足（比如很难根据实际预览的内容动态加载 js/css 资源），导致不少提供
Markdown Preview 功能的插件都自己另起炉灶，通过 Webview 来实现自己的 preview 功能，比如被广泛使用的功能强大的
Markdown Preview Enhanced 插件。

这就导致这些插件无法互相补充配合使用。

# 花絮：ChatGPT 指导项目开发

[ChatGPT.md](./ChatGPT.md)

# 参考资料

[VS Code插件创作](https://liiked.github.io/VS-Code-Extension-Doc-ZH/)
| [EN](https://code.visualstudio.com/api)

[markdown-it](https://github.com/markdown-it/markdown-it)
- [API](https://markdown-it.github.io/markdown-it/)
| [CN](https://markdown-it.docschina.org/)
- [使用 markdown-it 解析 markdown 代码](https://juejin.cn/post/6844903688536850440)
- [markdown-it-katex](https://github.com/waylonflinn/markdown-it-katex)
- [markdown-it-mermaid](https://github.com/tylingsoft/markdown-it-mermaid)
- [markdown-it-mermaid-plugin](https://github.com/DCsunset/markdown-it-mermaid-plugin)

[Markdown Preview Enhanced 插件](https://shd101wyy.github.io/markdown-preview-enhanced/)
| [github](https://github.com/shd101wyy/markdown-preview-enhanced)
| [github.com/shd101wyy/mume](https://github.com/shd101wyy/mume)

[Markdown Preview Mermaid Support 插件](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)
| [github](https://github.com/mjbvz/vscode-markdown-mermaid)

[Markdown Preview Markmap Support 插件](https://github.com/phoihos/vscode-markdown-markmap)
| [github.com/markmap/markmap](https://github.com/markmap/markmap)

[github.com/dundalek/markmap](https://github.com/dundalek/markmap)

[How to run a NodeJS module in a browser](https://linuxhint.com/run-nodejs-module-browser/)
- [browserify](https://browserify.org/)
- [sheetify](https://github.com/stackcss/sheetify)
- [css-extract](https://github.com/stackcss/css-extract)

[Gitea (Mermaid support)](https://docs.gitea.io/en-us/)
