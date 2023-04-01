// 注入 preview 窗口

// 考虑到真正处理 markmap 的脚本程序会比较大，不适合在所有 markdown preview 里面都直接引入，
// 这里只引入一个比较小的 js，随时检查 DOM 中是否存在 markmap 元素，必要时再引入 markmap 资源。

window._markmap_loader = {
  baseUrl: '',
  nonce: '',
  loaded: {},
  init: function() {
    // 准备好加载 markmap 资源所需的参数
    // NOTE: 此处依赖于 vscode markdown preview 的具体实现（csp 中的 nonce）
    let meta = document.head.querySelector('meta[http-equiv=Content-Security-Policy]')
    let re = /nonce-([0-9a-zA-Z]*)/
    let m = meta.content.match(re)
    this.nonce = m[1]
    // NOTE: 此处依赖于 vscode markdown preview 的具体实现（local resource uri）
    this.baseUrl = document.currentScript.src.replace('prepare.js', '')
  },
  loadScript: function(src) {
    if (this.loaded[src]) return
    this.loaded[src] = true
    if (!src.startsWith('http')) {
      src = this.baseUrl + src
    }
    let script = document.createElement('script')
    script.src = src
    script.setAttribute('nonce', this.nonce)
    script.async = true
    document.body.appendChild(script)
  },
  loadStylesheet: function(src) {
    if (this.loaded[src]) return
    this.loaded[src] = true
    if (!src.startsWith('http')) {
      src = this.baseUrl + src
    }
    let el = document.createElement('link')
    el.rel = 'stylesheet'
    el.type = 'text/css'
    el.href = src
    document.head.appendChild(el)
  },
  loadStyle: function(style) {
    if (this.loaded[style]) return
    this.loaded[style] = true
    let el = document.createElement('style')
    el.textContent = style
    document.head.appendChild(el)
  },
}
window._markmap_loader.init();

(function() {
  // 懒加载 markmap 资源
  let loadMarkmapResources = function() {
    window._markmap_loader.loadScript('markmap.bundle.js')
    window._markmap_loader.loadStylesheet('markmap.bundle.css')
  }

  const MARKMAP_CLASS = 'markmap-block'
  const MARKMAP_SELECTOR = `.${MARKMAP_CLASS}`

  // 处理已经存在的 markmap-block 元素
  let hasMarkmapBlock = false
  let blocks = document.querySelectorAll(MARKMAP_SELECTOR)
  if (blocks.length > 0) {
    // 立即加载 markmap 资源
    loadMarkmapResources()
    hasMarkmapBlock = true
  }

  // 监测 DOM 变化
  new MutationObserver((mutationList) => {
    // console.log('root observer:', mutationList)
    if (!hasMarkmapBlock) {
      // 检查是否有新增的 markmap-block 元素
      for (let mr of mutationList) {
        for (let node of mr.addedNodes) {
          if (node.nodeType != 1) continue
          if (!node.classList.contains(MARKMAP_CLASS)) continue
          // console.log('root addedNodes:', node)
          hasMarkmapBlock = true
        }
      }
    }

    // 启动渲染
    if (window._markmap_render) {
      window._markmap_render()
    } else if (hasMarkmapBlock) {
      loadMarkmapResources()
    }
  })
  // NOTE: 此处依赖于 vscode markdown preview 的具体实现（.markdown-body 容器元素）
  .observe(document.querySelector('.markdown-body'), {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  })
})()
