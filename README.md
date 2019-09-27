# bulletScreen

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/5SSS/bulletScreen)

bulletScreen based on canvas

## Links

- [Github](https://github.com/5SSS/bulletScreen)

## Install

```js
npm install bullet-screen
```

or

```js
<script src="https://cdn.jsdelivr.net/npm/bullet-screen@latest/dist/bulletScreen.js"></script>
```

## Usage

```html
<!-- this div need set width and height (inline or css) -->
<div id="app" style="position: relative; width: 800px; height: 600px"></div>
```

```js
import BulletScreen from 'bullet-screen'

const bullet = new BulletScreen({id: "app"})
// send
bullet.push('test')
bullet.push('test', 'color')
bullet.push('test', 'static')
```


## Constructor

| Attribute  | Description  | Default |
|-------- |-------- | -------- |
| id | placeholder | none |
| speed | speed | 2 |
| color | default text color| #000 |
| size  | default text size | 16 |
| gap  |  default gap between text | 4 |

## API

- run:
bullet.run()
- stop:
bullet.stop()
- send: type default / color / static
bullet.push(text, type)

## EVENT

```js
bullet.on('fps', (times) => {
	// render ${times} fps per/seconds
})
```

## Example

![示例](./src/example/example.png)

## PS

如果喜欢请给个星星，谢谢。
If you like, please give me a star, thank you.

如果需要帮助: QQ:1573815240 邮箱: 1573815240@qq.com
if you need help: QQ:1573815240 email: 1573815240@qq.com