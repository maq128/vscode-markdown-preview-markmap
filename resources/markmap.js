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
  css('markmap/style/view.mindmap.css')

  require('markmap/lib/d3-flextree')
  const markmap = require('markmap/lib/view.mindmap')
  const parse = require('markmap/lib/parse.markdown')
  const transform = require('markmap/lib/transform.headings')

  let guard = ''
  window._markmap_render = function() {
    // _markmap_render() 可频繁重复调用，这里用 guard 排除重复渲染
    let newGuard = document.querySelector('.markmap-guard').textContent
    if (guard === newGuard) return
    guard = newGuard

    // console.log('markmap_render:', guard)
    let blocks = document.querySelectorAll('.markmap-block')
    for (let block of blocks) {
      let source = block.querySelector('.source')
      let target = block.querySelector('.target')
      let data = transform(parse(source.textContent));
      markmap(target, data, {
        preset: 'colorful',
        linkShape: 'diagonal'
      })
    }
  }
  window._markmap_render()
})()
