# rc-bullets-ts
> 👏 基于 rc-bullets 库使用`typescript`结合`webpack`进行重构，为后续项目开发提供更安全的类型支持与拓展性支持。感谢原作者：[@zerosoul](https://github.com/zerosoul) 提供支持  
> 🌈 基于 CSS3 Animation，使用 React 构建，可扩展，高性能。  
> 💻 原项目地址：https://github.com/zerosoul/rc-bullets  
[![NPM](https://img.shields.io/npm/v/rc-bullets-ts.svg)](https://www.npmjs.com/package/rc-bullets-ts) [![NPM downloads](https://img.shields.io/npm/dm/rc-bullets-ts.svg)](http://npmjs.com/package/rc-bullets-ts)

## 注意！
> ⚠️ 如之前安装版本存在弹幕大面积重合及消失问题，请尝试升级npm库到最新版本。

## 安装

npm:

```bash
npm install --save rc-bullets-ts
```

## 初始化一个简单的弹幕场景

```jsx
import BulletScreen, { StyledBullet } from 'rc-bullets-ts'
import { useEffect, useRef, useState } from 'react'

const headUrl =
  'https://zerosoul.github.io/rc-bullets/assets/img/heads/girl.jpg'

const Demo = () => {
  const screenElRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<InstanceType<typeof BulletScreen>>()
  const [bullet, setBullet] = useState('')

  useEffect(() => {
    // 给页面中某个元素初始化弹幕屏幕，一般为一个大区块。此处的配置项全局生效
    screenRef.current = new BulletScreen(screenElRef.current, { duration: 20 })
  }, [])

  return (
    <main>
      <div ref={screenElRef} style={{ width: '100vw', height: '80vh' }} />
      <input
        value={bullet}
        onChange={({ target: { value } }) => {
          // 弹幕内容输入事件处理
          setBullet(value)
        }}
      />
      <button
        onClick={() => {
          // 发送弹幕
          if (bullet && screenRef.current) {
            // 纯文本调用形式
            screenRef.current.push(bullet)

            // StyledBullet 调用形式
            screenRef.current.push(
              <StyledBullet
                head={headUrl}
                msg={bullet}
                backgroundColor={'#fff'}
                size="large"
              />
            )

            // 对象调用形式
            screenRef.current.push({
              msg: bullet,
              head: headUrl,
              color: '#eee',
              size: 'large',
              backgroundColor: 'rgba(2, 2, 2, .3)',
            })
          }
        }}
      >
        发送
      </button>
    </main>
  )
}

export default Demo
```

## 特性

- 支持传入 React 组件，灵活控制弹幕内容和 UI，并提供一个默认样式组件：`<StyledBullet/>`
- 弹幕屏幕管理：清屏，暂停，隐藏（后续可能会加入针对单个弹幕的控制）
- 弹幕动画参数化：运动函数（匀速/ease/步进/cubic-bezier）、时长（秒）、循环次数、延迟等
- 鼠标悬浮弹幕暂停

## 常用 API

- 初始化弹幕屏幕：`const screen = new BulletScreen(<queryString>|<HTMLElement>,[<option>])`，此处的`option`和下面的一致，偏向全局初始化，没有则使用默认值，每次发送弹幕不传则使用默认或全局设置，传了则该条弹幕覆盖全局设置。
- 发送弹幕：`const bulletId = screen.push(<string>|<ReactElement>,[<option>])`

`option`：

| 选项           | 含义               | 值类型        | 默认值      | 备注                                                                                                                      |
| -------------- | ------------------ | ------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| top            | 弹幕位置           | string        | undefined   | 自已强制定制距离顶部的高度，格式同 CSS 中的 top                                                                           |
| trackHeight    | 轨道高度           | number        | 50          | 均分轨道的高度                                                                                                            |
| onStart        | 自定义动画开始函数 | function      | null        | e.g.(bulletId,screen)=>{//do something}可以自定义一些动作，比如播放某个音效，在特定时间暂停该弹幕：screen.pause(bulletId) |
| onEnd          | 自定义动画结束函数 | function      | null        | e.g.(bulletId,screen)=>{//do something}可以自定义一些动作，比如播放某个音效                                               |
| pauseOnClick   | 鼠标点击暂停       | boolean       | false       | 再次点击继续                                                                                                              |
| pauseOnHover   | 鼠标悬停暂停       | boolean       | true        | 鼠标进入暂停，离开继续                                                                                                    |
| loopCount      | 循环次数           | number/string | 1           | 值为‘infinite’时，表示无限循环                                                                                            |
| duration       | 滚动时长           | number/string | 10          | 数字则单位为‘秒’，字符串则支持'10s'和'300ms'两种单位                                                                      |
| delay          | 延迟               | number/string | 0           | 数字则单位为‘秒’，字符串则支持'10s'和'300ms'两种单位                                                                      | [animation-delay](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-delay)支持的所有值 |
| direction      | 动画方向           | string        | normal      | [animation-direction](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction)支持的所有值                   |
| animateTimeFun | 动画函数           | string        | linear:匀速 | [animation-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function)支持的所有值       |

- 弹幕清屏：`screen.clear([<bulletId>])`，无参则清除全部
- 暂停弹幕：`screen.pause([<bulletId>])`，无参则暂停全部
- 弹幕继续：`screen.resume([<bulletId>])`，无参则继续全部
- 隐藏弹幕（滚动继续）：`screen.hide([<bulletId>])`，无参则隐藏全部
- 显示弹幕：`screen.show([<bulletId>])`，无参则显示全部
- 自带的一个弹幕样式组件：`<StyledBullet msg="<弹幕内容>" head="<头像地址>" color="<字体颜色>" backgroundColor="<背景色>" size="<尺寸:small|normal|large|huge|自定义大小,基于em机制，默认normal>">`

## TO DO
- &#x2705; react hook
- 暂时还未想好，欢迎提issues~

## 本地开发指引
1. git clone
   ```bash
    git clone https://github.com/slatejack/rc-bullets-ts
   ```
2. 安装依赖
   ```bash
    npm install
   ```
3. 测试环境
   ```bash
    npm run dev
   ```
4. 打包正式
   ```bash
    npm run build
   ```
## License

MIT © [slatejack](https://github.com/slatejack)
