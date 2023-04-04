// 由 prepare.js 在必要时引入

// 打包命令：
//   npx browserify -t sheetify/transform -p [ css-extract -o out/markmap.bundle.css ] resources/markmap.js -o out/markmap.bundle.js
//
// 打包之后生成两个独立的文件，可以在 web 页面中直接引入：
//   markmap.bundle.css
//   markmap.bundle.js

(function() {
  const css = require('sheetify')
  css('./markmap.css')

  const { Transformer } = require('markmap-lib')
  const markmap = require('markmap-view')

  window._markmap_render = function() {
    let blocks = document.querySelectorAll('.markmap-block')
    for (let block of blocks) {
      // 解析 fenced code block 里面的 markdown 内容
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
          fn(...(getParams({ getMarkmap: () => markmap }) || []))
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
      let svg = block.querySelector('.target')
      let fitRatio = 0.9
      let mm = new markmap.Markmap(svg, {
        fitRatio,
        duration: 0,
      })
      mm.setData(result.root)

      // 即使设置了 duration 为 0，仍然会有个 transition 过程，所以需要延迟操作
      setTimeout(() => {
        // 获取 svg 内容的位置和大小
        let { xMin, xMax, yMin, yMax } = [...svg.children].reduce((acc, el) => {
          if (!el.getBBox) return acc
          let { x, y, width, height } = el.getBBox()
          if (!acc.xMin || acc.xMin < x) acc.xMin = x
          if (!acc.xMax || acc.xMax > x + width) acc.xMax = x + width
          if (!acc.yMin || acc.yMin < y) acc.yMin = y
          if (!acc.yMax || acc.yMax > y + height) acc.yMax = y + height
          return acc
        }, {})
        let svgLeft = xMin
        let svgTop = yMin
        let svgWidth = xMax - xMin
        let svgHeight = yMax - yMin
        // console.log('bbox:', svgLeft, svgTop, svgWidth, svgHeight)

        // 根据 viewport 的宽度设置其高度，使其与 svg 具有相同的宽高比
        let { width: viewportWidth } = svg.getBoundingClientRect()
        let viewportHeight = viewportWidth * svgHeight / svgWidth
        svg.style.height = `${viewportHeight}px`

        // 通过 viewBox 把 svg 平移缩放到适当的位置
        let vbWidth = svgWidth / fitRatio
        let vbHeight = svgHeight / fitRatio
        let vbLeft = svgLeft - (vbWidth - svgWidth) / 2
        let vbTop = svgTop - (vbHeight - svgHeight) / 2
        // console.log('viewBox:', vbLeft, vbTop, vbWidth, vbHeight)
        svg.setAttribute('viewBox', `${vbLeft} ${vbTop} ${vbWidth} ${vbHeight}`)

        // 首次渲染不需要动画效果，后续手工操作时需要动画效果
        mm.setOptions({ duration: 500 })
      }, 0)
    }
  }
  window._markmap_render()
})()
