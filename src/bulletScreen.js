export default class BulletScreen {
  constructor ({id = '', speed = 2, color = '#000', size = 16, gap = 4} = {}) {
    let canvas = document.createElement('canvas')
    let el = document.getElementById(id)
    canvas.width = el.offsetWidth
    canvas.height = el.offsetHeight
    el.appendChild(canvas)
    this.width = canvas.width
    this.height = canvas.height
    this.color = color
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.speed = speed
    this.pool = []
    this.top = 20
    this.index = 0
    this.eventMap = {}
    // fps
    this.fps = 0
    this.fpsTimer = null
    // 弹幕文字字体大小
    this.size = size
    // 弹幕上下间距
    this.gap = gap
    this.data = []
    this.cancelId = null
    this.ctx.font = `${size}px Arial`
    // 获取requestAnimationFrame
    BulletScreen.getAnimation()
    // 获取行数
    this.line = BulletScreen.getLinesBySize(this.size + this.gap, this.height)
    // 每行最右边距离
    this.lineLeft = new Array(this.line).fill(0)
    this.start = this.start.bind(this)
  }

  /**
  * 开始运行
  */
  run () {
    if (this.cancelId !== null) {
      return false
    }
    this.start()
    this.getFPS()
  }

  /**
  * 开始帧动画
  */
  start () {
    this.render()
    this.parse()
    this.fps += 1
    this.cancelId = window.requestAnimFrame(this.start)
  }

  /**
  * 停止帧动画
  */
  stop () {
    if (!this.cancelId) {
      return false
    }
    window.cancelAnimationFrame(this.cancelId)
    clearInterval(this.fpsTimer)
    this.fpsTimer = null
    this.cancelId = null
  }

  /**
  * 处理帧数据
  */
  parse () {
    for (let i = 0, len = this.data.length; i < len; i++) {
      if (this.data[i].type === 'static') {
        // 渲染静止，且不超出时间范围的弹幕
        if (this.data[i].frames >= 0) {
          this.data[i].frames -= 1
        }
      } else {
        // 渲染动态，且不超出屏幕范围的弹幕
        if ((this.data[i].width + this.data[i].left) > -10) {
          this.data[i].left -= this.speed
        }
      }
    }
    // 右端距离屏幕距离
    for (let i = 0, len = this.lineLeft.length; i < len; i++) {
      if (this.lineLeft[i] <= 0) {
        continue
      }
      this.lineLeft[i] = this.lineLeft[i] - this.speed
    }
  }

  /**
  * 渲染数据
  */
  render () {
    // 清空上一帧
    this.ctx.clearRect(0, 0, this.width, this.height)
    // 绘制当前帧
    for (let i = 0, len = this.data.length; i < len; i++) {
      // 超出时间不需要渲染
      if (this.data[i].frames && this.data[i].frames < 0) {
        continue
      }
      // 超出范围不需要渲染
      if (this.data[i].left >= this.width || (this.data[i].width + this.data[i].left) <= -10) {
        continue
      }
      if (this.data[i].type === 'color') {
        // 带背景
        this.fillSpecialText(this.data[i])
      } else {
        // 静止 和 滚动
        this.fillText(this.data[i])
      }
    }
  }

  /**
  * 添加弹幕
  * type: default 默认滚动弹幕, color 带背景颜色的滚动弹幕, static 悬停在屏幕5秒的弹幕
  */
  push (words, type = 'default') {
    let self = this
    // 弹幕长度
    let width = self.ctx.measureText(words).width
    // 弹幕初始位置
    let lineIndex = Math.round(Math.random() * (this.line - 1))
    let left = this.lineLeft[lineIndex] + self.width
    let top = (lineIndex + 1) * (this.gap + this.size)
    this.lineLeft[lineIndex] += width + 10
    let bullet = {
      words: words,
      type: type,
      left: left,
      top: top,
      width: width,
      color: self.color
    }
    // 带背景弹幕
    if (type === 'color') {
      bullet.color = '#fff'
      bullet.background = `rgba(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},0.7)`
    }
    // 悬停弹幕
    if (type === 'static') {
      bullet.top = this.top % this.height
      bullet.left = (this.width - width) / 2
      // 每秒约60fps 300fps大约等于5秒
      bullet.frames = 300
      this.top = (this.top % this.height) + 20
    }
    let index = this.pool.shift()
    if (index !== undefined) {
      this.data[index] = bullet
    } else {
      // this.data.push(bullet)
      // 寻找可复用的index
      this.findReuse()
      let rindex = this.pool.shift()
      if (rindex !== undefined) {
        this.data[rindex] = bullet
      } else {
        this.data.push(bullet)
      }
    }
  }

  /**
  * 渲染普通弹幕
  */
  fillText (item) {
    this.ctx.beginPath()
    this.ctx.fillStyle = item.color
    this.ctx.fillText(item.words, item.left, item.top)
  }

  /**
  * 渲染高级弹幕
  */
  fillSpecialText (item) {
    // 画背景
    this.ctx.beginPath()
    this.ctx.lineCap = 'round'
    this.ctx.moveTo(item.left, item.top)
    this.ctx.lineTo(item.left + item.width, item.top);
    this.ctx.strokeStyle = item.background
    this.ctx.lineWidth = 30
    this.ctx.stroke()
    // 画文字
    this.ctx.beginPath()
    this.ctx.fillStyle = item.color
    this.ctx.fillText(item.words, item.left, item.top + 6)
  }

  /**
  * 获取当前可复用的index
  */
  findReuse () {
    this.pool = []
    for (let i = 0, len = this.data.length; i < len; i++) {
      if (this.data[i].frames && this.data[i].frames < 0) {
        this.pool.push(i)
      }
      if ((this.data[i].width + this.data[i].left) <= -10) {
        this.pool.push(i)
      }
    }
  }

  /**
  * PFS 计算
  */
  getFPS () {
    this.fpsTimer = setInterval(() => {
      this.emit('fps', this.fps)
      this.fps = 0
    }, 1000)
  }

  on (name = '', fn = null) {
    if (typeof fn === 'function') {
      this.eventMap[name] = fn
    }
  }

  emit (name, ...args) {
    if (this.eventMap[name] && typeof this.eventMap[name] === 'function') {
      this.eventMap[name](...args)
    }
  }

  static getAnimation () {
    window.requestAnimFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }

  /**
  * 算出当前屏幕可以放多少行弹幕
  */
  static getLinesBySize (lineSize, totalHeight) {
    return Math.floor(totalHeight / lineSize)
  }

}
