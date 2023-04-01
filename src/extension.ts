import * as vscode from 'vscode'
import * as MarkdownIt from 'markdown-it'

function markdownItMarkmap(md: MarkdownIt) {
  // 接管 fence block 的渲染
  const origFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    let token = tokens[idx];

    // 处理 markmap 类型
    if (token.info === 'markmap') {
      let code = token.content.trim();
      let html = `<p class="markmap-block"><span class="source">${code}</span><svg class="target"></svg></p>`
      return html
    }

    // 处理其它类型
    return origFence!.call(md.renderer.rules, tokens, idx, options, env, self)
  }

  // 接管整个渲染接口
  const origRender = md.renderer.render
  md.renderer.render = function (...args) {
    let origRet = origRender.apply(md.renderer, args)
    // 追加一个 guard 元素，用于排除重复的渲染操作
    origRet += `<p class="markmap-guard">${new Date().getTime()}</p>`
    // console.log('render:', origRet)
    return origRet
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
