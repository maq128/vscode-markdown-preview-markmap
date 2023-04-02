// 由 prepare.js 在必要时引入

// 打包命令：
//   npx browserify -t sheetify/transform -p [ css-extract -o resources/markmap.bundle.css ] resources/markmap.js -o resources/markmap.bundle.js
//
// 打包之后生成两个独立的文件，可以在 web 页面中直接引入：
//   markmap.bundle.css
//   markmap.bundle.js

(function() {
  const css = require('sheetify')
  css('./markmap.css')

  const { Transformer } = require('markmap-lib')
  const markmap = require('markmap-view')
  let markmapContext = { getMarkmap: () => markmap }

  window._markmap_render = function() {
    let blocks = document.querySelectorAll('.markmap-block')
    for (let block of blocks) {
      // 解析 fence block 里面的 markdown 内容
      let source = block.querySelector('.source')
      let code = Buffer.from(source.textContent, 'base64').toString()
      let transformer = new Transformer()
      let result = transformer.transform(code)

      // 加载涉及到的资源
      let assets = transformer.getUsedAssets(result.features)
      for (let item of assets.scripts) {
        if (item.type === 'script') {
          window._markmap_loader.loadScript(item.data.src)
        }
        if (item.type === 'iife') {
          let { fn, getParams } = item.data
          fn(...(getParams(markmapContext) || []))
        }
      }
      for (let item of assets.styles) {
        if (item.type === 'stylesheet') {
          window._markmap_loader.loadStylesheet(item.data.href)
        }
        if (item.type === 'style') {
          window._markmap_loader.loadStyle(item.data)
        }
      }

      // 渲染 SVG
      block.innerHTML = '<svg class="target"></svg>'
      let target = block.querySelector('.target')
      markmap.Markmap.create(target, markmapContext, result.root)
    }
  }
  window._markmap_render()
})()
