import * as vscode from 'vscode'
import * as MarkdownIt from 'markdown-it'

function markdownItMarkmap(md: MarkdownIt) {
  // 接管 fence block 的渲染
  const origFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    let token = tokens[idx]

    // 处理 markmap 类型
    if (token.info === 'markmap') {
      let b64 = Buffer.from(token.content).toString('base64')
      let html = `<p class="markmap-block"><span class="source">${b64}</span></p>`
      return html
    }

    // 处理其它类型
    return origFence!.call(md.renderer.rules, tokens, idx, options, env, self)
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  return {
    extendMarkdownIt(md: MarkdownIt) {
      return md
        .use(markdownItMarkmap)
    }
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
